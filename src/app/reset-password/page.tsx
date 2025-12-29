import React from "react";
import { z } from "zod";
import { ResetPasswordClient } from "./ResetPasswordClient";

const searchParamsSchema = z.object({
  token: z.string().optional()
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PodcastsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ResetPasswordPage({ searchParams }: PodcastsPageProps) {
  const queryParams = searchParams ? await searchParams : {};
  const { token } = await parseSearchParams(queryParams);

  return (
    <ResetPasswordClient token={token} />
  );
}

async function parseSearchParams(queryParams: SearchParams) {
  const parsed = searchParamsSchema.safeParse(queryParams);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;

  return data;
}
