import { useTranslations } from "next-intl";
import { SearchInput } from "../../components/Form/SearchInput";
import { useSearchContext } from "./SearchContext";

export function SearchListHeader() {
  const { setSearchParams } = useSearchContext();
  const tFeatures = useTranslations("features");

  return (
    <div>
      <SearchInput
        onSearch={(value: string) => {
          setSearchParams({ q: value });
        }}
        placeholder={tFeatures("search.search_by_title")}
        autoFocus
      />
    </div>
  )
}
