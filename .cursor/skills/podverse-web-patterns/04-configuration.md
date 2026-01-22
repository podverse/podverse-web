# Configuration & Environment Variables

## Using Constants Instead of Hardcoded Values

### Pattern Structure

1. Create a constants file (e.g., `src/constants/[feature].ts`)
2. Define named constants with descriptive names
3. Import and use constants instead of hardcoding numbers/strings
4. Group related constants together

### Example: Rate Limiting Constants

**CRITICAL: Always nest all constants within a single feature object**

```typescript
// src/utils/proxy/constants.ts
export const PROXY = {
  RATE_LIMIT: {
    MAX_REQUESTS: 1000,
    WINDOW_MS: 10 * 60 * 1000, // 10 minutes in milliseconds
  },
  SIZE_LIMITS: {
    MAX_RESPONSE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  },
  TIMEOUT_MS: 10 * 1000, // 10 seconds
  ALLOWED_CONTENT_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
} as const;
```

### Usage in Code

```typescript
// src/app/api/proxy/route.ts
import { PROXY } from "../../utils/proxy/constants";

// Instead of: if (count > 1000) { ... }
if (count > PROXY.RATE_LIMIT.MAX_REQUESTS) {
  // ...
}

// Instead of: const maxSize = 10 * 1024 * 1024;
const maxSize = PROXY.SIZE_LIMITS.MAX_RESPONSE_SIZE_BYTES;

// Instead of: timeout: 10000
const controller = new AbortController();
setTimeout(() => controller.abort(), PROXY.TIMEOUT_MS);

// Access nested arrays
const isAllowed = PROXY.ALLOWED_CONTENT_TYPES.includes(contentType);
```

### Example: Image Size Constants

```typescript
// src/constants/images.ts (existing file)
export const IMAGES = {
  LIST: {
    PODCASTS: {
      SIZE: 100,
      SIZE_FIND_TARGET: 200,
    },
    EPISODES: {
      DESKTOP: {
        SIZE: 150,
        SIZE_FIND_TARGET: 300,
      },
      MOBILE: {
        SIZE: 80,
        SIZE_FIND_TARGET: 160,
      },
    },
  },
} as const;
```

### Example: Image Path Constants

**CRITICAL: Always use constants for image paths from the public directory**

All image paths should be defined in `src/constants/images.ts` under the `IMAGES.SRC` or appropriate nested structure. Never hardcode image paths in components.

```typescript
// src/constants/images.ts
export const IMAGES = {
  SRC: {
    PLACEHOLDER: "/images/placeholder-image.png"
  },
  MOBILE: {
    APP_STORES: {
      APP_STORE: "/images/mobile/app-stores/download-badge-download-on-the-app-store.svg",
      GOOGLE_PLAY: "/images/mobile/app-stores/download-badge-get-it-on-google-play.png",
      F_DROID: "/images/mobile/app-stores/download-badge-get-it-on-fdroid.png"
    }
  }
} as const;
```

### Usage in Components

```typescript
// src/app/about/page.tsx
import { IMAGES } from "../../constants/images";
import Image from "next/image";

// ✅ CORRECT: Use constants
<Image
  src={IMAGES.MOBILE.APP_STORES.APP_STORE}
  alt="Download on the App Store"
  width={135}
  height={40}
/>

// ❌ WRONG: Hardcoded path
<Image
  src="/images/mobile/app-stores/download-badge-download-on-the-app-store.svg"
  alt="Download on the App Store"
  width={135}
  height={40}
/>
```

### Why Use Constants for Image Paths

- **Single source of truth**: Update path in one place if files move
- **Type safety**: TypeScript can catch typos and missing paths
- **Refactoring**: Easy to find all usages of an image path
- **Consistency**: Ensures all images follow the same pattern
- **Documentation**: Constants file serves as a catalog of available images

### Key Points

- **CRITICAL: Nest all constants within a single feature object**: All constants for a feature should be nested under one object (e.g., `PROXY`, `IMAGES`, `API_CONFIG`)
- **Use descriptive names**: `PROXY.RATE_LIMIT.MAX_REQUESTS` is clearer than `1000`
- **Group related constants**: Use nested objects to organize related constants together
- **Use `as const`**: Ensures TypeScript treats values as literals and provides better type inference
- **Calculate derived values**: Use expressions like `10 * 60 * 1000` with comments explaining the unit
- **Centralize configuration**: Makes it easy to adjust values in one place
- **Improve readability**: `PROXY.TIMEOUT_MS` is self-documenting vs `10000`
- **Type safety**: Constants can be typed and checked at compile time
- **Single import**: Import one object instead of multiple individual constants

### When to Use Constants

- **Magic numbers**: Any numeric value that isn't immediately obvious (timeouts, limits, sizes)
- **Repeated values**: Values used in multiple places
- **Configuration values**: Settings that might need adjustment
- **Complex calculations**: Expressions that benefit from explanation
- **Related values**: Groups of constants that belong together

### Anti-Pattern: Hardcoded Values

```typescript
// ❌ Bad: Hardcoded values
if (count > 1000) { ... }
const maxSize = 10 * 1024 * 1024;
setTimeout(() => controller.abort(), 10000);
```

### Good Pattern: Named Constants (Nested)

```typescript
// ✅ Good: Named constants nested in feature object
import { PROXY } from "./constants";

if (count > PROXY.RATE_LIMIT.MAX_REQUESTS) { ... }
const maxSize = PROXY.SIZE_LIMITS.MAX_RESPONSE_SIZE_BYTES;
setTimeout(() => controller.abort(), PROXY.TIMEOUT_MS);
```

### Anti-Pattern: Individual Exports

```typescript
// ❌ Bad: Individual constant exports
export const PROXY_RATE_LIMIT = { ... };
export const PROXY_SIZE_LIMITS = { ... };
export const PROXY_TIMEOUT_MS = 10000;

// Requires multiple imports
import { PROXY_RATE_LIMIT, PROXY_SIZE_LIMITS, PROXY_TIMEOUT_MS } from "./constants";
```

## Environment Variables and Configuration

### Pattern: Using Config Object Instead of process.env

**CRITICAL**: Always use the `config` object from `src/config/index.ts` instead of accessing `process.env` directly in application code.

### Steps for Adding New Environment Variables

**In Plan Mode**: Before adding a new environment variable, you MUST ask:
- "Should this new environment variable be required (added to validation script) or optional?"

1. **Add to config object** (`src/config/index.ts`):
   ```typescript
   export const config = {
     // ... existing config ...
     newFeature: {
       setting: process.env.NEXT_PUBLIC_NEW_FEATURE_SETTING || "default"
     }
   };
   ```

2. **If required**: Add to validation script (`scripts/validate-env.ts`):
   ```typescript
   const REQUIRED_ENV_VARS = [
     'NEXT_PUBLIC_PROXY_USER_AGENT',
     'NEXT_PUBLIC_NEW_FEATURE_SETTING', // Add new required var here
   ] as const;
   ```

3. **Update .env.example** (root directory):
   - Add the new variable with a comment explaining its purpose
   - Include a sensible default or example value

4. **Update all env files** in `env/` directory:
   - `env/local.env`
   - `env/alpha.env`
   - `env/beta.env` (if exists)
   - `env/production.env` (if exists)
   - Add the variable with environment-appropriate values

5. **Use config object in code**:
   ```typescript
   // ✅ Good: Use config object
   import { config } from "../../config";
   const value = config.newFeature.setting;
   
   // ❌ Bad: Direct process.env access
   const value = process.env.NEXT_PUBLIC_NEW_FEATURE_SETTING;
   ```

### Why Use Config Object?

- **Centralized configuration**: All environment variables in one place
- **Type safety**: TypeScript can infer types from the config object
- **Default values**: Easy to set defaults in one location
- **Consistency**: Ensures all env vars are properly handled
- **Documentation**: The config file serves as documentation of available variables

### Environment Variable Naming

**CRITICAL**: In podverse-web, ALL environment variables should use the `NEXT_PUBLIC_` prefix for consistency, even if they are only used server-side. This is because all environment variables in podverse-web are intended to be public.

- **All variables**: Use `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_PROXY_USER_AGENT`, not `PROXY_USER_AGENT`)
- **Use descriptive names**: `NEXT_PUBLIC_PROXY_USER_AGENT` not `NEXT_PUBLIC_PROXY_UA`
- **Group related variables**: Use consistent prefixes (e.g., `NEXT_PUBLIC_PROXY_*`, `NEXT_PUBLIC_API_*`)

### Example: Adding Proxy User Agent

```typescript
// ✅ Good: In src/config/index.ts
export const config = {
  // ... existing config ...
  proxy: {
    userAgent: process.env.NEXT_PUBLIC_PROXY_USER_AGENT || "Podverse Bot Local/Web-API/5"
  }
};

// ✅ Good: In code
import { config } from "../../config";
const response = await fetch(url, {
  headers: {
    "User-Agent": config.proxy.userAgent
  }
});

// ❌ Bad: Direct process.env
const response = await fetch(url, {
  headers: {
    "User-Agent": process.env.NEXT_PUBLIC_PROXY_USER_AGENT || "Podverse Bot Local/Web-API/5"
  }
});

// ❌ Bad: Missing NEXT_PUBLIC_ prefix (even for server-only vars in podverse-web)
userAgent: process.env.PROXY_USER_AGENT || "Podverse Bot Local/Web-API/5"
```

### Environment Variable Validation

**CRITICAL**: A validation script (`scripts/validate-env.ts`) runs before every build to ensure required environment variables are set and properly formatted. If any required variables are missing or invalid, the build will abort.

**Required Environment Variables**:
- `NEXT_PUBLIC_PROXY_USER_AGENT` - User-Agent string for proxy requests
  - **Format**: `BrandName Bot Environment/AppName/Version` (3 parts separated by slashes)
  - **Requirements**: 
    - Must have exactly 3 parts: `[first part]/[second part]/[third part]`
    - First part must include "Bot" (e.g., "Podverse Bot Local")
    - Example: `"Podverse Bot Local/Web-API/5"`
  - **Validation**: The script validates both the format pattern and the "Bot" requirement

**Adding a new required variable**:
1. Add the variable name to the `REQUIRED_ENV_VARS` array in `scripts/validate-env.ts`
2. If format validation is needed, add a validation function (see `validateUserAgentFormat` as an example)
3. The validation script will automatically check it before build
4. Update `.env.example` and all environment files in `env/` directory

**In Plan Mode**: When planning to add a new environment variable, you MUST ask the user:
- "Should this new environment variable be required (added to validation script) or optional?"

#### NODE_ENV and Environment File Loading

**CRITICAL**: The validation script handles different `NODE_ENV` values differently, matching Next.js's behavior:

**Production (`NODE_ENV=production`)**:
- In Docker builds, environment files from `env/` directory are copied to `.env.production` (see Dockerfile)
- Validation script loads `.env.production` first, then falls back to `.env`
- This matches Next.js's automatic loading of `.env.production` when `NODE_ENV=production`

**Development (`NODE_ENV=development` or unset)**:
- Validation script loads `.env.local` first (if exists), then falls back to `.env`
- This matches Next.js's priority order for development

**Pattern for validation scripts**:
```typescript
// Always check NODE_ENV and load appropriate .env file
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  // Try .env.production first (Docker builds), then .env
  if (existsSync('.env.production')) {
    config({ path: '.env.production' });
  } else if (existsSync('.env')) {
    config({ path: '.env' });
  }
} else {
  // Development: Try .env.local first, then .env
  if (existsSync('.env.local')) {
    config({ path: '.env.local' });
  } else if (existsSync('.env')) {
    config({ path: '.env' });
  }
}
```

**Docker Build Context**:
- Dockerfiles copy environment-specific files from `env/` directory to `.env.production` during build
- Example: `COPY ./env/alpha.env ./.env.production`
- The validation script must account for this when running in production build context

### Updating .env Files

**Note**: In podverse-web, all environment variables are intended to be public, so it's safe to update `.env` files directly.

**CRITICAL**: `.env.example` and all files in the `env/` directory should mirror each other closely in terms of comments and structure, only differing in values.

When adding a new environment variable:
1. **If required**: Add to `REQUIRED_ENV_VARS` in `scripts/validate-env.ts`
2. Add to `.env.example` with full documentation (format, examples, required status, etc.)
3. Add to all environment-specific files in `env/` directory with the **same comments** as `.env.example`, only changing the values
4. Use consistent formatting and comments across all files
5. Group related variables together with section headers

**Example**: If `.env.example` has:
```env
# User-Agent string sent when proxying external image requests
# Format: BrandName Bot Environment/AppName/Version
# Example: Podverse Bot Local/Web-API/5
# Required: Yes (validated before build)
# Note: The first part must include "Bot" (e.g., "Podverse Bot Local")
NEXT_PUBLIC_PROXY_USER_AGENT="Podverse Bot Local/Web-API/5"
```

Then `env/local.env` and `env/alpha.env` should have:
```env
# User-Agent string sent when proxying external image requests
# Format: BrandName Bot Environment/AppName/Version
# Example: Podverse Bot Local/Web-API/5
# Required: Yes (validated before build)
# Note: The first part must include "Bot" (e.g., "Podverse Bot Local")
NEXT_PUBLIC_PROXY_USER_AGENT="Podverse Bot Local/Web-API/5"  # (or "Podverse Bot Alpha/Web-API/5" for alpha)
```

**Keep comments synchronized**: When updating comments in `.env.example`, update them in all `env/*.env` files as well.

### User-Agent String Pattern

**CRITICAL**: Use a consistent User-Agent format pattern across all Podverse projects.

**Pattern**: `BrandName Bot Environment/AppName/Version`

**Components**:
- `BrandName Bot Environment` - First part (before first slash), must include "Bot" (e.g., "Podverse Bot Local", "Podverse Bot Alpha")
- `AppName` - Application identifier (e.g., "Web-API", "API", "Management-API")
- `Version` - Version number (e.g., `5`)

**Format Rules**:
- Must have exactly 3 parts separated by forward slashes (`/`)
- First part must include the word "Bot" (e.g., "Podverse Bot Local", not "Podverse Local")
- First part can contain spaces (e.g., "Podverse Bot Local")
- Second part is the application name (e.g., "Web-API", "API", "Management-API")
- Third part is the version number (e.g., "5")

**Examples**:
- `"Podverse Bot Local/Web-API/5"` - Local development, Web API (podverse-web)
- `"Podverse Bot Alpha/Web-API/5"` - Alpha environment, Web API (podverse-web)
- `"Podverse Bot Local/API/5"` - Local development, API (podverse-api)
- `"Podverse Bot Local/Management-API/5"` - Local development, Management API (podverse-management-api)
- `"Podverse Bot/Web-API/5"` - Production, Web API (no environment in first part for prod)

**Validation**:
- The validation script (`scripts/validate-env.ts`) enforces this format
- Must match pattern: `/^[^/]+\/[^/]+\/[^/]+$/` (3 parts separated by slashes)
- First part must include "Bot"
- Build will fail if format is incorrect

**When to use**:
- HTTP User-Agent headers for external requests
- API client identification
- Service-to-service communication
- Any place where the application identifies itself to external services

This pattern should be used consistently across all Podverse projects (podverse-web, podverse-api, podverse-management-api, podverse-workers, etc.).
