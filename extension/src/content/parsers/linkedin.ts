import { parseSalaryRange } from "../../shared/salary";

export function parseLinkedIn() {
  const getText = (selector: string) =>
    document.querySelector(selector)?.textContent?.trim() ?? "";

  let company = getText(".job-details-jobs-unified-top-card__company-name a");
  let role = getText(".job-details-jobs-unified-top-card__job-title h1");
  let location = "";
  let datePosted = "";
  let salaryRaw = "";
  let salaryType: "HOURLY" | "MONTHLY" | "YEARLY" | null = null;
  let workMode: "REMOTE" | "HYBRID" | "ONSITE" | null = null;

  // LOCATION + DATE POSTED
  const tertiaryContainer = document.querySelector(
    ".job-details-jobs-unified-top-card__tertiary-description-container",
  );

  if (tertiaryContainer) {
    const spans = Array.from(tertiaryContainer.querySelectorAll("span"));

    for (const span of spans) {
      const text = span.textContent?.trim() ?? "";
      // LOCATION
      if (
        !location &&
        text &&
        !text.includes("·") &&
        !text.includes("ago") &&
        !text.includes("applicants")
      ) {
        location = text;
      }
      // DATE POSTED
      if (text.toLowerCase().includes("ago")) {
        datePosted = text;
      }
    }
  }

  // SALARY EXTRACTION
  // const parseSalary = (text: string) => {
  //   const normalized = text.replace(/[–—]/g, "-");

  //   // Match salary range
  //   const rangeMatch = normalized.match(
  //     /\$\s?[\d,.]+k?(?:\/\w+)?\s*-\s*\$\s?[\d,.]+k?(?:\/\w+)?/i,
  //   );

  //   if (rangeMatch) return rangeMatch[0];

  //   const singleMatch = normalized.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);

  //   if (singleMatch) return singleMatch[0];

  //   return "";
  // };

  // TOP CARD FIRST
  const topCard = document.querySelector(".job-details-fit-level-preferences");

  // if (topCard) {
  //   salaryRaw = parseSalary(topCard.textContent || "");
  // }

  if (topCard) {
    const buttons = Array.from(topCard.querySelectorAll("button"));

    for (const btn of buttons) {
      const text = btn.textContent?.trim() ?? "";

      // Extract salary if present
      const salaryMatch = text.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);
      if (salaryMatch && !salaryRaw) {
        salaryRaw = text;

        // Detect salary type
        const textLower = text.toLowerCase();
        if (
          textLower.includes("/hr") ||
          textLower.includes("per hour") ||
          textLower.includes("/hour")
        ) {
          salaryType = "HOURLY";
        } else if (
          textLower.includes("/month") ||
          textLower.includes("per month")
        ) {
          salaryType = "MONTHLY";
        } else {
          salaryType = "YEARLY";
        }
      }

      // Extract work mode
      const textLower = text.toLowerCase();
      if (textLower.includes("remote")) {
        workMode = "REMOTE";
      } else if (textLower.includes("hybrid")) {
        workMode = "HYBRID";
      } else if (
        textLower.includes("onsite") ||
        textLower.includes("on-site")
      ) {
        workMode = "ONSITE";
      }
    }
  }

  // FALLBACK TO JOB DESCRIPTION
  if (!salaryRaw) {
    const description =
      document.querySelector("#job-details")?.textContent || "";
    const rangeMatch = description.match(
      /\$\s?[\d,.]+k?(?:\/\w+)?\s*-\s*\$\s?[\d,.]+k?(?:\/\w+)?/i,
    );
    const singleMatch = description.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);
    if (rangeMatch) {
      salaryRaw = rangeMatch[0];
    } else {
      const singleMatch = description.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);
      if (singleMatch) salaryRaw = singleMatch[0];
    }
    // Detect salary type from description
    const descLower = (rangeMatch?.[0] || singleMatch?.[0] || "").toLowerCase();
    if (
      descLower.includes("/hr") ||
      descLower.includes("per hour") ||
      descLower.includes("/hour")
    )
      salaryType = "HOURLY";
    else if (descLower.includes("/month") || descLower.includes("per month"))
      salaryType = "MONTHLY";
    else if (salaryRaw) salaryType = "YEARLY";
  }

  const { salaryMin, salaryMax } = parseSalaryRange(salaryRaw);

  // Convert "# days ago" to actual date
  if (datePosted) {
    // Match for "days ago", "weeks ago", etc.
    const dayMatch = datePosted.match(/(\d+)\s*days?\s*ago/);
    const weekMatch = datePosted.match(/(\d+)\s*weeks?\s*ago/);
    const monthMatch = datePosted.match(/(\d+)\s*months?\s*ago/);
    const yearMatch = datePosted.match(/(\d+)\s*years?\s*ago/);

    const now = new Date();

    if (dayMatch) {
      now.setDate(now.getDate() - parseInt(dayMatch[1], 10));
    } else if (weekMatch) {
      now.setDate(now.getDate() - parseInt(weekMatch[1], 10) * 7);
    } else if (monthMatch) {
      now.setMonth(now.getMonth() - parseInt(monthMatch[1], 10));
    } else if (yearMatch) {
      now.setFullYear(now.getFullYear() - parseInt(yearMatch[1], 10));
    }
    datePosted = now.toISOString().split("T")[0];
  }

  const result = {
    company,
    role,
    location,
    salaryMin,
    salaryMax,
    salaryType,
    workMode,
    dateApplied: new Date().toISOString().split("T")[0],
    datePosted,
    applicationUrl: window.location.href,
    platform: "LINKEDIN",
    notes: "",
  };

  console.log("DevScope Analyze Result:", result);

  return result;
}
