/**
 * Business/Location domain types
 * A business represents a clinic location
 */

import type { ISODateTimeString, UUID } from './common';

/** Business address */
export interface BusinessAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postCode: string;
  country: string;
}

/** Business operating hours for a single day */
export interface BusinessHours {
  open: string; // HH:mm format
  close: string; // HH:mm format
  isClosed: boolean;
}

/** Weekly operating hours */
export interface WeeklyBusinessHours {
  monday: BusinessHours;
  tuesday: BusinessHours;
  wednesday: BusinessHours;
  thursday: BusinessHours;
  friday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

/** Business/Clinic location entity */
export interface Business {
  id: UUID;
  name: string;
  address: BusinessAddress;
  phone: string | null;
  email: string | null;
  website: string | null;
  timezone: string;
  businessHours: WeeklyBusinessHours;
  showInOnlineBookings: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/** Business summary for selectors and lists */
export interface BusinessSummary {
  id: UUID;
  name: string;
  timezone: string;
}
