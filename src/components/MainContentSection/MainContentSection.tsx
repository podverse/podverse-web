import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useState } from 'react'
import { Icon, PageHeader } from '~/components'

type Props = {
  children: any
  headerText: string
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  sortOptions?: any[]
  sortOnChange?: any
  sortSelected?: string
}

export const MainContentSection = ({
  children,
  headerText,
  primaryOnChange,
  primaryOptions,
  primarySelected,
  sortOnChange,
  sortOptions,
  sortSelected
}: Props) => {
  const [showContent, setShowContent] = useState<boolean>(false)
  const caretIcon = showContent ? faAngleUp : faAngleDown

  const contentsClass = classNames('main-content-contents', showContent ? '' : 'hide')

  const _headerOnClick = () => {
    setShowContent(!showContent)
  }

  return (
    <>
      <div className='main-content-section'>
        <div className='main-content-header'>
          <PageHeader
            handleCollapse={_headerOnClick}
            isCollapsed={!showContent}
            isSubHeader
            primaryOnChange={primaryOnChange}
            primaryOptions={primaryOptions}
            primarySelected={primarySelected}
            sortOnChange={sortOnChange}
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            text={headerText}
          />
        </div>
        <div className={contentsClass}>{children}</div>
      </div>
      <hr />
    </>
  )
}
