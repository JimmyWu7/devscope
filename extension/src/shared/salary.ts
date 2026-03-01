export function parseSalaryRange(raw: string) {
  if (!raw) return { salaryMin: "", salaryMax: "" };

  const normalized = raw.replace(/[–—]/g, "-").toLowerCase();

  function convertToNumber(value: string, forceThousands = false): string {
    const cleaned = value.replace(/[^0-9k.]/g, "");

    if (!cleaned) return "";

    let number = parseFloat(cleaned.replace("k", ""));

    if (cleaned.includes("k") || forceThousands) {
      number *= 1000;
    }

    return Math.round(number).toString();
  }

  if (normalized.includes("-")) {
    const [minRaw, maxRaw] = normalized.split("-");
    const hasK = normalized.includes("k");
    const salaryMin = convertToNumber(minRaw, hasK);
    const salaryMax = convertToNumber(maxRaw, hasK);
    return { salaryMin, salaryMax };
  }

  return {
    salaryMin: convertToNumber(normalized),
    salaryMax: "",
  };
}
