import { faSearch } from '@fortawesome/free-solid-svg-icons'
import debounce from 'debounce'
import { useMemo } from 'react'
import { TextInput } from '~/components'

type Props = {
  debounceRate?: number
  defaultValue?: string
  handleAutoSubmit: (val: string) => void
  label: string
  placeholder: string
}

export const SearchPageInput = ({ debounceRate = 1000, defaultValue, handleAutoSubmit, label, placeholder }: Props) => {
  const debouncedHandleAutoSubmit = useMemo(
    () => debounce((val) => handleAutoSubmit(val), debounceRate),
    [debounceRate, handleAutoSubmit]
  )

  return (
    <div className='search-page-input'>
      <div className='main-max-width'>
        <TextInput
          defaultValue={defaultValue}
          faIcon={faSearch}
          label={label}
          onChange={(value) => debouncedHandleAutoSubmit(value)}
          placeholder={placeholder}
          type='text'
        />
      </div>
    </div>
  )
}
