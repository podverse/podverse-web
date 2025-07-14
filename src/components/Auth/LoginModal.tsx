"use client";

import React, { useState } from 'react'
import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'
import { TextInput } from '../TextInput/TextInput'
import { useModals } from '../../contexts/Modals'
import styles from '../../styles/components/Auth/LoginModal.module.scss'

export const LoginModal: React.FC = () => {
  const { modals, closeModal } = useModals()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // handle login logic here
    closeModal('LoginModal')
  }

  return (
    <Modal
      header="Log in"
      isOpen={modals.LoginModal.isOpen}
      onClose={() => closeModal('LoginModal')}
      ariaLabel="Log in"
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          placeholder="Email"
          eyebrow="Email"
        />
        <TextInput
          type="password"
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
      </form>
    </Modal>
  )
}