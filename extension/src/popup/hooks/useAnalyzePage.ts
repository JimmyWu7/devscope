import { useState } from "react";
import { parseSalaryRange } from "../../shared/salary";
import type { JobApplication } from "../../shared/types";

export function useAnalyzePage() {
  const [jobData, setJobData] = useState<JobApplication | null>(null);

  async function analyzeCurrentPage() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return;

    const extracted = await chrome.tabs.sendMessage(tab.id, {
      type: "ANALYZE_PAGE",
    });

    if (!extracted) return;

    const salaryParsed = parseSalaryRange(extracted.salary);

    setJobData({ ...extracted, ...salaryParsed });
  }

  return { jobData, setJobData, analyzeCurrentPage };
}
