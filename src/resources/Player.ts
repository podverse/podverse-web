const _speedCustom = -1
const _speedOneHalfKey = 0.5
const _speedThreeQuartersKey = 0.75
const _speedNormalKey = 1.0
const _speedOneAndAQuarterKey = 1.25
const _speedOneAndAHalfKey = 1.5
const _speedOneAndThreeQuartersKey = 1.75
const _speedDoubleKey = 2

const speeds = {
  _speedCustom,
  _speedOneHalfKey,
  _speedThreeQuartersKey,
  _speedNormalKey,
  _speedOneAndAQuarterKey,
  _speedOneAndAHalfKey,
  _speedOneAndThreeQuartersKey,
  _speedDoubleKey
}

const generateSpeedOptions = () => {
  const options = Object.keys(speeds).map((key) => {
    if (speeds[key] === -1) {
      return { i18nKey: `Custom`, value: speeds[key], key }
    }

    return {
      i18nKey: speeds[key],
      value: speeds[key],
      key: key
    }
  })

  return options
}

export const Player = {
  playerTypes: {
    audio: '_audio',
    video: '_video'
  },
  speedOptions: generateSpeedOptions(),
  speeds: Object.values(speeds)
}
