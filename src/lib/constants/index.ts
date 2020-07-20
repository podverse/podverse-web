// NOTE! Save this TODO for last, after all constants are replaced and
// organized in the misc file.
// TODO: separate the constants defined in the misc object into their own files.
// follow the example of the colors file, and after each is setup in its own
// file and imported/exported here, then run a find and replace to update the
// import { constants } from '~/lib/constants/misc' and change it to
// import PV from '~/lib/constants'
// and instead of writing "constants.###" everywhere, you'll shorten those
// to "PV.###". This PV object for constants is a pattern we're currently
// using in the mobile app. See the NSFWModal file for an example in podverse-web.

import { attributes } from '~/lib/constants/attributes'
import { colors } from '~/lib/constants/colors'
import { cookies } from '~/lib/constants/cookies'
import { core } from '~/lib/constants/core'
import { errors } from '~/lib/constants/errors'
import { mediaList } from '~/lib/constants/mediaList'
import { getPlaybackRateText, getPlaybackRateNextValue } from '~/lib/constants/misc'
import { paths } from '~/lib/constants/paths'
import { player } from '~/lib/constants/player'
import { query } from '~/lib/constants/query'
import { components } from '~/lib/constants/components'

export default {
  attributes,
  colors,
  components,
  cookies,
  core,
  errors,
  getPlaybackRateNextValue,
  getPlaybackRateText,
  mediaList,
  paths,
  player,
  query
}
