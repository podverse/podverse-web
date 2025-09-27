"use client";

import DOMPurify from 'isomorphic-dompurify';
import React from 'react';
import styles from './SafeHtmlDescription.module.scss';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'a',
  'b', 'strong', 'i', 'em', 'u',
  'ul', 'ol', 'li',
  'br'
];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

export function isHtmlString(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function SafeHtmlDescription({ html }: { html: string }) {
  const cleanHtml = React.useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      RETURN_TRUSTED_TYPE: false,
      FORCE_BODY: true,
    });
  }, [html]);

  return (
    <div
      className={styles.safeHtmlDescription}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

export function DescriptionRenderer({ description }: { description: string }) {
  if (isHtmlString(description)) {
    return <SafeHtmlDescription html={description} />;
  }
  return <p className={styles.safeHtmlDescription}>{description}</p>;
}
