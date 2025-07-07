'use client'

import { useEffect, useState } from 'react'

type Props = {
  initialTheme: 'light' | 'dark'
}

export default function ThemeToggle({ initialTheme }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.cookie = `theme=${theme}; path=/; max-age=31536000`
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}