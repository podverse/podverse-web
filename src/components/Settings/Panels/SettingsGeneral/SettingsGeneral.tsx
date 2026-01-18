"use client"

import React from 'react'
import { SettingsLocaleSelector } from './SettingsLocaleSelector'
import { SettingsThemeSelector } from './SettingsThemeSelector'

export function SettingsGeneral() {  
  return (
    <>
      <SettingsLocaleSelector />
      <SettingsThemeSelector />
    </>
  )
}
