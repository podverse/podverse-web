"use client";

import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button'
import { Modal } from './Modal'
import { TextInput } from '../Form/TextInput'
import { useModals } from '../../contexts/Modals'
import { apiRequestService } from '../../factories/apiRequestService';
import Form from '../Form/Form';
import { FormErrorMessageText } from '../Form/FormErrorMessageText';
import styles from '../../styles/components/Modal/ModalAuthLogin.module.scss'
import { ERROR_MESSAGES } from 'podverse-helpers';
import { FormInfoMessageText } from '../Form/FormInfoMessageText';
import { handleRateLimitAlert } from '../../utils/rateLimit/rateLimitAlert';

export const ModalAuthLogin: React.FC = () => {
  const { modalAuthLogin, setModalAuthLogin } = useModals();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [accountNotVerified, setAccountNotVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const tAuthentication = useTranslations("authentication");
  const tMisc = useTranslations("misc");
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setShowErrorMessage(false);
      setAccountNotVerified(false);
      setVerificationEmailSent(false);
      await apiRequestService.reqAuthLogin({ email, password });
      window.location.reload();
    } catch (err: any) {
      const rateLimitErrorHandled = handleRateLimitAlert(err, locale, tMisc);
      if (!rateLimitErrorHandled) {
        const responseMessage = err?.response?.data?.message;
        if (responseMessage === ERROR_MESSAGES.ACCOUNT.NOT_VERIFIED) {
          setAccountNotVerified(true);
          setShowErrorMessage(false);
        } else {
          setShowErrorMessage(true);
        }
      }
    }
      setIsSubmitting(false);
  };

  const handleResendVerificationEmail = async () => {
    try {
      await apiRequestService.reqAccountSendVerificationEmail({ email });
      setVerificationEmailSent(true);
    } catch (err) {
      const rateLimitErrorHandled = handleRateLimitAlert(err, locale, tMisc);
      if (!rateLimitErrorHandled) {
        console.error('Resend verification email failed:', err);
      }
    }
  };

  const handleNavAndClose = (path: string) => {
    setModalAuthLogin({ isOpen: false });
    router.push(path);
  };

  return (
    <Modal
      header={tAuthentication("login")}
      isOpen={modalAuthLogin.isOpen}
      onClose={() => setModalAuthLogin({ isOpen: false })}
      ariaLabel={tAuthentication("login")}
      modalContentMaxWidth={500}
    >
      <Form onSubmit={handleSubmit}>
        <TextInput
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          placeholder={tAuthentication("email")}
          eyebrow={tAuthentication("email")}
        />
        <TextInput
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={tAuthentication("password")}
          eyebrow={tAuthentication("password")}
        />
        {accountNotVerified && (
          <div className={styles.verificationSection}>
            {!verificationEmailSent ? (
              <>
                <FormInfoMessageText message={tAuthentication("account_not_verified")} />
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendVerificationEmail}
                >
                  {tAuthentication("resend_verification_email")}
                </Button>
              </>
            ) : (
              <FormInfoMessageText message={tAuthentication("verification_email_sent")} />
            )}
          </div>
        )}
        {!accountNotVerified && showErrorMessage && (
          <FormErrorMessageText message={tAuthentication("invalid_email_or_password")} />
        )}
        <div className={styles.buttons}>
          <Button type="button" onClick={() => setModalAuthLogin({ isOpen: false })} variant="secondary">
            {tMisc("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {tMisc("submit")}
          </Button>
        </div>
        <div className={styles.links}>
          <Button type='button' variant='link' onClick={() => handleNavAndClose('/forgot-password')}>
            {tAuthentication("forgot_password")}
          </Button>
          <Button type='button' variant='link' onClick={() => handleNavAndClose('/sign-up')}>
            {tAuthentication("sign_up")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};