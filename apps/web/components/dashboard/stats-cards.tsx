"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useDashboardOverview } from "@/hooks/use-api";
import { Users, Clock, Calendar, Zap } from "lucide-react";

export function StatsCards() {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32 sm:w-40 rounded-full" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Waitlist",
      value: data?.activeWaitlist ?? 0,
      subValue: data?.urgentWaitlist ?? 0,
      subLabel: "urgent",
      icon: Users,
      highlight: (data?.urgentWaitlist ?? 0) > 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
    },
    {
      title: "Slots",
      value: data?.availableSlots ?? 0,
      subValue: null,
      subLabel: "14 days",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      title: "Matches",
      value: data?.potentialMatches ?? 0,
      subValue: null,
      subLabel: "found",
      icon: Zap,
      highlight: true,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "Booked",
      value: data?.recentBookingsFromWaitlist ?? 0,
      subValue: null,
      subLabel: "this week",
      icon: Clock,
      color: "text-violet-600",
      bgColor: "bg-violet-50 border-violet-200",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border ${stat.bgColor} transition-all hover:shadow-sm`}
        >
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
          <div className="flex items-baseline gap-1.5">
            <span className={`text-base sm:text-lg font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.title}</span>
          </div>
          {stat.subValue !== null && stat.subValue > 0 && (
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
              {stat.subValue} {stat.subLabel}
            </span>
          )}
          {stat.subValue === null && (
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
              {stat.subLabel}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
