export function parseHandshake() {
  const getText = (selector: string) =>
    document.querySelector(selector)?.textContent?.trim() ?? "";

  return {
    role: getText("h1"),
    company: getText("a[href*='/employers/']"),
    location: getText("[data-hook='location']"),
    salary: "",
    salaryMin: "",
    salaryMax: "",
    dateApplied: new Date().toISOString().split("T")[0],
    datePosted: "",
    applicationUrl: window.location.href,
    notes: "",
  };
}
