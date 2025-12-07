import React from "react";
import { DTOCategory } from "podverse-helpers";
import { useRouter } from "next/navigation";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { ModalCategoriesSelect } from "../../components/Modal/ModalCategoriesSelect";
import { onClickCategory } from "../../utils/categories";
import { ROUTES } from "../../constants/routes";
import { ListClips } from "../../components/List/Clips/ListClips";
import { useClipsContext } from "./ClipsContext";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";

export const ClipsList: React.FC = () => {
  const { filterParams, setFilterParams, clips, totalPages, isLoading,
    showSubscribeMessage, showCategoriesModal, setShowCategoriesModal } = useClipsContext();
  const { page, type, category } = filterParams;
  const router = useRouter();

  const handleOnClickCategory = (category: DTOCategory) => {
    onClickCategory({
      category,
      setFilterParams,
      filterParams,
      setShowCategoriesModal,
      linkPath: ROUTES.CLIPS,
      router
    });
  };

  return (
    <>
      {
        filterParams.type === "subscribed" && (
          <HowToStartInfo
            rows={clips}
            totalPages={totalPages}
          />
        )
      }
      <ListClips
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        clips={clips}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
        category={category}
        showItemInfo
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
