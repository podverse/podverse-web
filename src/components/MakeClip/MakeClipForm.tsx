import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from "react-i18next"
import { Dropdown, PVImage } from "~/components"
import { PV } from '~/resources'

type Props = {}

export const MakeClipForm = (props: Props) => {
  const { t } = useTranslation()
  const [makeClip] = useOmniAural('makeClip')
  const [player] = useOmniAural('player')
  const { endTime, isPublic, startTime, title } = makeClip
  const { currentNowPlayingItem } = player
  const privacySelected = isPublic
    ? PV.MakeClip.privacyKeys.public
    : PV.MakeClip.privacyKeys.onlyWithLink

  /* Function Helpers */

  const _privacyOnChange = (selectedOptions: any[]) => {
    const selectedOption = selectedOptions[0]
    const isPublic = selectedOption.key === PV.MakeClip.privacyKeys.public
    OmniAural.makeClipSetIsPublic(isPublic)
  }

  /* Render Helpers */

  const generatePrivacyDropdownItems = () => {
    const items = [
      { label: 'Public', key: PV.Users.privacyKeys.public },
      { label: 'Only with link', key: PV.Users.privacyKeys.onlyWithLink }
    ]

    return items
  }

  const privacyDropdownItems = generatePrivacyDropdownItems()

  return (
    <div className='make-clip-form'>
      <div className='make-clip-header-wrapper'>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.medium}
          src={currentNowPlayingItem.episodeImageUrl || currentNowPlayingItem.podcastImageUrl}
          width={PV.Images.sizes.medium} />
        <h1>{t('Make Clip')}</h1>
        <Dropdown
          dropdownWidthClass='width-small'
          onChange={_privacyOnChange}
          options={privacyDropdownItems}
          outlineStyle
          selectedKey={privacySelected} />
      </div>
    </div>
  )
}
