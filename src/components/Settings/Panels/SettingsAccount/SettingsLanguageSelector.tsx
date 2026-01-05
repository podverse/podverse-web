"use client"

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { writeCookie } from '../../../../utils/cookie'
import { FormDropdown } from '../../../Form/FormDropdown'
import type { DropdownMenuItem } from '../../../Dropdown/Dropdown'

export const SettingsLanguageSelector: React.FC = () => {
  const tLanguage = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();

  const languages: Array<{ value: string; label: string }> = [
    { value: 'en', label: tLanguage('languages.en') },
    { value: 'es', label: tLanguage('languages.es') },
    { value: 'fr', label: tLanguage('languages.fr') },
    { value: 'el-GR', label: tLanguage('languages.el-GR') },
  ];

  const menuItems: DropdownMenuItem[] = languages.map((l) => ({
    label: l.label,
    param: l.value,
    value: l.value,
  }));

  const handleChange = async (value: string) => {
    if (!value || value === locale) return;

    // Persist the chosen locale in a cookie so server can pick it up on next render.
    // Use cookie name NEXT_LOCALE which is commonly used; if you prefer a different
    // cookie name adjust server-side detection accordingly.
    try {
      writeCookie('NEXT_LOCALE', value);
    } catch (err) {
      // swallow
    }

    try {
      router.refresh();
    } catch (err) {
      window.location.reload();
    }
  };

  return (
    <FormDropdown
      eyebrow={tLanguage('select_language')}
      menuItems={menuItems}
      value={locale}
      onChange={handleChange}
    />
  );
};
