
"use client";

import { DTOClip } from "podverse-helpers";
import React from "react";
import { ClipEditContextProvider } from "./ClipEditContext";
import { ClipEditForm } from "./ClipEditForm";
import { ClipEditHeader } from "./ClipEditHeader";
import MainWrapper from "../../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../../components/Main/MainInnerContentWrapper";

type ClipEditClientProps = {
  ssrClip: DTOClip;
}

export function ClipEditClient({ ssrClip }: ClipEditClientProps) {
  return (
    <ClipEditContextProvider ssrClip={ssrClip}>
      <ClipEditHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <ClipEditForm ssrClip={ssrClip} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </ClipEditContextProvider>
  );
}
