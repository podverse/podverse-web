"use client"

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { writeCookie } from '../../../../utils/cookie'
import { FormDropdown } from '../../../Form/FormDropdown'
import type { DropdownMenuItem } from '../../../Dropdown/Dropdown'
import { useAccount } from '../../../../contexts/Account'
import { apiRequestService } from '../../../../factories/apiRequestService'
import { config } from '../../../../config'

export const SettingsLocaleSelector: React.FC = () => {
  const tLanguage = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const { loggedInAccount, setLoggedInAccount } = useAccount();

  // Get supported locales from config
  const supportedLocalesConfig = config.public.features.locales.supported;
  const allLanguages = [
    { value: 'en', label: tLanguage('languages.en') },
    { value: 'es', label: tLanguage('languages.es') },
    { value: 'fr', label: tLanguage('languages.fr') },
    { value: 'el-GR', label: tLanguage('languages.el-GR') },
  ];

  // Filter to only supported locales
  let languages = allLanguages;
  if (supportedLocalesConfig !== 'all-available') {
    const supportedLocales = supportedLocalesConfig.split(',').map(l => l.trim()).filter(Boolean);
    languages = allLanguages.filter(l => supportedLocales.includes(l.value));
  }

  const menuItems: DropdownMenuItem[] = languages.map((l) => ({
    label: l.label,
    param: l.value,
    value: l.value,
  }));

  const handleChange = async (value: string) => {
    if (!value || value === locale) return;

    // Persist the chosen locale in a cookie
    try {
      writeCookie('NEXT_LOCALE', value);
    } catch (err) {
      // swallow
    }

    // If user is logged in, update account settings locale
    if (loggedInAccount) {
      try {
        const updatedAccount = await apiRequestService.reqAccountSettingsLocaleUpdate({ locale: value });
        setLoggedInAccount(updatedAccount);
      } catch (err) {
        console.error('Failed to update account locale:', err);
        // Continue with refresh even if API call fails
      }
    }

    try {
      router.refresh();
    } catch (err) {
      window.location.reload();
    }
  };

  return (
    <FormDropdown
      label={tLanguage('language')}
      id="settings_language_selector"
      menuItems={menuItems}
      value={locale}
      onChange={handleChange}
    />
  );
};
