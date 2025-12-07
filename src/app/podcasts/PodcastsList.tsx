import React from "react";
import { DTOCategory } from "podverse-helpers";
import { ListPodcasts } from "../../components/List/Podcasts/ListPodcasts";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { ModalCategoriesSelect } from "../../components/Modal/ModalCategoriesSelect";
import { onClickCategory } from "../../utils/categories";
import { ROUTES } from "../../constants/routes";
import { useRouter } from "next/navigation";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";

export const PodcastsList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading,
    showSubscribeMessage, showCategoriesModal, setShowCategoriesModal } = usePodcastsContext();
  const { viewSelected } = useLocalSettings();
  const { page, type, category } = filterParams;
  const router = useRouter();

  const handleOnClickCategory = (category: DTOCategory) => {
    onClickCategory({
      category,
      setFilterParams,
      filterParams,
      setShowCategoriesModal,
      linkPath: ROUTES.PODCASTS,
      router
    });
  };

  return (
    <>
      {
        filterParams.type === "subscribed" && (
          <HowToStartInfo
            rows={channels}
            totalPages={totalPages}
          />
        )
      }
      <ListPodcasts
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        channels={channels}
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
