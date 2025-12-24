export function waitForSourceUri(media: HTMLMediaElement | null, maxWaitMs = 1000, intervalMs = 50): Promise<string | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const uri = media?.src || null;
      if (uri) {
        resolve(uri);
      } else if (Date.now() - start >= maxWaitMs) {
        resolve(null);
      } else {
        setTimeout(check, intervalMs);
      }
    };
    check();
  });
}

export function playMediaWhenReady(media: HTMLMediaElement | null, onPlayed?: () => void) {
  if (!media) return;
  if (media.readyState >= 2) { // HAVE_CURRENT_DATA
    media.play().catch(() => {});
    if (onPlayed) onPlayed();
  } else {
    const onCanPlay = () => {
      media.play().catch(() => {});
      if (onPlayed) onPlayed();
      media.removeEventListener('canplay', onCanPlay);
    };
    media.addEventListener('canplay', onCanPlay);
  }
}
