"use client";

import Link from "next/link";
import { SiMatrix } from "react-icons/si";
import styles from "../../styles/components/Footer/Footer.module.scss";
import FooterBrand from "./FooterBrand";
import FooterCopyright from "./FooterCopyright";
import { ROUTES } from "../../constants/routes";
import { FaDiscord, FaGithub, FaMastodon, FaXTwitter } from "react-icons/fa6";
import { SOCIALS } from "../../constants/socials";
import { useTranslations } from "next-intl";

export const Footer: React.FC = () => {
  const tMisc = useTranslations("misc");
  const tInfo = useTranslations("info");
  const tMembership = useTranslations("membership");
  const tFeatures = useTranslations("features");
  const tSocials = useTranslations("socials");

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <FooterBrand />
        <FooterCopyright />
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerLinks}>
          <Link href={ROUTES.CONTACT}>{tMisc("contact")}</Link>
          <Link href={ROUTES.ABOUT}>{tInfo("about")}</Link>
          <Link href={ROUTES.TERMS}>{tMisc("terms")}</Link>
          <Link href={ROUTES.MEMBERSHIP}>{tMembership("premium")}</Link>
          <Link href={ROUTES.MOBILE_APP}>{tMisc("mobile")}</Link>
          <Link href={ROUTES.EMBED}>{tFeatures("embed")}</Link>
          <Link href={ROUTES.DONATE}>{tMisc("donate")}</Link>
          <Link href={ROUTES.UPDATES}>{tMisc("updates")}</Link>
        </div>
        <div className={styles.footerSocialLinks}>
          <Link href={SOCIALS.DISCORD} target="_blank" rel="noopener noreferrer" aria-label={tSocials("discord")}>
            <FaDiscord />
          </Link>
          <Link href={SOCIALS.ACTIVITY_PUB} target="_blank" rel="noopener noreferrer" aria-label={tSocials("mastodon")}>
            <FaMastodon />
          </Link>
          <Link href={SOCIALS.X} target="_blank" rel="noopener noreferrer" aria-label={tSocials("x")}>
            <FaXTwitter />
          </Link>
          <Link href={SOCIALS.MATRIX} target="_blank" rel="noopener noreferrer" aria-label={tSocials("matrix")}>
            <SiMatrix />
          </Link>
          <Link href={SOCIALS.GITHUB} target="_blank" rel="noopener noreferrer" aria-label={tSocials("github")}>
            <FaGithub />
          </Link>
        </div>
      </div>
    </footer>
  )
}
