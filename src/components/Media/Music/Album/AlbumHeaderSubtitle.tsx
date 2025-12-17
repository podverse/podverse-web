import { DTOChannel } from "podverse-helpers";
import React from "react";

type AlbumHeaderSubtitleProps = {
  channel: DTOChannel;
};

export const AlbumHeaderSubtitle: React.FC<AlbumHeaderSubtitleProps> = ({ channel }) => {
  const channel_about = channel.channel_about;
  const author = channel_about?.author;
  
  return (
    <div>
      <span>{author}</span>
    </div>
  )
};
