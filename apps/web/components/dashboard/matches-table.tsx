"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useTopMatches, useBookMatch } from "@/hooks/use-api";
import { CheckCircle, Clock, User, MapPin, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import type { TopMatch } from "@/lib/api";

type Urgency = "urgent" | "high" | "normal" | "low";

const urgencyColors: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
  low: "bg-gray-500",
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

function formatDateShort(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDaysWaiting(createdAt: string) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  return days === 1 ? "1 day" : `${days} days`;
}

// Mobile card component for each match
function MatchCard({
  match,
  onBook,
  isBooking
}: {
  match: TopMatch;
  onBook: () => void;
  isBooking: boolean;
}) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-3 bg-card hover:bg-accent/30 transition-colors">
      {/* Header: Score + Patient + Urgency */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
            <span className="text-xl sm:text-2xl font-bold text-primary">{match.score}</span>
            <span className="text-[10px] text-muted-foreground">score</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm sm:text-base truncate">{match.patient.name}</span>
              <Badge className={`${urgencyColors[match.urgency]} text-white text-xs`} variant="secondary">
                {match.urgency}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Waiting {formatDaysWaiting(match.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Appointment */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Appointment</span>
          <div>
            <span className="font-medium text-xs sm:text-sm">{match.appointmentType}</span>
            <span
              className="ml-1.5 text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: match.appointmentTypeColor + "20" }}
            >
              {match.appointmentTypeDuration}m
            </span>
          </div>
        </div>

        {/* Slot */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Practitioner</span>
          <div className="font-medium text-xs sm:text-sm truncate">{match.slot.practitioner}</div>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Location</span>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="truncate">{match.slot.business}</span>
          </div>
        </div>

        {/* Time */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Slot Time</span>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span>{formatDateShort(match.slot.startsAt)}</span>
          </div>
        </div>
      </div>

      {/* Match Reasons + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
        <div className="flex flex-wrap gap-1">
          {match.matchReasons.slice(0, 3).map((reason, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {reason}
            </Badge>
          ))}
        </div>
        <Button
          size="sm"
          onClick={onBook}
          disabled={isBooking}
          className="w-full sm:w-auto cursor-pointer"
        >
          {isBooking ? (
            "Booking..."
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Book Appointment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function MatchesTable() {
  const { data: matches, isLoading } = useTopMatches(10);
  const bookMatch = useBookMatch();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [selectedUrgencies, setSelectedUrgencies] = useState<Set<Urgency>>(new Set());

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

  const handleBook = async (waitlistEntryId: string, slotId: string, matchId: string) => {
    setBookingId(matchId);
    try {
      await bookMatch.mutateAsync({ waitlistEntryId, slotId });
    } finally {
      setBookingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Top Matches</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Loading matches...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 sm:h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          Top Matches
          <Badge variant="secondary" className="text-xs">
            {selectedUrgencies.size > 0 ? `${filteredMatches.length}/${matches?.length ?? 0}` : matches?.length ?? 0}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Best waitlist-to-slot matches based on preferences, urgency, and wait time
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Urgency Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Filter:</span>
          {urgencyOrder.map((urgency) => {
            const isSelected = selectedUrgencies.has(urgency);
            const count = matches?.filter((m) => m.urgency === urgency).length ?? 0;
            return (
              <button
                key={urgency}
                onClick={() => toggleUrgency(urgency)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? `${urgencyColors[urgency]} text-white border-transparent`
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {urgency}
                <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
          {selectedUrgencies.size > 0 && (
            <button
              onClick={() => setSelectedUrgencies(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile/Tablet: Card Layout */}
        <div className="lg:hidden space-y-3">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onBook={() => handleBook(match.waitlistEntryId, match.slotId, match.id)}
              isBooking={bookingId === match.id}
            />
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Score</TableHead>
                <TableHead className="w-[18%]">Patient</TableHead>
                <TableHead className="w-[16%]">Type</TableHead>
                <TableHead className="w-[22%]">Slot</TableHead>
                <TableHead>Reasons</TableHead>
                <TableHead className="text-right w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-primary">{match.score}</span>
                      <Badge className={`${urgencyColors[match.urgency]} text-white text-xs px-1.5`} variant="secondary">
                        {match.urgency}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs truncate flex items-center gap-1">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{match.patient.name}</span>
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatDaysWaiting(match.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs truncate">{match.appointmentType}</span>
                      <span
                        className="text-xs text-muted-foreground px-1 rounded w-fit"
                        style={{ backgroundColor: match.appointmentTypeColor + "20" }}
                      >
                        {match.appointmentTypeDuration}m
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs truncate">{match.slot.practitioner}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{match.slot.business}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(match.slot.startsAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-wrap gap-0.5">
                      {match.matchReasons.slice(0, 2).map((reason, i) => (
                        <Badge key={i} variant="outline" className="text-xs px-1.5 py-0">
                          {reason}
                        </Badge>
                      ))}
                      {match.matchReasons.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{match.matchReasons.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button
                      size="sm"
                      onClick={() => handleBook(match.waitlistEntryId, match.slotId, match.id)}
                      disabled={bookingId === match.id}
                      className="cursor-pointer h-7 px-2 text-xs"
                    >
                      {bookingId === match.id ? (
                        "..."
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Book
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
