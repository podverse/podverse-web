import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput } from '~/components'
import { PV } from '~/resources'

export const SearchBarHome = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState<string>('')
  const endButtonClass = classNames(searchValue ? 'show' : '')

  const handleSearch = () => {
    if (searchValue) {
      router.push(`${PV.RoutePaths.web.search}?podcastTitle=${searchValue}`)
    }
  }

  return (
    <div className='search-bar-home'>
      <TextInput
        endButtonClass={endButtonClass}
        endButtonText={t('Search')}
        faIcon={faSearch}
        handleEndButtonClick={handleSearch}
        onChange={setSearchValue}
        onSubmit={handleSearch}
        placeholder={t('Search for a podcast')}
        type='text'
        value={searchValue}
      />
    </div>
  )
}
