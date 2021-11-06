import { Dropdown } from ".."

type Props = {
  sortOnChange?: any
  sortOptions?: any[]
  sortSelected?: string
  text: string
  typeOnChange?: any
  typeOptions?: any[]
  typeSelected?: string
}

export const PageHeader = ({ sortOnChange, sortOptions, sortSelected, text,
  typeOnChange, typeOptions, typeSelected }: Props) => {
  const hasDropdowns = !!(sortOptions?.length || typeOptions?.length)

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
                typeOptions?.length && (
                  <div className='dropdown-type-wrapper'>
                    <Dropdown
                      dropdownWidthClass='width-small'
                      onChange={typeOnChange}
                      options={typeOptions}
                      outlineStyle
                      selectedKey={typeSelected} />
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