export function updateLayoutForMediaPlayer(nowPlayingItem: any) {
  const sidebar = document.getElementById("sidebar");
  const pageWrapper = document.getElementById("page-wrapper");
  const styleValue = "calc(100vh - var(--media-player-height))";

  if (nowPlayingItem) {
    if (sidebar) {
      sidebar.style.minHeight = styleValue;
      sidebar.style.height = styleValue;
    }
    if (pageWrapper) {
      pageWrapper.style.minHeight = styleValue;
      pageWrapper.style.height = styleValue;
    }
  } else {
    if (sidebar) {
      sidebar.style.minHeight = "";
      sidebar.style.height = "";
    }
    if (pageWrapper) {
      pageWrapper.style.minHeight = "";
      pageWrapper.style.height = "";
    }
  }
}
