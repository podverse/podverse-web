"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AccountMembershipEnum } from "podverse-helpers";
import { useAccount } from "../../contexts/Account";
import { getParsedLocalSettings, handleLocalSettingsUpdate } from "../../utils/localSettings/localSettings";
import { ROUTES } from "../../constants/routes";
import { showToastCustom } from "./Toast";

export function MembershipExpirationToast() {
  const { loggedInAccount } = useAccount();
  const t = useTranslations("membership");
  const router = useRouter();
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loggedInAccount) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    const accountMembershipStatus = loggedInAccount?.account_membership_status;
    if (!accountMembershipStatus) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    const membershipExpiresAt = accountMembershipStatus.membership_expires_at;
    if (!membershipExpiresAt) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    const membershipId = accountMembershipStatus.account_membership_id;
    const isFreeTrial = membershipId === AccountMembershipEnum.Trial;
    const autoRenew = accountMembershipStatus.auto_renew || false;

    const expirationDate = new Date(membershipExpiresAt);
    const now = new Date();
    const isExpired = expirationDate.getTime() < now.getTime();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysUntilExpiration <= 14 && daysUntilExpiration > 0;

    const localSettings = getParsedLocalSettings();
    const dismissedTimestamp = localSettings.metd;
    
    // Check if warning toast was dismissed within the past 24 hours
    let wasDismissedWithin24Hours = false;
    if (dismissedTimestamp) {
      try {
        const dismissedDate = new Date(dismissedTimestamp);
        const hoursSinceDismissal = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);
        wasDismissedWithin24Hours = hoursSinceDismissal < 24 && hoursSinceDismissal >= 0;
      } catch (err) {
        // If timestamp is invalid, treat as not dismissed
        wasDismissedWithin24Hours = false;
      }
    }

    const membershipType = isFreeTrial ? t("free_trial") : t("premium_membership");
    const expirationDateFormatted = expirationDate.toLocaleDateString();

    // Handler for danger toast: just dismisses, doesn't store timestamp (so it always shows on next load)
    const handleDismissDanger = () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };

    // Handler for warning toast: dismisses and stores timestamp to prevent showing for 24 hours
    const handleDismissWarning = () => {
      const settings = getParsedLocalSettings();
      // Store full ISO timestamp for 24-hour check
      handleLocalSettingsUpdate({
        ...settings,
        metd: now.toISOString()
      });
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };

    const handleLinkClickDanger = () => {
      handleDismissDanger();
      router.push(ROUTES.MEMBERSHIP);
    };

    const handleLinkClickWarning = () => {
      handleDismissWarning();
      router.push(ROUTES.MEMBERSHIP);
    };

    // Danger toast: Always show if expired (ignores dismissed timestamp, always shows on window load)
    if (isExpired) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const expiredMessage = t("membership_expired_danger", { type: membershipType });
      const linkText = t("membership_link_text");
      
      toastIdRef.current = showToastCustom({
        message: expiredMessage,
        linkText,
        linkHref: ROUTES.MEMBERSHIP,
        onLinkClick: handleLinkClickDanger,
        onDismiss: handleDismissDanger
      }, "danger");
      return;
    }

    // Warning toast: Show if expiring soon, not auto-renew, and not dismissed within past 24 hours
    if (isExpiringSoon && !autoRenew && !wasDismissedWithin24Hours) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const warningMessage = t("membership_expiring_warning", { type: membershipType, date: expirationDateFormatted });
      const linkText = t("membership_link_text");
      
      toastIdRef.current = showToastCustom({
        message: warningMessage,
        linkText,
        linkHref: ROUTES.MEMBERSHIP,
        onLinkClick: handleLinkClickWarning,
        onDismiss: handleDismissWarning
      }, "warning");
      return;
    }

    // If not showing toast, dismiss any existing one
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [loggedInAccount, t, router]);

  return null;
}
