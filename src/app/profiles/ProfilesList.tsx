import React from "react";
import { ListProfiles } from "../../components/List/Profiles/ListProfiles";
import { useProfilesContext } from "./ProfilesContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";

export const ProfilesList: React.FC = () => {
  const { filterParams, setFilterParams, accounts, totalPages, isLoading,
    showSubscribeMessage } = useProfilesContext();
  const { page, type } = filterParams;

  return (
    <>
      {
        filterParams.type === "subscribed" && (
          <HowToStartInfo
            rows={accounts}
            totalPages={totalPages}
          />
        )
      }
      <ListProfiles
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        accounts={accounts}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
