import { faSearch } from '@fortawesome/free-solid-svg-icons'
import debounce from 'debounce'
import { useMemo } from 'react'
import { TextInput } from '~/components'

type Props = {
  debounceRate?: number
  defaultValue?: string
  handleSubmit: (val: string) => void
  label: string
  placeholder: string
}

export const SearchPageInput = ({ debounceRate = 1000, defaultValue, handleSubmit, label, placeholder }: Props) => {
  const debouncedHandleSubmit = useMemo(
    () => debounce((val) => handleSubmit(val), debounceRate),
    [debounceRate, handleSubmit]
  )

  return (
    <div className='search-page-input'>
      <div className='main-max-width'>
        <TextInput
          autoFocus
          defaultValue={defaultValue}
          faIcon={faSearch}
          label={label}
          onChange={(value) => debouncedHandleSubmit(value)}
          placeholder={placeholder}
          type='text'
        />
      </div>
    </div>
  )
}
