/**
 * Waitlist domain types
 * Core domain for the Smart Waitlist Auto-Matcher
 */

import type { DayOfWeek, ISODateString, ISODateTimeString, UUID } from './common';
import type { BusinessSummary } from './business';
import type { AppointmentTypeSummary } from './appointment';
import type { PatientSummary } from './patient';
import type { PractitionerSummary } from './practitioner';

/** Urgency levels for waitlist entries */
export type WaitlistUrgency = 'low' | 'normal' | 'high' | 'urgent';

/** Status of a waitlist entry */
export type WaitlistEntryStatus = 'active' | 'booked' | 'expired' | 'cancelled';

/** Patient's availability preferences */
export interface WaitlistAvailability {
  /** Days the patient is available */
  days: DayOfWeek[];
  /** Whether patient can only attend outside regular business hours */
  outsideBusinessHoursOnly: boolean;
  /** Optional preferred time of day */
  preferredTimeOfDay?: ('morning' | 'afternoon' | 'evening')[];
}

/** Core waitlist entry entity */
export interface WaitlistEntry {
  id: UUID;
  patient: PatientSummary;
  appointmentType: AppointmentTypeSummary;
  /** Preferred practitioners (empty = any) */
  preferredPractitioners: PractitionerSummary[];
  /** Preferred/allowed businesses (empty = any) */
  preferredBusinesses: BusinessSummary[];
  availability: WaitlistAvailability;
  urgency: WaitlistUrgency;
  status: WaitlistEntryStatus;
  notes: string | null;
  /** Date when entry should be automatically removed */
  expiresAt: ISODateString;
  /** Date when patient was added to waitlist */
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  /** Date when booking was made (if status = 'booked') */
  bookedAt: ISODateTimeString | null;
}

/** DTO for creating a waitlist entry */
export interface CreateWaitlistEntryDto {
  patientId: UUID;
  appointmentTypeId: UUID;
  preferredPractitionerIds?: UUID[];
  preferredBusinessIds?: UUID[];
  availableDays: DayOfWeek[];
  outsideBusinessHoursOnly?: boolean;
  preferredTimeOfDay?: ('morning' | 'afternoon' | 'evening')[];
  urgency?: WaitlistUrgency;
  notes?: string;
  expiresAt?: ISODateString;
}

/** DTO for updating a waitlist entry */
export interface UpdateWaitlistEntryDto extends Partial<Omit<CreateWaitlistEntryDto, 'patientId'>> {
  status?: WaitlistEntryStatus;
}

/** Waitlist statistics for dashboard */
export interface WaitlistStats {
  total: number;
  byUrgency: Record<WaitlistUrgency, number>;
  byStatus: Record<WaitlistEntryStatus, number>;
  averageWaitDays: number;
  oldestEntryDays: number;
}

/** Helper to calculate days on waitlist */
export const calculateDaysOnWaitlist = (createdAt: ISODateTimeString): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/** Urgency score for sorting (higher = more urgent) */
export const getUrgencyScore = (urgency: WaitlistUrgency): number => {
  const scores: Record<WaitlistUrgency, number> = {
    low: 1,
    normal: 2,
    high: 3,
    urgent: 4,
  };
  return scores[urgency];
};
