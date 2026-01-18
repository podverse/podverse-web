"use client"

import React from 'react'
import { SettingsLocaleSelector } from './SettingsLocaleSelector'
import { SettingsThemeSelector } from './SettingsThemeSelector'
import { Divider } from '../../../Divider/Divider'

export function SettingsGeneral() {  
  return (
    <>
      <SettingsLocaleSelector />
      <Divider withSpacing />
      <SettingsThemeSelector />
    </>
  )
}
