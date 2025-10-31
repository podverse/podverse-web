import { useTranslations } from "next-intl";
import { ButtonTabs } from "../../../../components/Tabs/ButtonTabs";
import { usePlaylistEditContext } from "./PlaylistEditContext";
import styles from "../../../../styles/app/playlist/edit/PlaylistEditButtonTabs.module.scss";

export function PlaylistEditButtonTabs() {
  const tMisc = useTranslations("misc");
  const { tabSelectedKey, setTabSelectedKey } = usePlaylistEditContext();

  const buttonTabs = [
    {
      key: "info",
      label: tMisc("info"),
      onClick: () => {
        setTabSelectedKey("info");
      }
    },
    {
      key: "items",
      label: tMisc("items"),
      onClick: () => {
        setTabSelectedKey("items");
      }
    }
  ];

  return (
    <ButtonTabs
      className={styles.buttonTabs}
      buttonTabs={buttonTabs}
      selectedKey={tabSelectedKey}
    />
  )
}
