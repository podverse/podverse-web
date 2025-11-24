import { DTOCategory, QUERY_PARAMS_GLOBAL_GET_MANY_SORT_VALUES } from "podverse-helpers";

type OnClickCategoryParams = {
  category: DTOCategory,
  setFilterParams: (params: any) => void,
  filterParams: any,
  setShowCategoriesModal: (isOpen: boolean) => void,
  linkPath?: string,
  router: any
};

export const onClickCategory = ({
  category,
  setFilterParams,
  filterParams,
  setShowCategoriesModal,
  linkPath,
  router
}: OnClickCategoryParams) => {
  if (category?.mapping_key) {
    setFilterParams({
      ...filterParams,
      type: "category",
      sort: QUERY_PARAMS_GLOBAL_GET_MANY_SORT_VALUES
        .includes(filterParams.sort) ? filterParams.sort : "recent",
      category: category.mapping_key,
      page: 1
    });
    setShowCategoriesModal(false);
    router.replace(`${linkPath}?category=${category.mapping_key}`);
  }
};
