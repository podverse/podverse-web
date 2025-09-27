import { DescriptionRenderer } from "../../Description/DescriptionRenderer";

type EpisodeSummaryProps = {
  description?: string;
}

export const EpisodeSummary: React.FC<EpisodeSummaryProps> = ({ description }) => {
  return (
    <DescriptionRenderer description={description || ""} />
  );
};
