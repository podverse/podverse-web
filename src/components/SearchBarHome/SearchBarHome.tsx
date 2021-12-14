import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput } from '~/components'
import { PV } from '~/resources'

type Props = {}

export const SearchBarHome = (props: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState<string>('')

  const handleSearch = () => {
    if (searchValue) {
      router.push(`${PV.RoutePaths.web.search}?podcastTitle=${searchValue}`)
    }
  }

  return (
    <div className='search-bar-home'>
      <TextInput
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
