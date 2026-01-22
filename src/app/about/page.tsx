import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";
import { FeatureComparison } from "../../components/FeatureComparison/FeatureComparison";
import { FEATURES } from "../../constants/features";
import { IMAGES } from "../../constants/images";
import styles from "../../styles/app/about/About.module.scss";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <>
      <MainHeader title={t("title")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <section className={styles.intro}>
              <p>{t("intro_text")}</p>
            </section>

            <section className={styles.downloadButtons}>
              <a href="#" className={styles.downloadButton} aria-label={t("download_app_store")}>
                <Image
                  src={IMAGES.MOBILE.APP_STORES.DESKTOP.APP_STORE}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.DESKTOP.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.DESKTOP.HEIGHT}
                  className={styles.downloadButtonImageDesktop}
                  aria-hidden="true"
                />
                <Image
                  src={IMAGES.MOBILE.APP_STORES.MOBILE.APP_STORE}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.MOBILE.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.MOBILE.HEIGHT}
                  className={styles.downloadButtonImageMobile}
                  aria-hidden="true"
                />
              </a>
              <a href="#" className={styles.downloadButton} aria-label={t("download_google_play")}>
                <Image
                  src={IMAGES.MOBILE.APP_STORES.DESKTOP.GOOGLE_PLAY}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.DESKTOP.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.DESKTOP.HEIGHT}
                  className={styles.downloadButtonImageDesktop}
                  aria-hidden="true"
                />
                <Image
                  src={IMAGES.MOBILE.APP_STORES.MOBILE.GOOGLE_PLAY}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.MOBILE.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.MOBILE.HEIGHT}
                  className={styles.downloadButtonImageMobile}
                  aria-hidden="true"
                />
              </a>
              <a href="#" className={styles.downloadButton} aria-label={t("download_f_droid")}>
                <Image
                  src={IMAGES.MOBILE.APP_STORES.DESKTOP.F_DROID}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.DESKTOP.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.DESKTOP.HEIGHT}
                  className={styles.downloadButtonImageDesktop}
                  aria-hidden="true"
                />
                <Image
                  src={IMAGES.MOBILE.APP_STORES.MOBILE.F_DROID}
                  alt=""
                  width={IMAGES.MOBILE.APP_STORES.MOBILE.WIDTH}
                  height={IMAGES.MOBILE.APP_STORES.MOBILE.HEIGHT}
                  className={styles.downloadButtonImageMobile}
                  aria-hidden="true"
                />
              </a>
            </section>

            <section className={styles.licensing}>
              <p>{t("licensing_text")}</p>
            </section>

            <section className={styles.featuresSection}>
              <h2 className={styles.comparisonTitle}>{t("features_title")}</h2>
              <FeatureComparison features={FEATURES} />
            </section>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}
