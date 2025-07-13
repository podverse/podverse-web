export function toggleMobileSidebar() {
  const sidebar = document.querySelector('[data-mobile-nav="menu"]');
  const toggle = document.querySelector('[data-mobile-nav="toggle"]');
  const toggleMore = document.querySelector('[data-mobile-nav="toggle-more"]');
  const toggleX = document.querySelector('[data-mobile-nav="toggle-x"]');

  const isOpen = sidebar?.classList.contains('open');

  if (isOpen) {
    sidebar?.classList.remove('open');
    toggle?.classList.remove('close-button');
    toggleMore?.classList.remove('hidden');
    toggleX?.classList.add('hidden');
  } else {
    sidebar?.classList.add('open');
    toggle?.classList.add('close-button');
    toggleMore?.classList.add('hidden');
    toggleX?.classList.remove('hidden');
  }
}
