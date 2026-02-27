export function parseSalaryRange(raw: string) {
  if (!raw) return { salaryMin: "", salaryMax: "" };

  const normalized = raw.replace(/[–—]/g, "-").toLowerCase();

  const convertToNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9k.]/g, "");

    if (cleaned.includes("k")) {
      return (parseFloat(cleaned.replace("k", "")) * 1000).toString();
    }

    return cleaned;
  };

  if (normalized.includes("-")) {
    const [minRaw, maxRaw] = normalized.split("-");
    return {
      salaryMin: convertToNumber(minRaw),
      salaryMax: convertToNumber(maxRaw),
    };
  }

  return {
    salaryMin: convertToNumber(normalized),
    salaryMax: "",
  };
}
