/**
 * Prisma Seed Script
 * Populates the database with demo data for the Cliniko Waitlist Optimizer
 *
 * Run with: npx prisma db seed
 */

import 'dotenv/config';
import { PrismaClient, DayOfWeek, TimeOfDay, WaitlistUrgency } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.waitlistBusinessPreference.deleteMany();
  await prisma.waitlistPractitionerPreference.deleteMany();
  await prisma.waitlistTimePreference.deleteMany();
  await prisma.waitlistDayPreference.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.availableSlot.deleteMany();
  await prisma.practitionerBusiness.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.practitioner.deleteMany();
  await prisma.appointmentType.deleteMany();
  await prisma.business.deleteMany();

  // =============================================================================
  // BUSINESSES (Clinic Locations)
  // =============================================================================
  console.log('🏥 Creating businesses...');

  const mainClinic = await prisma.business.create({
    data: {
      name: 'Main Clinic',
      addressLine1: '123 Health Street',
      addressLine2: 'Suite 100',
      city: 'Melbourne',
      state: 'VIC',
      postCode: '3000',
      country: 'Australia',
      phone: '+61 3 9000 0001',
      email: 'main@clinic.com',
      website: 'https://clinic.com',
      timezone: 'Australia/Melbourne',
      showInOnlineBookings: true,
      businessHours: {
        monday: { open: '08:00', close: '18:00', isClosed: false },
        tuesday: { open: '08:00', close: '18:00', isClosed: false },
        wednesday: { open: '08:00', close: '20:00', isClosed: false },
        thursday: { open: '08:00', close: '18:00', isClosed: false },
        friday: { open: '08:00', close: '17:00', isClosed: false },
        saturday: { open: '09:00', close: '13:00', isClosed: false },
        sunday: { open: '00:00', close: '00:00', isClosed: true },
      },
    },
  });

  const northBranch = await prisma.business.create({
    data: {
      name: 'North Branch',
      addressLine1: '456 Wellness Avenue',
      city: 'Preston',
      state: 'VIC',
      postCode: '3072',
      country: 'Australia',
      phone: '+61 3 9000 0002',
      email: 'north@clinic.com',
      timezone: 'Australia/Melbourne',
      showInOnlineBookings: true,
      businessHours: {
        monday: { open: '09:00', close: '17:00', isClosed: false },
        tuesday: { open: '09:00', close: '17:00', isClosed: false },
        wednesday: { open: '09:00', close: '17:00', isClosed: false },
        thursday: { open: '09:00', close: '17:00', isClosed: false },
        friday: { open: '09:00', close: '16:00', isClosed: false },
        saturday: { open: '00:00', close: '00:00', isClosed: true },
        sunday: { open: '00:00', close: '00:00', isClosed: true },
      },
    },
  });

  console.log(`  ✓ Created ${mainClinic.name}`);
  console.log(`  ✓ Created ${northBranch.name}`);

  // =============================================================================
  // PRACTITIONERS
  // =============================================================================
  console.log('\n👨‍⚕️ Creating practitioners...');

  const drSarah = await prisma.practitioner.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Dr',
      designation: 'Physiotherapist',
      email: 'sarah.johnson@clinic.com',
      isActive: true,
      showInOnlineBookings: true,
    },
  });

  const michael = await prisma.practitioner.create({
    data: {
      firstName: 'Michael',
      lastName: 'Chen',
      designation: 'Massage Therapist',
      email: 'michael.chen@clinic.com',
      isActive: true,
      showInOnlineBookings: true,
    },
  });

  const drEmma = await prisma.practitioner.create({
    data: {
      firstName: 'Emma',
      lastName: 'Williams',
      title: 'Dr',
      designation: 'Chiropractor',
      email: 'emma.williams@clinic.com',
      isActive: true,
      showInOnlineBookings: true,
    },
  });

  console.log(`  ✓ Created Dr Sarah Johnson`);
  console.log(`  ✓ Created Michael Chen`);
  console.log(`  ✓ Created Dr Emma Williams`);

  // Link practitioners to businesses
  await prisma.practitionerBusiness.createMany({
    data: [
      { practitionerId: drSarah.id, businessId: mainClinic.id },
      { practitionerId: drSarah.id, businessId: northBranch.id },
      { practitionerId: michael.id, businessId: mainClinic.id },
      { practitionerId: drEmma.id, businessId: northBranch.id },
    ],
  });

  // =============================================================================
  // APPOINTMENT TYPES
  // =============================================================================
  console.log('\n📋 Creating appointment types...');

  const initialConsult = await prisma.appointmentType.create({
    data: {
      name: 'Initial Consultation',
      description: 'First appointment for new patients',
      duration: 60,
      color: '#4F46E5',
      showInOnlineBookings: true,
    },
  });

  const followUp = await prisma.appointmentType.create({
    data: {
      name: 'Follow-up',
      description: 'Standard follow-up appointment',
      duration: 30,
      color: '#10B981',
      showInOnlineBookings: true,
    },
  });

  const massage = await prisma.appointmentType.create({
    data: {
      name: 'Massage Therapy',
      description: '60 minute massage session',
      duration: 60,
      color: '#F59E0B',
      showInOnlineBookings: true,
    },
  });

  const extended = await prisma.appointmentType.create({
    data: {
      name: 'Extended Treatment',
      description: 'Extended treatment session',
      duration: 90,
      color: '#EC4899',
      showInOnlineBookings: true,
    },
  });

  console.log(`  ✓ Created Initial Consultation (60 min)`);
  console.log(`  ✓ Created Follow-up (30 min)`);
  console.log(`  ✓ Created Massage Therapy (60 min)`);
  console.log(`  ✓ Created Extended Treatment (90 min)`);

  // =============================================================================
  // PATIENTS
  // =============================================================================
  console.log('\n👥 Creating patients...');

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-03-15'),
        email: 'john.smith@email.com',
        phone: '+61 400 000 001',
        mobile: '+61 400 000 001',
        referralSource: 'Google',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Emily',
        lastName: 'Davis',
        dateOfBirth: new Date('1990-07-22'),
        email: 'emily.davis@email.com',
        phone: '+61 400 000 002',
        mobile: '+61 400 000 002',
        referralSource: 'Friend referral',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Robert',
        lastName: 'Wilson',
        dateOfBirth: new Date('1978-11-08'),
        email: 'robert.wilson@email.com',
        phone: '+61 400 000 003',
        referralSource: 'Website',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Brown',
        dateOfBirth: new Date('1995-02-28'),
        email: 'lisa.brown@email.com',
        phone: '+61 400 000 004',
        mobile: '+61 400 000 004',
        referralSource: 'Instagram',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'David',
        lastName: 'Taylor',
        dateOfBirth: new Date('1982-09-12'),
        email: 'david.taylor@email.com',
        phone: '+61 400 000 005',
        mobile: '+61 400 000 005',
        referralSource: 'Doctor referral',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Sophie',
        lastName: 'Anderson',
        dateOfBirth: new Date('1988-05-20'),
        email: 'sophie.anderson@email.com',
        phone: '+61 400 000 006',
        referralSource: 'Google',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'James',
        lastName: 'Martinez',
        dateOfBirth: new Date('1975-12-03'),
        email: 'james.martinez@email.com',
        phone: '+61 400 000 007',
        referralSource: 'Website',
      },
    }),
  ]);

  console.log(`  ✓ Created ${patients.length} patients`);

  // =============================================================================
  // WAITLIST ENTRIES
  // =============================================================================
  console.log('\n📝 Creating waitlist entries...');

  const now = new Date();
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };
  const daysAhead = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  // Waitlist Entry 1: John Smith - Urgent, Initial Consultation, prefers Dr Sarah
  const wl1 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[0]!.id,
      appointmentTypeId: initialConsult.id,
      urgency: WaitlistUrgency.urgent,
      notes: 'Experiencing significant back pain, needs to be seen soon',
      expiresAt: daysAhead(14),
      createdAt: daysAgo(7),
      availableDays: {
        create: [
          { day: DayOfWeek.mon },
          { day: DayOfWeek.wed },
          { day: DayOfWeek.fri },
        ],
      },
      preferredTimesOfDay: {
        create: [{ timeOfDay: TimeOfDay.morning }],
      },
      preferredPractitioners: {
        create: [{ practitionerId: drSarah.id }],
      },
      preferredBusinesses: {
        create: [{ businessId: mainClinic.id }],
      },
    },
  });

  // Waitlist Entry 2: Emily Davis - Normal, Follow-up, flexible
  const wl2 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[1]!.id,
      appointmentTypeId: followUp.id,
      urgency: WaitlistUrgency.normal,
      notes: 'Follow-up after initial treatment',
      expiresAt: daysAhead(21),
      createdAt: daysAgo(12),
      availableDays: {
        create: [{ day: DayOfWeek.tue }, { day: DayOfWeek.thu }],
      },
      preferredTimesOfDay: {
        create: [{ timeOfDay: TimeOfDay.afternoon }],
      },
    },
  });

  // Waitlist Entry 3: Robert Wilson - High, Massage, prefers Michael
  const wl3 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[2]!.id,
      appointmentTypeId: massage.id,
      urgency: WaitlistUrgency.high,
      notes: 'Recovering from sports injury',
      expiresAt: daysAhead(30),
      createdAt: daysAgo(5),
      availableDays: {
        create: [
          { day: DayOfWeek.mon },
          { day: DayOfWeek.tue },
          { day: DayOfWeek.wed },
          { day: DayOfWeek.thu },
          { day: DayOfWeek.fri },
        ],
      },
      preferredPractitioners: {
        create: [{ practitionerId: michael.id }],
      },
      preferredBusinesses: {
        create: [
          { businessId: mainClinic.id },
          { businessId: northBranch.id },
        ],
      },
    },
  });

  // Waitlist Entry 4: Lisa Brown - Low, Initial Consultation, evening only
  const wl4 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[3]!.id,
      appointmentTypeId: initialConsult.id,
      urgency: WaitlistUrgency.low,
      notes: 'Works during business hours, prefers evening appointments',
      expiresAt: daysAhead(45),
      createdAt: daysAgo(3),
      outsideBusinessHoursOnly: true,
      availableDays: {
        create: [{ day: DayOfWeek.wed }, { day: DayOfWeek.fri }],
      },
      preferredPractitioners: {
        create: [{ practitionerId: drEmma.id }],
      },
      preferredBusinesses: {
        create: [{ businessId: northBranch.id }],
      },
    },
  });

  // Waitlist Entry 5: David Taylor - Normal, Extended Treatment
  const wl5 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[4]!.id,
      appointmentTypeId: extended.id,
      urgency: WaitlistUrgency.normal,
      expiresAt: daysAhead(28),
      createdAt: daysAgo(15),
      availableDays: {
        create: [{ day: DayOfWeek.mon }, { day: DayOfWeek.wed }],
      },
      preferredTimesOfDay: {
        create: [
          { timeOfDay: TimeOfDay.morning },
          { timeOfDay: TimeOfDay.afternoon },
        ],
      },
      preferredBusinesses: {
        create: [{ businessId: mainClinic.id }],
      },
    },
  });

  // Waitlist Entry 6: Sophie Anderson - High, Follow-up
  const wl6 = await prisma.waitlistEntry.create({
    data: {
      patientId: patients[5]!.id,
      appointmentTypeId: followUp.id,
      urgency: WaitlistUrgency.high,
      notes: 'Post-surgery follow-up',
      expiresAt: daysAhead(7),
      createdAt: daysAgo(2),
      availableDays: {
        create: [
          { day: DayOfWeek.mon },
          { day: DayOfWeek.tue },
          { day: DayOfWeek.wed },
          { day: DayOfWeek.thu },
          { day: DayOfWeek.fri },
        ],
      },
    },
  });

  console.log(`  ✓ Created 6 waitlist entries`);

  // =============================================================================
  // AVAILABLE SLOTS (Next 14 days)
  // =============================================================================
  console.log('\n📅 Creating available slots...');

  const practitioners = [
    { practitioner: drSarah, businesses: [mainClinic, northBranch], appointmentTypes: [initialConsult, followUp, extended] },
    { practitioner: michael, businesses: [mainClinic], appointmentTypes: [massage] },
    { practitioner: drEmma, businesses: [northBranch], appointmentTypes: [initialConsult, followUp, extended] },
  ];

  // Batch slot creation for performance
  const slotsToCreate: {
    practitionerId: string;
    businessId: string;
    appointmentTypeId: string;
    startsAt: Date;
    endsAt: Date;
    duration: number;
    isBooked: boolean;
  }[] = [];

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  // Use seeded random for reproducible demo data
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  let seedCounter = 42;

  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    const dayOfWeek = currentDate.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    for (const { practitioner, businesses, appointmentTypes } of practitioners) {
      const business = businesses[0]!;

      // Morning slots: 9, 10, 11
      // Afternoon slots: 14, 15, 16
      // Wednesday evening: 18, 19
      const hours = dayOfWeek === 3
        ? [9, 10, 11, 14, 15, 16, 18, 19]
        : [9, 10, 11, 14, 15, 16];

      for (const hour of hours) {
        // Skip some slots to simulate booked appointments
        if (seededRandom(seedCounter++) > 0.7) continue;

        for (const aptType of appointmentTypes) {
          const startsAt = new Date(currentDate);
          startsAt.setHours(hour, 0, 0, 0);

          const endsAt = new Date(startsAt);
          endsAt.setMinutes(endsAt.getMinutes() + aptType.duration);

          slotsToCreate.push({
            practitionerId: practitioner.id,
            businessId: business.id,
            appointmentTypeId: aptType.id,
            startsAt,
            endsAt,
            duration: aptType.duration,
            isBooked: false,
          });
        }
      }
    }
  }

  // Batch insert all slots
  await prisma.availableSlot.createMany({ data: slotsToCreate });
  console.log(`  ✓ Created ${slotsToCreate.length} available slots`);

  // =============================================================================
  // SUMMARY
  // =============================================================================
  console.log('\n✅ Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`  • ${await prisma.business.count()} businesses`);
  console.log(`  • ${await prisma.practitioner.count()} practitioners`);
  console.log(`  • ${await prisma.appointmentType.count()} appointment types`);
  console.log(`  • ${await prisma.patient.count()} patients`);
  console.log(`  • ${await prisma.waitlistEntry.count()} waitlist entries`);
  console.log(`  • ${await prisma.availableSlot.count()} available slots`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
