# Styling Patterns

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
