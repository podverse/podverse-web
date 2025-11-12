import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../../utils/auth/ssrAuth";
import { ClipEditClient } from "./ClipEditClient";
import { z } from "zod";

type ClipEditPageProps = {
  params: Promise<{ clip_id: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

const searchParamsSchema = z.object({
  ers: z.string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !Number.isNaN(v) && v >= 0, { message: "ers must be integer >= 0" })
    .optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export default async function ClipEditPage({ params, searchParams }: ClipEditPageProps) {
  const { clip_id } = await params;
  const qp = searchParams ? await searchParams : {};
  const { ers } = parseSearchParams(qp);
  const ssrEnclosureRowSelected = typeof ers === 'number' ? ers : 0;
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
    <ClipEditClient ssrClip={ssrClip} ssrEnclosureRowSelected={ssrEnclosureRowSelected} />
  );
}

function parseSearchParams(raw: Record<string, string | string[] | undefined>): SearchParams {
  const normalized: Record<string, string | undefined> = {};
  Object.entries(raw).forEach(([k, v]) => {
    if (Array.isArray(v)) normalized[k] = v[0]; else normalized[k] = v;
  });
  const result = searchParamsSchema.safeParse(normalized);
  return result.success ? result.data : {};
}
