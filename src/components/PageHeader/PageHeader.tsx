import { faAngleDown, faAngleUp, faFilm, faSpinner } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ButtonRectangle, DivClickable, Dropdown, Icon, SwitchWithIcons } from '~/components'

type Props = {
  customButtons?: any
  handleAutoScrollButton?: any
  handleClearAllButton?: any
  handleCollapse?: any
  handleEditButton?: any
  hasEditButton?: boolean
  handleVideoOnlyModeToggle?: any
  isAutoScrollOn?: boolean
  isCollapsed?: boolean
  isEditing?: boolean
  isLoading?: boolean
  isSubHeader?: boolean
  noMarginBottom?: boolean
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  secondaryOptions?: any[]
  secondaryOnChange?: any
  secondarySelected?: string
  text: string
  videoOnlyMode?: boolean
}

export const PageHeader = ({
  customButtons,
  handleAutoScrollButton,
  handleClearAllButton,
  handleCollapse,
  handleEditButton,
  hasEditButton,
  handleVideoOnlyModeToggle,
  isAutoScrollOn,
  isCollapsed,
  isEditing,
  isLoading,
  isSubHeader,
  noMarginBottom,
  primaryOnChange,
  primaryOptions,
  primarySelected,
  secondaryOnChange,
  secondaryOptions,
  secondarySelected,
  text,
  videoOnlyMode
}: Props) => {
  const { t } = useTranslation()
  const wrapperClass = classnames(
    'page-header',
    isSubHeader ? 'sub-header' : '',
    noMarginBottom ? 'no-margin-bottom' : ''
  )
  const hrClassName = classnames('page-header-hr', noMarginBottom ? 'no-margin-bottom' : '')
  const hasDropdowns = !!(secondaryOptions?.length || primaryOptions?.length)
  const hasButtons = !!hasEditButton || !!handleAutoScrollButton || !!customButtons
  const caretIcon = (
    <div className='header-caret'>
      <Icon faIcon={isCollapsed ? faAngleDown : faAngleUp} />
    </div>
  )

  const splitText = text.split(' > ')
  const h1AriaLabel = splitText.length > 1 ? splitText.join(', ') : text
  const divClickableRole = handleCollapse ? 'button' : ''
  const h1TabIndex = handleCollapse ? -1 : 0

  return (
    <>
      <div className={wrapperClass}>
        <div className='main-max-width'>
          <DivClickable className='page-header-title-wrapper' onClick={handleCollapse} role={divClickableRole}>
            {!isSubHeader && (
              <h1 aria-label={h1AriaLabel} tabIndex={h1TabIndex}>
                {text}
              </h1>
            )}
            {isSubHeader && <h2 tabIndex={h1TabIndex}>{text}</h2>}
            {handleCollapse && caretIcon}
            {isLoading && (
              <div className='loader-wrapper'>
                <Icon faIcon={faSpinner} spin />
              </div>
            )}
          </DivClickable>
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
              {secondaryOptions?.length && (
                <div className='dropdown-secondary-wrapper'>
                  <Dropdown
                    dropdownWidthClass='width-medium'
                    onChange={secondaryOnChange}
                    options={secondaryOptions}
                    outlineStyle
                    selectedKey={secondarySelected}
                  />
                </div>
              )}
              {handleVideoOnlyModeToggle && (
                <SwitchWithIcons
                  ariaLabel={t('ARIA - Toggle video only mode')}
                  checked={videoOnlyMode}
                  faIconEnding={faFilm}
                  onChange={handleVideoOnlyModeToggle}
                />
              )}
            </div>
          )}
          {hasButtons && (
            <div className='buttons'>
              {isEditing && (
                <ButtonRectangle label={t('Remove All')} onClick={handleClearAllButton} isDanger type='tertiary' />
              )}
              {hasEditButton && (
                <ButtonRectangle
                  ariaDescription={t('Edit activation description - remove')}
                  ariaPressed
                  label={isEditing ? t('Done') : t('Edit')}
                  onClick={handleEditButton}
                  type='tertiary'
                />
              )}
              {!!handleAutoScrollButton && (
                <ButtonRectangle
                  ariaDescription={t('Auto-scroll button - aria description')}
                  ariaPressed
                  label={isAutoScrollOn ? t('Auto-scroll button - on') : t('Auto-scroll button - off')}
                  onClick={handleAutoScrollButton}
                  type='tertiary'
                />
              )}
              {customButtons ? customButtons : null}
            </div>
          )}
        </div>
      </div>
      {!isSubHeader && <hr aria-hidden='true' className={hrClassName} />}
    </>
  )
}
