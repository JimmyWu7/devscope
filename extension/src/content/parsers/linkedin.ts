export function parseLinkedIn() {
  const getText = (selector: string) =>
    document.querySelector(selector)?.textContent?.trim() ?? "";

  let company = getText(".job-details-jobs-unified-top-card__company-name a");
  let role = getText(".job-details-jobs-unified-top-card__job-title h1");
  let location = "";
  let datePosted = "";
  let salary = "";

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
  const parseSalary = (text: string) => {
    const normalized = text.replace(/[–—]/g, "-");

    // Match salary range
    const rangeMatch = normalized.match(
      /\$\s?[\d,.]+k?(?:\/\w+)?\s*-\s*\$\s?[\d,.]+k?(?:\/\w+)?/i,
    );

    if (rangeMatch) return rangeMatch[0];

    const singleMatch = normalized.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);

    if (singleMatch) return singleMatch[0];

    return "";
  };

  // TOP CARD FIRST
  const topCard = document.querySelector(".job-details-fit-level-preferences");

  if (topCard) {
    salary = parseSalary(topCard.textContent || "");
  }
  // FALLBACK TO JOB DESCRIPTION
  if (!salary) {
    const description =
      document.querySelector("#job-details")?.textContent || "";

    salary = parseSalary(description);
  }

  // Convert "# days ago" to actual date
  if (datePosted) {
    // Match for "days ago", "weeks ago", etc.
    const dayMatch = datePosted.match(/(\d+)\s*days?\s*ago/);
    const weekMatch = datePosted.match(/(\d+)\s*weeks?\s*ago/);
    const monthMatch = datePosted.match(/(\d+)\s*months?\s*ago/);

    const now = new Date();

    if (dayMatch) {
      now.setDate(now.getDate() - parseInt(dayMatch[1], 10));
    } else if (weekMatch) {
      now.setDate(now.getDate() - parseInt(weekMatch[1], 10) * 7);
    } else if (monthMatch) {
      now.setMonth(now.getMonth() - parseInt(monthMatch[1], 10));
    }
    datePosted = now.toISOString().split("T")[0];
  }

  const result = {
    company,
    role,
    location,
    salary,
    salaryMin: "",
    salaryMax: "",
    dateApplied: new Date().toISOString().split("T")[0],
    datePosted,
    applicationUrl: window.location.href,
    notes: "",
  };

  // console.log("DevScope Analyze Result:", result);

  return result;
}
