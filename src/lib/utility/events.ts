export const eventNavBarLinkClicked = () => {
  const event = new CustomEvent("navbar-link-clicked")
  window.dispatchEvent(event)
}
