import { Controller, Get, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  async findAll(
    @Query('practitionerId') practitionerId?: string,
    @Query('businessId') businessId?: string,
    @Query('appointmentTypeId') appointmentTypeId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('includeBooked') includeBooked?: string,
  ) {
    const slots = await this.slotsService.findAll({
      practitionerId,
      businessId,
      appointmentTypeId,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      includeBooked: includeBooked === 'true',
    });

    return {
      count: slots.length,
      slots: slots.map((slot) => ({
        id: slot.id,
        practitioner: {
          id: slot.practitioner.id,
          name: slot.practitioner.title
            ? `${slot.practitioner.title} ${slot.practitioner.firstName} ${slot.practitioner.lastName}`
            : `${slot.practitioner.firstName} ${slot.practitioner.lastName}`,
          designation: slot.practitioner.designation,
        },
        business: slot.business,
        appointmentType: slot.appointmentType,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        duration: slot.duration,
        isBooked: slot.isBooked,
      })),
    };
  }

  @Get('stats')
  async getStats() {
    return this.slotsService.getStats();
  }

  @Get('by-practitioner')
  async getByPractitioner() {
    return this.slotsService.getByPractitioner();
  }
}
