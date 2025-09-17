import styles from "../../styles/components/Main/MainInnerWrapper.module.scss"

type MainInnerWrapperProps = {
  children: React.ReactNode;
};

export const MainInnerWrapper = ({ children }: MainInnerWrapperProps) => {
  return (
    <div className={styles.mainInnerWrapper}>
      {children}
    </div>
  )
}
