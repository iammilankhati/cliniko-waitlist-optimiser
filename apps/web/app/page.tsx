import { StatsCards } from "@/components/dashboard/stats-cards";
import { MatchesTable } from "@/components/dashboard/matches-table";
import { WaitlistSummary } from "@/components/dashboard/waitlist-summary";
import { PractitionersCard } from "@/components/dashboard/practitioners-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Sticky on mobile */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Waitlist Optimizer</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Smart matching for appointment scheduling
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs sm:text-sm text-muted-foreground">Demo</span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Stats Overview */}
          <StatsCards />

          {/* Main Grid - Stack on mobile, side-by-side on desktop */}
          <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
            {/* Matches - Full width on mobile/tablet, 2 cols on desktop */}
            <div className="xl:col-span-2">
              <MatchesTable />
            </div>

            {/* Side Panel */}
            <div className="space-y-4 sm:space-y-6">
              <WaitlistSummary />
              <PractitionersCard />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <p className="text-xs text-muted-foreground text-center">
            Smart Waitlist Auto-Matcher - A proposed enhancement for Cliniko
          </p>
        </div>
      </footer>
    </div>
  );
}
