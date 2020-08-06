import { attributes } from '~/lib/constants/attributes'
import { colors } from '~/lib/constants/colors'
import { cookies } from '~/lib/constants/cookies'
import { common } from '~/lib/constants/i18n/common'
import { errorResponseMessages } from '~/lib/constants/errorResponseMessages'
import { misc } from '~/lib/constants/misc'
import { nexti18next } from '~/lib/constants/nexti18next'
import { pages } from '~/lib/constants/i18n/pages'
import { paths } from '~/lib/constants/paths'
import { queryParams } from '~/lib/constants/queryParams'
import { storageKeys } from '~/lib/constants/storageKeys'

export default {
  attributes,
  colors,
  cookies,
  errorResponseMessages,
  i18n: {
    common,
    pages
  },
  misc,
  nexti18next,
  paths,
  queryParams,
  storageKeys
}
