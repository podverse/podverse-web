export const scrollToTopOfView = (document) => {
  if (document) {
    const viewTop = document.querySelector('.view__contents')
    
    if (viewTop) {
      viewTop.scrollTop = 0
    }
  }
}
