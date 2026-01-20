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
