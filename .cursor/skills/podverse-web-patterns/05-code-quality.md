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
import { useTranslations } from "next-intl";

const MyComponent: React.FC = () => {
  const tMisc = useTranslations("misc");
  
  const handleAction = async () => {
    try {
      await apiRequestService.reqSomeEndpoint();
    } catch (error) {
      if (!handleRateLimitAlert(error, undefined, tMisc)) {
        // Handle other errors
        console.error("Error:", error);
      }
    }
  };
};
```

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
