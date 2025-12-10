import React from "react";
import { DTOCategory } from "podverse-helpers";
import { useTranslations } from "next-intl";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../../contexts/LocalSettings";
import { ModalCategoriesSelect } from "../../../components/Modal/ModalCategoriesSelect";
import { onClickCategory } from "../../../utils/categories";
import { ROUTES } from "../../../constants/routes";
import { useRouter } from "next/navigation";
import { useLivestreamsContext } from "./LivestreamsContext";
import { HowToStartInfo } from "../../../components/InfoWrapper/HowToStartInfo";
import { ListLiveItems } from "../../../components/List/LiveItem/ListLiveItems";
import { ButtonTabs } from "../../../components/Tabs/ButtonTabs";
import styles from "../../../styles/app/podcasts/livestreams/LivestreamsList.module.scss";

type LivestreamsListProps = {
  medium: "av" | "music"
};

export const LivestreamsList: React.FC<LivestreamsListProps> = ({ medium }) => {
  const { filterParams, setFilterParams, items, totalPages, isLoading,
    showSubscribeMessage, showCategoriesModal, setShowCategoriesModal } = useLivestreamsContext();
  const { viewSelected } = useLocalSettings();
  const { page } = filterParams;
  const router = useRouter();
  const tMedia = useTranslations("media");

  const handleOnClickCategory = (category: DTOCategory) => {
    const route = medium === "av" ? ROUTES.PODCASTS_LIVESTREAMS : ROUTES.MUSIC_LIVESTREAMS;
    onClickCategory({
      category,
      setFilterParams,
      filterParams,
      setShowCategoriesModal,
      linkPath: route,
      router
    });
  };

  const buttonTabs = [
    {
      key: "live",
      label: tMedia("livestream.live"),
      onClick: () => setFilterParams({ ...filterParams, page: 1, liveItemType: "live" })
    },
    {
      key: "pending",
      label: tMedia("livestream.pending"),
      onClick: () => setFilterParams({ ...filterParams, page: 1, liveItemType: "pending" })
    },
    {
      key: "ended",
      label: tMedia("livestream.ended"),
      onClick: () => setFilterParams({ ...filterParams, page: 1, liveItemType: "ended" })
    }
  ]
      
  return (
    <>
      {
        filterParams.type === "subscribed" && (
          <HowToStartInfo
            rows={items}
            totalPages={totalPages}
          />
        )
      }
      <ButtonTabs
        buttonTabs={buttonTabs}
        selectedKey={filterParams.liveItemType}
      />
      <div className={styles.listWrapper}>
        <ListLiveItems
          page={page}
          setPage={(page) => setFilterParams({ ...filterParams, page })}
          items={items}
          totalPages={totalPages}
          showSubscribeMessage={showSubscribeMessage}
          viewSelected={viewSelected}
          showChannelInfo
        />
      </div>
      <LoadingSpinnerOverlay isLoading={isLoading} />
      <ModalCategoriesSelect
        isOpen={showCategoriesModal}
        onCategoryClick={handleOnClickCategory}
        setIsOpen={setShowCategoriesModal}
      />
    </>
  );
};
