"use client";

import React, { useState } from 'react'
import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'
import { TextInput } from '../Form/TextInput'
import { useModals } from '../../contexts/Modals'
import styles from '../../styles/components/Auth/LoginModal.module.scss'
import { apiRequestService } from '../../factories/apiRequestService';
import Form from '../Form/Form';

export const LoginModal: React.FC = () => {
  const { modals, closeModal } = useModals()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      header="Log in"
      isOpen={modals.LoginModal.isOpen}
      onClose={() => closeModal('LoginModal')}
      ariaLabel="Log in"
    >
      <Form onSubmit={handleSubmit}>
        <TextInput
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          placeholder="Email"
          eyebrow="Email"
        />
        <TextInput
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          eyebrow="Password"
        />
        <div className={styles.buttons}>
          <Button type="button" onClick={() => closeModal('LoginModal')} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
        <div className={styles.links}>
          <Button type='button' variant='link' onClick={() => console.log('Forgot password clicked')}>
            Forgot password?
          </Button>
          <Button type='button' variant='link' onClick={() => console.log('Sign up clicked')}>
            Sign up
          </Button>
        </div>
      </Form>
    </Modal>
  )
}