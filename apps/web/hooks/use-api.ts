"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Query keys for cache management
export const queryKeys = {
  dashboard: {
    overview: ["dashboard", "overview"] as const,
    topMatches: (limit: number) => ["dashboard", "top-matches", limit] as const,
    practitioners: ["dashboard", "practitioners"] as const,
    appointmentTypes: ["dashboard", "appointment-types"] as const,
  },
  matching: {
    all: ["matching", "all"] as const,
    forEntry: (id: string) => ["matching", "entry", id] as const,
  },
  waitlist: {
    all: (status?: string) => ["waitlist", "all", status] as const,
    stats: ["waitlist", "stats"] as const,
  },
  slots: {
    stats: ["slots", "stats"] as const,
  },
};

// Dashboard hooks
export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: api.dashboard.overview,
  });
}

export function useTopMatches(limit = 10) {
  return useQuery({
    queryKey: queryKeys.dashboard.topMatches(limit),
    queryFn: () => api.dashboard.topMatches(limit),
  });
}

export function usePractitioners() {
  return useQuery({
    queryKey: queryKeys.dashboard.practitioners,
    queryFn: api.dashboard.practitioners,
  });
}

export function useAppointmentTypes() {
  return useQuery({
    queryKey: queryKeys.dashboard.appointmentTypes,
    queryFn: api.dashboard.appointmentTypes,
  });
}

// Matching hooks
export function useAllMatches() {
  return useQuery({
    queryKey: queryKeys.matching.all,
    queryFn: api.matching.all,
  });
}

export function useMatchesForEntry(id: string) {
  return useQuery({
    queryKey: queryKeys.matching.forEntry(id),
    queryFn: () => api.matching.forEntry(id),
    enabled: !!id,
  });
}

export function useBookMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ waitlistEntryId, slotId }: { waitlistEntryId: string; slotId: string }) =>
      api.matching.book(waitlistEntryId, slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["matching"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

// Waitlist hooks
export function useWaitlist(status?: string) {
  return useQuery({
    queryKey: queryKeys.waitlist.all(status),
    queryFn: () => api.waitlist.all(status),
  });
}

export function useWaitlistStats() {
  return useQuery({
    queryKey: queryKeys.waitlist.stats,
    queryFn: api.waitlist.stats,
  });
}

// Slots hooks
export function useSlotsStats() {
  return useQuery({
    queryKey: queryKeys.slots.stats,
    queryFn: api.slots.stats,
  });
}
