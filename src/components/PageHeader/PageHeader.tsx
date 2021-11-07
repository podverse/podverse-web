import { Dropdown } from "~/components"

type Props = {
  primaryOnChange?: any
  primaryOptions?: any[]
  primarySelected?: string
  sortOptions?: any[]
  sortOnChange?: any
  sortSelected?: string
  text: string
}

export const PageHeader = ({ primaryOnChange, primaryOptions, primarySelected,
  sortOnChange, sortOptions, sortSelected, text }: Props) => {
  const hasDropdowns = !!(sortOptions?.length || primaryOptions?.length)

  return (
    <div className='page-header'>
      <div className='main-max-width'>
        <div className='title'>
          {text}
        </div>
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
