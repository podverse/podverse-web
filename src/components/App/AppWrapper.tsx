import styles from "../../styles/components/App/AppWrapper.module.scss";

type AppWrapperProps = {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className={styles.appWrapper}>
      {children}
    </div>
  )
}
