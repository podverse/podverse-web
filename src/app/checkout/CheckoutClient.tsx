"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";
import { RadioButton } from "../../components/Form/RadioButton";
import { Checkbox } from "../../components/Form/Checkbox";
import { Button } from "../../components/Button/Button";
import styles from "../../styles/app/checkout/Checkout.module.scss";

type MembershipPricingData = {
  costMonthly: number;
  costAnnually: number;
  freeTrialDurationSeconds: number;
  freeTrialDurationDays: number;
  annuallySavingsPercent: number;
  monthlyEquivalentAnnually: number;
};

type CheckoutClientProps = {
  pricingData: MembershipPricingData | null;
  isContactOnlyMode: boolean;
};

export function CheckoutClient({ pricingData, isContactOnlyMode }: CheckoutClientProps) {
  const t = useTranslations("checkout");
  const tMembership = useTranslations("membership");

  const [paymentPlan, setPaymentPlan] = useState<string>("monthly");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [paymentProcessor, setPaymentProcessor] = useState<string>("stripe");

  const handleCompletePurchase = () => {
    const autoRenewText = autoRenew ? "yes" : "no";
    alert(
      `Payment Plan: ${paymentPlan}, Auto-renew: ${autoRenewText}, Processor: ${paymentProcessor}`
    );
  };

  const paymentPlanOptions = [
    { label: tMembership("pricing_monthly"), value: "monthly" },
    { label: tMembership("pricing_annually"), value: "annual" },
  ];

  const paymentProcessorOptions = [
    { label: t("paypal"), value: "paypal" },
    { label: t("stripe"), value: "stripe" },
  ];

  return (
    <>
      <MainHeader title={t("checkout")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            {isContactOnlyMode && (
              <section className={styles.disabledSection}>
                <p>{t("disabled_message")}</p>
              </section>
            )}
            {!isContactOnlyMode && pricingData && (
              <section className={styles.pricingSection}>
                <div className={styles.pricingPlan}>
                  <h3 className={styles.planTitle}>
                    {tMembership("pricing_monthly")}
                  </h3>
                  <div className={styles.planPrice}>
                    ${pricingData.costMonthly}
                    <span className={styles.planPeriod}>
                      {tMembership("pricing_per_month")}
                    </span>
                  </div>
                </div>
                <div className={styles.pricingPlan}>
                  <h3 className={styles.planTitle}>
                    {tMembership("pricing_annually")}
                  </h3>
                  <div className={styles.planPriceContainer}>
                    <div className={styles.planPrice}>
                      ${pricingData.costAnnually}
                      <span className={styles.planPeriod}>
                        {tMembership("pricing_per_year")}
                      </span>
                    </div>
                    {pricingData.annuallySavingsPercent > 0 && (
                      <div className={styles.savingsBadge}>
                        {tMembership("pricing_save_percent", {
                          percent: pricingData.annuallySavingsPercent,
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {!isContactOnlyMode && (
              <>
                <section className={styles.formSection}>
                  <RadioButton
                    name="payment-plan"
                    eyebrow={t("payment_plan")}
                    options={paymentPlanOptions}
                    selectedValue={paymentPlan}
                    onChange={setPaymentPlan}
                  />

                  <Checkbox
                    id="auto-renew"
                    name="auto-renew"
                    label={t("auto_renew")}
                    checked={autoRenew}
                    onChange={setAutoRenew}
                  />

                  <RadioButton
                    name="payment-processor"
                    eyebrow={t("payment_processor")}
                    options={paymentProcessorOptions}
                    selectedValue={paymentProcessor}
                    onChange={setPaymentProcessor}
                  />
                </section>

                <section className={styles.buttonSection}>
                  <Button onClick={handleCompletePurchase} variant="primary">
                    {t("complete_purchase")}
                  </Button>
                </section>
              </>
            )}
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}
