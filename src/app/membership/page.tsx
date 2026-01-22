import React from "react";
import { AccountMembershipEnum, calculateTimeRemaining, DTOAccount } from "podverse-helpers";
import { getTranslations } from "next-intl/server";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";
import { FeatureComparison } from "../../components/FeatureComparison/FeatureComparison";
import { MembershipCTA } from "./MembershipCTA";
import { getSSRLoggedInAccount } from "../../utils/auth/ssrAuth";
import { getSSRApiRequestService } from "../../factories/apiRequestService";
import { config } from "../../config";
import { FEATURES } from "../../constants/features";
import styles from "../../styles/app/membership/Membership.module.scss";

type MembershipPricingData = {
  costMonthly: number;
  costAnnually: number;
  freeTrialDurationSeconds: number;
  freeTrialDurationDays: number;
  annuallySavingsPercent: number;
  monthlyEquivalentAnnually: number;
};

type RenderIntroTextParams = {
  t: (key: string, values?: any) => string;
  isContactOnlyMode: boolean;
  contactEmail?: string;
  ssrLoggedInAccount: DTOAccount | null;
  isMembershipExpired: boolean;
  isFreeTrial: boolean;
  minutesLeft: number | null;
  hoursLeft: number | null;
  daysLeft: number | null;
  isPaidPremium: boolean;
  membershipExpiresAt: Date | string | null | undefined;
  pricingData: MembershipPricingData | null;
  contactLinkClassName: string;
};

export default async function MembershipPage() {
  const t = await getTranslations("membership");
  const ssrLoggedInAccount = await getSSRLoggedInAccount();
  const ssrApiRequestService = getSSRApiRequestService();
  const signupMode = config.public.account.signupMode;
  const contactEmail = config.public.account.contactEmail;
  const isContactOnlyMode = signupMode === 'contact-only';
  
  let pricingData: MembershipPricingData | null = null;
  let errorMessage: string | null = null;
  if (!isContactOnlyMode) {
    try {
      const response = await ssrApiRequestService.reqMembershipGetPricing();
      if ('data' in response && response.data) {
        pricingData = response.data;
      } else if ('message' in response && response.message) {
        errorMessage = response.message;
      }
    } catch (error) {
      // Handle error - pricing data is optional
    }
  }

  // Determine user status
  const accountMembershipStatus = ssrLoggedInAccount?.account_membership_status;
  // Handle both DTO structure (account_membership_id) and populated structure (account_membership.id)
  const membershipId = accountMembershipStatus?.account_membership_id ?? 
    (accountMembershipStatus as any)?.account_membership?.id;
  const isFreeTrial = membershipId === AccountMembershipEnum.Trial;
  const isPaidPremium = membershipId === AccountMembershipEnum.Basic;
  const membershipExpiresAt = accountMembershipStatus?.membership_expires_at;
  
  // Check if membership has expired
  const isMembershipExpired = membershipExpiresAt 
    ? new Date(membershipExpiresAt).getTime() < new Date().getTime()
    : false;

  // Calculate time left in membership if active
  const { daysLeft, hoursLeft, minutesLeft } = 
    membershipExpiresAt && !isMembershipExpired
      ? calculateTimeRemaining(membershipExpiresAt)
      : { daysLeft: null, hoursLeft: null, minutesLeft: null };

  return (
    <>
      <MainHeader title={t("membership")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            {!isContactOnlyMode && errorMessage && (
              <section className={styles.errorSection}>
                <p>{errorMessage}</p>
              </section>
            )}

            <section className={styles.intro}>
              <p>
                {renderIntroText({
                  t,
                  isContactOnlyMode,
                  contactEmail,
                  ssrLoggedInAccount,
                  isMembershipExpired,
                  isFreeTrial,
                  minutesLeft,
                  hoursLeft,
                  daysLeft,
                  isPaidPremium,
                  membershipExpiresAt,
                  pricingData,
                  contactLinkClassName: styles.contactLink
                })}
              </p>
            </section>

            {!isContactOnlyMode && pricingData && (
              <section className={styles.pricingSection}>
                  <div className={styles.pricingPlan}>
                    <h3 className={styles.planTitle}>{t("pricing_monthly")}</h3>
                    <div className={styles.planPrice}>
                      ${pricingData.costMonthly}
                      <span className={styles.planPeriod}>{t("pricing_per_month")}</span>
                    </div>
                  </div>
                  <div className={styles.pricingPlan}>
                    <h3 className={styles.planTitle}>{t("pricing_annually")}</h3>
                    <div className={styles.planPriceContainer}>
                      <div className={styles.planPrice}>
                        ${pricingData.costAnnually}
                        <span className={styles.planPeriod}>{t("pricing_per_year")}</span>
                      </div>
                      {pricingData.annuallySavingsPercent > 0 && (
                        <div className={styles.savingsBadge}>
                          {t("pricing_save_percent", { percent: pricingData.annuallySavingsPercent })}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
            )}

            {!isContactOnlyMode && (
              <MembershipCTA
                ssrLoggedInAccount={!!ssrLoggedInAccount}
                isMembershipExpired={isMembershipExpired}
                isFreeTrial={isFreeTrial}
                isPaidPremium={isPaidPremium}
                membershipExpiresAt={membershipExpiresAt}
              />
            )}

            <section>
              <h2 className={styles.comparisonTitle}>{t("features")}</h2>
              <FeatureComparison features={FEATURES} />
            </section>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}

function renderIntroText({
  t,
  isContactOnlyMode,
  contactEmail,
  ssrLoggedInAccount,
  isMembershipExpired,
  isFreeTrial,
  minutesLeft,
  hoursLeft,
  daysLeft,
  isPaidPremium,
  membershipExpiresAt,
  pricingData,
  contactLinkClassName
}: RenderIntroTextParams): string | React.ReactElement {
  if (isContactOnlyMode && contactEmail) {
    return (
      <>
        {t("contact_mode_text_before")}{" "}
        <a href={`mailto:${contactEmail}`} className={contactLinkClassName}>
          {contactEmail}
        </a>
      </>
    );
  }

  if (!ssrLoggedInAccount) {
    return t("cta_sign_up_text");
  }

  if (isMembershipExpired) {
    return (
      <>
        {isFreeTrial ? t("trial_expired_text_line1") : t("membership_expired_text_line1")}
        <br />
        {isFreeTrial ? t("trial_expired_text_line2") : t("membership_expired_text_line2")}
      </>
    );
  }

  if (minutesLeft !== null) {
    if (isFreeTrial) {
      const key = minutesLeft === 1 ? "intro_trial_minutes_left_one" : "intro_trial_minutes_left_other";
      return t(key, { minutes: minutesLeft });
    } else {
      const key = minutesLeft === 1 ? "intro_membership_minutes_left_one" : "intro_membership_minutes_left_other";
      return t(key, { minutes: minutesLeft });
    }
  }

  if (hoursLeft !== null) {
    if (isFreeTrial) {
      const key = hoursLeft === 1 ? "intro_trial_hours_left_one" : "intro_trial_hours_left_other";
      return t(key, { hours: hoursLeft });
    } else {
      const key = hoursLeft === 1 ? "intro_membership_hours_left_one" : "intro_membership_hours_left_other";
      return t(key, { hours: hoursLeft });
    }
  }

  if (daysLeft !== null) {
    if (isFreeTrial) {
      const key = daysLeft === 1 ? "intro_trial_days_left_one" : "intro_trial_days_left_other";
      return t(key, { days: daysLeft });
    } else {
      const key = daysLeft === 1 ? "intro_membership_days_left_one" : "intro_membership_days_left_other";
      return t(key, { days: daysLeft });
    }
  }

  if (isFreeTrial) {
    return t("cta_upgrade_text");
  }

  if (isPaidPremium && membershipExpiresAt) {
    return t("your_membership_expires_on", { date: new Date(membershipExpiresAt).toLocaleDateString() });
  }

  if (pricingData) {
    return t("intro_try_premium", { days: pricingData.freeTrialDurationDays });
  }

  return "";
}
