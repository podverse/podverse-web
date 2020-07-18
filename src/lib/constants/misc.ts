export const getPlaybackRateText = num => {
  switch (num) {
    case 0.5:
      return `0.5x`
    case 0.75:
      return `0.75x`
    case 1:
      return `1x`
    case 1.25:
      return `1.25x`
    case 1.5:
      return `1.5x`
    case 2:
      return `2x`
    default:
      return `1x`
  }
}

export const getPlaybackRateNextValue = num => {
  switch (num) {
    case 0.5:
      return 0.75
    case 0.75:
      return 1
    case 1:
      return 1.25
    case 1.25:
      return 1.5
    case 1.5:
      return 2
    case 2:
      return 0.5
    default:
      return 1
  }
}