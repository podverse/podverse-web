# API & Data Fetching Patterns

## Adding a New API Endpoint Call

### Client Component Pattern

```typescript
import { apiRequestService } from "../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../utils/rateLimit/rateLimitAlert";
import { useTranslations } from "next-intl";

const MyComponent: React.FC = () => {
  const tMisc = useTranslations("misc");
  
  const handleApiCall = async () => {
    try {
      const response = await apiRequestService.reqMyNewEndpoint({ param: "value" });
      // Handle success
    } catch (error) {
      if (!handleRateLimitAlert(error, undefined, tMisc)) {
        // Handle other errors
      }
    }
  };
  
  return <button onClick={handleApiCall}>Call API</button>;
};
```

### Server Component Pattern

```typescript
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

export default async function MyPage() {
  const { ssrApiRequestService } = await getSSRAuthService();
  
  try {
    const response = await ssrApiRequestService.reqMyNewEndpoint({ param: "value" });
    const data = response.data;
    return <MyClientComponent ssrData={data} />;
  } catch (error) {
    // Handle error
    return <ErrorComponent />;
  }
}
```

### Key Points

- Client: Use `apiRequestService` from `src/factories/apiRequestService`
- Server: Use `getSSRAuthService()` to get `ssrApiRequestService`
- Always handle errors, especially rate limits
- Use proper TypeScript types from `podverse-helpers`

## Rate Limit Handling (Special Case)

**CRITICAL**: Rate limits are a special case that require coordinated handling on both the API and client sides to properly display error messages to users.

### API Side (Backend)

When implementing rate limiting on an endpoint, use the rate limiter utilities from `podverse-api/src/lib/rateLimiter.ts`:

```typescript
import { rateLimitAuthEndpoint, rateLimitEndpoint } from '@api/lib/rateLimiter';

// For authenticated endpoints (per-user rate limiting)
router.get('/download-data', 
  rateLimitAuthEndpoint({ windowMs: 24 * 60 * 60 * 1000, max: 3 }), 
  asyncHandler(AccountController.downloadData)
);

// For public endpoints (IP-based rate limiting)
router.post('/create', 
  rateLimitEndpoint({ windowMs: 10 * 60 * 1000, max: 3 }), 
  asyncHandler(AccountController.create)
);
```

The rate limiter automatically:
- Returns a 429 status code when the limit is exceeded
- Includes a JSON response with `tooManyRequests: true` and `minutesRemaining` properties
- Calculates the time until the rate limit resets

### Client Side (Frontend)

The client must handle rate limit errors using `handleRateLimitAlert()`:

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
      // handleRateLimitAlert returns true if it handled the rate limit
      const rateLimitHandled = await handleRateLimitAlert(error, locale, tMisc);
      if (!rateLimitHandled) {
        // Handle other errors only if rate limit wasn't handled
        console.error("Error:", error);
      }
    }
  };
};
```

**Important Notes**:
- `handleRateLimitAlert()` is **async** - always use `await`
- It displays an alert to the user with the time remaining until the rate limit resets
- It returns `true` if it handled a rate limit error, `false` otherwise
- For blob responses (`responseType: 'blob'`), the `ApiRequestService` automatically converts blob error responses to JSON before throwing, so rate limit detection works correctly

### Why Both Sides Are Required

1. **API side** must:
   - Track request counts per user/IP
   - Return 429 with structured JSON containing `tooManyRequests` and `minutesRemaining`
   - Calculate accurate reset times

2. **Client side** must:
   - Catch 429 errors from API responses
   - Parse the error response (handling blob responses if needed)
   - Display user-friendly messages with time remaining
   - Prevent duplicate error messages (rate limit alert vs generic error toast)

Without proper handling on both sides, users will see generic error messages instead of helpful rate limit information.
