import { faDesktop, faMobile, faMobileAlt, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import OmniAural from 'omniaural'
import { useState } from 'react'
import { ButtonRectangle } from '../Buttons/ButtonRectangle'
import { Icon } from '../Icon/Icon'

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
          <div className='tutorial-section-inner-wrapper'>
            {!!webPreviewVideoEmbed && (
              <ButtonRectangle
                className='tutorial-video-button'
                onClick={() => playVideoInModal(webPreviewVideoEmbed)}
                type='tertiary'
              >
                <div className='tutorial-video-button-label'>Video Demo</div>
                <Icon className='play-preview' faIcon={faPlay} />
              </ButtonRectangle>
            )}
            <div className='tutorial-section-explanation' dangerouslySetInnerHTML={{ __html: webExplanation }} />
          </div>
        </>
      )}
      {typeSelected === 'mobile' && (
        <div className='tutorial-section-inner-wrapper'>
          {!!mobilePreviewVideoEmbed && (
            <ButtonRectangle
              className='tutorial-video-button'
              onClick={() => playVideoInModal(mobilePreviewVideoEmbed)}
              type='tertiary'
            >
              <div className='tutorial-video-button-label'>Video Demo</div>
              <Icon className='play-preview' faIcon={faPlay} />
            </ButtonRectangle>
          )}
          <div className='tutorial-section-explanation' dangerouslySetInnerHTML={{ __html: mobileExplanation }} />
        </div>
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
      <div className='tutorial-section-tabs-inner'>
        <TutorialTab isActive={typeSelected === 'web'} label='Web' onClick={() => onClick('web')} />
        <TutorialTab isActive={typeSelected === 'mobile'} label='Mobile' onClick={() => onClick('mobile')} />
      </div>
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
