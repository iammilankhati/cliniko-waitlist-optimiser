const API_BASE = "https://cliniko-api.digitalsikchya.com/api/v1";

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

async function poster<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// Types based on API responses
export interface DashboardOverview {
  totalPatients: number;
  activeWaitlist: number;
  urgentWaitlist: number;
  availableSlots: number;
  potentialMatches: number;
  recentBookingsFromWaitlist: number;
}

export interface Match {
  id: string;
  score: number;
  breakdown: {
    baseScore: number;
    businessBonus: number;
    practitionerBonus: number;
    timeOfDayBonus: number;
    urgencyBonus: number;
    waitTimeBonus: number;
    totalScore: number;
  };
  matchReasons: string[];
  waitlistEntry: {
    id: string;
    patient: { id: string; name: string; email: string | null; phone: string | null };
    appointmentType: { id: string; name: string; duration: number; color: string };
    urgency: "urgent" | "high" | "normal" | "low";
    notes: string | null;
    createdAt: string;
    expiresAt: string;
  };
  slot: {
    id: string;
    practitioner: { id: string; name: string; designation: string | null };
    business: { id: string; name: string; city: string };
    appointmentType: { id: string; name: string; duration: number; color: string };
    startsAt: string;
    endsAt: string;
    duration: number;
  };
}

export interface WaitlistEntry {
  id: string;
  patient: { id: string; name: string; email: string | null; phone: string | null };
  appointmentType: { id: string; name: string; duration: number; color: string };
  urgency: "urgent" | "high" | "normal" | "low";
  status: "active" | "booked" | "expired" | "cancelled";
  notes: string | null;
  availableDays: string[];
  preferredTimesOfDay: string[];
  preferredPractitioners: { id: string; name: string }[];
  preferredBusinesses: { id: string; name: string; city: string }[];
  createdAt: string;
  expiresAt: string;
  bookedAt: string | null;
}

export interface Practitioner {
  id: string;
  name: string;
  designation: string | null;
  availableSlots: number;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  color: string;
  waitlistCount: number;
  availableSlots: number;
}

// Dashboard-specific match type (flattened for easier consumption)
export interface TopMatch {
  id: string;
  score: number;
  matchReasons: string[];
  patient: { id: string; name: string };
  appointmentType: string;
  appointmentTypeDuration: number;
  appointmentTypeColor: string;
  urgency: "urgent" | "high" | "normal" | "low";
  createdAt: string;
  slot: {
    id: string;
    practitioner: string;
    business: string;
    startsAt: string;
  };
  waitlistEntryId: string;
  slotId: string;
}

// API functions
export const api = {
  dashboard: {
    overview: () => fetcher<DashboardOverview>("/dashboard/overview"),
    topMatches: (limit = 10) => fetcher<TopMatch[]>(`/dashboard/top-matches?limit=${limit}`),
    practitioners: () => fetcher<Practitioner[]>("/dashboard/practitioners"),
    appointmentTypes: () => fetcher<AppointmentType[]>("/dashboard/appointment-types"),
  },
  matching: {
    all: () => fetcher<{ count: number; matches: Match[] }>("/matching"),
    forEntry: (id: string) => fetcher<{ waitlistEntryId: string; count: number; matches: Match[] }>(`/matching/waitlist/${id}`),
    book: (waitlistEntryId: string, slotId: string) =>
      poster<{ success: boolean; appointmentId: string }>("/matching/book", { waitlistEntryId, slotId }),
  },
  waitlist: {
    all: (status?: string) => fetcher<{ count: number; entries: WaitlistEntry[] }>(`/waitlist${status ? `?status=${status}` : ""}`),
    stats: () => fetcher<{ total: number; active: number; booked: number; expired: number; byUrgency: Record<string, number> }>("/waitlist/stats"),
  },
  slots: {
    stats: () => fetcher<{ total: number; available: number; booked: number; nextWeekAvailable: number }>("/slots/stats"),
  },
};
