// There is a strange bug with the CSS vh unit on iOS.
// To fix it, we need to basically calculate and set vh for the browser.
// For more information checkout:
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

let fixApplied = false

export const fixMobileViewportHeight = () => {
  if (!fixApplied) {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    fixApplied = true
  }
}
