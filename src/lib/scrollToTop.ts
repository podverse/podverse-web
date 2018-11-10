export const scrollToTopOfView = () => {
  const viewTop = document.querySelector('.view__contents')
  
  if (viewTop) {
    viewTop.scrollTop = 0
  }
}
