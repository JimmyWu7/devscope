"use client";

import {
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconClock,
  IconStar,
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
import { AnimatedNumber } from "@/components/animated-number";
import { cn } from "@/lib/utils";

type SectionCardsProps = {
  stats: {
    totalApplications: number;
    applicationsThisMonth: number;
    interviews: number;
    offers: number;
    rejected: number;
    active: number;
    resumeCount: number;
    totalStars: number;
    interviewRate: number;
  };
};

export function SectionCards({ stats }: SectionCardsProps) {
  // Application trend color
  const applicationTrendColor =
    stats.applicationsThisMonth > 0
      ? "text-emerald-600"
      : "text-muted-foreground";

  // Interview rate color logic
  const interviewColor =
    stats.interviewRate >= 25
      ? "text-emerald-600"
      : stats.interviewRate >= 10
        ? "text-yellow-600"
        : "text-red-600";

  // Github Portfolio strength color
  const starColor =
    stats.totalStars >= 50
      ? "text-emerald-600"
      : stats.totalStars >= 10
        ? "text-yellow-600"
        : "text-muted-foreground";

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Applications Sent */}
      <Card>
        <CardHeader>
          <CardDescription>Applications Sent</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            <AnimatedNumber value={stats.totalApplications} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={applicationTrendColor}>
              {stats.applicationsThisMonth > 0 ? (
                <IconTrendingUp className="mr-1 size-4" />
              ) : (
                <IconTrendingDown className="mr-1 size-4" />
              )}
              +{stats.applicationsThisMonth} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Total job applications submitted
        </CardFooter>
      </Card>

      {/* Interview Rate */}
      <Card>
        <CardHeader>
          <CardDescription>Interview Rate</CardDescription>
          <CardTitle
            className={cn(
              "text-3xl font-semibold tabular-nums transition-colors",
              interviewColor,
            )}
          >
            <AnimatedNumber value={stats.interviewRate} suffix="%" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTarget className="mr-1 size-4" />
              {stats.interviews} interviews
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          {stats.interviewRate >= 25
            ? "Strong conversion rate 🚀"
            : stats.interviewRate >= 10
              ? "Decent performance — room to improve"
              : "Consider improving resume or targeting"}
        </CardFooter>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader>
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            <AnimatedNumber value={stats.active} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="mr-1 size-4" />
              Awaiting response
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Applied + Interview stages
        </CardFooter>
      </Card>

      {/* GitHub Stars */}
      <Card>
        <CardHeader>
          <CardDescription>GitHub Stars</CardDescription>
          <CardTitle
            className={cn(
              "text-3xl font-semibold tabular-nums transition-colors",
              starColor,
            )}
          >
            <AnimatedNumber value={stats.totalStars} />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconStar className="mr-1 size-4" />
              Portfolio strength
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Across synced repositories
        </CardFooter>
      </Card>
    </div>
  );
}
