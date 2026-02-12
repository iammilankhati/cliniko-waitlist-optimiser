"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { usePractitioners } from "@/hooks/use-api";
import { Stethoscope } from "lucide-react";

export function PractitionersCard() {
  const { data: practitioners, isLoading } = usePractitioners();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Practitioners</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Loading...</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 sm:h-14 w-full" />
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
          <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
          Practitioners
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Available slots by practitioner</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          {practitioners?.map((practitioner) => (
            <div
              key={practitioner.id}
              className="flex items-center justify-between p-2 sm:p-3 rounded-lg border gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">{practitioner.name}</p>
                {practitioner.designation && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{practitioner.designation}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-primary">{practitioner.availableSlots}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">slots</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
