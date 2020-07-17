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

import { colors } from '~/lib/constants/colors'

export default {
  colors
}
