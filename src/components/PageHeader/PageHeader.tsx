import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ButtonRectangle, Dropdown } from '~/components'

type Props = {
  handleClearAllButton?: any
  handleEditButton?: any
  hasEditButton?: boolean
  isEditing?: boolean
  isSubHeader?: boolean
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  sortOptions?: any[]
  sortOnChange?: any
  sortSelected?: string
  text: string
}

export const PageHeader = ({
  handleClearAllButton,
  handleEditButton,
  hasEditButton,
  isEditing,
  isSubHeader,
  primaryOnChange,
  primaryOptions,
  primarySelected,
  sortOnChange,
  sortOptions,
  sortSelected,
  text
}: Props) => {
  const { t } = useTranslation()
  const wrapperClass = classnames('page-header', isSubHeader ? 'sub-header' : '')
  const hasDropdowns = !!(sortOptions?.length || primaryOptions?.length)
  const hasButtons = hasEditButton

  return (
    <>
      <div className={wrapperClass}>
        <div className='main-max-width'>
          {!isSubHeader && <h1>{text}</h1>}
          {isSubHeader && <h2>{text}</h2>}
          {hasDropdowns && (
            <div className='dropdowns'>
              {primaryOptions?.length && (
                <div className='dropdown-primary-wrapper'>
                  <Dropdown
                    dropdownWidthClass='width-small'
                    onChange={primaryOnChange}
                    options={primaryOptions}
                    outlineStyle
                    selectedKey={primarySelected}
                  />
                </div>
              )}
              {sortOptions?.length && (
                <div className='dropdown-sort-wrapper'>
                  <Dropdown
                    dropdownWidthClass='width-medium'
                    onChange={sortOnChange}
                    options={sortOptions}
                    outlineStyle
                    selectedKey={sortSelected}
                  />
                </div>
              )}
            </div>
          )}
          {hasButtons && (
            <div className='buttons'>
              {isEditing && <ButtonRectangle label={t('Remove All')} onClick={handleClearAllButton} type='tertiary' />}
              {hasEditButton && (
                <ButtonRectangle label={isEditing ? t('Done') : t('Edit')} onClick={handleEditButton} type='tertiary' />
              )}
            </div>
          )}
        </div>
      </div>
      <hr />
    </>
  )
}
