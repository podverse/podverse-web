"use client";

import { useTranslations } from 'next-intl';
import React, { useState } from 'react'
import { Button } from '../Button/Button'
import { Modal } from './Modal'
import { TextInput } from '../Form/TextInput'
import { useModals } from '../../contexts/Modals'
import styles from '../../styles/components/Modal/ModalAuthLogin.module.scss'
import { apiRequestService } from '../../factories/apiRequestService';
import Form from '../Form/Form';

export const ModalAuthLogin: React.FC = () => {
  const { modalAuthLogin, setModalAuthLogin } = useModals()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const tAuthentication = useTranslations("authentication");
  const tMisc = useTranslations("misc");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiRequestService.reqAuthLogin({ email, password })
      window.location.reload();
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

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
        <div className={styles.buttons}>
          <Button type="button" onClick={() => setModalAuthLogin({ isOpen: false })} variant="secondary">
            {tMisc("cancel")}
          </Button>
          <Button type="submit" variant="primary">
            {tMisc("submit")}
          </Button>
        </div>
        <div className={styles.links}>
          <Button type='button' variant='link' onClick={() => console.log('Forgot password clicked')}>
            {tAuthentication("forgot_password")}
          </Button>
          <Button type='button' variant='link' onClick={() => console.log('Sign up clicked')}>
            {tAuthentication("sign_up")}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}