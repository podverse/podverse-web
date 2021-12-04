import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useState } from 'react'
import { Icon } from '~/components'

type Props = {
  children: any
  headerText: string
}

export const SideContentSection = ({ children, headerText }: Props) => {
  const [showContent, setShowContent] = useState<boolean>(false)
  const caretIcon = showContent ? faAngleUp : faAngleDown

  const contentsClass = classNames('side-content-contents', showContent ? '' : 'hide-below-tablet-xl')

  const _headerOnClick = () => {
    setShowContent(!showContent)
  }

  return (
    <>
      <div className='side-content-section'>
        <div className='side-content-header' onClick={_headerOnClick}>
          <h2>{headerText}</h2>
          <div className='side-content-header-caret'>
            <Icon faIcon={caretIcon} />
          </div>
        </div>
        <div className={contentsClass}>{children}</div>
      </div>
      <hr />
    </>
  )
}
