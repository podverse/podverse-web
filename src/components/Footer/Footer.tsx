import Link from "next/link";
import styles from "../../styles/components/Footer/Footer.module.scss";
import FooterBrand from "./FooterBrand";
import FooterCopyright from "./FooterCopyright";
import { ROUTES } from "../../constants/routes";
import { FaDiscord, FaGithub, FaMastodon, FaXTwitter } from "react-icons/fa6";
import { SiMatrix } from "react-icons/si";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <FooterBrand />
      <FooterCopyright />
    </div>
    <div className={styles.footerBottom}>
      <div className={styles.footerLinks}>
        <div className={styles.footerLinksTop}>
          <Link href={ROUTES.CONTACT}>Contact</Link>
          <Link href={ROUTES.ABOUT}>About</Link>
          <Link href={ROUTES.TERMS}>Terms</Link>
          <Link href={ROUTES.PREMIUM}>Premium</Link>
        </div>
        <div className={styles.footerLinksBottom}>
          <Link href={ROUTES.MOBILE_APP}>Mobile App</Link>
          <Link href={ROUTES.EMBED}>Embed</Link>
          <Link href={ROUTES.DONATE}>Donate</Link>
        </div>
      </div>
      <div className={styles.footerSocialLinks}>
        <Link href={ROUTES.SOCIALS.DISCORD} target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <FaDiscord />
        </Link>
        <Link href={ROUTES.SOCIALS.ACTIVITY_PUB} target="_blank" rel="noopener noreferrer" aria-label="Mastodon">
          <FaMastodon />
        </Link>
        <Link href={ROUTES.SOCIALS.X} target="_blank" rel="noopener noreferrer" aria-label="X">
          <FaXTwitter />
        </Link>
        <Link href={ROUTES.SOCIALS.MATRIX} target="_blank" rel="noopener noreferrer" aria-label="Matrix">
          <SiMatrix />
        </Link>
        <Link href={ROUTES.SOCIALS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;