import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  WaitlistEntry,
  AvailableSlot,
  WaitlistUrgency,
  TimeOfDay,
  DayOfWeek,
} from '../../../generated/prisma/client';

export interface MatchScoreBreakdown {
  baseScore: number;
  businessBonus: number;
  practitionerBonus: number;
  timeOfDayBonus: number;
  urgencyBonus: number;
  waitTimeBonus: number;
  totalScore: number;
}

export interface MatchResult {
  waitlistEntry: WaitlistEntryWithRelations;
  slot: AvailableSlotWithRelations;
  score: number;
  breakdown: MatchScoreBreakdown;
  matchReasons: string[];
}

type WaitlistEntryWithRelations = WaitlistEntry & {
  patient: { id: string; firstName: string; lastName: string; email: string | null; phone: string | null };
  appointmentType: { id: string; name: string; duration: number; color: string };
  availableDays: { day: DayOfWeek }[];
  preferredTimesOfDay: { timeOfDay: TimeOfDay }[];
  preferredPractitioners: { practitionerId: string }[];
  preferredBusinesses: { businessId: string }[];
};

type AvailableSlotWithRelations = AvailableSlot & {
  practitioner: { id: string; firstName: string; lastName: string; title: string | null; designation: string | null };
  business: { id: string; name: string; city: string };
  appointmentType: { id: string; name: string; duration: number; color: string };
};

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all active waitlist entries with their preferences
   */
  async getActiveWaitlist(): Promise<WaitlistEntryWithRelations[]> {
    return this.prisma.waitlistEntry.findMany({
      where: {
        status: 'active',
        expiresAt: { gt: new Date() },
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        appointmentType: {
          select: { id: true, name: true, duration: true, color: true },
        },
        availableDays: { select: { day: true } },
        preferredTimesOfDay: { select: { timeOfDay: true } },
        preferredPractitioners: { select: { practitionerId: true } },
        preferredBusinesses: { select: { businessId: true } },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * Get available slots for a specific appointment type
   */
  async getAvailableSlots(appointmentTypeId: string): Promise<AvailableSlotWithRelations[]> {
    return this.prisma.availableSlot.findMany({
      where: {
        appointmentTypeId,
        isBooked: false,
        startsAt: { gt: new Date() },
      },
      include: {
        practitioner: {
          select: { id: true, firstName: true, lastName: true, title: true, designation: true },
        },
        business: {
          select: { id: true, name: true, city: true },
        },
        appointmentType: {
          select: { id: true, name: true, duration: true, color: true },
        },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  /**
   * Calculate match score between a waitlist entry and available slot
   */
  calculateMatchScore(
    entry: WaitlistEntryWithRelations,
    slot: AvailableSlotWithRelations,
  ): { score: number; breakdown: MatchScoreBreakdown; reasons: string[] } {
    const reasons: string[] = [];
    let baseScore = 100;
    let businessBonus = 0;
    let practitionerBonus = 0;
    let timeOfDayBonus = 0;
    let urgencyBonus = 0;
    let waitTimeBonus = 0;

    // Check day availability
    const slotDay = this.getDayOfWeek(slot.startsAt);
    const availableDays = entry.availableDays.map((d) => d.day);

    if (availableDays.length > 0 && !availableDays.includes(slotDay)) {
      return { score: 0, breakdown: this.createBreakdown(0, 0, 0, 0, 0, 0), reasons: ['Day not available'] };
    }

    if (availableDays.includes(slotDay)) {
      reasons.push(`Available on ${slotDay}`);
    }

    // Business preference bonus
    const preferredBusinessIds = entry.preferredBusinesses.map((b) => b.businessId);
    if (preferredBusinessIds.length === 0 || preferredBusinessIds.includes(slot.businessId)) {
      if (preferredBusinessIds.includes(slot.businessId)) {
        businessBonus = 20;
        reasons.push(`Preferred location: ${slot.business.name}`);
      }
    } else {
      baseScore -= 30;
    }

    // Practitioner preference bonus
    const preferredPractitionerIds = entry.preferredPractitioners.map((p) => p.practitionerId);
    if (preferredPractitionerIds.length === 0 || preferredPractitionerIds.includes(slot.practitionerId)) {
      if (preferredPractitionerIds.includes(slot.practitionerId)) {
        practitionerBonus = 25;
        const practName = slot.practitioner.title
          ? `${slot.practitioner.title} ${slot.practitioner.lastName}`
          : `${slot.practitioner.firstName} ${slot.practitioner.lastName}`;
        reasons.push(`Preferred practitioner: ${practName}`);
      }
    } else {
      baseScore -= 20;
    }

    // Time of day preference
    const slotHour = slot.startsAt.getHours();
    const slotTimeOfDay = this.getTimeOfDay(slotHour);
    const preferredTimes = entry.preferredTimesOfDay.map((t) => t.timeOfDay);

    if (preferredTimes.length === 0 || preferredTimes.includes(slotTimeOfDay)) {
      if (preferredTimes.includes(slotTimeOfDay)) {
        timeOfDayBonus = 15;
        reasons.push(`Preferred time: ${slotTimeOfDay}`);
      }
    } else {
      baseScore -= 15;
    }

    // Urgency bonus
    const urgencyMultiplier: Record<WaitlistUrgency, number> = {
      urgent: 40,
      high: 25,
      normal: 10,
      low: 0,
    };
    urgencyBonus = urgencyMultiplier[entry.urgency];
    if (entry.urgency === 'urgent' || entry.urgency === 'high') {
      reasons.push(`${entry.urgency.charAt(0).toUpperCase() + entry.urgency.slice(1)} priority`);
    }

    // Wait time bonus (longer wait = higher priority)
    const daysWaiting = Math.floor(
      (Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    waitTimeBonus = Math.min(daysWaiting * 2, 30);
    if (daysWaiting > 7) {
      reasons.push(`Waiting ${daysWaiting} days`);
    }

    const totalScore = Math.max(
      0,
      baseScore + businessBonus + practitionerBonus + timeOfDayBonus + urgencyBonus + waitTimeBonus,
    );

    return {
      score: totalScore,
      breakdown: this.createBreakdown(
        baseScore,
        businessBonus,
        practitionerBonus,
        timeOfDayBonus,
        urgencyBonus,
        waitTimeBonus,
      ),
      reasons,
    };
  }

  private createBreakdown(
    baseScore: number,
    businessBonus: number,
    practitionerBonus: number,
    timeOfDayBonus: number,
    urgencyBonus: number,
    waitTimeBonus: number,
  ): MatchScoreBreakdown {
    return {
      baseScore,
      businessBonus,
      practitionerBonus,
      timeOfDayBonus,
      urgencyBonus,
      waitTimeBonus,
      totalScore:
        baseScore + businessBonus + practitionerBonus + timeOfDayBonus + urgencyBonus + waitTimeBonus,
    };
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date.getDay()] as DayOfWeek;
  }

  private getTimeOfDay(hour: number): TimeOfDay {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  /**
   * Find best matches for all active waitlist entries
   */
  async findMatches(): Promise<MatchResult[]> {
    const waitlist = await this.getActiveWaitlist();
    const results: MatchResult[] = [];

    for (const entry of waitlist) {
      const slots = await this.getAvailableSlots(entry.appointmentTypeId);

      for (const slot of slots) {
        const { score, breakdown, reasons } = this.calculateMatchScore(entry, slot);

        if (score > 0) {
          results.push({
            waitlistEntry: entry,
            slot,
            score,
            breakdown,
            matchReasons: reasons,
          });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Find matches for a specific waitlist entry
   */
  async findMatchesForEntry(waitlistEntryId: string): Promise<MatchResult[]> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: waitlistEntryId },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        appointmentType: {
          select: { id: true, name: true, duration: true, color: true },
        },
        availableDays: { select: { day: true } },
        preferredTimesOfDay: { select: { timeOfDay: true } },
        preferredPractitioners: { select: { practitionerId: true } },
        preferredBusinesses: { select: { businessId: true } },
      },
    });

    if (!entry) {
      return [];
    }

    const slots = await this.getAvailableSlots(entry.appointmentTypeId);
    const results: MatchResult[] = [];

    for (const slot of slots) {
      const { score, breakdown, reasons } = this.calculateMatchScore(entry, slot);

      if (score > 0) {
        results.push({
          waitlistEntry: entry,
          slot,
          score,
          breakdown,
          matchReasons: reasons,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Book a slot for a waitlist entry
   */
  async bookMatch(waitlistEntryId: string, slotId: string): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
    try {
      const [entry, slot] = await Promise.all([
        this.prisma.waitlistEntry.findUnique({
          where: { id: waitlistEntryId },
          include: { patient: true },
        }),
        this.prisma.availableSlot.findUnique({
          where: { id: slotId },
        }),
      ]);

      if (!entry) {
        return { success: false, error: 'Waitlist entry not found' };
      }

      if (!slot) {
        return { success: false, error: 'Slot not found' };
      }

      if (slot.isBooked) {
        return { success: false, error: 'Slot is already booked' };
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.create({
          data: {
            patientId: entry.patientId,
            practitionerId: slot.practitionerId,
            businessId: slot.businessId,
            appointmentTypeId: slot.appointmentTypeId,
            startsAt: slot.startsAt,
            endsAt: slot.endsAt,
            status: 'scheduled',
            bookedFromWaitlistId: entry.id,
          },
        });

        await tx.availableSlot.update({
          where: { id: slot.id },
          data: { isBooked: true },
        });

        await tx.waitlistEntry.update({
          where: { id: entry.id },
          data: {
            status: 'booked',
            bookedAt: new Date(),
          },
        });

        return appointment;
      });

      return { success: true, appointmentId: result.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
