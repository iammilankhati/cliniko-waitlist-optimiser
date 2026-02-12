/**
 * Matching domain types
 * Types for the Smart Waitlist Auto-Matcher algorithm
 */

import type { UUID } from './common';
import type { AvailableSlot } from './availability';
import type { WaitlistEntry, WaitlistUrgency } from './waitlist';

/** Reasons why a match was made */
export type MatchReason =
  | 'day_matches'
  | 'appointment_type_matches'
  | 'business_matches'
  | 'practitioner_matches'
  | 'time_of_day_matches'
  | 'is_urgent'
  | 'long_wait_time';

/** Reasons why a match might not be perfect */
export type MismatchReason =
  | 'business_not_preferred'
  | 'practitioner_not_preferred'
  | 'time_of_day_not_preferred'
  | 'outside_business_hours_preference';

/** Detailed breakdown of match scoring */
export interface MatchScoreBreakdown {
  /** Base score for matching required criteria (day + appointment type) */
  baseScore: number;
  /** Bonus for matching preferred business */
  businessBonus: number;
  /** Bonus for matching preferred practitioner */
  practitionerBonus: number;
  /** Bonus for matching preferred time of day */
  timeOfDayBonus: number;
  /** Bonus based on urgency level */
  urgencyBonus: number;
  /** Bonus based on wait time (longer wait = higher priority) */
  waitTimeBonus: number;
  /** Total calculated score (0-100) */
  totalScore: number;
}

/** A match between an available slot and a waitlist entry */
export interface Match {
  id: UUID;
  slot: AvailableSlot;
  waitlistEntry: WaitlistEntry;
  score: number;
  scoreBreakdown: MatchScoreBreakdown;
  matchReasons: MatchReason[];
  mismatchReasons: MismatchReason[];
  /** Days the patient has been waiting */
  daysWaiting: number;
  createdAt: string;
}

/** Match grouped by slot (one slot can match multiple waitlist entries) */
export interface SlotMatches {
  slot: AvailableSlot;
  matches: Match[];
  bestMatch: Match | null;
  totalMatches: number;
}

/** Match grouped by waitlist entry (one entry can match multiple slots) */
export interface WaitlistEntryMatches {
  waitlistEntry: WaitlistEntry;
  matches: Match[];
  bestMatch: Match | null;
  totalMatches: number;
}

/** Configuration for the matching algorithm */
export interface MatchingConfig {
  /** Weight for business preference matching (0-1) */
  businessWeight: number;
  /** Weight for practitioner preference matching (0-1) */
  practitionerWeight: number;
  /** Weight for time of day preference (0-1) */
  timeOfDayWeight: number;
  /** Weight for urgency (0-1) */
  urgencyWeight: number;
  /** Weight for wait time (0-1) */
  waitTimeWeight: number;
  /** Maximum days of wait time to consider for bonus */
  maxWaitTimeDays: number;
  /** Minimum score threshold to be considered a match (0-100) */
  minimumScoreThreshold: number;
}

/** Default matching configuration */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  businessWeight: 0.15,
  practitionerWeight: 0.15,
  timeOfDayWeight: 0.1,
  urgencyWeight: 0.1,
  waitTimeWeight: 0.1,
  maxWaitTimeDays: 30,
  minimumScoreThreshold: 40, // Must match day + appointment type at minimum
};

/** Dashboard statistics for matches */
export interface MatchingStats {
  totalAvailableSlots: number;
  totalWaitlistEntries: number;
  totalMatches: number;
  matchesFoundToday: number;
  averageMatchScore: number;
  urgentMatchesCount: number;
  topMatches: Match[];
}

/** Query parameters for finding matches */
export interface FindMatchesQuery {
  /** Filter by specific slot ID */
  slotId?: UUID;
  /** Filter by specific waitlist entry ID */
  waitlistEntryId?: UUID;
  /** Minimum match score (0-100) */
  minScore?: number;
  /** Filter by urgency */
  urgency?: WaitlistUrgency;
  /** Limit results */
  limit?: number;
}

/** DTO for booking a match */
export interface BookMatchDto {
  matchId: UUID;
  /** Optional notes to add to the appointment */
  notes?: string;
  /** Whether to send confirmation to patient */
  sendConfirmation?: boolean;
}

/** Result of booking a match */
export interface BookMatchResult {
  success: boolean;
  appointmentId?: UUID;
  message: string;
  error?: string;
}
