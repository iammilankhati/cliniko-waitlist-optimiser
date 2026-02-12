/**
 * Appointment domain types
 */

import type { ISODateTimeString, UUID } from './common';
import type { BusinessSummary } from './business';
import type { PatientSummary } from './patient';
import type { PractitionerSummary } from './practitioner';

/** Appointment type (e.g., "First Appointment", "Follow-up") */
export interface AppointmentType {
  id: UUID;
  name: string;
  description: string | null;
  duration: number; // in minutes
  color: string; // hex color for calendar display
  showInOnlineBookings: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/** Appointment type summary */
export interface AppointmentTypeSummary {
  id: UUID;
  name: string;
  duration: number;
  color: string;
}

/** Appointment status */
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

/** Core appointment entity */
export interface Appointment {
  id: UUID;
  patient: PatientSummary;
  practitioner: PractitionerSummary;
  business: BusinessSummary;
  appointmentType: AppointmentTypeSummary;
  startsAt: ISODateTimeString;
  endsAt: ISODateTimeString;
  status: AppointmentStatus;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: ISODateTimeString | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/** DTO for creating an appointment */
export interface CreateAppointmentDto {
  patientId: UUID;
  practitionerId: UUID;
  businessId: UUID;
  appointmentTypeId: UUID;
  startsAt: ISODateTimeString;
  notes?: string;
}

/** DTO for cancelling an appointment */
export interface CancelAppointmentDto {
  reason?: string;
}
