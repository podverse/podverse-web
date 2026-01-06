import styles from '../../styles/components/Settings/SettingsWrapper.module.scss'

type SettingsWrapperProps = {
  children: React.ReactNode
}

export function SettingsWrapper({ children }: SettingsWrapperProps) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}
