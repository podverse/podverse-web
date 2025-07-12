import React from "react";
import { getTranslations } from "next-intl/server";

export default async function Podcasts() {
  const t = await getTranslations('_sample');

  return (
    <div>
      <h1>{(await t)("hello_world")}</h1>
    </div>
  );
}