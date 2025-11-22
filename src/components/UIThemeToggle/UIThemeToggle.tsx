'use client';

import { useLocalSettings } from '../../contexts/LocalSettings'
import { UITheme } from '../../utils/uiTheme'
import styles from '../../styles/components/SideBar/SideBarLink.module.scss'
import { useTranslations } from 'next-intl';

const UI_THEMES: UITheme[] = ['dark', 'light'];

export function UIThemeToggle() {
  const { uiTheme, setUITheme } = useLocalSettings();
  const tSettings = useTranslations('settings');

  const nextUITheme = () => {
    const idx = UI_THEMES.indexOf(uiTheme);
    return UI_THEMES[(idx + 1) % UI_THEMES.length] || 'dark'
  }

  const toggleUITheme = () => setUITheme(nextUITheme());

  return (
    <button
      onClick={toggleUITheme}
      aria-label={tSettings('ui_theme.select_ui_theme')}
      className={styles.link}
    >
      {
        uiTheme === 'dark'
          ? tSettings('ui_theme.dark')
          : uiTheme === 'light'
            ? tSettings('ui_theme.light')
            : uiTheme
      }
    </button>
  )
}