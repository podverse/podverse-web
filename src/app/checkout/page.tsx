import React from "react";
import { getSSRApiRequestService } from "../../factories/apiRequestService";
import { config } from "../../config";
import { CheckoutClient } from "./CheckoutClient";

type MembershipPricingData = {
  costMonthly: number;
  costAnnually: number;
  freeTrialDurationSeconds: number;
  freeTrialDurationDays: number;
  annuallySavingsPercent: number;
  monthlyEquivalentAnnually: number;
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const ssrApiRequestService = getSSRApiRequestService();
  const signupMode = config.public.account.signupMode;
  const isContactOnlyMode = signupMode === "contact-only";

  let pricingData: MembershipPricingData | null = null;
  if (!isContactOnlyMode) {
    try {
      const response = await ssrApiRequestService.reqMembershipGetPricing();
      if ("data" in response && response.data) {
        pricingData = response.data;
      }
    } catch (error) {
      // Handle error - pricing data is optional
    }
  }

  return <CheckoutClient pricingData={pricingData} isContactOnlyMode={isContactOnlyMode} />;
}
