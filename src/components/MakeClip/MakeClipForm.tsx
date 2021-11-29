import { faPlay } from '@fortawesome/free-solid-svg-icons'
import OmniAural, { useOmniAural } from 'omniaural'
import { useRouter } from 'next/router'
import { useTranslation } from "react-i18next"
import { ButtonRectangle, Dropdown, PVImage, TextInput } from "~/components"
import { ProgressBar } from '~/components/Player/controls/ProgressBar'
import { PlayerProgressButtons } from '~/components/Player/controls/PlayerProgressButtons'
import { convertHHMMSSToSeconds } from '~/lib/utility/time'
import { playerNextSpeed, playerPlay, playerSeekTo } from '~/services/player/player'
import { generateFlagPositions } from '~/services/player/playerFlags'
import { PV } from '~/resources'
import { PlayerOptionButton } from '../Player/options/PlayerOptionButton'
import { createMediaRef, updateMediaRef } from '~/services/mediaRef'
import { handleSetupClipListener } from '~/services/player/playerClip'
import { useState } from 'react'

type Props = {
  handleCancel: any
}

export const MakeClipForm = ({ handleCancel }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [makeClip] = useOmniAural('makeClip')
  const [player] = useOmniAural('player')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const { clipFlagPositions, endTime, highlightedPositions, isEditing, isPublic,
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
    _handleUpdateFlagPositions(value ? value : null, '')
  }

  const _endTimeOnChange = (value: string) => {
    OmniAural.makeClipSetEndTime(value)
    _handleUpdateFlagPositions('', value ? value : null)
  }

  const _handleUpdateFlagPositions = (startTimeOverride: string | null, endTimeOverride: string | null) => {
    const flagStartTime =
      startTimeOverride === null
        ? -1
        : startTimeOverride
          ? startTimeOverride
          : startTime
    const flagEndTime =
      endTimeOverride === null
        ? -1
        : endTimeOverride
          ? endTimeOverride
          : endTime

    const flagStartTimeSeconds = convertHHMMSSToSeconds(flagStartTime)
    const flagEndTimeSeconds = convertHHMMSSToSeconds(flagEndTime)

    const flagTimes = []
    if (flagStartTimeSeconds >= 0) {
      flagTimes.push(flagStartTimeSeconds)
    }
    if (flagEndTimeSeconds && flagEndTimeSeconds > flagStartTimeSeconds) {
      flagTimes.push(flagEndTimeSeconds)
    }

    const flagPositions = generateFlagPositions(flagTimes, duration)
    OmniAural.makeClipSetClipFlagPositions(flagPositions)
    OmniAural.makeClipSetHighlightedPositions(flagPositions)
  }

  const _handlePreviewStartTime = () => {
    if (startTime) {
      const startTimeSeconds = convertHHMMSSToSeconds(startTime)
      const endTimeSeconds = convertHHMMSSToSeconds(endTime)
      playerSeekTo(startTimeSeconds)
      handleSetupClipListener(endTimeSeconds)
      playerPlay()
    }
  }

  const _handlePreviewEndTime = () => {
    if (endTime) {
      const endTimeSeconds = convertHHMMSSToSeconds(endTime)
      playerSeekTo(endTimeSeconds - 3)
      handleSetupClipListener(endTimeSeconds)
      playerPlay()
    }
  }

  const _handleSaveClip = async () => {
    try {
      setIsSaving(true)

      if (isEditing) {
        const startTimeSeconds = convertHHMMSSToSeconds(startTime)
        const endTimeSeconds = convertHHMMSSToSeconds(endTime)

        const updatedMediaRef = await updateMediaRef({
          episodeId: currentNowPlayingItem.episodeId,
          endTime: endTimeSeconds,
          id: currentNowPlayingItem.clipId,
          isPublic,
          startTime: startTimeSeconds,
          title
        })

        // Navigate to the clips page to refresh the state
        router.push(`${PV.RoutePaths.web.clip}/${updatedMediaRef.id}`)
        OmniAural.makeClipClearState()
      } else {
        const startTimeSeconds = convertHHMMSSToSeconds(startTime)
        const endTimeSeconds = convertHHMMSSToSeconds(endTime)

        const newMediaRef = await createMediaRef({
          episodeId: currentNowPlayingItem.episodeId,
          endTime: endTimeSeconds,
          isPublic,
          startTime: startTimeSeconds,
          title
        })

        const linkUrl = `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clip}/${newMediaRef.id}`
        OmniAural.makeClipClearState()
        OmniAural.makeClipSuccessModalSetLinkUrl(linkUrl)
        OmniAural.makeClipSuccessModalShow()
      }

      
    } catch (error) {
      alert(t('Something went wrong'))
      console.log('_handleSaveClip error:', error)
    }

    setIsSaving(false)
  }

  /* Render Helpers */

  const generatePrivacyDropdownItems = () => {
    const items = [
      { label: 'Public', key: PV.MakeClip.privacyKeys.public },
      { label: 'Only with link', key: PV.MakeClip.privacyKeys.onlyWithLink }
    ]

    return items
  }

  const privacyDropdownItems = generatePrivacyDropdownItems()
  const headerText = isEditing ? t('Edit Clip') : t('Make Clip')

  return (
    <div className='make-clip-form'>
      <div className='make-clip-header-wrapper'>
        <PVImage
          alt={t('Podcast artwork')}
          height={PV.Images.sizes.medium}
          src={currentNowPlayingItem.episodeImageUrl || currentNowPlayingItem.podcastImageUrl}
          width={PV.Images.sizes.medium} />
        <h1>{headerText}</h1>
        <Dropdown
          dropdownWidthClass='width-medium'
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
          handleIconEndClick={_handlePreviewStartTime}
          label={t('Start time')}
          onChange={_startTimeOnChange}
          onSubmit={_handleSaveClip}
          placeholder={'00:00'}
          type='text' />
        <TextInput
          defaultValue={endTime}
          faIconEnd={faPlay}
          handleIconEndClick={_handlePreviewEndTime}
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
          isLoading={isSaving}
          label={t('Save')}
          onClick={_handleSaveClip}
          type='primary' />
      </div>
    </div>
  )
}
