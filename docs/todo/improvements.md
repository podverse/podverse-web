# Podverse Web - Code Improvement Tracking

This document tracks all identified areas for improvement in the Podverse Web codebase. Items are organized by impact, with highest impact items first.

## Performance Optimizations (Highest Impact)

### 1. Insufficient Memoization
**Priority**: High  
**Severity**: Medium

**Issue**: Only 44 instances of `React.memo`, `useMemo`, or `useCallback` across a large codebase (194 app files, 282 component files). Many components re-render unnecessarily, causing performance issues especially in lists and forms.

**Recommendations**:
- **Memoize expensive list components**: 
  - `ListPodcastRow`, `ListEpisodeRow`, `ListClipRow` (frequently re-rendered in long lists)
  - Any component rendered in `.map()` with >10 items
- **Use `useCallback` for event handlers** passed to child components to prevent unnecessary re-renders
- **Use `useMemo` for expensive computations**: filtering, sorting, data transformations
- **Memoize context providers** that pass functions or complex objects
- **Memoize context consumers** that only need specific values

**High-priority components to memoize** (in order):
1. **List row components** - `src/components/List/Podcasts/ListPodcastRow.tsx`, `src/components/List/Podcasts/Episodes/ListEpisodeRow.tsx`, `src/components/List/Clips/ListClipRow.tsx`
2. **Form components** - Any form input that re-renders on parent state changes
3. **Media player components** - Components that update frequently during playback
4. **Context providers** - Providers in `src/providers/Providers.tsx` that pass functions/objects

**Implementation Pattern**:
```typescript
// For list rows
export const ListPodcastRow = React.memo<ListPodcastRowProps>(({ podcast, onSelect }) => {
  // component code
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.podcast.id === nextProps.podcast.id && 
         prevProps.podcast.updatedAt === nextProps.podcast.updatedAt;
});

// For event handlers
const handleClick = useCallback((id: string) => {
  // handler code
}, [/* dependencies */]);

// For expensive computations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

**Expected Impact**:
- Reduce re-renders by 30-50% in list views
- Improve scroll performance in long lists
- Reduce CPU usage during interactions

**Files affected**: Multiple list components, form components, context providers

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for detailed memoization patterns and when to use each technique.

---

### 2. Image Optimization Issues
**Priority**: Medium  
**Severity**: Low-Medium

**Issue**: The `Image` component (`src/components/Image/Image.tsx`) is missing critical optimization props, leading to:
- Larger than necessary image downloads
- Slower LCP (Largest Contentful Paint) for above-the-fold images
- Poor responsive image handling
- Missing visual feedback during loading

**Missing optimizations**:
- No `priority` prop for above-the-fold images (hero images, podcast covers in lists)
- No `sizes` prop for responsive images (causes downloading full-size images on mobile)
- No `placeholder="blur"` or `placeholder="empty"` for better UX
- No `loading` prop control (Next.js defaults to lazy, but should be explicit)

**Recommendation**: Enhance `src/components/Image/Image.tsx`:
```typescript
interface ImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  skipProxy?: boolean;
  priority?: boolean; // NEW: For above-the-fold images
  sizes?: string; // NEW: For responsive images
  placeholder?: 'blur' | 'empty'; // NEW: Loading placeholder
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  skipProxy,
  priority = false,
  sizes,
  placeholder = 'empty'
}) => {
  // ... existing code ...
  
  return (
    <NextImage
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes || `(max-width: 768px) ${width}px, ${width}px`}
      placeholder={placeholder}
      loading={priority ? "eager" : "lazy"}
      onError={() => setImageError(true)}
    />
  );
};
```

**Usage examples**:
```typescript
// Above-the-fold hero image
<Image src={heroImage} alt="Hero" width={1200} height={600} priority />

// List item image (below fold)
<Image 
  src={podcastImage} 
  alt={podcastTitle} 
  width={100} 
  height={100}
  sizes="(max-width: 768px) 100px, 100px"
/>

// Responsive grid image
<Image 
  src={coverImage} 
  alt={title} 
  width={300} 
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Expected Impact**:
- Reduce image payload by 30-50% on mobile devices
- Improve LCP by 0.5-1.5s for above-the-fold images
- Better perceived performance with placeholders

**Files affected**:
- `src/components/Image/Image.tsx` (primary)
- All components using `Image` component (update to pass `priority` where appropriate)

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for image optimization best practices.

---

### 3. Server Component Optimization
**Priority**: Medium  
**Severity**: Medium

**Issue**: Some components that could be server components are client components, increasing bundle size and reducing initial render performance. Next.js 15 App Router provides excellent server component support that should be leveraged more.

**Recommendations**:
- **Audit client components** to identify which could be server components:
  - Components that only fetch and display data (no interactivity)
  - Static content components
  - Components that don't use hooks or browser APIs
- **Move data fetching to server components** where possible
- **Use server components for layouts** and static sections
- **Keep client components minimal** - only mark interactive parts as client

**Benefits**:
- Reduced JavaScript bundle size
- Faster initial page loads
- Better SEO (fully rendered HTML)
- Lower client-side CPU usage

**Files to review**:
- Page components in `src/app/` that might be unnecessarily client components
- Layout components that could be server components

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for server component patterns.

---

### 4. API Response Caching
**Priority**: Medium  
**Severity**: Medium

**Issue**: API responses are fetched on every page load/component mount without caching, leading to:
- Unnecessary network requests
- Slower page loads
- Higher API server load
- Poor offline experience

**Recommendations**:
- **Implement response caching** for:
  - Static/semi-static data (categories, podcast metadata)
  - User-specific data with appropriate cache invalidation
  - List data with pagination caching
- **Use Next.js caching** for server component data fetching:
  - `fetch` with `cache: 'force-cache'` for static data
  - `revalidate` for time-based revalidation
  - `cache: 'no-store'` only when necessary
- **Client-side caching** for frequently accessed data:
  - React Query or SWR for client-side data fetching
  - Local storage for user preferences
  - Session storage for temporary data

**Implementation**:
```typescript
// Server component with caching
export default async function MyPage() {
  // Cached for 1 hour
  const data = await fetch(url, {
    next: { revalidate: 3600 }
  });
  
  return <MyClientComponent data={data} />;
}
```

**Expected Impact**:
- Reduce API calls by 40-60% for cached data
- Improve page load times by 0.5-1.0s
- Better offline experience

**Files affected**: Server components with data fetching, API request utilities

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for caching strategies.

---

### 5. Web Vitals Monitoring
**Priority**: Medium  
**Severity**: Medium

**Issue**: No Core Web Vitals monitoring or tracking. Cannot measure real-world performance or identify performance regressions.

**Recommendations**:
- **Implement Web Vitals tracking**:
  - Use `next/web-vitals` package
  - Track LCP, FID, CLS, TTFB, FCP
  - Send metrics to analytics service
- **Set performance budgets**:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
  - TTFB: < 800ms
- **Monitor in production**: Track metrics over time
- **Alert on regressions**: Set up alerts for performance degradation

**Implementation**:
```typescript
// src/app/layout.tsx or _app.tsx
import { onCLS, onFID, onLCP } from 'next/web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  console.log(metric);
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
}
```

**Expected Impact**:
- Visibility into real-world performance
- Early detection of performance issues
- Data-driven optimization decisions

**Files affected**: `src/app/layout.tsx` or analytics setup

**Notes**: Critical for maintaining performance over time.

---

### 6. useEffect Optimization
**Priority**: Medium  
**Severity**: Medium

**Issue**: 126 instances of `useEffect` across 44 files. Some may have:
- Missing dependencies in dependency arrays (causing stale closures)
- Unnecessary re-renders (dependencies changing too frequently)
- Memory leaks (missing cleanup functions)
- Race conditions in async operations
- Effects that could be replaced with event handlers or derived state

**Audit Checklist**:
For each `useEffect`:
- [ ] All dependencies are included in dependency array
- [ ] Cleanup function added if effect sets up subscriptions, timers, or event listeners
- [ ] Async operations handle component unmounting (use AbortController or flags)
- [ ] Effect is necessary (could it be an event handler instead?)
- [ ] Dependencies are stable (use `useCallback`/`useMemo` if needed)
- [ ] No infinite loops (dependencies don't change on every render)

**Common Issues Found**:
- Context providers with effects that re-run on every context update
- Data fetching effects without cleanup/abort logic
- Effects that could be replaced with React 19 `useEffectEvent` for stable handlers

**Recommendations**:
- **Use `useEffectEvent` (React 19)** for stable event handlers in effects
- **Replace effects with event handlers** where the effect responds to user actions
- **Use derived state** instead of effects that sync state from props
- **Add cleanup functions** for all subscriptions, timers, and event listeners
- **Use AbortController** for async operations in effects

**Example fixes**:
```typescript
// ❌ Bad: Missing cleanup, potential memory leak
useEffect(() => {
  const interval = setInterval(() => {
    updateTime();
  }, 1000);
}, []);

// ✅ Good: With cleanup
useEffect(() => {
  const interval = setInterval(() => {
    updateTime();
  }, 1000);
  return () => clearInterval(interval);
}, []);

// ❌ Bad: Race condition
useEffect(() => {
  fetchData(id).then(setData);
}, [id]);

// ✅ Good: With abort controller
useEffect(() => {
  const controller = new AbortController();
  fetchData(id, { signal: controller.signal }).then(setData);
  return () => controller.abort();
}, [id]);
```

**Files to audit**:
- `src/app/*/Context.tsx` files (multiple context providers with effects)
- `src/hooks/*.tsx` files (custom hooks with effects)
- Components with data fetching in effects

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for useEffect optimization patterns.

---

### 7. Bundle Size Analysis and Monitoring
**Priority**: Medium  
**Severity**: Medium

**Issue**: No bundle size analysis or monitoring. Large dependencies may be included unnecessarily, and bundle size may grow over time without detection.

**Recommendations**:
- **Add `@next/bundle-analyzer`**:
  ```typescript
  // next.config.ts
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  ```
- **Set bundle size budgets**:
  - Initial JS: < 200KB gzipped
  - Total JS: < 500KB gzipped
  - Individual chunks: < 100KB gzipped
- **Monitor in CI/CD**: Add bundle size check to build process
- **Identify large dependencies**: 
  - Video.js (if used)
  - react-virtuoso
  - Other heavy libraries
- **Tree-shake unused code**: Ensure proper ES module imports

**Implementation**:
```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

**Expected Impact**:
- Identify optimization opportunities
- Prevent bundle size regressions
- Guide dependency decisions

**Files affected**: `next.config.ts`, `package.json`, CI/CD configuration

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for bundle optimization patterns.

---

### 8. Virtual Scrolling Best Practices
**Priority**: Low  
**Severity**: Low

**Issue**: `react-virtuoso` is already used (`src/components/VirtualizedList/VirtualizedList.tsx`), but best practices should be documented and applied consistently.

**Recommendations**:
- **Document virtual scrolling patterns** for long lists
- **Ensure consistent usage** across all long lists (>50 items)
- **Optimize item rendering** in virtualized lists:
  - Memoize list items
  - Use stable keys
  - Minimize item component complexity
- **Consider virtual scrolling** for:
  - Podcast lists
  - Episode lists
  - Clip lists
  - Any list with >50 items

**Files affected**: List components that could benefit from virtualization

**Notes**: See `.cursor/skills/podverse-web-patterns/09-performance-optimization.md` for virtual scrolling patterns.

---

### 9. Font Optimization
**Priority**: Low  
**Severity**: Low

**Issue**: Web fonts may not be optimized for performance, causing:
- Layout shifts during font loading
- Blocking render
- Large font file downloads

**Recommendations**:
- **Use `next/font`** for automatic font optimization
- **Preload critical fonts** in layout
- **Use `font-display: swap`** for non-critical fonts
- **Subset fonts** to only include needed characters
- **Consider variable fonts** to reduce file size

**Files affected**: `src/app/layout.tsx` (font loading)

**Notes**: Lower priority but important for perceived performance.

---

## Security Enhancements

### 10. Content Security Policy
**Priority**: Medium  
**Severity**: Medium

**Issue**: No CSP headers found in configuration.

**Recommendation**: Add CSP headers in `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; ..."
        }
      ]
    }
  ];
}
```

**File**: `next.config.ts`

---

## Code Quality Improvements

### 11. Missing ESLint Configuration
**Priority**: Medium  
**Severity**: Medium

**Issue**: No ESLint configuration file found. The project has a `lint` script but no visible config.

**Recommendation**: 
- Add `.eslintrc.json` or `eslint.config.mjs`
- Configure Next.js ESLint plugin
- Add TypeScript ESLint rules
- Set up pre-commit hooks with linting

---

### 12. No Testing Infrastructure
**Priority**: Medium  
**Severity**: Medium

**Issue**: No test files found (`.test.*`, `.spec.*`). No testing framework configured.

**Recommendation**: Set up testing:
- Jest + React Testing Library
- Unit tests for utilities and hooks
- Component tests for critical components
- E2E tests with Playwright or Cypress
- Test coverage reporting

---

### 13. API Error Handling
**Priority**: Medium  
**Severity**: Medium

**Issue**: Error handling is inconsistent. Some components handle errors, others don't.

**Recommendation**:
- Create a centralized error handling utility
- Implement retry logic for failed requests
- Add user-friendly error messages
- Log errors to monitoring service
- Handle network errors gracefully

---

### 14. Loading States
**Priority**: Low  
**Severity**: Low

**Issue**: Some components show loading states, but it's inconsistent.

**Recommendation**:
- Standardize loading state patterns
- Use Suspense boundaries for async components
- Add skeleton loaders for better UX
- Implement optimistic updates where appropriate

---

### 15. Incomplete Metadata
**Priority**: Low  
**Severity**: Low

**Issue**: Root layout has placeholder metadata:
```typescript
description: 'Add meta description here'
```

**Recommendation**: Add proper SEO metadata:
- Dynamic descriptions per route
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)

**File**: `src/app/layout.tsx`

---

### 16. TypeScript Improvements
**Priority**: Low  
**Severity**: Low

**Issue**: Some areas could use better typing:
- `useSkipInitialEffect` uses `any[]` for dependencies
- Some error handling uses `unknown` without proper type guards
- Missing return type annotations in some functions

**Recommendation**: 
- Replace `any` types with proper types
- Add explicit return types
- Use type guards for error handling
- Enable additional strict TypeScript flags

---

## Accessibility

### 17. ARIA Attributes
**Priority**: Low  
**Severity**: Low

**Issue**: Good ARIA usage found (194 matches), but should be audited for:
- Missing labels
- Keyboard navigation
- Screen reader support
- Focus management

**Recommendation**: Run accessibility audit with:
- axe DevTools
- Lighthouse
- WAVE
- Manual keyboard navigation testing

---

## How to Use This Document

1. **When starting work on an item**: Begin implementation
2. **When completing work**: Remove the entire item from the document
3. **When identifying new improvements**: Add them to the appropriate section with full details
4. **Organization**: Items are ordered by impact - highest impact items appear first

## Adding New Improvements

When identifying improvements outside the scope of current work:
1. Add a new entry in the appropriate category (or create new category if needed)
2. Include: Issue description, Recommendation, Priority, Severity
3. Link to relevant files when possible
4. Provide code examples when helpful
5. Order items by impact within each category
