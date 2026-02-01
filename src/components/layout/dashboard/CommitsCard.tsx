"use client";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconTrendingUp2,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

type Calendar = {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
};

const WEEKDAY_LABELS = [
  { label: null, index: 0 },
  { label: "Mon", index: 1 },
  { label: null, index: 2 },
  { label: "Wed", index: 3 },
  { label: null, index: 4 },
  { label: "Fri", index: 5 },
  { label: null, index: 6 },
];

function getMonthLabel(date: string) {
  return new Date(date).toLocaleString("default", { month: "short" });
}

function getCurrentStreak(calendar: Calendar): number {
  // Flatten days → newest first
  const days = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function CommitsCard() {
  const [calendar, setCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    fetch("/api/github/contributions")
      .then((res) => res.json())
      .then(setCalendar)
      .catch(console.error);
  }, []);

  const monthLabels =
    calendar?.weeks.map((week, index) => {
      const firstDay = week.contributionDays[0];
      if (!firstDay) return null;

      const month = getMonthLabel(firstDay.date);

      const prevWeek = calendar.weeks[index - 1];
      const prevMonth = prevWeek
        ? getMonthLabel(prevWeek.contributionDays[0].date)
        : null;

      return month !== prevMonth ? month : null;
    }) ?? [];

  const currentStreak = calendar ? getCurrentStreak(calendar) : 0;

  return (
    <div className="gap-4 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            Commit History{" "}
            <span className="text-muted-foreground">
              {calendar
                ? `• ${calendar.totalContributions.toLocaleString()} contributions in the last year`
                : "• Loading…"}
            </span>
          </CardDescription>
          <CardAction>
            {calendar && currentStreak > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                🔥 {currentStreak}-day streak
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        {!calendar ? (
          <div className="p-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="px-6 pb-4">
            {/* Month labels */}
            <div className="mb-2 ml-8 grid grid-cols-53 gap-1 text-xs text-muted-foreground">
              {monthLabels.map((month, i) => (
                <div key={i}>{month}</div>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Weekday labels */}
              <div className="flex flex-col justify-between text-xs text-center text-muted-foreground">
                {WEEKDAY_LABELS.map((day, i) => (
                  <div key={i} className="h-4">
                    {day.label ?? ""}
                  </div>
                ))}
              </div>

              {/* Heatmap */}
              <div className="grid grid-cols-53 gap-1 w-full">
                {calendar.weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {week.contributionDays.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.contributionCount} contributions on ${day.date}`}
                        className="h-3 w-3 xl:h-3.5 xl:w-3.5 rounded-xs"
                        style={{ backgroundColor: day.color }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
