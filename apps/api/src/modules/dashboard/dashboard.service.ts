import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MatchingService } from '../matching/matching.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private matchingService: MatchingService,
  ) {}

  async getOverview() {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const [
      totalPatients,
      activeWaitlist,
      urgentWaitlist,
      availableSlots,
      matchesCount,
      recentBookings,
    ] = await Promise.all([
      this.prisma.patient.count(),
      this.prisma.waitlistEntry.count({ where: { status: 'active' } }),
      this.prisma.waitlistEntry.count({
        where: {
          status: 'active',
          urgency: { in: ['urgent', 'high'] },
        },
      }),
      this.prisma.availableSlot.count({
        where: {
          isBooked: false,
          startsAt: { gte: now },
        },
      }),
      this.matchingService.findMatches().then((m) => m.length),
      this.prisma.appointment.count({
        where: {
          bookedFromWaitlistId: { not: null },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      totalPatients,
      activeWaitlist,
      urgentWaitlist,
      availableSlots,
      potentialMatches: matchesCount,
      recentBookingsFromWaitlist: recentBookings,
    };
  }

  async getTopMatches(limit = 10) {
    const matches = await this.matchingService.findMatches();

    return matches.slice(0, limit).map((m) => ({
      id: `${m.waitlistEntry.id}-${m.slot.id}`,
      score: m.score,
      matchReasons: m.matchReasons,
      patient: {
        id: m.waitlistEntry.patient.id,
        name: `${m.waitlistEntry.patient.firstName} ${m.waitlistEntry.patient.lastName}`,
      },
      appointmentType: m.waitlistEntry.appointmentType.name,
      appointmentTypeDuration: m.waitlistEntry.appointmentType.duration,
      appointmentTypeColor: m.waitlistEntry.appointmentType.color,
      urgency: m.waitlistEntry.urgency,
      createdAt: m.waitlistEntry.createdAt,
      slot: {
        id: m.slot.id,
        practitioner: m.slot.practitioner.title
          ? `${m.slot.practitioner.title} ${m.slot.practitioner.lastName}`
          : `${m.slot.practitioner.firstName} ${m.slot.practitioner.lastName}`,
        business: m.slot.business.name,
        startsAt: m.slot.startsAt,
      },
      waitlistEntryId: m.waitlistEntry.id,
      slotId: m.slot.id,
    }));
  }

  async getPractitioners() {
    return this.prisma.practitioner.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        designation: true,
        _count: {
          select: {
            availableSlots: {
              where: { isBooked: false, startsAt: { gte: new Date() } },
            },
          },
        },
      },
    });
  }

  async getBusinesses() {
    return this.prisma.business.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        _count: {
          select: {
            availableSlots: {
              where: { isBooked: false, startsAt: { gte: new Date() } },
            },
          },
        },
      },
    });
  }

  async getAppointmentTypes() {
    return this.prisma.appointmentType.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        color: true,
        _count: {
          select: {
            waitlistEntries: { where: { status: 'active' } },
            availableSlots: { where: { isBooked: false, startsAt: { gte: new Date() } } },
          },
        },
      },
    });
  }
}
