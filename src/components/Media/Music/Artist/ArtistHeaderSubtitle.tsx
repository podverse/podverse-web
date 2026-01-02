import { DTOChannel } from "podverse-helpers";
import React from "react";

type ArtistHeaderSubtitleProps = {
  channel: DTOChannel;
};

export const ArtistHeaderSubtitle: React.FC<ArtistHeaderSubtitleProps> = ({ channel }) => {
  const channel_about = channel.channel_about;
  const author = channel_about?.author;
  
  return (
    <div>
      <span>{author}</span>
    </div>
  )
};
