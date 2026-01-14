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
    const dismissedDate = localSettings.metd;
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const wasDismissedToday = dismissedDate === today;

    const membershipType = isFreeTrial ? t("free_trial") : t("premium_membership");
    const expirationDateFormatted = expirationDate.toLocaleDateString();

    const handleDismiss = () => {
      const settings = getParsedLocalSettings();
      handleLocalSettingsUpdate({
        ...settings,
        metd: today
      });
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };

    const handleLinkClick = () => {
      handleDismiss();
      router.push(ROUTES.MEMBERSHIP);
    };

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
        onLinkClick: handleLinkClick,
        onDismiss: handleDismiss
      }, "danger");
      return;
    }

    // Handle expiring soon - show warning toast if not auto-renew and not dismissed today
    if (isExpiringSoon && !autoRenew && !wasDismissedToday) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const warningMessage = t("membership_expiring_warning", { type: membershipType, date: expirationDateFormatted });
      const linkText = t("membership_link_text");
      
      toastIdRef.current = showToastCustom({
        message: warningMessage,
        linkText,
        linkHref: ROUTES.MEMBERSHIP,
        onLinkClick: handleLinkClick,
        onDismiss: handleDismiss
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
