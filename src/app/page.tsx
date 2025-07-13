import React from "react";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('_sample');

  return (
    <div>
      hello home
    </div>
  );
}