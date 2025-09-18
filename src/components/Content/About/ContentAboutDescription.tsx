import { stripAndDecodeHtml } from "podverse-helpers";

type ContentAboutDescription = {
  description?: string;
}

export const ContentAboutDescription = ({ description }: ContentAboutDescription) => {
  const cleanedDescription = description ? stripAndDecodeHtml(description) : "";
  return (
    <p>
      {cleanedDescription}
    </p>
  );
};
