---
name: podverse-web-patterns
description: Common patterns and examples for the podverse-web Next.js application
version: 1.0.0
---

# Podverse-Web Development Patterns

This skill provides quick reference for common patterns used in the podverse-web codebase. Use these patterns when implementing new features or modifying existing code.

## Creating a New Page with SSR

### Pattern Structure

1. Create `page.tsx` in `src/app/[route]/`
2. Make it an async server component
3. Fetch data using `getSSRApiRequestService()`
4. Parse and validate search params with Zod
5. Pass SSR data to a client component

### Example

```typescript
// src/app/my-feature/page.tsx
import { z } from "zod";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { MyFeatureClient } from "./MyFeatureClient";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  sort: z.enum(["recent", "top"]).optional().default("recent"),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type MyFeaturePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MyFeaturePage({ searchParams }: MyFeaturePageProps) {
  const queryParams = await searchParams;
  const { ssrApiRequestService } = await getSSRAuthService();
  
  // Parse and validate search params
  const parsed = searchParamsSchema.safeParse(queryParams);
  const { page, sort } = parsed.success ? parsed.data : { page: 1, sort: "recent" };
  
  // Fetch data
  const response = await ssrApiRequestService.reqSomeEndpoint({ page, sort });
  const data = response.data;
  
  // Pass to client component
  return <MyFeatureClient ssrData={data} initialPage={page} initialSort={sort} />;
}
```

### Key Points

- Use `getSSRAuthService()` to get authenticated API service
- Validate search params with Zod schemas
- Use `safeParse()` for error handling
- Pass SSR data as props to client components

## Creating a Client Component with Translations

### Pattern Structure

1. Add `"use client"` directive
2. Import `useTranslations` from `next-intl`
3. Use translation keys for all user-facing text
4. Define TypeScript interface for props

### Example

```typescript
// src/components/MyComponent/MyComponent.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../Button/Button";
import styles from "../../styles/components/MyComponent/MyComponent.module.scss";

type MyComponentProps = {
  title: string;
  onAction: () => void;
};

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <Button onClick={onAction}>
        {tFeatures("my_action_button")}
      </Button>
      <p>{tMisc("helper_text")}</p>
    </div>
  );
};
```

### Key Points

- **CRITICAL: ALWAYS use `useTranslations()` for ALL user-facing text** - Never hardcode strings like "Submit", "Cancel", "Error", etc.
- **NO EXCEPTIONS**: Every string visible to users must come from translation files
- Use namespaced translation keys (e.g., "features", "misc")
- If a translation key doesn't exist, add it to `i18n/originals/en.json` first
- Define TypeScript interfaces for props
- Use SCSS modules for styling

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

## Creating a New Context Provider

### Pattern Structure

1. Create context file in `src/contexts/`
2. Define context type with state and setters
3. Create provider component with useState
4. Export custom hook for consuming context
5. Add provider to `src/providers/Providers.tsx`

### Example

```typescript
// src/contexts/MyFeature.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOMyType } from "podverse-helpers";

type MyFeatureState = {
  data: DTOMyType | null;
  isLoading: boolean;
};

type MyFeatureContextType = {
  myFeature: MyFeatureState;
  setMyFeature: (val: MyFeatureState) => void;
};

const MyFeatureContext = createContext<MyFeatureContextType | undefined>(undefined);

export const MyFeatureProvider = ({ 
  children,
  ssrInitialData 
}: { 
  children: ReactNode;
  ssrInitialData: DTOMyType | null;
}) => {
  const [myFeature, setMyFeature] = useState<MyFeatureState>({
    data: ssrInitialData,
    isLoading: false
  });

  return (
    <MyFeatureContext.Provider value={{ myFeature, setMyFeature }}>
      {children}
    </MyFeatureContext.Provider>
  );
};

export const useMyFeature = () => {
  const context = useContext(MyFeatureContext);
  if (!context) throw new Error("useMyFeature must be used within MyFeatureProvider");
  return context;
};
```

### Adding to Providers

```typescript
// src/providers/Providers.tsx
import { MyFeatureProvider } from "../contexts/MyFeature";

export default function Providers({ children, ssrMyFeature, ...otherProps }: Props) {
  return (
    <NextIntlClientProvider>
      {/* ... other providers ... */}
      <MyFeatureProvider ssrInitialData={ssrMyFeature}>
        {children}
      </MyFeatureProvider>
    </NextIntlClientProvider>
  );
}
```

### Key Points

- Always include error check in custom hook
- Accept SSR initial data as props
- Use TypeScript for all types
- Follow the provider nesting order in `Providers.tsx`

## Adding a New Modal

### Pattern Structure

1. Create modal component using base `Modal` component
2. Add modal state to `src/contexts/Modals.tsx`
3. Register modal in `src/components/Modals/Modals.tsx`
4. Use `useModals()` hook to control modal

### Step 1: Create Modal Component

```typescript
// src/components/Modal/ModalMyFeature.tsx
"use client";

import { useModals } from "../../contexts/Modals";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import { useTranslations } from "next-intl";
import styles from "../../styles/components/Modal/ModalMyFeature.module.scss";

export const ModalMyFeature: React.FC = () => {
  const { modalMyFeature, setModalMyFeature } = useModals();
  const tMisc = useTranslations("misc");
  
  const handleClose = () => {
    setModalMyFeature({ isOpen: false });
  };
  
  return (
    <Modal
      isOpen={modalMyFeature.isOpen}
      onClose={handleClose}
      ariaLabel={tMisc("my_feature_modal")}
      header={tMisc("my_feature_title")}
    >
      <div className={styles.content}>
        {/* Modal content */}
        <Button onClick={handleClose}>{tMisc("close")}</Button>
      </div>
    </Modal>
  );
};
```

### Step 2: Add to Modals Context

```typescript
// src/contexts/Modals.tsx
type ModalsContextType = {
  // ... existing modals ...
  modalMyFeature: ModalBasic;
  setModalMyFeature: (val: ModalBasic) => void;
};

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  // ... existing state ...
  const [modalMyFeature, setModalMyFeature] = useState<ModalBasic>({ isOpen: false });
  
  return (
    <ModalsContext.Provider value={{
      // ... existing values ...
      modalMyFeature, setModalMyFeature
    }}>
      {children}
    </ModalsContext.Provider>
  );
};
```

### Step 3: Register in Modals Component

```typescript
// src/components/Modals/Modals.tsx
import { ModalMyFeature } from "../Modal/ModalMyFeature";

export const Modals: React.FC = () => {
  return (
    <>
      {/* ... existing modals ... */}
      <ModalMyFeature />
    </>
  );
};
```

### Key Points

- Use base `Modal` component for consistency
- Always include `ariaLabel` for accessibility
- Use translations for all text
- Follow the three-step pattern (component, context, registration)

## Creating a New List Component

### Pattern Structure

1. Create list component in `src/components/List/[Feature]/`
2. Support different view modes (list/grid) if applicable
3. Use SCSS modules for styling
4. Include pagination if needed
5. Follow existing list patterns

### Example

```typescript
// src/components/List/MyFeature/ListMyFeature.tsx
"use client";

import React from "react";
import { DTOMyType } from "podverse-helpers";
import { ListMyFeatureRow } from "./ListMyFeatureRow";
import { ListMyFeatureGridNode } from "./ListMyFeatureGridNode";
import { ViewSelector } from "../../ViewSelector/ViewSelector";
import { Pagination } from "../../Pagination/Pagination";
import styles from "../../../styles/components/List/MyFeature/ListMyFeature.module.scss";

type ListMyFeatureProps = {
  items: DTOMyType[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const ListMyFeature: React.FC<ListMyFeatureProps> = ({
  items,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  if (items.length === 0) {
    return <NoResults />;
  }
  
  return (
    <div className={styles.listWrapper}>
      <ViewSelector viewMode={viewMode} onViewModeChange={setViewMode} />
      
      <div className={styles.list}>
        {items.map((item) => (
          viewMode === "list" ? (
            <ListMyFeatureRow key={item.id} item={item} />
          ) : (
            <ListMyFeatureGridNode key={item.id} item={item} />
          )
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
```

### Key Points

- Support both list and grid views
- Use proper TypeScript types
- Include empty state handling
- Follow existing list component patterns
- Use SCSS modules for styling

## Server/Client Component Split Pattern

### When to Use Server Components

- Data fetching
- Accessing backend resources
- Keeping sensitive information on server
- Large dependencies that should be excluded from client bundle

### When to Use Client Components

- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, useContext, etc.)
- Event listeners

### Example Pattern

```typescript
// Server Component (page.tsx)
export default async function MyPage() {
  const data = await fetchData();
  return <MyClientComponent ssrData={data} />;
}

// Client Component (MyClientComponent.tsx)
"use client";

export const MyClientComponent: React.FC<{ ssrData: DataType }> = ({ ssrData }) => {
  const [state, setState] = useState(ssrData);
  // Interactive logic here
  return <div onClick={handleClick}>{/* ... */}</div>;
};
```

## Styling with SCSS Modules

### Pattern

```typescript
import classNames from "classnames";
import styles from "../../styles/components/MyComponent/MyComponent.module.scss";

export const MyComponent: React.FC<{ variant?: "primary" | "secondary" }> = ({ variant = "primary" }) => {
  return (
    <div className={classNames(styles.container, styles[variant])}>
      <button className={styles.button}>Click me</button>
    </div>
  );
};
```

### SCSS File Structure

```scss
// src/styles/components/MyComponent/MyComponent.module.scss
.container {
  padding: 1rem;
  
  &.primary {
    background: var(--color-primary);
  }
  
  &.secondary {
    background: var(--color-secondary);
  }
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}
```

### Key Points

- Use camelCase for class names
- Use `classNames` utility for conditional classes
- Import SCSS variables and mixins as needed
- Follow existing component style patterns

## Common Utility Patterns

### Error Handling

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

### Type Safety with podverse-helpers

```typescript
import { DTOAccount, DTOChannel, DTOItem } from "podverse-helpers";

type MyComponentProps = {
  account: DTOAccount;
  channel: DTOChannel;
  items: DTOItem[];
};
```

### Translation Pattern

```typescript
const tFeatures = useTranslations("features");
const tMisc = useTranslations("misc");
const tInstructions = useTranslations("instructions");

// Use with keys
<button>{tFeatures("button_label")}</button>
<p>{tMisc("helper_text")}</p>
```

## Code Improvement and Optimization Guidelines

### Plan Mode: Recommending Improvements

When operating in **plan mode**, actively identify and recommend code improvements and optimizations:

**Performance Optimizations:**
- Identify opportunities for code splitting, lazy loading, or memoization
- Suggest database query optimizations or API response caching strategies
- Recommend bundle size reductions or tree-shaking improvements
- Propose rendering optimizations (e.g., virtual scrolling, pagination improvements)

**Code Quality Improvements:**
- Suggest better error handling patterns
- Recommend improved type safety where gaps exist
- Propose better component composition patterns
- Identify opportunities for code reuse and DRY principles

**Pattern Alternatives:**
- **Be bold** in suggesting better patterns, even if they deviate significantly from current project patterns
- If you identify a pattern that would be better (e.g., state management, data fetching, component architecture), recommend it
- Consider modern React patterns, Next.js best practices, or industry standards that might improve the codebase
- Don't be constrained by "how things are currently done" - focus on "how they should be done"

**When Evaluating Patterns:**
- Current pattern: What is the codebase currently using?
- Better pattern: What would be a superior approach?
- Benefits: Why would the new pattern be better? (performance, maintainability, developer experience, etc.)
- Deviation level: How significant would the change be?
- Migration path: How could this be implemented if approved?

### Agent Mode: Implementing Changes

When operating in **agent mode**, follow existing patterns unless explicitly directed otherwise:

**Follow Established Patterns:**
- Use the patterns documented in this skill file and `.cursorrules`
- Match the style and structure of similar existing code
- Don't introduce new patterns unless explicitly asked
- Complete tasks using the current codebase conventions

**Do NOT Automatically Implement Pattern Deviations:**
- Even if you notice a better pattern exists, do not automatically refactor to use it
- Do not migrate existing code to new patterns without explicit approval
- Do not make dramatic architectural changes unless explicitly requested
- Complete the requested task using current patterns

**When You Identify Better Patterns:**
- Acknowledge that a better pattern might exist
- Suggest that plan mode could evaluate this as a future improvement
- Continue implementing using the current established patterns
- Only deviate if the user explicitly requests it or plan mode has approved it

**Exception: Following Approved Plans:**
- If plan mode has recommended a new pattern and the user approved it in the plan, implement it
- Follow the plan's recommendations exactly
- Update documentation if new patterns are being adopted

### Examples

**Plan Mode Recommendation:**
```markdown
**Recommendation: Consider Using React Server Components More Extensively**

Current Pattern: Many components are client components that fetch data client-side.

Better Pattern: Move data fetching to server components and pass data down as props.

Benefits: 
- Reduced JavaScript bundle size
- Faster initial page loads
- Better SEO
- More efficient server-side rendering

Deviation Level: Medium - Would require refactoring data fetching but maintains overall structure.

This could be evaluated for future work.
```

**Agent Mode Behavior:**
```markdown
I notice that this could be implemented as a server component for better performance. 
However, I'll implement it as a client component following the existing pattern in similar features. 
Plan mode could evaluate server component optimization as a future improvement.
```

## Documenting Out-of-Scope Improvements

### When to Document Improvements

When working on a task and you identify potential improvements that are **outside the scope** of the current work, you should automatically document them in `docs/todo/improvements.md`.

**Document improvements when:**
- They would improve code quality, performance, or maintainability
- They are not part of the current task/plan
- They would require separate work to implement
- They are architectural or pattern improvements
- They are security, accessibility, or performance optimizations

**Do NOT document:**
- Improvements that are part of the current task (implement them instead)
- Trivial style preferences
- Improvements you're already implementing

### How to Document Improvements

1. **Read the existing file**: Check `docs/todo/improvements.md` to see if a similar improvement already exists
2. **Choose the right category**: Add to the appropriate section (Critical Issues, Performance Optimizations, Code Quality Issues, etc.)
3. **Use the standard format**:

```markdown
### [Number]. [Title]
**Status**: Pending  
**Priority**: [Critical/High/Medium/Low]  
**Severity**: [High/Medium/Low]

**Issue**: [Clear description of the problem or opportunity]

**Recommendation**: [Specific actionable recommendation]
- [Specific action item 1]
- [Specific action item 2]

**Files affected**: [List relevant files or "Multiple files"]

**Notes**: [Any additional context, why it's important, or related items]
```

4. **Update existing entries**: If a similar improvement exists, update it rather than creating a duplicate
5. **Link to files**: Include file paths when relevant (e.g., `src/components/Image/Image.tsx`)
6. **Provide examples**: Include code examples when helpful

### Example: Documenting a New Improvement

**Scenario**: While implementing a feature, you notice that a component could benefit from React.memo but it's not part of your current task.

**Action**: Add to `docs/todo/improvements.md`:

```markdown
### 20. Memoize ListRow Components
**Status**: Pending  
**Priority**: Medium  
**Severity**: Medium

**Issue**: `ListPodcastRow` component re-renders on every parent update, even when its props haven't changed. This causes unnecessary re-renders in long lists.

**Recommendation**: Wrap frequently-rendered list row components with `React.memo`:
- Add `React.memo` to `ListPodcastRow`, `ListEpisodeRow`, `ListClipRow`
- Ensure props are stable (use `useCallback` for handlers)
- Add custom comparison function if needed

**Files affected**: 
- `src/components/List/Podcasts/ListPodcastRow.tsx`
- `src/components/List/Podcasts/Episodes/ListEpisodeRow.tsx`
- `src/components/List/Clips/ListClipRow.tsx`

**Notes**: This will improve performance when scrolling through long lists. Should be done after current feature work.
```

### Updating Status

When you start working on a documented improvement:
1. Change **Status** from "Pending" to "In Progress"
2. When completed, change to "Completed" and add completion date
3. If intentionally deferred, change to "Ignored" and add reason in Notes

### Integration with Plan Mode

In **plan mode**, when recommending improvements:
- If the improvement is part of the current plan → include it in the plan
- If the improvement is outside scope → document it in `docs/todo/improvements.md` and mention it in the plan summary

### Integration with Agent Mode

In **agent mode**, when you notice improvements:
- If it's a quick fix related to your task → implement it
- If it's outside scope → document it in `docs/todo/improvements.md` and continue with your task
- Don't let improvement documentation distract from completing the assigned work

## Best Practices Summary

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

### Translation Requirements (CRITICAL)

**MANDATORY**: Every string that users can see must use translations:
- Button labels: `{tMisc("submit")}` NOT `"Submit"`
- Error messages: `{tMisc("error_message")}` NOT `"Error occurred"`
- Placeholder text: `{tFeatures("search_placeholder")}` NOT `"Search..."`
- Development-only text visible to users: Still use translations
- Even in error pages: Use translations (with fallback for global-error.tsx)

**If you see hardcoded English strings in user-facing code, you MUST:**
1. Add the translation key to `i18n/originals/en.json`
2. Replace the hardcoded string with `useTranslations()` call
3. This applies to ALL components, pages, error boundaries, etc.