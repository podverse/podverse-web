import { faSearch } from '@fortawesome/free-solid-svg-icons'
import debounce from 'debounce'
import { useEffect, useMemo, useState } from 'react'
import { TextInput } from '~/components'

type Props = {
  debounceRate?: number
  defaultValue?: string
  handleClear: () => void
  handleSubmit: (val: string) => void
  label: string
  placeholder: string
}

export const SearchPageInput = ({
  debounceRate = 1000,
  defaultValue,
  handleClear,
  handleSubmit,
  label,
  placeholder
}: Props) => {
  const [searchText, setSearchText] = useState<string>('')

  const debouncedHandleSubmit = useMemo(
    () => debounce((val) => handleSubmit(val), debounceRate),
    [debounceRate, handleSubmit]
  )

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      window.addEventListener('navbar-link-clicked-search', _handleClear)
      return () => window.removeEventListener('navbar-link-clicked-search', _handleClear)
    })()
  }, [])

  /* Helper Functions */

  const _handleClear = () => {
    handleClear()
    setSearchText('')
  }

  const handleOnChange = (val: string) => {
    setSearchText(val)
    debouncedHandleSubmit(val)
  }

  const handleOnSubmit = () => {
    debouncedHandleSubmit.flush()
  }

  return (
    <div className='search-page-input'>
      <div className='main-max-width'>
        <TextInput
          autoFocus
          defaultValue={defaultValue}
          faIcon={faSearch}
          handleEndButtonClearButtonClick={searchText && _handleClear}
          label={label}
          onChange={handleOnChange}
          onSubmit={handleOnSubmit}
          placeholder={placeholder}
          type='text'
          value={searchText}
        />
      </div>
    </div>
  )
}
