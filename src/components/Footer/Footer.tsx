import Link from "next/link";
import styles from "../../styles/components/Footer/Footer.module.scss";
import FooterBrand from "./FooterBrand";
import FooterCopyright from "./FooterCopyright";
import { ROUTES } from "../../constants/routes";
import { FaDiscord, FaGithub, FaMastodon, FaXTwitter } from "react-icons/fa6";
import { SiMatrix } from "react-icons/si";
import { SOCIALS } from "../../constants/socials";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <FooterBrand />
      <FooterCopyright />
    </div>
    <div className={styles.footerBottom}>
      <div className={styles.footerLinks}>
        <Link href={ROUTES.CONTACT}>Contact</Link>
        <Link href={ROUTES.ABOUT}>About</Link>
        <Link href={ROUTES.TERMS}>Terms</Link>
        <Link href={ROUTES.MEMBERSHIP}>Premium</Link>
        <Link href={ROUTES.MOBILE_APP}>Mobile</Link>
        <Link href={ROUTES.EMBED}>Embed</Link>
        <Link href={ROUTES.DONATE}>Donate</Link>
      </div>
      <div className={styles.footerSocialLinks}>
        <Link href={SOCIALS.DISCORD} target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <FaDiscord />
        </Link>
        <Link href={SOCIALS.ACTIVITY_PUB} target="_blank" rel="noopener noreferrer" aria-label="Mastodon">
          <FaMastodon />
        </Link>
        <Link href={SOCIALS.X} target="_blank" rel="noopener noreferrer" aria-label="X">
          <FaXTwitter />
        </Link>
        <Link href={SOCIALS.MATRIX} target="_blank" rel="noopener noreferrer" aria-label="Matrix">
          <SiMatrix />
        </Link>
        <Link href={SOCIALS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;