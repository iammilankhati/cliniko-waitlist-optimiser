/**
 * Practitioner domain types
 * Practitioners are healthcare providers who can have appointments
 */

import type { ISODateTimeString, UUID } from './common';

/** Practitioner entity */
export interface Practitioner {
  id: UUID;
  firstName: string;
  lastName: string;
  title: string | null;
  designation: string | null;
  email: string;
  isActive: boolean;
  showInOnlineBookings: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/** Practitioner summary for list views and selectors */
export interface PractitionerSummary {
  id: UUID;
  firstName: string;
  lastName: string;
  title: string | null;
}

/** Helper to get practitioner display name */
export const getPractitionerDisplayName = (
  practitioner: PractitionerSummary | Practitioner,
): string => {
  const name = `${practitioner.firstName} ${practitioner.lastName}`.trim();
  return practitioner.title ? `${practitioner.title} ${name}` : name;
};
