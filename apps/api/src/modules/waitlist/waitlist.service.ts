import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WaitlistStatus } from '../../../generated/prisma/client';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: WaitlistStatus) {
    return this.prisma.waitlistEntry.findMany({
      where: status ? { status } : undefined,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            mobile: true,
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
        availableDays: { select: { day: true } },
        preferredTimesOfDay: { select: { timeOfDay: true } },
        preferredPractitioners: {
          include: {
            practitioner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                title: true,
              },
            },
          },
        },
        preferredBusinesses: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.waitlistEntry.findUnique({
      where: { id },
      include: {
        patient: true,
        appointmentType: true,
        availableDays: true,
        preferredTimesOfDay: true,
        preferredPractitioners: {
          include: { practitioner: true },
        },
        preferredBusinesses: {
          include: { business: true },
        },
        bookedAppointment: true,
      },
    });
  }

  async getStats() {
    const [total, active, booked, expired, byUrgency] = await Promise.all([
      this.prisma.waitlistEntry.count(),
      this.prisma.waitlistEntry.count({ where: { status: 'active' } }),
      this.prisma.waitlistEntry.count({ where: { status: 'booked' } }),
      this.prisma.waitlistEntry.count({ where: { status: 'expired' } }),
      this.prisma.waitlistEntry.groupBy({
        by: ['urgency'],
        _count: { _all: true },
        where: { status: 'active' },
      }),
    ]);

    return {
      total,
      active,
      booked,
      expired,
      byUrgency: byUrgency.reduce(
        (acc, item) => {
          acc[item.urgency] = item._count._all;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async cancel(id: string) {
    return this.prisma.waitlistEntry.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }
}
