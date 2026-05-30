/**
 * Get date components in Asia/Shanghai timezone.
 * This ensures the TCM app always uses the correct date for the target audience.
 */

const SHANGHAI_TZ = "Asia/Shanghai";

/** Return { year, month (1-12), day } in Shanghai timezone */
export function getShanghaiDate(): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || "0", 10);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Get Shanghai year-month-day as a number MMDD for comparison (e.g., 530 for May 30) */
export function getShanghaiMMDD(): number {
  const { month, day } = getShanghaiDate();
  return month * 100 + day;
}

/** Get Shanghai year for term computation */
export function getShanghaiYear(): number {
  return getShanghaiDate().year;
}

/** Format the current Shanghai date for display */
export function formatShanghaiDate(locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: SHANGHAI_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}
