import styles from "../../../styles/components/Media/Episode/EpisodeSummary.module.scss";

type EpisodeSummaryProps = {
  description?: string;
}

export const EpisodeSummary: React.FC<EpisodeSummaryProps> = ({ description }) => {
  return (
    <div className={styles.summary}>
      <p>{description}</p>
    </div>
  );
};
