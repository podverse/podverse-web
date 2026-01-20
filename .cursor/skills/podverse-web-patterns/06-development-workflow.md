# Development Workflow

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
2. **When completed, remove the entire item from the document** - Do not mark as "Completed" or keep completed items in the document
3. Update the numbers (starting from 1) on todo items when others are completed.

### Integration with Plan Mode

In **plan mode**, when recommending improvements:
- If the improvement is part of the current plan → include it in the plan
- If the improvement is outside scope → document it in `docs/todo/improvements.md` and mention it in the plan summary

### Integration with Agent Mode

In **agent mode**, when you notice improvements:
- If it's a quick fix related to your task → implement it
- If it's outside scope → document it in `docs/todo/improvements.md` and continue with your task
- Don't let improvement documentation distract from completing the assigned work
