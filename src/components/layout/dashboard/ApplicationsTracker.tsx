"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR from "swr";

import { DataTable } from "@/components/data-table";
import { DataTableColumns } from "@/components/data-table-columns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch job applications");
  return res.json();
};

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  dateApplied: Date;
  createdAt: Date;
  updatedAt: Date;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  datePosted?: Date | null;
  applicationUrl?: string | null;
  notes?: string | null;
}

const ApplicationsTracker = () => {
  const { data, isLoading, error } = useSWR("/api/job-applications", fetcher);
  const mounted = useRef(true);

  if (error) {
    toast.error("Failed to load job applications");
  }

  const formatted: JobApplication[] = data?.map((app: any) => ({
    ...app,
    dateApplied: new Date(app.dateApplied),
    datePosted: new Date(app.datePosted),
    createdAt: new Date(app.createdAt),
    updatedAt: new Date(app.updatedAt),
  }));

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>

        <CardContent>
          {mounted.current ? (
            <DataTable
              data={formatted}
              columns={DataTableColumns}
              loading={isLoading}
            />
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsTracker;
