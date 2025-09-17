import styles from "../../styles/components/SideContent/SideContent.module.scss";

type SideContentProps = {
  children: React.ReactNode;
}

export const SideContent = ({ children }: SideContentProps) => {
  return (
    <aside className={styles.sideContent}>
      {children}
    </aside>
  )
}
