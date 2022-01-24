import { faSearch } from '@fortawesome/free-solid-svg-icons'
import debounce from 'debounce'
import { useCallback } from 'react'
import { TextInput } from '~/components'

type Props = {
  debounceRate?: number
  defaultValue?: string
  handleAutoSubmit: any
  label: string
  placeholder: string
}

export const SearchPageInput = ({ debounceRate = 1000, defaultValue, handleAutoSubmit, label, placeholder }: Props) => {
  const debouncedHandleAutoSubmit = useCallback(
    debounce((val) => handleAutoSubmit(val, 1), debounceRate),
    []
  )

  return (
    <div className='search-page-input'>
      <div className='main-max-width'>
        <TextInput
          defaultValue={defaultValue}
          faIcon={faSearch}
          label={label}
          onChange={(value) => debouncedHandleAutoSubmit(value, 1)}
          placeholder={placeholder}
          type='text'
        />
      </div>
    </div>
  )
}
