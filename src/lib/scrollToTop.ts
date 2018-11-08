export const scrollToTopOfView = () => {
  const viewTop = document.querySelector('.view__top')
  if (viewTop) {
    viewTop.scrollTop = 0
  }
}
