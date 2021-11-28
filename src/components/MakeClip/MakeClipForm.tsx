import { faPlay } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from "react-i18next"
import { ButtonRectangle, Dropdown, PVImage, TextInput } from "~/components"
import { ProgressBar } from '~/components/Player/controls/ProgressBar'
import { PlayerProgressButtons } from '~/components/Player/controls/PlayerProgressButtons'
import { convertHHMMSSToSeconds } from '~/lib/utility/time'
import { playerNextSpeed } from '~/services/player/player'
import { generateFlagPositions } from '~/services/player/playerFlags'
import { PV } from '~/resources'
import { PlayerOptionButton } from '../Player/options/PlayerOptionButton'

type Props = {
  handleCancel: any
}

export const MakeClipForm = ({ handleCancel }: Props) => {
  const { t } = useTranslation()
  const [makeClip] = useOmniAural('makeClip')
  const [player] = useOmniAural('player')
  const { clipFlagPositions, endTime, highlightedPositions, isPublic,
    startTime, title } = makeClip
  const { currentNowPlayingItem, duration, playSpeed } = player
  const privacySelected = isPublic
    ? PV.MakeClip.privacyKeys.public
    : PV.MakeClip.privacyKeys.onlyWithLink

  /* Function Helpers */
  
  const _privacyOnChange = (selectedOptions: any[]) => {
    const selectedOption = selectedOptions[0]
    const isPublic = selectedOption.key === PV.MakeClip.privacyKeys.public
    OmniAural.makeClipSetIsPublic(isPublic)
  }
  
  const _startTimeOnChange = (value: string) => {
    OmniAural.makeClipSetStartTime(value)
    _handleUpdateFlagPositions(value, '')
  }

  const _endTimeOnChange = (value: string) => {
    OmniAural.makeClipSetEndTime(value)
    _handleUpdateFlagPositions('', value)
  }

  const _handleSaveClip = () => {
    console.log('_handleSaveClip')
  }

  const _handleUpdateFlagPositions = (startTimeOverride: string, endTimeOverride: string) => {
    const startTimeSeconds = convertHHMMSSToSeconds(startTimeOverride || startTime)
    const endTimeSeconds = convertHHMMSSToSeconds(endTimeOverride || endTime)
    const flagTimes = [startTimeSeconds]
    if (endTimeSeconds > startTimeSeconds) {
      flagTimes.push(endTimeSeconds)
    }
    const flagPositions = generateFlagPositions(flagTimes, duration)
    OmniAural.makeClipSetClipFlagPositions(flagPositions)
    OmniAural.makeClipSetHighlightedPositions(flagPositions)
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
      <TextInput
        defaultValue={title}
        label={t('Clip title')}
        onChange={(value) => {
          OmniAural.makeClipSetTitle(value)
        }}
        onSubmit={_handleSaveClip}
        placeholder={t('Clip title')}
        type='text' />
      <h3>{t('Clip times')}</h3>
      <div className='make-clip-time-inputs'>
        <TextInput
          defaultValue={startTime}
          faIconEnd={faPlay}
          label={t('Start time')}
          onChange={_startTimeOnChange}
          onSubmit={_handleSaveClip}
          placeholder={'00:00'}
          type='text' />
        <TextInput
          defaultValue={endTime}
          faIconEnd={faPlay}
          label={t('End')}
          onChange={_endTimeOnChange}
          onSubmit={_handleSaveClip}
          placeholder={t('optional')}
          type='text' />
      </div>
      <ProgressBar
        clipFlagPositions={clipFlagPositions}
        highlightedPositions={highlightedPositions}
        labelsBelow />
      <PlayerProgressButtons hasMiniJump />
      <div className='make-clip-speed-button'>
        <PlayerOptionButton
          onClick={playerNextSpeed}
          size='small'
          type='speed'>
          {playSpeed}x
        </PlayerOptionButton>
      </div>
      <div className='make-clip-submit-buttons'>
        <ButtonRectangle
          label={t('Cancel')}
          onClick={handleCancel}
          type='secondary' />
        <ButtonRectangle
          label={t('Save')}
          onClick={_handleSaveClip}
          type='primary' />
      </div>
    </div>
  )
}
