export async function handleRateLimitAlert(
  error: unknown,
  locale?: string,
  tMisc?: (key: string, values?: Record<string, any>) => string
): Promise<boolean> {
  const status =
    (error as any)?.response?.status ??
    (error as any)?.status ??
    (error as any)?.code;

  let data =
    (error as any)?.response?.data ??
    (error as any)?.data ??
    (error as any)?.body;

  // If data is a Blob (can happen with responseType: 'blob'), convert to JSON
  if (status === 429 && data instanceof Blob) {
    try {
      const blobText = await data.text();
      data = JSON.parse(blobText);
      // Update the error object with parsed data for consistency
      if ((error as any)?.response) {
        (error as any).response.data = data;
      } else if ((error as any)?.data) {
        (error as any).data = data;
      }
    } catch (parseError) {
      // If parsing fails, can't handle rate limit
      console.error('[handleRateLimitAlert] Failed to parse blob error response:', parseError);
      return false;
    }
  }

  if (status === 429 && data?.tooManyRequests) {
    const minutesRemaining = data.minutesRemaining;
    if (typeof minutesRemaining !== "number" || isNaN(minutesRemaining) || minutesRemaining < 1) {
      alert(
        tMisc
          ? tMisc("rate_limit.generic")
          : "Rate limited: please try again later."
      );
      return true;
    }

    let message: string;
    if (tMisc) {
      const key =
        minutesRemaining === 1
          ? "rate_limit.minute_remaining"
          : "rate_limit.minutes_remaining";
      const templated = tMisc(key, { minutes: minutesRemaining });
      if (!templated || templated.includes(key)) {
        // Fallback to generic if translation missing
        message = tMisc("rate_limit.generic");
      } else {
        message = templated;
      }
    } else {
      message =
        minutesRemaining === 1
          ? "Rate limited: 1 minute until you can use this action again."
          : `Rate limited: ${minutesRemaining} minutes until you can use this action again.`;
    }
    alert(message);
    return true;
  }

  return false;
}
