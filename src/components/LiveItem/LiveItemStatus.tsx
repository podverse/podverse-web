import { useTranslations } from "next-intl";
import { DTOLiveItem, LiveItemStatusEnum } from "podverse-helpers";
import { Button, ButtonVariant } from "../Button/Button";
import styles from "../../styles/components/LiveItem/LiveItemStatus.module.scss";

type LiveItemStatusProps = {
  live_item: DTOLiveItem;
}

export const LiveItemStatus = ({ live_item }: LiveItemStatusProps) => {
  const tMedia = useTranslations("media");

  let statusText = tMedia("livestream.scheduled");
  let variant: ButtonVariant = 'miniGlow';
  if (live_item.live_item_status.id === LiveItemStatusEnum.Live) {
    statusText = tMedia("livestream.live_now");
    variant = 'miniGlowDanger';
  } else if (live_item.live_item_status.id === LiveItemStatusEnum.Ended) {
    statusText = tMedia("livestream.ended");
    variant = 'miniGlowWarning';
  }

  return (
    <Button
      className={styles.button}
      variant={variant}>
      {statusText}
    </Button>
  );
};
