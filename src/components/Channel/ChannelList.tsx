"use client";

import React, { useRef } from "react";
import ChannelListItem from "./ChannelListItem";
import Pagination from "../Pagination/Pagination";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { DTOChannel } from "podverse-helpers";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channels: DTOChannel[];
  totalPages: number;
};

const ChannelList: React.FC<Props> = ({ page = 1, setPage, channels, totalPages }) => {
  const topRef = useRef<HTMLDivElement>(null);

  useSkipInitialEffect(() => {
    topRef?.current?.scrollIntoView();
  }, [channels]);

  return (
    <>
      <div ref={topRef} />
      <Pagination
        currentPage={page}
        maxButtons={5}
        totalPages={totalPages}
        onPageChange={setPage}>
        {channels.map((channel) => (
          <ChannelListItem key={channel.id} channel={channel} />
        ))}
      </Pagination>
    </>
  );
};

export default ChannelList;