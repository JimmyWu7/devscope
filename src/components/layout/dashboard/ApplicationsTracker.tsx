"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { DataTable } from "@/components/data-table";
import { DataTableColumns } from "@/components/data-table-columns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { data } from "@/constants/table-data";

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
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/job-applications");
        if (!res.ok) throw new Error("Failed to fetch job applications");

        const applications: any[] = await res.json(); // API returns JSON
        // console.log("applications", applications);

        // Convert date strings to Date objects
        const formatted: JobApplication[] = applications.map((app) => ({
          ...app,
          dateApplied: new Date(app.dateApplied),
          datePosted: new Date(app.datePosted),
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt),
        }));
        // console.log("Formatted", formatted);


        setData(formatted);
      } catch (err) {
        // console.log("Application Tracker");
        // console.error(err);
        toast.error("Failed to load job applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable data={data} columns={DataTableColumns} />
          {loading && (
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsTracker;
