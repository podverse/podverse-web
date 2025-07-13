import Footer from "../Footer/Footer";
import styles from "../../styles/components/MainWrapper/MainWrapper.module.scss";
import Divider from "../Divider/Divider";

type MainWrapperProps = {
  children: React.ReactNode;
};

const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => (
  <div className={styles.mainOuterWrapper}>
    <main className={styles.main}>
      {children}
    </main>
    <Divider />
    <Footer />
  </div>
);

export default MainWrapper;