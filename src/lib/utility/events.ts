export const eventNavBarLinkClicked = (type: 'search' | 'podcasts' | 'episodes' | 'clips') => {
  const event = new CustomEvent(`navbar-link-clicked-${type}`)
  window.dispatchEvent(event)
}
