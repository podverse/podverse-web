import React from 'react'
import styles from '../../styles/components/Settings/SettingsSection.module.scss'

type SettingsSectionProps = {
  children: React.ReactNode
}

export function SettingsSection({ children }: SettingsSectionProps) {
  return (
    <div className={styles.section}>
      {children}
    </div>
  )
}
