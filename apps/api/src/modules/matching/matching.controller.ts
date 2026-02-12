import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  /**
   * GET /matching
   * Find all matches for active waitlist entries
   */
  @Get()
  async findAllMatches() {
    const matches = await this.matchingService.findMatches();
    return {
      count: matches.length,
      matches: matches.map((m) => ({
        id: `${m.waitlistEntry.id}-${m.slot.id}`,
        score: m.score,
        breakdown: m.breakdown,
        matchReasons: m.matchReasons,
        waitlistEntry: {
          id: m.waitlistEntry.id,
          patient: {
            id: m.waitlistEntry.patient.id,
            name: `${m.waitlistEntry.patient.firstName} ${m.waitlistEntry.patient.lastName}`,
            email: m.waitlistEntry.patient.email,
            phone: m.waitlistEntry.patient.phone,
          },
          appointmentType: m.waitlistEntry.appointmentType,
          urgency: m.waitlistEntry.urgency,
          notes: m.waitlistEntry.notes,
          createdAt: m.waitlistEntry.createdAt,
          expiresAt: m.waitlistEntry.expiresAt,
        },
        slot: {
          id: m.slot.id,
          practitioner: {
            id: m.slot.practitioner.id,
            name: m.slot.practitioner.title
              ? `${m.slot.practitioner.title} ${m.slot.practitioner.firstName} ${m.slot.practitioner.lastName}`
              : `${m.slot.practitioner.firstName} ${m.slot.practitioner.lastName}`,
            designation: m.slot.practitioner.designation,
          },
          business: m.slot.business,
          appointmentType: m.slot.appointmentType,
          startsAt: m.slot.startsAt,
          endsAt: m.slot.endsAt,
          duration: m.slot.duration,
        },
      })),
    };
  }

  /**
   * GET /matching/waitlist/:id
   * Find matches for a specific waitlist entry
   */
  @Get('waitlist/:id')
  async findMatchesForEntry(@Param('id') id: string) {
    const matches = await this.matchingService.findMatchesForEntry(id);

    if (matches.length === 0) {
      throw new HttpException('No matches found for this waitlist entry', HttpStatus.NOT_FOUND);
    }

    return {
      waitlistEntryId: id,
      count: matches.length,
      matches: matches.map((m) => ({
        id: `${m.waitlistEntry.id}-${m.slot.id}`,
        score: m.score,
        breakdown: m.breakdown,
        matchReasons: m.matchReasons,
        slot: {
          id: m.slot.id,
          practitioner: {
            id: m.slot.practitioner.id,
            name: m.slot.practitioner.title
              ? `${m.slot.practitioner.title} ${m.slot.practitioner.firstName} ${m.slot.practitioner.lastName}`
              : `${m.slot.practitioner.firstName} ${m.slot.practitioner.lastName}`,
            designation: m.slot.practitioner.designation,
          },
          business: m.slot.business,
          appointmentType: m.slot.appointmentType,
          startsAt: m.slot.startsAt,
          endsAt: m.slot.endsAt,
          duration: m.slot.duration,
        },
      })),
    };
  }

  /**
   * POST /matching/book
   * Book a match (create appointment from waitlist entry + slot)
   */
  @Post('book')
  async bookMatch(@Body() body: { waitlistEntryId: string; slotId: string }) {
    const { waitlistEntryId, slotId } = body;

    if (!waitlistEntryId || !slotId) {
      throw new HttpException('waitlistEntryId and slotId are required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.matchingService.bookMatch(waitlistEntryId, slotId);

    if (!result.success) {
      throw new HttpException(result.error || 'Booking failed', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      appointmentId: result.appointmentId,
      message: 'Appointment booked successfully from waitlist',
    };
  }
}
