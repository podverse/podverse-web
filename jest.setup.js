import '@testing-library/jest-dom/extend-expect'
import { setConfig } from 'next/config'
import config from './next.config'

// Make sure you can use "publicRuntimeConfig" within tests.
setConfig(config.publicRuntimeConfig)
