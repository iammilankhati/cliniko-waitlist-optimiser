import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  async getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('top-matches')
  async getTopMatches(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getTopMatches(parsedLimit);
  }

  @Get('practitioners')
  async getPractitioners() {
    const practitioners = await this.dashboardService.getPractitioners();
    return practitioners.map((p) => ({
      id: p.id,
      name: p.title
        ? `${p.title} ${p.firstName} ${p.lastName}`
        : `${p.firstName} ${p.lastName}`,
      designation: p.designation,
      availableSlots: p._count.availableSlots,
    }));
  }

  @Get('businesses')
  async getBusinesses() {
    const businesses = await this.dashboardService.getBusinesses();
    return businesses.map((b) => ({
      id: b.id,
      name: b.name,
      city: b.city,
      availableSlots: b._count.availableSlots,
    }));
  }

  @Get('appointment-types')
  async getAppointmentTypes() {
    const types = await this.dashboardService.getAppointmentTypes();
    return types.map((t) => ({
      id: t.id,
      name: t.name,
      duration: t.duration,
      color: t.color,
      waitlistCount: t._count.waitlistEntries,
      availableSlots: t._count.availableSlots,
    }));
  }
}
