# Performance Optimization Patterns

## Performance Optimization Principles

### When to Optimize

**CRITICAL: Measure first, optimize second**

1. **Identify bottlenecks**: Use browser DevTools, Lighthouse, and Web Vitals to identify actual performance issues
2. **Set performance budgets**: Define targets for bundle size, load times, and Core Web Vitals
3. **Profile before optimizing**: Don't optimize code that isn't actually slow
4. **Optimize incrementally**: Make one change at a time and measure impact

### Performance Budgets

**Recommended targets for podverse-web**:
- **Initial JS bundle**: < 200KB gzipped
- **Total JS bundle**: < 500KB gzipped
- **Individual chunks**: < 100KB gzipped
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 800ms
- **FCP (First Contentful Paint)**: < 1.8s

### Core Web Vitals Targets

- **LCP**: Measure loading performance - should be < 2.5s
- **FID/INP**: Measure interactivity - should be < 100ms
- **CLS**: Measure visual stability - should be < 0.1

## Code Splitting Patterns

### Dynamic Imports with next/dynamic

**When to use**: For heavy components that aren't needed immediately or on every page.

**Pattern**:
```typescript
import dynamic from 'next/dynamic';

// Lazy load with SSR disabled
const MediaPlayer = dynamic(() => import('../components/MediaPlayer/MediaPlayer'), {
  ssr: false,
  loading: () => <div>Loading player...</div>
});

// Lazy load with SSR enabled (default)
const HeavyComponent = dynamic(() => import('../components/HeavyComponent'));

// Lazy load with custom loading component
const Modal = dynamic(() => import('../components/Modal/Modal'), {
  loading: () => <SkeletonLoader />
});
```

**Best practices**:
- Use `ssr: false` for components that require browser APIs
- Provide loading states for better UX
- Lazy load components that are below the fold
- Lazy load route-specific components

**Components to lazy load in podverse-web**:
- `MediaPlayer` (large component, not needed immediately)
- `Modals` (all modals loaded together)
- Settings pages
- Profile editing pages
- Admin features

### Route-Based Code Splitting

**Pattern**: Next.js automatically code-splits by route, but you can enhance it:

```typescript
// pages/settings.tsx - automatically code-split
export default function SettingsPage() {
  return <SettingsContent />;
}

// Use dynamic imports for heavy route components
const SettingsContent = dynamic(() => import('../components/Settings/SettingsContent'));
```

### Component-Level Lazy Loading

**Pattern**: Lazy load heavy components within pages:

```typescript
// In a page component
const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false
});

export default function EpisodePage() {
  const [showPlayer, setShowPlayer] = useState(false);
  
  return (
    <>
      <EpisodeInfo />
      {showPlayer && <VideoPlayer />}
    </>
  );
}
```

## Memoization Patterns

### When to Use React.memo

**Use `React.memo` when**:
- Component receives props that change frequently but component output doesn't need to update
- Component is rendered in a list with many items
- Component is expensive to render (complex calculations, many DOM nodes)
- Parent re-renders frequently but props are stable

**Pattern**:
```typescript
// ✅ Good: Memoize list items
export const ListPodcastRow = React.memo<ListPodcastRowProps>(({ podcast, onSelect }) => {
  return (
    <div onClick={() => onSelect(podcast.id)}>
      <Image src={podcast.imageUrl} alt={podcast.title} />
      <h3>{podcast.title}</h3>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if podcast data actually changed
  return prevProps.podcast.id === nextProps.podcast.id && 
         prevProps.podcast.updatedAt === nextProps.podcast.updatedAt;
});

// ❌ Bad: Memoizing simple components
export const SimpleText = React.memo(({ text }: { text: string }) => {
  return <p>{text}</p>; // Too simple, memo overhead not worth it
});
```

**High-priority components to memoize**:
- List row components (`ListPodcastRow`, `ListEpisodeRow`, `ListClipRow`)
- Form input components
- Media player components
- Components in frequently re-rendering contexts

### When to Use useMemo

**Use `useMemo` when**:
- Computing expensive values (filtering, sorting, transformations)
- Creating objects/arrays that are used as dependencies
- Preventing unnecessary recalculations

**Pattern**:
```typescript
// ✅ Good: Expensive computation
const sortedEpisodes = useMemo(() => {
  return episodes
    .filter(ep => ep.publishedAt)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}, [episodes]);

// ✅ Good: Stable object reference
const filterConfig = useMemo(() => ({
  type: 'podcast',
  sort: 'recent',
  limit: 50
}), []); // Empty deps - object never changes

// ❌ Bad: Simple computation
const doubled = useMemo(() => count * 2, [count]); // Overhead not worth it
```

**Common pitfalls**:
- Memoizing simple computations (overhead > benefit)
- Missing dependencies (causes stale values)
- Memoizing values that change frequently anyway

### When to Use useCallback

**Use `useCallback` when**:
- Passing functions as props to memoized children
- Functions are dependencies of other hooks
- Creating stable function references for context providers

**Pattern**:
```typescript
// ✅ Good: Stable handler for memoized child
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
  onItemSelect?.(id);
}, [onItemSelect]); // Include all dependencies

// ✅ Good: Function in dependency array
const handleSubmit = useCallback(() => {
  submitForm(formData);
}, [formData]);

useEffect(() => {
  // handleSubmit is stable, won't cause re-renders
  document.addEventListener('keydown', handleSubmit);
  return () => document.removeEventListener('keydown', handleSubmit);
}, [handleSubmit]);

// ❌ Bad: Unnecessary useCallback
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Not passed to memoized child, not needed
```

**Best practices**:
- Only use when function is passed to memoized component
- Include all dependencies in dependency array
- Don't use for simple inline handlers

## Image Optimization Patterns

### Next.js Image Component Best Practices

**Pattern**:
```typescript
import NextImage from 'next/image';

// Above-the-fold image (hero, main content)
<NextImage
  src={heroImage}
  alt="Hero image"
  width={1200}
  height={600}
  priority // Critical for LCP
  placeholder="blur" // Better UX
  blurDataURL={blurDataUrl} // If using blur placeholder
/>

// Below-the-fold image (lazy loaded)
<NextImage
  src={podcastImage}
  alt={podcastTitle}
  width={300}
  height={300}
  loading="lazy" // Explicit lazy loading
  sizes="(max-width: 768px) 300px, 300px" // Responsive sizing
/>

// Responsive grid image
<NextImage
  src={coverImage}
  alt={title}
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Priority Prop Usage

**Use `priority` for**:
- Hero images (above the fold)
- Logo images
- First image in a list/grid
- Images that are part of LCP (Largest Contentful Paint)

**Don't use `priority` for**:
- Images below the fold
- Images in modals
- Images in tabs/accordions that aren't initially visible
- Thumbnail images in lists

### Responsive Images with sizes

**Pattern**:
```typescript
// Single column on mobile, 2 columns on tablet, 3 on desktop
<NextImage
  src={image}
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Fixed size image
<NextImage
  src={image}
  width={100}
  height={100}
  sizes="100px" // Always 100px
/>
```

### Placeholder Strategies

**Options**:
- `placeholder="blur"` with `blurDataURL` - Best UX, requires base64 blur image
- `placeholder="empty"` - Default, no placeholder
- Custom placeholder component - For complex loading states

## Data Fetching Optimization

### Server Component Data Fetching

**Pattern**: Fetch data in server components, pass to client components:

```typescript
// ✅ Good: Server component fetches data
export default async function PodcastPage({ params }: { params: { id: string } }) {
  const { ssrApiRequestService } = await getSSRAuthService();
  const podcast = await ssrApiRequestService.reqPodcastGet({ id: params.id });
  
  return <PodcastClient podcast={podcast.data} />;
}

// ❌ Bad: Client component fetches on mount
"use client";
export default function PodcastPage({ params }: { params: { id: string } }) {
  const [podcast, setPodcast] = useState(null);
  
  useEffect(() => {
    apiRequestService.reqPodcastGet({ id: params.id }).then(res => {
      setPodcast(res.data);
    });
  }, [params.id]);
  
  // ...
}
```

### API Response Caching

**Pattern**: Use Next.js fetch caching:

```typescript
// Cache for 1 hour
const data = await fetch(url, {
  next: { revalidate: 3600 }
});

// Cache indefinitely (until manually revalidated)
const data = await fetch(url, {
  next: { revalidate: false }
});

// No cache (always fresh)
const data = await fetch(url, {
  cache: 'no-store'
});
```

**When to cache**:
- Static/semi-static data (categories, podcast metadata)
- Data that changes infrequently
- Public data that's the same for all users

**When not to cache**:
- User-specific data that changes frequently
- Real-time data
- Data that must be fresh

### Request Deduplication

**Pattern**: Next.js automatically deduplicates identical fetch requests:

```typescript
// These two fetches will be deduplicated automatically
const data1 = await fetch('https://api.example.com/podcasts');
const data2 = await fetch('https://api.example.com/podcasts');
// Only one network request is made
```

### Optimistic Updates

**Pattern**: Update UI immediately, then sync with server:

```typescript
const handleLike = async (episodeId: string) => {
  // Optimistic update
  setLikedEpisodes(prev => [...prev, episodeId]);
  
  try {
    await apiRequestService.reqEpisodeLike({ id: episodeId });
  } catch (error) {
    // Rollback on error
    setLikedEpisodes(prev => prev.filter(id => id !== episodeId));
    // Show error message
  }
};
```

## Rendering Optimization

### Server Components vs Client Components

**Use Server Components for**:
- Data fetching
- Accessing backend resources
- Large dependencies that should be excluded from client bundle
- Static content
- SEO-critical content

**Use Client Components for**:
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, useContext, etc.)
- Event listeners
- Third-party libraries that require client-side execution

### Avoiding Unnecessary Re-renders

**Patterns**:
```typescript
// ✅ Good: Stable props
const MemoizedChild = React.memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    // stable function
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}

// ❌ Bad: Unstable props
function Parent() {
  const [count, setCount] = useState(0);
  
  return <MemoizedChild onClick={() => {}} />; // New function every render
}
```

### Context Optimization

**Pattern**: Split contexts to prevent unnecessary re-renders:

```typescript
// ❌ Bad: Single context with everything
const AppContext = createContext({
  user: null,
  settings: {},
  theme: 'dark',
  // Any change causes all consumers to re-render
});

// ✅ Good: Split contexts
const UserContext = createContext({ user: null });
const SettingsContext = createContext({ settings: {} });
const ThemeContext = createContext({ theme: 'dark' });
// Only relevant consumers re-render
```

**Use context selectors** (if needed):
```typescript
// Consider using use-context-selector for large contexts
import { useContextSelector } from 'use-context-selector';

const user = useContextSelector(UserContext, state => state.user);
// Only re-renders when user changes, not other context values
```

### List Virtualization

**Pattern**: Use `react-virtuoso` for long lists:

```typescript
import { Virtuoso } from 'react-virtuoso';

// ✅ Good: Virtualized list
<Virtuoso
  data={items}
  totalCount={items.length}
  itemContent={(index) => <ListItem item={items[index]} />}
  style={{ height: '600px' }}
/>

// Memoize list items for best performance
const ListItem = React.memo(({ item }: { item: Item }) => {
  return <div>{item.name}</div>;
});
```

**When to virtualize**:
- Lists with >50 items
- Long scrollable lists
- Lists that re-render frequently

## Bundle Optimization

### Tree Shaking

**Pattern**: Use ES module imports:

```typescript
// ✅ Good: Tree-shakeable
import { specificFunction } from 'large-library';

// ❌ Bad: Imports entire library
import * as library from 'large-library';
```

### Dependency Analysis

**Tools**:
- `@next/bundle-analyzer` - Visualize bundle composition
- `webpack-bundle-analyzer` - Alternative analyzer
- `source-map-explorer` - Analyze bundle sizes

**Pattern**:
```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### Bundle Size Budgets

**Set budgets**:
- Initial JS: < 200KB gzipped
- Total JS: < 500KB gzipped
- Individual chunks: < 100KB gzipped

**Monitor in CI/CD**:
```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build:analyze": "npm run build && npm run analyze"
  }
}
```

## Performance Monitoring

### Web Vitals Tracking

**Pattern**: Track Core Web Vitals:

```typescript
// src/app/layout.tsx or analytics setup
import { onCLS, onFID, onLCP, onTTFB, onFCP } from 'next/web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  // Example: Google Analytics, custom endpoint, etc.
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onFCP(sendToAnalytics);
}
```

### Performance Budgets

**Set targets**:
- LCP: < 2.5s
- FID/INP: < 100ms
- CLS: < 0.1
- TTFB: < 800ms
- FCP: < 1.8s

## Common Performance Anti-Patterns

### ❌ Don't Do This

```typescript
// ❌ Memoizing everything
const Component = React.memo(({ text }: { text: string }) => {
  return <p>{text}</p>; // Too simple, overhead not worth it
});

// ❌ useMemo for simple computations
const doubled = useMemo(() => count * 2, [count]);

// ❌ useCallback for inline handlers
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Not passed to memoized child

// ❌ Fetching in client components when server would work
"use client";
useEffect(() => {
  fetchData().then(setData);
}, []);

// ❌ Missing image optimization
<img src={imageUrl} alt="image" />; // Use Next.js Image instead

// ❌ Loading everything synchronously
import HeavyComponent from './HeavyComponent'; // Use dynamic import
```

### ✅ Do This Instead

```typescript
// ✅ Memoize only when needed
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  // Expensive rendering
});

// ✅ useMemo for expensive computations
const sortedData = useMemo(() => {
  return largeArray.sort(/* complex sort */);
}, [largeArray]);

// ✅ useCallback for handlers passed to memoized children
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);

// ✅ Fetch in server components
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// ✅ Optimize images
<NextImage src={imageUrl} alt="image" width={400} height={300} priority />

// ✅ Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Performance Checklist

When implementing new features or optimizing existing code:

- [ ] Measure performance before optimizing
- [ ] Use server components for data fetching when possible
- [ ] Lazy load heavy components with `next/dynamic`
- [ ] Memoize expensive list items and form components
- [ ] Use `useCallback` for handlers passed to memoized children
- [ ] Use `useMemo` for expensive computations
- [ ] Optimize images with Next.js Image component
- [ ] Set `priority` prop for above-the-fold images
- [ ] Use `sizes` prop for responsive images
- [ ] Cache API responses when appropriate
- [ ] Virtualize long lists (>50 items)
- [ ] Split contexts to prevent unnecessary re-renders
- [ ] Monitor bundle size
- [ ] Track Web Vitals in production
