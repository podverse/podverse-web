'use client';

import { useTheme } from '../../contexts/Theme'
import { UITheme } from '../../utils/theme'
import styles from '../../styles/components/SideBar/SideBarLink.module.scss'

const THEMES: UITheme[] = ['dark', 'light'];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const idx = THEMES.indexOf(theme)
    return THEMES[(idx + 1) % THEMES.length] || 'dark'
  }

  const toggleTheme = () => setTheme(nextTheme())

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={styles.link}
    >
      {theme === 'dark' ? '🌙 Dark' : theme === 'light' ? '☀️ Light' : theme}
    </button>
  )
}