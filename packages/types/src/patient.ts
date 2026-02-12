/**
 * Patient domain types
 * Based on Cliniko's patient data model
 */

import type { ISODateString, ISODateTimeString, UUID } from './common';

/** Patient contact information */
export interface PatientContact {
  email: string | null;
  phone: string | null;
  mobile: string | null;
}

/** Patient address */
export interface PatientAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postCode: string | null;
  country: string | null;
}

/** Core patient entity */
export interface Patient {
  id: UUID;
  firstName: string;
  lastName: string;
  dateOfBirth: ISODateString | null;
  contact: PatientContact;
  address: PatientAddress | null;
  referralSource: string | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  archivedAt: ISODateTimeString | null;
}

/** Patient summary for list views */
export interface PatientSummary {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

/** DTO for creating a patient */
export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth?: ISODateString;
  email?: string;
  phone?: string;
  mobile?: string;
}

/** DTO for updating a patient */
export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

/** Helper to get full name */
export const getPatientFullName = (patient: PatientSummary | Patient): string =>
  `${patient.firstName} ${patient.lastName}`.trim();
