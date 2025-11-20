"use client";

import { useLocale, useTranslations } from 'next-intl';
import { getEmailErrorKey } from 'podverse-helpers';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button'
import { TextInput } from '../Form/TextInput'
import Form from '../Form/Form';
import { apiRequestService } from '../../factories/apiRequestService';
import { handleRateLimitAlert } from '../../utils/rateLimit/rateLimitAlert';
import { FormInfoMessageText } from '../Form/FormInfoMessageText';
import styles from '../../styles/components/Auth/AuthForgotPasswordForm.module.scss'

export const AuthForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailErrorKey, setEmailErrorKey] = useState<string | undefined>();
  const [emailTouched, setEmailTouched] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tAuthentication = useTranslations("authentication");
  const tMisc = useTranslations("misc");
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      try {
        await apiRequestService.reqAccountSendResetPasswordEmail({ email });
        setIsEmailSent(true);
      } catch (err) {
        const rateLimitErrorHandled = handleRateLimitAlert(err, locale, tMisc);
        if (!rateLimitErrorHandled) {
          console.error('Send forgot password email failed:', err);
          alert(tMisc("errors.generic"));
        }
      }
    }
    setIsLoading(false);
  };

  const handleEmailBlur = () => {
    if (emailTouched && email.trim() !== '') {
      setEmailErrorKey(getEmailErrorKey(email) || undefined);
    }
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    setEmailTouched(value !== '');
    if (emailErrorKey) {
      const key = getEmailErrorKey(value);
      if (!key) setEmailErrorKey(undefined);
    }
    if (value === '') setEmailErrorKey(undefined);
  };

  const isFormValid = !getEmailErrorKey(email) && !!email;

  return (
    <div className={styles.authForgotPasswordForm}>
      {
        !isEmailSent && (
          <Form onSubmit={handleSubmit}>
            <TextInput
              type="email"
              name="email"
              value={email}
              onChange={e => onEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              autoFocus
              placeholder={tAuthentication("email")}
              eyebrow={tAuthentication("email")}
              infoError={emailErrorKey ? tAuthentication(emailErrorKey) : undefined}
            />
            <div className={styles.buttons}>
              <Button type="button" onClick={() => router.push('/')} variant="secondary">
                {tMisc("cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || isLoading}
                isLoading={isLoading}
              >
                {tMisc("submit")}
              </Button>
            </div>
          </Form>
        )
      }
      {
        isEmailSent && (
          <FormInfoMessageText message={tAuthentication("forgot_password_email_sent_message")} />
        )
      }
    </div>
  );
};
