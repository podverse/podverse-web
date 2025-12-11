import { DescriptionRenderer } from "../../Description/DescriptionRenderer";

type LivestreamSummaryProps = {
  description?: string;
}

export const LivestreamSummary: React.FC<LivestreamSummaryProps> = ({ description }) => {
  return (
    <DescriptionRenderer description={description || ""} />
  );
};
