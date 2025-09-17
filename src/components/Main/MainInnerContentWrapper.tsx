import styles from "../../styles/components/Main/MainInnerContentWrapper.module.scss"

type MainInnerContentWrapperProps = {
  children: React.ReactNode;
};

export const MainInnerContentWrapper = ({ children }: MainInnerContentWrapperProps) => {
  return (
    <div className={styles.mainInnerContentWrapper}>
      {children}
    </div>
  )
}
