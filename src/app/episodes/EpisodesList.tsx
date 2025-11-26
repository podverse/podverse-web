import React from "react";
import { DTOCategory } from "podverse-helpers";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { ModalCategoriesSelect } from "../../components/Modal/ModalCategoriesSelect";
import { onClickCategory } from "../../utils/categories";
import { ROUTES } from "../../constants/routes";
import { useRouter } from "next/navigation";
import { useEpisodesContext } from "./EpisodesContext";
import ListEpisodes from "../../components/List/Podcasts/Episodes/ListEpisodes";

export const EpisodesList: React.FC = () => {
  const { filterParams, setFilterParams, items, totalPages, isLoading,
    showSubscribeMessage, showCategoriesModal, setShowCategoriesModal } = useEpisodesContext();
  const { viewSelected } = useLocalSettings();
  const { page, type, category } = filterParams;
  const router = useRouter();

  const handleOnClickCategory = (category: DTOCategory) => {
    onClickCategory({
      category,
      setFilterParams,
      filterParams,
      setShowCategoriesModal,
      linkPath: ROUTES.EPISODES,
      router
    });
  };

  return (
    <>
      <ListEpisodes
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        channel={null}
        items={items}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
        category={category}
        viewSelected={viewSelected}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
      <ModalCategoriesSelect
        isOpen={showCategoriesModal}
        onCategoryClick={handleOnClickCategory}
        setIsOpen={setShowCategoriesModal}
      />
    </>
  );
};
