/**
 * Availability and Available Slots domain types
 */

import type { DayOfWeek, ISODateString, ISODateTimeString, TimeOfDay, UUID } from './common';
import type { BusinessSummary } from './business';
import type { AppointmentTypeSummary } from './appointment';
import type { PractitionerSummary } from './practitioner';

/** Practitioner's recurring availability schedule */
export interface PractitionerAvailability {
  practitionerId: UUID;
  businessId: UUID;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

/** An available time slot that can be booked */
export interface AvailableSlot {
  id: UUID;
  practitioner: PractitionerSummary;
  business: BusinessSummary;
  appointmentType: AppointmentTypeSummary;
  startsAt: ISODateTimeString;
  endsAt: ISODateTimeString;
  duration: number; // minutes
}

/** Query parameters for finding available slots */
export interface AvailableSlotsQuery {
  businessId?: UUID;
  practitionerId?: UUID;
  appointmentTypeId: UUID;
  fromDate: ISODateString;
  toDate: ISODateString;
  timeOfDay?: TimeOfDay;
}

/** Helper to determine time of day from hour */
export const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

/** Helper to get day of week from date */
export const getDayOfWeekFromDate = (date: Date): DayOfWeek => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const dayIndex = date.getDay();
  // Safe access since getDay() always returns 0-6
  return days[dayIndex] as DayOfWeek;
};
