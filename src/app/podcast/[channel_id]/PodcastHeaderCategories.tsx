"use client";

import { useTranslations } from "next-intl";
import { DTOChannelCategory } from "podverse-helpers"
import Link from "../../../components/Link/Link";

type PodcastHeaderCategoriesProps = {
  channel_categories?: DTOChannelCategory[];
}

export const PodcastHeaderCategories: React.FC<PodcastHeaderCategoriesProps> = ({ channel_categories }) => {
  const tCategories = useTranslations("categories");

  return channel_categories?.map((channel_category, index) => (
    <span key={index}>
      <Link
        key={channel_category.id}
        href={`/podcasts?category=${channel_category.category.mapping_key}`}
        color="secondary"
        style={{ fontSize: 'var(--font-size-md)' }}>
        {tCategories(channel_category.category.mapping_key)}
      </Link>
      {index < (channel_categories.length - 1) && ', '}
    </span>
  ))
}