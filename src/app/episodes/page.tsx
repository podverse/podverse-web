import React from "react";
import { getTranslations } from "next-intl/server";

export default async function Episodes() {
  const t = await getTranslations('Episodes_Page');

  return (
    <div>
      <h1>{(await t)("title")}</h1>
      <p>episodes</p>
    </div>
  );
}