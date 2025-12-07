# Common UI Components

This folder contains reusable UI components that can be used throughout the application.

## Shimmer Component

A loading shimmer effect component for better user experience during data loading.

### Usage

```jsx
import { Shimmer } from '../../Common';

// Basic usage
<Shimmer />

// With custom dimensions
<Shimmer width={200} height={24} />

// With custom styling
<Shimmer
  width="100%"
  height={32}
  style={{ marginBottom: 16 }}
  borderRadius={8}
/>

// With additional CSS classes
<Shimmer className="my-custom-class" />
```

### Props

| Prop           | Type             | Default  | Description                       |
| -------------- | ---------------- | -------- | --------------------------------- |
| `width`        | string \| number | `'100%'` | Width of the shimmer element      |
| `height`       | string \| number | `16`     | Height of the shimmer element     |
| `style`        | object           | `{}`     | Additional inline styles          |
| `className`    | string           | `''`     | Additional CSS classes            |
| `borderRadius` | number           | `4`      | Border radius for rounded corners |

## Adding New Components

When adding new common components:

1. Create the component file in this folder
2. Add appropriate CSS if needed
3. Export the component in `index.js`
4. Update this README with usage documentation
