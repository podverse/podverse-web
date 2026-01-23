# Code Quality Patterns

## Error Handling

### Catch Block Pattern

**CRITICAL**: If the error variable in a catch block is not used, omit the parameter entirely.

```typescript
// ✅ Good: Error not used, so omit parameter
try {
  const parsed = new URL(url);
  // ... code ...
} catch {
  return { isValid: false, error: 'Invalid URL format' };
}

// ❌ Bad: Unused error parameter
try {
  const parsed = new URL(url);
  // ... code ...
} catch (error) {
  return { isValid: false, error: 'Invalid URL format' };
}
```

**If the catch block is empty but needs to be present**, add a comment explaining why:

```typescript
// ✅ Good: Empty catch with explanation
try {
  await riskyOperation();
} catch {
  // swallow error - operation is optional and failure is acceptable
}

// ✅ Good: Empty catch with specific reason
try {
  await optionalCleanup();
} catch {
  // Ignore cleanup errors - they don't affect the main operation
}

// ✅ Good: If reason is unclear, use "swallow error"
try {
  await someOperation();
} catch {
  // swallow error
}
```

**If the error is used**, include it:

```typescript
// ✅ Good: Error is used
try {
  await apiRequestService.reqSomeEndpoint();
} catch (error) {
  if (!handleRateLimitAlert(error, undefined, tMisc)) {
    console.error("Error:", error);
  }
}
```

### API Error Handling

```typescript
import { handleRateLimitAlert } from "../../utils/rateLimit/rateLimitAlert";
import { useTranslations, useLocale } from "next-intl";

const MyComponent: React.FC = () => {
  const tMisc = useTranslations("misc");
  const locale = useLocale();
  
  const handleAction = async () => {
    try {
      await apiRequestService.reqSomeEndpoint();
    } catch (error) {
      // handleRateLimitAlert is async - always use await
      const rateLimitHandled = await handleRateLimitAlert(error, locale, tMisc);
      if (!rateLimitHandled) {
        // Handle other errors only if rate limit wasn't handled
        console.error("Error:", error);
      }
    }
  };
};
```

**CRITICAL: Rate Limits Require Both API and Client Handling**

Rate limits are a special case that must be handled on both the API and client sides:
- **API side**: Must use `rateLimitAuthEndpoint()` or `rateLimitEndpoint()` from `podverse-api/src/lib/rateLimiter.ts` to return 429 with structured JSON (`tooManyRequests`, `minutesRemaining`)
- **Client side**: Must use `await handleRateLimitAlert()` to detect and display rate limit errors to users

See [API & Data Fetching Patterns - Rate Limit Handling](../02-api-data-fetching.md#rate-limit-handling-special-case) for complete details.

## Type Safety with podverse-helpers

```typescript
import { DTOAccount, DTOChannel, DTOItem } from "podverse-helpers";

type MyComponentProps = {
  account: DTOAccount;
  channel: DTOChannel;
  items: DTOItem[];
};
```

## Translation Pattern

```typescript
const tFeatures = useTranslations("features");
const tMisc = useTranslations("misc");
const tInstructions = useTranslations("instructions");

// Use with keys
<button>{tFeatures("button_label")}</button>
<p>{tMisc("helper_text")}</p>
```

### Adding New Translation Keys

**CRITICAL**: When adding new translation keys, **only add them to `i18n/originals/en-US.json`**:
- Do NOT add translations to override files (e.g., `i18n/overrides/en-US.json`)
- Do NOT add translations to other language files
- The `i18n-compile` script automatically processes `originals/en-US.json` and generates all necessary translation files, overrides, and alternate languages
- `i18n/originals/en-US.json` is the single source of truth for all translations
