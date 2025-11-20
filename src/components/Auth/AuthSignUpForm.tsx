"use client";

import { useLocale, useTranslations } from 'next-intl';
import { getEmailErrorKey, getPasswordErrorKey, getPassword2ErrorKey,
  getPasswordRequirementsInfoKey } from 'podverse-helpers';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button'
import { TextInput } from '../Form/TextInput'
import Form from '../Form/Form';
import styles from '../../styles/components/Auth/AuthSignUpForm.module.scss'
import { apiRequestService } from '../../factories/apiRequestService';
import { handleRateLimitAlert } from '../../utils/rateLimit/rateLimitAlert';

export const AuthSignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailErrorKey, setEmailErrorKey] = useState<string | undefined>();
  const [password1ErrorKey, setPassword1ErrorKey] = useState<string | undefined>();
  const [password2ErrorKey, setPassword2ErrorKey] = useState<string | undefined>();
  const [emailTouched, setEmailTouched] = useState(false);
  const [password1Touched, setPassword1Touched] = useState(false);
  const [password2Touched, setPassword2Touched] = useState(false);
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
        await apiRequestService.reqAccountCreate({ email, password: password1 });
      } catch (err) {
        const rateLimitErrorHandled = handleRateLimitAlert(err, locale, tMisc);
        if (!rateLimitErrorHandled) {
          console.error('Resend verification email failed:', err);
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

  const handlePassword1Blur = () => {
    if (password1Touched && password1.trim() !== '') {
      setPassword1ErrorKey(getPasswordErrorKey(password1) || undefined);
    }
    if (password2Touched && password2) {
      setPassword2ErrorKey(getPassword2ErrorKey(password1, password2) || undefined);
    }
  };

  const handlePassword2Blur = () => {
    if (password2Touched && password2.trim() !== '') {
      setPassword2ErrorKey(getPassword2ErrorKey(password1, password2) || undefined);
    }
  };

  // Clear errors on change when values become valid
  const onEmailChange = (value: string) => {
    setEmail(value);
    setEmailTouched(value !== '');
    if (emailErrorKey) {
      const key = getEmailErrorKey(value);
      if (!key) setEmailErrorKey(undefined);
    }
    if (value === '') setEmailErrorKey(undefined);
  };
  const onPassword1Change = (value: string) => {
    setPassword1(value);
    setPassword1Touched(value !== '');
    if (password1ErrorKey) {
      const key = getPasswordErrorKey(value);
      if (!key) setPassword1ErrorKey(undefined);
    }
    if (value === '') setPassword1ErrorKey(undefined);
    if (password2Touched && password2) {
      const pwd2Key = getPassword2ErrorKey(value, password2);
      if (!pwd2Key) setPassword2ErrorKey(undefined); else setPassword2ErrorKey(pwd2Key);
    }
  };
  const onPassword2Change = (value: string) => {
    setPassword2(value);
    setPassword2Touched(value !== '');
    if (password2ErrorKey) {
      const key = getPassword2ErrorKey(password1, value);
      if (!key) setPassword2ErrorKey(undefined); else setPassword2ErrorKey(key);
    }
    if (value === '') setPassword2ErrorKey(undefined);
  };

  const isFormValid = !getEmailErrorKey(email) && !getPasswordErrorKey(password1) && !getPassword2ErrorKey(password1, password2) && !!email && !!password1 && !!password2;

  return (
    <div className={styles.authSignUpForm}>
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
        <TextInput
          type="password"
          name="password1"
          value={password1}
          onChange={e => onPassword1Change(e.target.value)}
          onBlur={handlePassword1Blur}
          placeholder={tAuthentication("password")}
          eyebrow={tAuthentication("password")}
          infoError={password1ErrorKey ? tAuthentication(password1ErrorKey) : undefined}
        />
        <TextInput
          type="password"
          name="password2"
          value={password2}
          onChange={e => onPassword2Change(e.target.value)}
          onBlur={handlePassword2Blur}
          placeholder={tAuthentication("password")}
          eyebrow={tAuthentication("confirm_password")}
          infoError={password2ErrorKey ? tAuthentication(password2ErrorKey) : undefined}
        />
        <div className={styles.passwordInfo}>
          {tAuthentication(getPasswordRequirementsInfoKey())}
        </div>
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
    </div>
  );
};