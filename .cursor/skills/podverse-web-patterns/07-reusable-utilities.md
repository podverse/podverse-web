# Reusable Utilities and podverse-helpers

## When to Put Utilities in podverse-helpers

**CRITICAL**: If a utility function could be useful in other Podverse applications (React Native mobile app, other Next.js apps, API services, etc.), it should be placed in the `podverse-helpers` project, not in the web app.

**Examples of utilities that belong in podverse-helpers:**
- URL validation and SSRF protection functions
- Date/time formatting utilities
- String manipulation helpers
- Data transformation functions
- Validation functions (email, password, URL, etc.)
- Type guards and type checking utilities
- Generic data processing functions
- Security-related utilities (SSRF protection, input sanitization, etc.)

**Examples of utilities that stay in podverse-web:**
- Next.js-specific utilities (SSR helpers, Next.js API route helpers)
- React/Next.js component-specific utilities
- Web-specific UI utilities
- Next.js Image optimization helpers
- Web-only routing utilities

## Pattern: Moving Utilities to podverse-helpers

1. **Identify reusable utilities**: Ask "Could this be useful in React Native or other apps?"
2. **Place in appropriate podverse-helpers location**: 
   - Validation functions → `src/lib/validation/`
   - URL utilities → `src/lib/validation/url.ts` or `src/lib/url.ts`
   - Date utilities → `src/lib/date/` or similar
   - Generic utilities → `src/lib/[category]/`
3. **Export from podverse-helpers**: Add to the appropriate index file
4. **Update web app**: Import from `podverse-helpers` instead of local file
5. **Keep app-specific wrappers**: If needed, create a thin wrapper in the web app that calls the podverse-helpers function with app-specific defaults

## Example: SSRF Protection Utilities

```typescript
// ✅ Good: In podverse-helpers/src/lib/validation/url.ts
export function isPrivateIP(ip: string): boolean {
  // Reusable across all Podverse apps
}

export function isLocalhost(hostname: string): boolean {
  // Reusable across all Podverse apps
}

export function validateUrlForSSRF(url: string, options?: {...}): {...} {
  // Reusable SSRF validation with configurable options
}
```

```typescript
// ✅ Good: In podverse-web/src/utils/proxy/urlValidator.ts
import { validateHttpOrHttpsUrl, validateUrlForSSRF } from "podverse-helpers";

// Thin wrapper with proxy-specific defaults
export function validateProxyUrl(url: string | null) {
  const urlValidation = validateHttpOrHttpsUrl(url);
  if (!urlValidation.isValid) return urlValidation;
  
  return validateUrlForSSRF(url, {
    allowPrivateIPs: false,
    allowLocalhost: false,
    allowedProtocols: ['http:', 'https:'],
  });
}
```

```typescript
// ❌ Bad: Keeping reusable utilities in podverse-web
// src/utils/proxy/urlValidator.ts
export function isPrivateIP(ip: string): boolean {
  // This should be in podverse-helpers!
}
```

## Key Points

- **Think cross-platform**: If it's useful in web, it's probably useful in mobile/API too
- **Security utilities are always reusable**: SSRF protection, input validation, etc.
- **Keep app-specific logic separate**: Web-specific wrappers are fine, but core logic goes to helpers
- **Check podverse-helpers first**: Before creating a new utility, check if it already exists
- **Update imports**: When moving utilities, update all imports across the codebase
