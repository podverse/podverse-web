import { faPlayCircle } from '@fortawesome/free-regular-svg-icons'
import classNames from 'classnames'
import OmniAural from 'omniaural'
import { useState } from 'react'
import { ButtonIcon } from '../Buttons/ButtonIcon'

export type TutorialSectionProps = {
  defaultTypeSelected: 'mobile' | 'web'
  description: string
  id: string
  mobileExplanation: string
  mobilePreviewVideoEmbed: any
  title: string
  webExplanation: string
  webPreviewVideoEmbed: any
}

export const TutorialSection = ({
  defaultTypeSelected,
  description,
  id,
  mobileExplanation,
  mobilePreviewVideoEmbed,
  title,
  webExplanation,
  webPreviewVideoEmbed
}: TutorialSectionProps) => {
  const [typeSelected, setTypeSelected] = useState<'mobile' | 'web'>(defaultTypeSelected)

  const tabOnClick = (typeSelected: 'mobile' | 'web') => {
    setTypeSelected(typeSelected)
  }

  const playVideoInModal = (previewVideoEmbed: Node) => {
    OmniAural.modalsFeatureVideoPreviewShow(previewVideoEmbed)
  }

  return (
    <div className='tutorial-section'>
      <h3 className='tutorial-section-title' id={id}>
        {title}
      </h3>
      <div className='tutorial-section-description'>{description}</div>
      <TutorialTabs onClick={tabOnClick} typeSelected={typeSelected} />
      {typeSelected === 'web' && (
        <>
          {!!webPreviewVideoEmbed && (
            <div className='tutorial-video-button'>
              <span className='tutorial-video-button-label'>Web Demo </span>
              <ButtonIcon
                className='play-preview'
                faIcon={faPlayCircle}
                isLink
                onClick={() => playVideoInModal(webPreviewVideoEmbed)}
              />
            </div>
          )}
          <div className='tutorial-section-explanation'>{webExplanation}</div>
        </>
      )}
      {typeSelected === 'mobile' && (
        <>
          {!!mobilePreviewVideoEmbed && (
            <div className='tutorial-video-button'>
              <span className='tutorial-video-button-label'>Mobile Demo </span>
              <ButtonIcon
                className='play-preview'
                faIcon={faPlayCircle}
                isLink
                onClick={() => playVideoInModal(mobilePreviewVideoEmbed)}
              />
            </div>
          )}
          <div className='tutorial-section-explanation'>{mobileExplanation}</div>
        </>
      )}
      <hr />
    </div>
  )
}

type TutorialTabsProps = {
  onClick: any
  typeSelected: 'mobile' | 'web'
}

const TutorialTabs = ({ onClick, typeSelected }: TutorialTabsProps) => {
  return (
    <div className='tutorial-section-tabs'>
      <TutorialTab isActive={typeSelected === 'web'} label='Web' onClick={() => onClick('web')} />
      <TutorialTab isActive={typeSelected === 'mobile'} label='Mobile' onClick={() => onClick('mobile')} />
    </div>
  )
}

type TutorialTabProps = {
  isActive: boolean
  label: string
  onClick: any
}

const TutorialTab = ({ isActive, label, onClick }: TutorialTabProps) => {
  const tabStyle = classNames('tutorial-tab', isActive ? 'active' : '')

  return (
    <button className={tabStyle} onClick={onClick} tabIndex={0}>
      {label}
    </button>
  )
}
