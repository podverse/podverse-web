import { stripAndDecodeHtml } from "podverse-helpers";
import { SideContentAboutHeader } from "./SideContentAboutHeader";

type SideContentAbout = {
  description?: string;
}

export const SideContentAbout = ({ description }: SideContentAbout) => {
  const cleanedDescription = description ? stripAndDecodeHtml(description) : "";

  return (
    <div>
      <SideContentAboutHeader />
      <p>{cleanedDescription}</p>
    </div>
  )
}

