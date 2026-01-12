"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";
import { Link } from "../../components/Link/Link";
import { CONTACT_EMAIL_LINKS } from "../../constants/contact";
import { SOCIALS } from "../../constants/socials";
import { Divider } from "../../components/Divider/Divider";
import styles from "../../styles/app/contact/Contact.module.scss";

export default function ContactPage() {
  const tContact = useTranslations("contact");

  return (
    <>
      <MainHeader title={tContact("contact")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <section className={styles.section}>
              <h2>{tContact("email")}</h2>
              <ul>
                <li>
                  <Link href={CONTACT_EMAIL_LINKS.BUG_REPORT} fullPageLoad>
                    {tContact("report_bug")}
                  </Link>
                </li>
                <li>
                  <Link href={CONTACT_EMAIL_LINKS.FEATURE_REQUEST} fullPageLoad>
                    {tContact("feature_request")}
                  </Link>
                </li>
                <li>
                  <Link href={CONTACT_EMAIL_LINKS.PODCAST_REQUEST} fullPageLoad>
                    {tContact("podcast_request")}
                  </Link>
                </li>
                <li>
                  <Link href={CONTACT_EMAIL_LINKS.CONTENT_ISSUE} fullPageLoad>
                    {tContact("report_content_issue")}
                  </Link>
                </li>
                <li>
                  <Link href={CONTACT_EMAIL_LINKS.GENERAL} fullPageLoad>
                    {tContact("general")}
                  </Link>
                </li>
              </ul>
            </section>
            <Divider className={styles.divider} />
            <section className={styles.section}>
              <h2>{tContact("live_chat")}</h2>
              <ul>
                <li>
                  <Link
                    href={SOCIALS.MATRIX}
                    fullPageLoad
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tContact("join_matrix_space")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={SOCIALS.DISCORD}
                    fullPageLoad
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tContact("chat_discord")}
                  </Link>
                </li>
              </ul>
            </section>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}
