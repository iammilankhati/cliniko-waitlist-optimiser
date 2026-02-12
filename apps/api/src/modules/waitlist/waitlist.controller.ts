import { Controller, Get, Param, Patch, Query, HttpException, HttpStatus } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistStatus } from '../../../generated/prisma/client';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Get()
  async findAll(@Query('status') status?: string) {
    const validStatuses: WaitlistStatus[] = ['active', 'booked', 'expired', 'cancelled'];
    const statusFilter = status && validStatuses.includes(status as WaitlistStatus)
      ? (status as WaitlistStatus)
      : undefined;

    const entries = await this.waitlistService.findAll(statusFilter);

    return {
      count: entries.length,
      entries: entries.map((entry) => ({
        id: entry.id,
        patient: {
          id: entry.patient.id,
          name: `${entry.patient.firstName} ${entry.patient.lastName}`,
          email: entry.patient.email,
          phone: entry.patient.phone || entry.patient.mobile,
        },
        appointmentType: entry.appointmentType,
        urgency: entry.urgency,
        status: entry.status,
        notes: entry.notes,
        availableDays: entry.availableDays.map((d) => d.day),
        preferredTimesOfDay: entry.preferredTimesOfDay.map((t) => t.timeOfDay),
        preferredPractitioners: entry.preferredPractitioners.map((p) => ({
          id: p.practitioner.id,
          name: p.practitioner.title
            ? `${p.practitioner.title} ${p.practitioner.firstName} ${p.practitioner.lastName}`
            : `${p.practitioner.firstName} ${p.practitioner.lastName}`,
        })),
        preferredBusinesses: entry.preferredBusinesses.map((b) => ({
          id: b.business.id,
          name: b.business.name,
          city: b.business.city,
        })),
        createdAt: entry.createdAt,
        expiresAt: entry.expiresAt,
        bookedAt: entry.bookedAt,
      })),
    };
  }

  @Get('stats')
  async getStats() {
    return this.waitlistService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.waitlistService.findOne(id);

    if (!entry) {
      throw new HttpException('Waitlist entry not found', HttpStatus.NOT_FOUND);
    }

    return entry;
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    try {
      const entry = await this.waitlistService.cancel(id);
      return { success: true, entry };
    } catch {
      throw new HttpException('Failed to cancel waitlist entry', HttpStatus.BAD_REQUEST);
    }
  }
}
