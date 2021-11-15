import classnames from  'classnames'
import { Dropdown } from "~/components"

type Props = {
  isSubHeader?: boolean
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  sortOptions?: any[]
  sortOnChange?: any
  sortSelected?: string
  text: string
}

export const PageHeader = ({ isSubHeader, primaryOnChange, primaryOptions,
  primarySelected, sortOnChange, sortOptions, sortSelected, text }: Props) => {
  const wrapperClass = classnames(
    'page-header',
    isSubHeader ? 'sub-header' : ''
  )
  const hasDropdowns = !!(sortOptions?.length || primaryOptions?.length)

  return (
    <div className={wrapperClass}>
      <div className='main-max-width'>
        {!isSubHeader && <h1>{text}</h1>}
        {isSubHeader && <h2>{text}</h2>}
        {
          hasDropdowns && (
            <div className='dropdowns'>
              {
                primaryOptions?.length && (
                  <div className='dropdown-primary-wrapper'>
                    <Dropdown
                      dropdownWidthClass='width-small'
                      onChange={primaryOnChange}
                      options={primaryOptions}
                      outlineStyle
                      selectedKey={primarySelected} />
                  </div>
                )
              }
              {
                sortOptions?.length && (
                  <div className='dropdown-sort-wrapper'>
                    <Dropdown
                      dropdownWidthClass='width-medium'
                      onChange={sortOnChange}
                      options={sortOptions}
                      outlineStyle
                      selectedKey={sortSelected} />
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}
