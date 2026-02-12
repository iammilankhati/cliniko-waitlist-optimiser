/**
 * Mock data for demonstration purposes
 * Simulates Cliniko API responses
 */

import type {
  Patient,
  Practitioner,
  Business,
  AppointmentType,
  WaitlistEntry,
  AvailableSlot,
} from '@cliniko/types';

// =============================================================================
// BUSINESSES (Clinic Locations)
// =============================================================================

export const mockBusinesses: Business[] = [
  {
    id: 'bus_001',
    name: 'Main Clinic',
    address: {
      line1: '123 Health Street',
      line2: 'Suite 100',
      city: 'Melbourne',
      state: 'VIC',
      postCode: '3000',
      country: 'Australia',
    },
    phone: '+61 3 9000 0001',
    email: 'main@clinic.com',
    website: 'https://clinic.com',
    timezone: 'Australia/Melbourne',
    businessHours: {
      monday: { open: '08:00', close: '18:00', isClosed: false },
      tuesday: { open: '08:00', close: '18:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '18:00', isClosed: false },
      friday: { open: '08:00', close: '17:00', isClosed: false },
      saturday: { open: '09:00', close: '13:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true },
    },
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bus_002',
    name: 'North Branch',
    address: {
      line1: '456 Wellness Avenue',
      line2: null,
      city: 'Preston',
      state: 'VIC',
      postCode: '3072',
      country: 'Australia',
    },
    phone: '+61 3 9000 0002',
    email: 'north@clinic.com',
    website: 'https://clinic.com',
    timezone: 'Australia/Melbourne',
    businessHours: {
      monday: { open: '09:00', close: '17:00', isClosed: false },
      tuesday: { open: '09:00', close: '17:00', isClosed: false },
      wednesday: { open: '09:00', close: '17:00', isClosed: false },
      thursday: { open: '09:00', close: '17:00', isClosed: false },
      friday: { open: '09:00', close: '16:00', isClosed: false },
      saturday: { open: '00:00', close: '00:00', isClosed: true },
      sunday: { open: '00:00', close: '00:00', isClosed: true },
    },
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// =============================================================================
// PRACTITIONERS
// =============================================================================

export const mockPractitioners: Practitioner[] = [
  {
    id: 'prac_001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'Dr',
    designation: 'Physiotherapist',
    email: 'sarah.johnson@clinic.com',
    isActive: true,
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prac_002',
    firstName: 'Michael',
    lastName: 'Chen',
    title: null,
    designation: 'Massage Therapist',
    email: 'michael.chen@clinic.com',
    isActive: true,
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prac_003',
    firstName: 'Emma',
    lastName: 'Williams',
    title: 'Dr',
    designation: 'Chiropractor',
    email: 'emma.williams@clinic.com',
    isActive: true,
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// =============================================================================
// APPOINTMENT TYPES
// =============================================================================

export const mockAppointmentTypes: AppointmentType[] = [
  {
    id: 'apt_001',
    name: 'Initial Consultation',
    description: 'First appointment for new patients',
    duration: 60,
    color: '#4F46E5',
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'apt_002',
    name: 'Follow-up',
    description: 'Standard follow-up appointment',
    duration: 30,
    color: '#10B981',
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'apt_003',
    name: 'Massage Therapy',
    description: '60 minute massage session',
    duration: 60,
    color: '#F59E0B',
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'apt_004',
    name: 'Extended Treatment',
    description: 'Extended treatment session',
    duration: 90,
    color: '#EC4899',
    showInOnlineBookings: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// =============================================================================
// PATIENTS
// =============================================================================

export const mockPatients: Patient[] = [
  {
    id: 'pat_001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1985-03-15',
    contact: {
      email: 'john.smith@email.com',
      phone: '+61 400 000 001',
      mobile: '+61 400 000 001',
    },
    address: {
      line1: '10 Patient Street',
      line2: null,
      city: 'Melbourne',
      state: 'VIC',
      postCode: '3000',
      country: 'Australia',
    },
    referralSource: 'Google',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
    archivedAt: null,
  },
  {
    id: 'pat_002',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1990-07-22',
    contact: {
      email: 'emily.davis@email.com',
      phone: '+61 400 000 002',
      mobile: '+61 400 000 002',
    },
    address: null,
    referralSource: 'Friend referral',
    createdAt: '2024-05-15T14:30:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
    archivedAt: null,
  },
  {
    id: 'pat_003',
    firstName: 'Robert',
    lastName: 'Wilson',
    dateOfBirth: '1978-11-08',
    contact: {
      email: 'robert.wilson@email.com',
      phone: '+61 400 000 003',
      mobile: null,
    },
    address: null,
    referralSource: 'Website',
    createdAt: '2024-04-20T09:15:00Z',
    updatedAt: '2024-04-20T09:15:00Z',
    archivedAt: null,
  },
  {
    id: 'pat_004',
    firstName: 'Lisa',
    lastName: 'Brown',
    dateOfBirth: '1995-02-28',
    contact: {
      email: 'lisa.brown@email.com',
      phone: '+61 400 000 004',
      mobile: '+61 400 000 004',
    },
    address: null,
    referralSource: 'Instagram',
    createdAt: '2024-07-01T16:45:00Z',
    updatedAt: '2024-07-01T16:45:00Z',
    archivedAt: null,
  },
  {
    id: 'pat_005',
    firstName: 'David',
    lastName: 'Taylor',
    dateOfBirth: '1982-09-12',
    contact: {
      email: 'david.taylor@email.com',
      phone: '+61 400 000 005',
      mobile: '+61 400 000 005',
    },
    address: null,
    referralSource: 'Doctor referral',
    createdAt: '2024-03-10T11:20:00Z',
    updatedAt: '2024-03-10T11:20:00Z',
    archivedAt: null,
  },
];

// =============================================================================
// WAITLIST ENTRIES
// =============================================================================

const now = new Date();
const getDateDaysAgo = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const getDateDaysAhead = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0] as string;
};

export const mockWaitlistEntries: WaitlistEntry[] = [
  {
    id: 'wl_001',
    patient: {
      id: 'pat_001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+61 400 000 001',
    },
    appointmentType: {
      id: 'apt_001',
      name: 'Initial Consultation',
      duration: 60,
      color: '#4F46E5',
    },
    preferredPractitioners: [
      {
        id: 'prac_001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        title: 'Dr',
      },
    ],
    preferredBusinesses: [
      { id: 'bus_001', name: 'Main Clinic', timezone: 'Australia/Melbourne' },
    ],
    availability: {
      days: ['mon', 'wed', 'fri'],
      outsideBusinessHoursOnly: false,
      preferredTimeOfDay: ['morning'],
    },
    urgency: 'urgent',
    status: 'active',
    notes: 'Experiencing significant back pain, needs to be seen soon',
    expiresAt: getDateDaysAhead(14),
    createdAt: getDateDaysAgo(7),
    updatedAt: getDateDaysAgo(7),
    bookedAt: null,
  },
  {
    id: 'wl_002',
    patient: {
      id: 'pat_002',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '+61 400 000 002',
    },
    appointmentType: {
      id: 'apt_002',
      name: 'Follow-up',
      duration: 30,
      color: '#10B981',
    },
    preferredPractitioners: [],
    preferredBusinesses: [],
    availability: {
      days: ['tue', 'thu'],
      outsideBusinessHoursOnly: false,
      preferredTimeOfDay: ['afternoon'],
    },
    urgency: 'normal',
    status: 'active',
    notes: 'Follow-up after initial treatment',
    expiresAt: getDateDaysAhead(21),
    createdAt: getDateDaysAgo(12),
    updatedAt: getDateDaysAgo(12),
    bookedAt: null,
  },
  {
    id: 'wl_003',
    patient: {
      id: 'pat_003',
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@email.com',
      phone: '+61 400 000 003',
    },
    appointmentType: {
      id: 'apt_003',
      name: 'Massage Therapy',
      duration: 60,
      color: '#F59E0B',
    },
    preferredPractitioners: [
      {
        id: 'prac_002',
        firstName: 'Michael',
        lastName: 'Chen',
        title: null,
      },
    ],
    preferredBusinesses: [
      { id: 'bus_001', name: 'Main Clinic', timezone: 'Australia/Melbourne' },
      { id: 'bus_002', name: 'North Branch', timezone: 'Australia/Melbourne' },
    ],
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      outsideBusinessHoursOnly: false,
    },
    urgency: 'high',
    status: 'active',
    notes: 'Recovering from sports injury',
    expiresAt: getDateDaysAhead(30),
    createdAt: getDateDaysAgo(5),
    updatedAt: getDateDaysAgo(5),
    bookedAt: null,
  },
  {
    id: 'wl_004',
    patient: {
      id: 'pat_004',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@email.com',
      phone: '+61 400 000 004',
    },
    appointmentType: {
      id: 'apt_001',
      name: 'Initial Consultation',
      duration: 60,
      color: '#4F46E5',
    },
    preferredPractitioners: [
      {
        id: 'prac_003',
        firstName: 'Emma',
        lastName: 'Williams',
        title: 'Dr',
      },
    ],
    preferredBusinesses: [
      { id: 'bus_002', name: 'North Branch', timezone: 'Australia/Melbourne' },
    ],
    availability: {
      days: ['wed', 'fri'],
      outsideBusinessHoursOnly: true,
    },
    urgency: 'low',
    status: 'active',
    notes: 'Works during business hours, prefers evening appointments',
    expiresAt: getDateDaysAhead(45),
    createdAt: getDateDaysAgo(3),
    updatedAt: getDateDaysAgo(3),
    bookedAt: null,
  },
  {
    id: 'wl_005',
    patient: {
      id: 'pat_005',
      firstName: 'David',
      lastName: 'Taylor',
      email: 'david.taylor@email.com',
      phone: '+61 400 000 005',
    },
    appointmentType: {
      id: 'apt_004',
      name: 'Extended Treatment',
      duration: 90,
      color: '#EC4899',
    },
    preferredPractitioners: [],
    preferredBusinesses: [
      { id: 'bus_001', name: 'Main Clinic', timezone: 'Australia/Melbourne' },
    ],
    availability: {
      days: ['mon', 'wed'],
      outsideBusinessHoursOnly: false,
      preferredTimeOfDay: ['morning', 'afternoon'],
    },
    urgency: 'normal',
    status: 'active',
    notes: null,
    expiresAt: getDateDaysAhead(28),
    createdAt: getDateDaysAgo(15),
    updatedAt: getDateDaysAgo(15),
    bookedAt: null,
  },
];

// =============================================================================
// AVAILABLE SLOTS (Generated dynamically)
// =============================================================================

/**
 * Generate available slots for the next N days
 */
export function generateAvailableSlots(daysAhead: number = 7): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < daysAhead; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    const dayOfWeek = currentDate.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    // Generate slots for each practitioner
    for (const practitioner of mockPractitioners) {
      // Determine business based on practitioner (simple logic for demo)
      const business =
        practitioner.id === 'prac_003' ? mockBusinesses[1] : mockBusinesses[0];

      if (!business) continue;

      // Generate morning slots
      const morningSlots = [9, 10, 11];
      // Generate afternoon slots
      const afternoonSlots = [14, 15, 16];
      // Wednesday evening slots
      const eveningSlots = dayOfWeek === 3 ? [18, 19] : [];

      const allHours = [...morningSlots, ...afternoonSlots, ...eveningSlots];

      for (const hour of allHours) {
        // Randomly skip some slots to simulate booked appointments
        if (Math.random() > 0.6) continue;

        for (const aptType of mockAppointmentTypes) {
          // Not all practitioners offer all appointment types
          if (
            aptType.id === 'apt_003' &&
            practitioner.id !== 'prac_002'
          )
            continue;
          if (
            aptType.id === 'apt_004' &&
            practitioner.id === 'prac_002'
          )
            continue;

          const startsAt = new Date(currentDate);
          startsAt.setHours(hour, 0, 0, 0);

          const endsAt = new Date(startsAt);
          endsAt.setMinutes(endsAt.getMinutes() + aptType.duration);

          slots.push({
            id: `slot_${currentDate.toISOString().split('T')[0]}_${hour}_${practitioner.id}_${aptType.id}`,
            practitioner: {
              id: practitioner.id,
              firstName: practitioner.firstName,
              lastName: practitioner.lastName,
              title: practitioner.title,
            },
            business: {
              id: business.id,
              name: business.name,
              timezone: business.timezone,
            },
            appointmentType: {
              id: aptType.id,
              name: aptType.name,
              duration: aptType.duration,
              color: aptType.color,
            },
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            duration: aptType.duration,
          });
        }
      }
    }
  }

  return slots;
}

// Pre-generate slots for demo
export const mockAvailableSlots = generateAvailableSlots(14);
