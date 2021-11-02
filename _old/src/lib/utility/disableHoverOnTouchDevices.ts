// thanks to blade on Stack Overflow for this script
// https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices

let hoverDisabled = false

export const disableHoverOnTouchDevices = () => {
  function hasTouch() {
    return 'ontouchstart' in document.documentElement
      || navigator.maxTouchPoints > 0
      || navigator.msMaxTouchPoints > 0
  }
  
  if (!hoverDisabled && document && navigator && hasTouch()) { // remove all :hover stylesheets
    // prevent exception on browsers not supporting DOM styleSheets properly
    try {
      for (const si in document.styleSheets) {
        const styleSheet = document.styleSheets[si] as any
        if (!styleSheet.rules) continue
  
        for (let ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
          if (!styleSheet.rules[ri].selectorText) continue
  
          if (styleSheet.rules[ri].selectorText.match(':hover')) {
            styleSheet.deleteRule(ri)
          }
        }
      }

      hoverDisabled = true
    } catch (ex) { }
  }
}
