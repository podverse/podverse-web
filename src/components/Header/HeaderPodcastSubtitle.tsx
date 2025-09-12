"use client";

import { DTOChannel } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Header/HeaderPodcastSubtitle.module.scss";
import { useTranslations } from "next-intl";
import Link from "../Link/Link";

type HeaderPodcastSubtitleProps = {
  channel: DTOChannel;
  categoryPath: 'podcasts';
};

const HeaderPodcastSubtitle: React.FC<HeaderPodcastSubtitleProps> = ({ channel, categoryPath }) => {
  const tCategories = useTranslations("categories");

  const channel_about = channel.channel_about;
  const author = channel_about?.author;
  const authorNode = (
    <span>{author}</span>
  )
  
  const channel_categories = channel.channel_categories;
  const categoryNodes = channel_categories?.map((category, index) => (
    <span key={index}>
      <Link
        key={category.id}
        href={`/${categoryPath}?category=${category.category.mapping_key}`}
        color="secondary"
        style={{ fontSize: 'var(--font-size-md)' }}>
        {tCategories(category.category.mapping_key)}
      </Link>
      {index < (channel_categories.length - 1) && ', '}
    </span>
  ))

  return (
    <div className={styles.subtitle}>
      {authorNode}
      {author && categoryNodes && ' • '}
      {categoryNodes}
    </div>
  )
};

export default HeaderPodcastSubtitle;
