---
name: podverse-web-patterns
description: Common patterns and examples for the podverse-web Next.js application
version: 1.0.0
---

# Podverse-Web Development Patterns

This skill provides quick reference for common patterns used in the podverse-web codebase. Use these patterns when implementing new features or modifying existing code.

## Table of Contents

The patterns are organized into the following subject areas:

1. **[Component Patterns](01-component-patterns.md)** - Pages, Client Components, Modals, Lists, Contexts, Server/Client split
2. **[API & Data Fetching](02-api-data-fetching.md)** - API endpoint calls, SSR patterns, error handling
3. **[Styling](03-styling.md)** - SCSS Modules patterns
4. **[Configuration](04-configuration.md)** - Environment variables, constants, config object, User-Agent patterns
5. **[Code Quality](05-code-quality.md)** - Error handling, type safety, translations
6. **[Development Workflow](06-development-workflow.md)** - Plan mode vs Agent mode, documenting improvements
7. **[Reusable Utilities](07-reusable-utilities.md)** - When to use podverse-helpers
8. **[Best Practices](08-best-practices.md)** - Quick reference checklist and critical requirements
9. **[Performance Optimization](09-performance-optimization.md)** - Code splitting, memoization, image optimization, caching, monitoring

## Quick Start

For the most critical patterns, see:
- **[Best Practices Summary](08-best-practices.md)** - Quick reference checklist
- **[Translation Requirements](08-best-practices.md#translation-requirements-critical)** - CRITICAL: Always use translations
- **[Component Patterns](01-component-patterns.md)** - How to create pages, components, modals, lists
- **[Configuration](04-configuration.md)** - Environment variables and constants

## Pattern Files

### [01-component-patterns.md](01-component-patterns.md)
- Creating a New Page with SSR
- Creating a Client Component with Translations
- Creating a New Context Provider
- Adding a New Modal
- Creating a New List Component
- Server/Client Component Split Pattern

### [02-api-data-fetching.md](02-api-data-fetching.md)
- Adding a New API Endpoint Call (Client & Server patterns)
- API error handling

### [03-styling.md](03-styling.md)
- Styling with SCSS Modules
- SCSS file structure patterns

### [04-configuration.md](04-configuration.md)
- Using Constants Instead of Hardcoded Values
- Environment Variables and Configuration
- Using Config Object Instead of process.env
- Environment Variable Validation
- Updating .env Files
- User-Agent String Pattern

### [05-code-quality.md](05-code-quality.md)
- Error Handling (Catch Block Pattern, API Error Handling)
- Type Safety with podverse-helpers
- Translation Pattern

### [06-development-workflow.md](06-development-workflow.md)
- Code Improvement and Optimization Guidelines
- Plan Mode vs Agent Mode
- Documenting Out-of-Scope Improvements

### [07-reusable-utilities.md](07-reusable-utilities.md)
- When to Put Utilities in podverse-helpers
- Pattern: Moving Utilities to podverse-helpers

### [08-best-practices.md](08-best-practices.md)
- Best Practices Summary (Quick Reference Checklist)
- Translation Requirements (CRITICAL)

### [09-performance-optimization.md](09-performance-optimization.md)
- Performance Optimization Principles
- Code Splitting Patterns
- Memoization Patterns (React.memo, useMemo, useCallback)
- Image Optimization Patterns
- Data Fetching Optimization
- Rendering Optimization
- Bundle Optimization
- Performance Monitoring
- Common Anti-Patterns
