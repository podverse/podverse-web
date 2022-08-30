import classNames from 'classnames'
import { useState } from 'react'
import { PageHeader } from '~/components'

type Props = {
  children: any
  handleAutoScrollButton?: any
  headerText: string
  isAutoScrollOn?: boolean
  isLoading?: boolean
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  sortOptions?: any[]
  sortOnChange?: any
  sortSelected?: string
}

export const MainContentSection = ({
  children,
  handleAutoScrollButton,
  headerText,
  isAutoScrollOn,
  isLoading,
  primaryOnChange,
  primaryOptions,
  primarySelected,
  sortOnChange,
  sortOptions,
  sortSelected
}: Props) => {
  const [showContent, setShowContent] = useState<boolean>(false)

  const contentsClass = classNames('main-content-contents', showContent ? '' : 'hide')

  const _headerOnClick = () => {
    setShowContent(!showContent)
  }

  return (
    <>
      <div className='main-content-section'>
        <div className='main-content-header'>
          <PageHeader
            handleAutoScrollButton={handleAutoScrollButton}
            handleCollapse={_headerOnClick}
            isAutoScrollOn={isAutoScrollOn}
            isCollapsed={!showContent}
            isLoading={isLoading}
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
