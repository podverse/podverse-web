import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "react-i18next"
import { TextInput } from "~/components"

type Props = {}

export const SearchPageInput = (props: Props) => {
  const { t } = useTranslation()

  return (
    <div className='search-page-input'>
      <div className='main-max-width'>
        <TextInput
          faIcon={faSearch}
          helperText={t('Use double quotes for exact matches')} />
      </div>
    </div>
  )
}
