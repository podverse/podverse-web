
"use client";

import React from "react";
import { PlaylistCreateContextProvider } from "./PlaylistCreateContext";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PlaylistCreateHeader } from "./PlaylistCreateHeader";
import { PlaylistCreateForm } from "./PlaylistCreateForm";

export function PlaylistCreateClient() {
  return (
    <PlaylistCreateContextProvider>
      <PlaylistCreateHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <PlaylistCreateForm />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PlaylistCreateContextProvider>
  );
}
