import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";

export function SearchHeader() {
  const tFeatures = useTranslations("features");
  return (
    <MainHeader title={tFeatures("search.search")} />
  )
}
