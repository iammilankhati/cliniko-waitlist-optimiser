import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    practitionerId?: string;
    businessId?: string;
    appointmentTypeId?: string;
    fromDate?: Date;
    toDate?: Date;
    includeBooked?: boolean;
  }) {
    const { practitionerId, businessId, appointmentTypeId, fromDate, toDate, includeBooked } = options || {};

    return this.prisma.availableSlot.findMany({
      where: {
        ...(practitionerId && { practitionerId }),
        ...(businessId && { businessId }),
        ...(appointmentTypeId && { appointmentTypeId }),
        ...(fromDate && { startsAt: { gte: fromDate } }),
        ...(toDate && { startsAt: { lte: toDate } }),
        ...(!includeBooked && { isBooked: false }),
      },
      include: {
        practitioner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            designation: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        appointmentType: {
          select: {
            id: true,
            name: true,
            duration: true,
            color: true,
          },
        },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async getStats() {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const [total, available, booked, nextWeekAvailable] = await Promise.all([
      this.prisma.availableSlot.count(),
      this.prisma.availableSlot.count({ where: { isBooked: false, startsAt: { gte: now } } }),
      this.prisma.availableSlot.count({ where: { isBooked: true } }),
      this.prisma.availableSlot.count({
        where: {
          isBooked: false,
          startsAt: { gte: now, lte: nextWeek },
        },
      }),
    ]);

    return {
      total,
      available,
      booked,
      nextWeekAvailable,
    };
  }

  async getByPractitioner() {
    const slots = await this.prisma.availableSlot.groupBy({
      by: ['practitionerId'],
      _count: { _all: true },
      where: { isBooked: false, startsAt: { gte: new Date() } },
    });

    const practitioners = await this.prisma.practitioner.findMany({
      select: { id: true, firstName: true, lastName: true, title: true },
    });

    return practitioners.map((p) => ({
      practitioner: {
        id: p.id,
        name: p.title ? `${p.title} ${p.firstName} ${p.lastName}` : `${p.firstName} ${p.lastName}`,
      },
      availableSlots: slots.find((s) => s.practitionerId === p.id)?._count._all || 0,
    }));
  }
}
