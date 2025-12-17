import { DescriptionRenderer } from "../../../../Description/DescriptionRenderer";

type TrackSummaryProps = {
  description?: string;
}

export const TrackSummary: React.FC<TrackSummaryProps> = ({ description }) => {
  return (
    <DescriptionRenderer description={description || ""} />
  );
};
