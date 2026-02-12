"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useWaitlist } from "@/hooks/use-api";
import { Clock, User, Calendar } from "lucide-react";

const urgencyColors: Record<string, string> = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  normal: "bg-blue-500 text-white",
  low: "bg-gray-400 text-white",
};

function formatDaysWaiting(createdAt: string) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : days === 1 ? "1d ago" : `${days}d ago`;
}

export function WaitlistSummary() {
  const { data, isLoading } = useWaitlist("active");

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Active Waitlist</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Loading...</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 sm:h-20 w-full" />
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
          Active Waitlist
          <Badge variant="outline" className="text-xs">{data?.count ?? 0}</Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Patients waiting for appointments</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          {data?.entries.slice(0, 6).map((entry) => (
            <div
              key={entry.id}
              className="p-2 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm sm:text-base truncate">{entry.patient.name}</span>
                  </div>
                  <Badge className={`${urgencyColors[entry.urgency]} text-[10px] sm:text-xs shrink-0`}>
                    {entry.urgency}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm text-muted-foreground">
                  <span
                    className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs"
                    style={{ backgroundColor: entry.appointmentType.color + "20" }}
                  >
                    {entry.appointmentType.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDaysWaiting(entry.createdAt)}
                  </span>
                </div>

                {entry.preferredPractitioners.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                    <span>Prefers:</span>
                    {entry.preferredPractitioners.slice(0, 2).map((p) => (
                      <Badge key={p.id} variant="outline" className="text-[10px] sm:text-xs">
                        {p.name}
                      </Badge>
                    ))}
                    {entry.preferredPractitioners.length > 2 && (
                      <span className="text-[10px]">+{entry.preferredPractitioners.length - 2}</span>
                    )}
                  </div>
                )}

                {entry.availableDays.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {entry.availableDays.map((d) => d.slice(0, 3)).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
