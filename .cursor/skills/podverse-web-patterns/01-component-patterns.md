# Component Patterns

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
