# Best Practices Summary

## Quick Reference Checklist

1. **CRITICAL: ALWAYS use translations for ALL user-facing text** - Use `useTranslations()` hook, NEVER hardcode strings
2. **Always use TypeScript types** - No `any` types
3. **Server components by default** - Add `"use client"` only when needed
4. **SCSS Modules for styling** - Never Tailwind or CSS-in-JS
5. **Proper error handling** - Use `handleRateLimitAlert()` for API errors
6. **Accessibility first** - Include ARIA labels and semantic HTML
7. **Follow existing patterns** - Look at similar components for reference (agent mode)
8. **Recommend improvements** - Propose better patterns when evaluating (plan mode)
9. **Type safety** - Use types from `podverse-helpers` package
10. **Document out-of-scope improvements** - Add to `docs/todo/improvements.md` automatically
11. **Use constants instead of hardcoded values** - Define named constants in separate files for magic numbers, timeouts, limits, and configuration values
12. **CRITICAL: Always use constants for image paths** - All image paths from the public directory must be defined in `src/constants/images.ts` under the `IMAGES` object. Never hardcode image paths like `"/images/..."` in components. Use `IMAGES.MOBILE.APP_STORES.APP_STORE` instead of `"/images/mobile/app-stores/..."`. See `04-configuration.md` for examples.
13. **CRITICAL: Reusable utilities go to podverse-helpers** - If a utility function could be useful in React Native, other Next.js apps, or any other Podverse application, it belongs in `podverse-helpers`, not in the web app
14. **CRITICAL: Always use config object for environment variables** - Import and use `config` from `src/config/index.ts` instead of accessing `process.env` directly. Update `.env.example` and all env files in `env/` directory when adding new variables

## Translation Requirements (CRITICAL)

**MANDATORY**: Every string that users can see must use translations:
- Button labels: `{tMisc("submit")}` NOT `"Submit"`
- Error messages: `{tMisc("error_message")}` NOT `"Error occurred"`
- Placeholder text: `{tFeatures("search_placeholder")}` NOT `"Search..."`
- Development-only text visible to users: Still use translations
- Even in error pages: Use translations (with fallback for global-error.tsx)

**If you see hardcoded English strings in user-facing code, you MUST:**
1. Add the translation key to `i18n/originals/en.json` **ONLY** - Do NOT add translations to override files or other language files. The i18n translation script handles generating overrides and alternate languages automatically.
2. Replace the hardcoded string with `useTranslations()` call
3. This applies to ALL components, pages, error boundaries, etc.

**CRITICAL**: When adding new translation keys:
- **Only edit `i18n/originals/en.json`** - This is the source of truth
- **Do NOT edit** override files (e.g., `i18n/overrides/en.json`) or other language files
- The `i18n-compile` script automatically processes `originals/en.json` and generates all necessary translation files
