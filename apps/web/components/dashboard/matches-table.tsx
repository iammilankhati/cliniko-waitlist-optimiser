"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@workspace/ui/components/dialog";
import { useTopMatches, useBookMatch } from "@/hooks/use-api";
import { Clock, User, MapPin, Calendar, Eye, Phone, Mail, Stethoscope } from "lucide-react";
import { useState, useMemo } from "react";
import type { TopMatch } from "@/lib/api";

type Urgency = "urgent" | "high" | "normal" | "low";

const urgencyConfig: Record<Urgency, { dot: string; text: string; bg: string; label: string }> = {
  urgent: { dot: "bg-red-500", text: "text-red-600", bg: "bg-red-50", label: "Urgent" },
  high: { dot: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50", label: "High" },
  normal: { dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50", label: "Normal" },
  low: { dot: "bg-gray-400", text: "text-gray-500", bg: "bg-gray-50", label: "Low" },
};

const urgencyOrder: Urgency[] = ["urgent", "high", "normal", "low"];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDaysWaiting(createdAt: string) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  return days === 1 ? "1 day" : `${days} days`;
}

function ViewDetailsModal({
  match,
  open,
  onOpenChange,
  onBook,
  isBooking,
}: {
  match: TopMatch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: () => void;
  isBooking: boolean;
}) {
  const config = urgencyConfig[match.urgency];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <div className="px-5 pt-5 pb-4 pr-12 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-gray-900">
              Match Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
              </span>
              <span className="text-sm font-semibold text-gray-900">{match.score} pts</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Patient</p>
            <p className="text-sm font-medium text-gray-900">{match.patient.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Waiting {formatDaysWaiting(match.createdAt)}</p>
            {(match.patient.email || match.patient.phone) && (
              <div className="flex flex-wrap gap-3 mt-2">
                {match.patient.email && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    {match.patient.email}
                  </span>
                )}
                {match.patient.phone && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="h-3 w-3" />
                    {match.patient.phone}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Appointment</p>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: match.appointmentTypeColor }}
              />
              <span className="text-sm text-gray-900">{match.appointmentType}</span>
              <span className="text-xs text-gray-400">({match.appointmentTypeDuration} min)</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Available Slot</p>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">{match.slot.practitioner}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {match.slot.business}
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1.5">{formatDateLong(match.slot.startsAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Why this match</p>
            <div className="flex flex-wrap gap-1.5">
              {match.matchReasons.map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-600 bg-gray-100"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-9 text-sm cursor-pointer"
          >
            Close
          </Button>
          <Button
            onClick={onBook}
            disabled={isBooking}
            className="flex-1 h-9 text-sm bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            {isBooking ? "Booking..." : "Book Appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingConfirmModal({
  match,
  open,
  onOpenChange,
  onConfirm,
  isBooking,
}: {
  match: TopMatch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isBooking: boolean;
}) {
  const config = urgencyConfig[match.urgency];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0">
        <div className="px-5 pt-5 pb-3 pr-12">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Confirm Booking
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Book this appointment?
          </p>
        </div>

        <div className="px-5 py-3">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{match.patient.name}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`w-1 h-1 rounded-full ${config.dot}`} />
                {config.label}
              </span>
            </div>

            <div className="border-t border-gray-200" />

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{match.slot.practitioner}</p>
                  <p className="text-xs text-gray-500">{match.appointmentType} ({match.appointmentTypeDuration} min)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{match.slot.business}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{formatDateLong(match.slot.startsAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBooking}
            className="flex-1 h-9 text-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isBooking}
            className="flex-1 h-9 text-sm bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            {isBooking ? "Booking..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MatchRow({
  match,
  onView,
  onBook,
}: {
  match: TopMatch;
  onView: () => void;
  onBook: () => void;
}) {
  const config = urgencyConfig[match.urgency];

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      {/* Desktop */}
      <div className="hidden sm:flex items-start gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
          <span className="text-lg font-bold text-gray-900">{match.score}</span>
          <span className="text-[10px] text-gray-400 font-medium">match</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{match.patient.name}</h3>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.text}`}>
              <span className={`w-1 h-1 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDaysWaiting(match.createdAt)}
            </span>
            <span>{match.appointmentType}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
            <span className="font-medium">{match.slot.practitioner}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.slot.business}
            </span>
            <span className="text-gray-300">•</span>
            <span>{formatDate(match.slot.startsAt)}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {match.matchReasons.slice(0, 3).map((reason, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50 border border-gray-100"
              >
                {reason}
              </span>
            ))}
            {match.matchReasons.length > 3 && (
              <span className="text-[10px] text-gray-400">+{match.matchReasons.length - 3}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="h-8 px-3 text-xs cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
          <Button
            size="sm"
            onClick={onBook}
            className="h-8 px-3 text-xs cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          >
            Book
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
            <span className="text-base font-bold text-gray-900">{match.score}</span>
            <span className="text-[9px] text-gray-400 font-medium">match</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{match.patient.name}</h3>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${config.bg} ${config.text}`}>
                <span className={`w-1 h-1 rounded-full ${config.dot}`} />
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <Clock className="h-3 w-3" />
              <span>{formatDaysWaiting(match.createdAt)}</span>
              <span className="text-gray-300">•</span>
              <span className="truncate">{match.appointmentType}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{match.slot.practitioner}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{match.slot.business}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(match.slot.startsAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {match.matchReasons.slice(0, 2).map((reason, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50 border border-gray-100"
            >
              {reason}
            </span>
          ))}
          {match.matchReasons.length > 2 && (
            <span className="text-[10px] text-gray-400">+{match.matchReasons.length - 2}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1 h-9 text-sm cursor-pointer"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            View Details
          </Button>
          <Button
            size="sm"
            onClick={onBook}
            className="flex-1 h-9 text-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MatchesTable() {
  const { data: matches, isLoading } = useTopMatches(10);
  const bookMatch = useBookMatch();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [selectedUrgencies, setSelectedUrgencies] = useState<Set<Urgency>>(new Set());
  const [viewMatch, setViewMatch] = useState<TopMatch | null>(null);
  const [confirmMatch, setConfirmMatch] = useState<TopMatch | null>(null);

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    if (selectedUrgencies.size === 0) return matches;
    return matches.filter((match) => selectedUrgencies.has(match.urgency));
  }, [matches, selectedUrgencies]);

  const toggleUrgency = (urgency: Urgency) => {
    setSelectedUrgencies((prev) => {
      const next = new Set(prev);
      if (next.has(urgency)) {
        next.delete(urgency);
      } else {
        next.add(urgency);
      }
      return next;
    });
  };

  const handleBook = async (match: TopMatch) => {
    setBookingId(match.id);
    try {
      await bookMatch.mutateAsync({ waitlistEntryId: match.waitlistEntryId, slotId: match.slotId });
      setConfirmMatch(null);
      setViewMatch(null);
    } finally {
      setBookingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Top Matches</CardTitle>
          <CardDescription className="text-xs">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base">Top Matches</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Best waitlist-to-slot matches
              </CardDescription>
            </div>
            <span className="text-xs text-gray-500">
              {selectedUrgencies.size > 0 ? filteredMatches.length : matches?.length ?? 0} matches
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-400">Filter:</span>
            {urgencyOrder.map((urgency) => {
              const isSelected = selectedUrgencies.has(urgency);
              const count = matches?.filter((m) => m.urgency === urgency).length ?? 0;
              const cfg = urgencyConfig[urgency];
              return (
                <button
                  key={urgency}
                  onClick={() => toggleUrgency(urgency)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? `${cfg.bg} ${cfg.text}`
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? cfg.dot : 'bg-gray-300'}`} />
                  {cfg.label}
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
            {selectedUrgencies.size > 0 && (
              <button
                onClick={() => setSelectedUrgencies(new Set())}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No matches found</p>
              </div>
            ) : (
              filteredMatches.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  onView={() => setViewMatch(match)}
                  onBook={() => setConfirmMatch(match)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {viewMatch && (
        <ViewDetailsModal
          match={viewMatch}
          open={!!viewMatch}
          onOpenChange={(open) => !open && setViewMatch(null)}
          onBook={() => handleBook(viewMatch)}
          isBooking={bookingId === viewMatch.id}
        />
      )}

      {confirmMatch && (
        <BookingConfirmModal
          match={confirmMatch}
          open={!!confirmMatch}
          onOpenChange={(open) => !open && setConfirmMatch(null)}
          onConfirm={() => handleBook(confirmMatch)}
          isBooking={bookingId === confirmMatch.id}
        />
      )}
    </>
  );
}
