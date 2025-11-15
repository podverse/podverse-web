import { notFound } from "next/navigation";
import { z } from "zod";
import { getSSRAuthService } from "../../../../utils/auth/ssrAuth";
import { ClipEditClient } from "./ClipEditClient";

const searchParamsSchema = z.object({
  ers: z.string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !Number.isNaN(v) && v >= 0, { message: "ers must be integer >= 0" })
    .optional(),
  ets: z.enum(["default", "audio", "video"]).optional(),
});

type ClipEditPageProps = {
  params: Promise<{ clip_id: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

type ParsedClipEditParams = {
  ssrEnclosureTypeSelected: 'default' | 'audio' | 'video';
  ssrEnclosureRowSelected: number;
};

export default async function ClipEditPage({ params, searchParams }: ClipEditPageProps) {
  const { clip_id } = await params;
  const qp = searchParams ? await searchParams : {};
  const { ssrEnclosureRowSelected, ssrEnclosureTypeSelected } = parseSearchParams(qp);
  const { apiRequestService } = await getSSRAuthService();

  let ssrClip;
  try {
    ssrClip = await apiRequestService.reqClipGet(clip_id);
    if (!ssrClip) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

  return (
    <ClipEditClient
      ssrClip={ssrClip}
      ssrEnclosureTypeSelected={ssrEnclosureTypeSelected}
      ssrEnclosureRowSelected={ssrEnclosureRowSelected}
    />
  );
}

function parseSearchParams(raw: Record<string, string | string[] | undefined>): ParsedClipEditParams {
  const normalized: Record<string, string | undefined> = {};
  Object.entries(raw).forEach(([k, v]) => {
    if (Array.isArray(v)) normalized[k] = v[0]; else normalized[k] = v;
  });
  const result = searchParamsSchema.safeParse(normalized);
  let ssrEnclosureTypeSelected: 'default' | 'audio' | 'video' = 'default';
  let ssrEnclosureRowSelected: number = 0;
  if (result.success) {
    const { ets, ers } = result.data;
    if (typeof ets === 'string' && ["default", "audio", "video"].includes(ets)) {
      ssrEnclosureTypeSelected = ets as 'default' | 'audio' | 'video';
    }
    if (typeof ers === 'number' && !Number.isNaN(ers) && ers >= 0) {
      ssrEnclosureRowSelected = ers;
    }
  }
  return { ssrEnclosureTypeSelected, ssrEnclosureRowSelected };
}
