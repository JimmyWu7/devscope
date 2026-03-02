import { useState } from "react";
import type { JobApplication } from "../../shared/types";
import { toast } from "sonner";

interface Props {
  jobData: JobApplication;
  setJobData: (data: JobApplication | null) => void;
  token: string;
}

function markActivity() {
  chrome.runtime.sendMessage({ type: "EXTENSION_ACTIVITY" });
}

export default function JobForm({ jobData, setJobData, token }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);

      const normalized = {
        ...jobData,
        status: "APPLIED", // default for extension
        salaryMin: jobData.salaryMin ? Number(jobData.salaryMin) : null,
        salaryMax: jobData.salaryMax ? Number(jobData.salaryMax) : null,
        salaryCurrency: jobData.salaryMin || jobData.salaryMax ? "USD" : null,
        location: jobData.location || null,
        platform: jobData.platform || null,
        workMode: jobData.workMode || null,
        salaryType: jobData.salaryType || null,
        applicationUrl: jobData.applicationUrl || null,
        notes: jobData.notes || null,
      };
      // console.log("(extension) JobForm Normalized", normalized);
      markActivity();

      const res = await fetch("http://localhost:3000/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalized),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save job");
      }

      toast.success("✅ Job added to DevScope!");
      setJobData({
        ...jobData,
        company: "",
        role: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        dateApplied: "",
        datePosted: "",
        applicationUrl: "",
        notes: "",
      });
      setJobData(null);
      markActivity();
    } catch (err) {
      toast.error("❌ Failed to add job");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      {/* Company */}
      <label className="block text-xs font-medium mb-1">Company Name*</label>
      <input
        className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
        placeholder="Company Name *"
        value={jobData.company}
        onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
      />
      {/* Role */}
      <label className="block text-xs font-medium mb-1">Role*</label>
      <input
        className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
        placeholder="Role *"
        value={jobData.role}
        onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
      />
      {/* Min Salary and Max Salary */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Salary Min</label>
          <input
            type="number"
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Salary Min"
            value={jobData.salaryMin}
            onChange={(e) =>
              setJobData({ ...jobData, salaryMin: e.target.value })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Salary Max</label>
          <input
            type="number"
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Salary Max"
            value={jobData.salaryMax}
            onChange={(e) =>
              setJobData({ ...jobData, salaryMax: e.target.value })
            }
          />
        </div>
        {/* Salary Type */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Salary Type</label>
          <select
            className="w-full p-2 rounded border"
            value={jobData.salaryType || ""}
            onChange={(e) =>
              setJobData({ ...jobData, salaryType: e.target.value })
            }
          >
            <option value="">Select Salary Type</option>
            <option value="YEARLY">Yearly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="HOURLY">Hourly</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        {/* Work Mode */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Work Mode</label>
          <select
            className="w-full p-2 rounded border"
            value={jobData.workMode || ""}
            onChange={(e) =>
              setJobData({ ...jobData, workMode: e.target.value })
            }
          >
            <option value="">Select Work Mode</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </div>
        {/* Location */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Location</label>
          <input
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Location"
            value={jobData.location}
            onChange={(e) =>
              setJobData({ ...jobData, location: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex gap-2">
        {/* Date Applied */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Date Applied</label>
          <input
            type="date"
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            value={jobData.dateApplied}
            onChange={(e) =>
              setJobData({ ...jobData, dateApplied: e.target.value })
            }
          />
        </div>
        {/* Date Posted */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Date Posted</label>
          <input
            type="date"
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Date Posted"
            value={jobData.datePosted}
            onChange={(e) =>
              setJobData({ ...jobData, datePosted: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex gap-2">
        {/* Platform */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Platform</label>
          <select
            className="w-full p-2 rounded border"
            value={jobData.platform || ""}
            onChange={(e) =>
              setJobData({ ...jobData, platform: e.target.value })
            }
          >
            <option value="">Select Platform</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="INDEED">Indeed</option>
            <option value="GLASSDOOR">Glassdoor</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        {/* Application URL */}
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">
            Application URL
          </label>
          <input
            type="url"
            className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Application URL"
            value={jobData.applicationUrl}
            onChange={(e) =>
              setJobData({ ...jobData, applicationUrl: e.target.value })
            }
          />
        </div>
      </div>
      {/* Notes */}
      <div>
        <label className="block text-xs font-medium mb-1">Notes</label>
        <textarea
          className="w-full p-2 rounded border bg-white text-gray-900 placeholder-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
          placeholder="Notes"
          value={jobData.notes}
          onChange={(e) => setJobData({ ...jobData, notes: e.target.value })}
        />
      </div>
      {/* Confirmation Button */}
      <div className="flex gap-2">
        <button
          className="flex-1 py-2 rounded bg-green-600 text-white cursor-pointer disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Yes, Track"}
        </button>

        <button
          className="flex-1 py-2 rounded border cursor-pointer"
          onClick={() => setJobData(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
