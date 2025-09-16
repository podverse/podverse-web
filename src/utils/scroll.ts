export function scrollMainToTop() {
  const el = document.getElementById("mainOuterWrapper");
  if (el) {
    el.scrollTo({ top: 0 });
  }
}
