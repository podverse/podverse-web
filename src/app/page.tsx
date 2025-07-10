import React from "react";
import TestComponent from "../components/TestComponent/TestComponent";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('HomePage');

  return (
    <div>
      <h1>{(await t)("title")}</h1>
      <p>helloooo</p>
      <TestComponent />
    </div>
  );
}