import { parseSalaryRange } from "../../shared/salary";

export function parseHandshake() {
  const container = document.querySelector('div[data-hook="right-content"]');
  if (!container) return null;

  // Company Name: first <a> that has a <div> inside
  const companyEl = Array.from(container.querySelectorAll("a > div")).find(
    (div) => div.textContent?.trim(),
  );
  const company = companyEl?.textContent?.trim() || "";

  // Job Title: first <h1>
  const roleEl = container.querySelector("h1");
  const role = roleEl?.textContent?.trim() || "";

  // Date Posted: first div that contains "Posted"
  const dateEl = Array.from(container.querySelectorAll("div")).find((div) =>
    div.textContent?.includes("Posted"),
  );
  let datePosted = "";
  if (dateEl) {
    const match = dateEl.textContent?.match(
      /Posted (\d+)\s*(hours?|days?|weeks?|months?) ago/i,
    );
    if (match) {
      const now = new Date();
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      if (unit.startsWith("hour")) {
        now.setHours(now.getHours() - value);
      } else if (unit.startsWith("day")) {
        now.setDate(now.getDate() - value);
      } else if (unit.startsWith("week")) {
        now.setDate(now.getDate() - value * 7);
      } else if (unit.startsWith("month")) {
        now.setMonth(now.getMonth() - value);
      }

      datePosted = now.toISOString().split("T")[0];
    }
  }

  let salaryRaw = "";
  let location = "";

  const atAGlanceHeader = Array.from(container.querySelectorAll("h3")).find(
    (h3) => h3.textContent?.trim().toLowerCase() === "at a glance",
  );

  if (atAGlanceHeader) {
    const outerWrapper = atAGlanceHeader.parentElement?.parentElement;
    console.log("Outer Wrapper", outerWrapper);

    if (outerWrapper) {
      const rows = Array.from(
        outerWrapper.querySelectorAll(":scope > div:not(:first-child)"),
      );

      rows.forEach((row) => {
        const wrapper = row.querySelector("svg + div");
        if (!wrapper) return;

        const primary = wrapper.firstElementChild as HTMLElement | null;
        if (!primary) return;

        const text = primary.textContent?.trim() || "";

        /* ---- Salary Detection ---- */
        if (!salaryRaw) {
          const salaryMatch =
            text.match(
              /\$\s?[\d,.]+k?(?:\/\w+)?\s*[–—-]\s*\$?[\d,.]+k?(?:\/\w+)?/i,
            ) || text.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);

          if (salaryMatch) {
            salaryRaw = salaryMatch[0];
            return;
          }
        }

        /* ---- Location Detection ---- */
        if (!location) {
          const lower = text.toLowerCase();

          if (
            lower.includes("remote") ||
            lower.includes("hybrid") ||
            lower.includes("onsite") ||
            lower.includes("based in") ||
            /,\s?[A-Z]{2}/.test(text)
          ) {
            location = text.replace(/\+\d+.*/, "").trim();
          }
        }
      });
    }
  }

  // Fallback to job description if not found in "At a Glance"
  if (!salaryRaw) {
    const jobDescHeader = Array.from(container.querySelectorAll("h3")).find(
      (h3) => h3.textContent?.trim().toLowerCase() === "job description",
    );
    const jobDescContainer = jobDescHeader?.parentElement?.nextElementSibling;
    if (jobDescContainer) {
      const match =
        jobDescContainer.textContent?.match(
          /\$\s?[\d,.]+k?(?:\/\w+)?\s*-\s*\$\s?[\d,.]+k?(?:\/\w+)?/i,
        ) || jobDescContainer.textContent?.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);
      if (match) salaryRaw = match[0];
    }
  }

  const { salaryMin, salaryMax } = parseSalaryRange(salaryRaw);

  return {
    company,
    role,
    location,
    salaryMin,
    salaryMax,
    dateApplied: new Date().toISOString().split("T")[0],
    datePosted,
    applicationUrl: window.location.href,
    notes: "",
  };
}
