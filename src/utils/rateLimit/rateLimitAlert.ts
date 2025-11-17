export function handleRateLimitAlert(
  error: unknown,
  locale?: string,
  tMisc?: (key: string, values?: Record<string, any>) => string
): boolean {
  const status =
    (error as any)?.response?.status ??
    (error as any)?.status ??
    (error as any)?.code;

  const data =
    (error as any)?.response?.data ??
    (error as any)?.data ??
    (error as any)?.body;

  if (status === 429 && data?.tooManyRequests) {
    let raw =
      data.timeUntilResetMs ??
      data.timeRemainingMs ??
      data.resetAt ??
      data.timeRemaining;

    if (raw == null) {
      alert(
        tMisc
          ? tMisc("rate_limit.generic")
          : "Rate limiting: please try again later."
      );
      return true;
    }

    let epochMs: number;
    if (typeof raw === "number") {
      if (raw < Date.now() / 4) {
        epochMs = Date.now() + raw;
      } else {
        epochMs = raw;
      }
    } else {
      const parsed = Date.parse(raw);
      epochMs = isNaN(parsed) ? Date.now() : parsed;
    }

    const localTime = new Date(epochMs).toLocaleString(locale || undefined);
    alert(
      tMisc
        ? tMisc("rate_limit.until", { time: localTime })
        : `Rate limiting: this action cannot be used until ${localTime}`
    );
    return true;
  }

  return false;
}
