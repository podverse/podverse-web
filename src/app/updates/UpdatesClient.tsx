import React from "react";
import ReactMarkdown from "react-markdown";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";

type UpdatesClientProps = {
  markdownContent: string;
};

export function UpdatesClient({ markdownContent }: UpdatesClientProps) {
  return (
    <MainWrapper>
      <MainInnerWrapper>
        <SideContent />
        <MainInnerContentWrapper>
          <div className="markdown">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}
