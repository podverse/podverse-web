# Environment Variables

## Overview

The `podverse-web` application is a Next.js application that requires environment variable validation before build. All environment variables are prefixed with `NEXT_PUBLIC_` which means they are exposed to the browser/client-side code.

Validation occurs in `scripts/validate-env.ts` before the build process. The validation:

1. Checks if each variable is set
2. Validates format/type where applicable (e.g., User-Agent format, theme validation, locale validation, numeric validation)
3. Displays a categorized status for each variable
4. Aborts the build if any required variables are missing or invalid

**Important**: All environment variables in this application are public (exposed to the browser). Do not include sensitive information like API keys or secrets.

## Required Variables

### Proxy Configuration

- **`NEXT_PUBLIC_PROXY_USER_AGENT`** (Required)
  - Format: `BrandName Bot Environment/AppName/Version`
  - Must include "Bot" in the first part (before the first slash)
  - Example: `Podverse Bot Local/Web-API/5`
  - Used when proxying external image requests

### API Configuration (SSR)

These variables are used for server-side rendering API requests:

- **`NEXT_PUBLIC_SSR_API_PROTOCOL`** (Required) - API protocol (`http` or `https`)
- **`NEXT_PUBLIC_SSR_API_HOST`** (Required) - API hostname
- **`NEXT_PUBLIC_SSR_API_PORT`** (Optional) - API port (must be a valid number if set)

### API Configuration (Client)

These variables are used for client-side API requests:

- **`NEXT_PUBLIC_API_PROTOCOL`** (Required) - API protocol (`http` or `https`)
- **`NEXT_PUBLIC_API_HOST`** (Required) - API hostname
- **`NEXT_PUBLIC_API_PORT`** (Optional) - API port (must be a valid number if set)
- **`NEXT_PUBLIC_API_PREFIX`** (Required) - API route prefix (e.g., `/api`)
- **`NEXT_PUBLIC_API_VERSION`** (Required) - API version (e.g., `v2`)

### Web Configuration

- **`NEXT_PUBLIC_WEB_PROTOCOL`** (Required) - Web protocol (`http` or `https`)
- **`NEXT_PUBLIC_WEB_DOMAIN`** (Required) - Web domain (e.g., `localhost:3000` or `podverse.fm`)

### App / General

- **`NEXT_PUBLIC_SERVER_ENV`** (Required) - Server environment
  - Must be one of: `prod`, `beta`, `alpha`, `local`
  - Controls environment-specific behavior (e.g., displaying environment warnings in non-production environments)
  - See `podverse-helpers/src/lib/constants/serverEnv.ts` for the constant definition

### Brand & Features

- **`NEXT_PUBLIC_FEATURES_SUPPORTED_LOCALES`** (Required)
  - Must be `"all-available"` or a comma-delimited list of valid locales
  - Valid locales: See `podverse-helpers/src/lib/constants/locales.ts`
  - Example: `"all-available"` or `"en,es,fr"`

- **`NEXT_PUBLIC_FEATURES_DEFAULT_LOCALE`** (Required)
  - Must be a valid locale from the supported locales list
  - Example: `"en"`

- **`NEXT_PUBLIC_SUPPORTED_THEMES`** (Required)
  - Must be `"all-available"` or a comma-delimited list of valid themes
  - Valid themes: `dark`, `light`, `dracula`
  - Example: `"all-available"` or `"dark,light"`

- **`NEXT_PUBLIC_DEFAULT_THEME`** (Required)
  - Must be one of the valid themes: `dark`, `light`, or `dracula`
  - Example: `"dark"`

## Optional Variables

### API Configuration (SSR)

- **`NEXT_PUBLIC_SSR_API_PORT`** (Optional) - API port for server-side rendering requests
  - Must be a valid positive number if set
  - If not set, the port will be omitted from the API URL

### API Configuration (Client)

- **`NEXT_PUBLIC_API_PORT`** (Optional) - API port for client-side API requests
  - Must be a valid positive number if set
  - If not set, the port will be omitted from the API URL

### Brand & Features

- **`NEXT_PUBLIC_BRAND_NAME`** (Optional) - Brand name for the application
- **`NEXT_PUBLIC_POLLING_INTERVAL_MS`** (Optional) - Polling interval in milliseconds (default: `3000`)
  - Must be a positive number if set

### Lightning Keysend

- **`NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_NAME`** (Optional) - Lightning keysend name
- **`NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_TYPE`** (Optional) - Lightning keysend type
- **`NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_ADDRESS`** (Optional) - Lightning keysend address
- **`NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_KEY`** (Optional) - Lightning keysend custom key
- **`NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_VALUE`** (Optional) - Lightning keysend custom value

### Notifications

- **`NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY`** (Optional) - WebPush VAPID public key for browser notifications

### Account

- **`NEXT_PUBLIC_ACCOUNT_SIGNUP_MODE`** (Required) - Account signup mode (no default value)
  - Valid values: `"sign-up"` or `"contact-only"`
  - Must be explicitly set - no default value is assumed

- **`NEXT_PUBLIC_CONTACT_EMAIL`** (Optional) - Contact email address

### Social Media

- **`NEXT_PUBLIC_SOCIAL_ACTIVITY_PUB`** (Optional) - ActivityPub URL
- **`NEXT_PUBLIC_SOCIAL_DISCORD`** (Optional) - Discord URL
- **`NEXT_PUBLIC_SOCIAL_GITHUB`** (Optional) - GitHub URL
- **`NEXT_PUBLIC_SOCIAL_MATRIX`** (Optional) - Matrix URL
- **`NEXT_PUBLIC_SOCIAL_X`** (Optional) - X (Twitter) URL

### General

- **`NEXT_PUBLIC_SERVER_ENV`** (Optional) - Server environment identifier

## Validation Rules

### Numeric Validation

Variables containing `PORT` or `INTERVAL` are validated to ensure they are valid positive numbers if set:
- `NEXT_PUBLIC_SSR_API_PORT` (Optional - must be a valid number if set)
- `NEXT_PUBLIC_API_PORT` (Optional - must be a valid number if set)
- `NEXT_PUBLIC_POLLING_INTERVAL_MS` (Optional - must be a valid number if set)

### Format Validation

- **User-Agent Format**: `NEXT_PUBLIC_PROXY_USER_AGENT` must follow `BrandName Bot Environment/AppName/Version` and include "Bot" in the first part
- **Theme Validation**: `NEXT_PUBLIC_SUPPORTED_THEMES` must be `"all-available"` or a comma-delimited list of valid themes (`dark`, `light`, `dracula`)
- **Theme Default**: `NEXT_PUBLIC_DEFAULT_THEME` must be one of the valid themes
- **Locale Validation**: `NEXT_PUBLIC_FEATURES_SUPPORTED_LOCALES` must be `"all-available"` or a comma-delimited list of valid locales
- **Locale Default**: `NEXT_PUBLIC_FEATURES_DEFAULT_LOCALE` must be a valid locale

## Validation Output

During build, the validation displays:
- A categorized list of all environment variables
- Status indicator (✓ for valid, ✗ for invalid)
- Whether the variable is required or optional
- A message indicating the validation result
- A summary with totals and counts

Example output:
```
=== Environment Variable Validation ===

[Proxy Configuration]
  ✓ NEXT_PUBLIC_PROXY_USER_AGENT - Valid format

[API Configuration (SSR)]
  ✓ NEXT_PUBLIC_SSR_API_PROTOCOL - Set
  ✓ NEXT_PUBLIC_SSR_API_HOST - Set
  ...

=== Validation Summary ===
Total: 30
Passed: 30
Failed: 0
Required Missing: 0
```

## Important Notes

- **Public variables**: All environment variables are prefixed with `NEXT_PUBLIC_` and are exposed to the browser. Do not include sensitive information.
- **Build abort**: If any required variable is missing or invalid, the build process will abort with a clear error message.
- **Validation file**: See `scripts/validate-env.ts` for the complete validation implementation.
- **Environment file loading**: The validation script loads `.env.production` in production mode, or `.env.local` (if exists) or `.env` in development mode.

## Adding New Environment Variables

When adding a new environment variable to the application:

1. **Add to configuration files**:
   - Add the variable to the appropriate config section

2. **Add validation to `scripts/validate-env.ts`**:
   - Determine if the variable is required or optional
   - Add appropriate validation call in `validateAllEnvironmentVariables()`
   - Use `validateRequired()` for required vars
   - Use `validateOptional()` for optional vars
   - Add custom validation if format/type checking is needed (e.g., theme validation, locale validation)

3. **Update this file**:
   - Add the variable to the appropriate section above
   - Document any special requirements (format, type)

4. **Update `.env.example` and environment files**:
   - Add the variable with a comment explaining its purpose
   - Update all environment-specific files in the `env/` directory with the same comments
