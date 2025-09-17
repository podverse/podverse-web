import styles from '../../styles/components/Content/ContentMobileAccordions.module.scss';

type MobileAccordionsProps = {
  children: React.ReactNode;
}

export const ContentMobileAccordions = ({ children }: MobileAccordionsProps) => {
  return (
    <div className={styles.mobileAccordions}>
      {children}
    </div>
  );
}
