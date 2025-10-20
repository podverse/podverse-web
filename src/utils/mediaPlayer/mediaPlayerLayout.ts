export function updateLayoutForMediaPlayer(nowPlayingItem: any) {
  const sidebar = document.getElementById("sidebar");
  const pageWrapper = document.getElementById("page-wrapper");
  const mediaPlayer = document.getElementById("media-player");
  const activeClass = "media-player-active";
  
  if (nowPlayingItem) {
    if (sidebar && !sidebar.classList.contains(activeClass)) {
      sidebar.classList.add(activeClass);
    }
    if (pageWrapper && !pageWrapper.classList.contains(activeClass)) {
      pageWrapper.classList.add(activeClass);
    }
    if (mediaPlayer && !mediaPlayer.classList.contains(activeClass)) {
      mediaPlayer.classList.add(activeClass);
    }
  } else {
    if (sidebar && sidebar.classList.contains(activeClass)) {
      sidebar.classList.remove(activeClass);
    }
    if (pageWrapper && pageWrapper.classList.contains(activeClass)) {
      pageWrapper.classList.remove(activeClass);
    }
    if (mediaPlayer && mediaPlayer.classList.contains(activeClass)) {
      mediaPlayer.classList.remove(activeClass);
    }
  }
}
