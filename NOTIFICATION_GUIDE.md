# Notification System Documentation

## Overview
The app uses **Sonner** for modern, non-blocking toast notifications. This provides a consistent, professional notification experience across the entire application.

## Features
- ✅ Non-blocking toast notifications (no modal dialogs)
- ✅ Auto-dismiss with customizable duration
- ✅ Rich colors for success, error, warning, and info states
- ✅ Action buttons with custom callbacks
- ✅ Queue system for multiple notifications
- ✅ Pause on page hidden
- ✅ Close button on each notification
- ✅ Top-right positioning (configurable)

## Setup
The `NotificationProvider` is already wrapped around the entire app in `index.tsx`. No additional setup needed.

## Usage

### Basic Usage
```tsx
import { useNotification } from './components/NotificationProvider';

function MyComponent() {
  const { success, error, warning, info } = useNotification();

  return (
    <button onClick={() => success('Operation completed!')}>
      Show Success
    </button>
  );
}
```

### Notification Types

#### Success
```tsx
success('Profile updated successfully');
```

#### Error
```tsx
error('Failed to process payment');
```

#### Warning
```tsx
warning('This action cannot be undone');
```

#### Info
```tsx
info('New updates available');
```

### Advanced Options
```tsx
success('Profile updated!', {
  duration: 5000, // Auto-dismiss after 5 seconds (default: 4000)
  description: 'Your changes have been saved', // Optional sub-text
  action: {
    label: 'Undo',
    onClick: () => handleUndo()
  }
});
```

### Generic Notify
```tsx
const { notify } = useNotification();

notify('Custom message', 'success', {
  duration: 3000,
  action: { label: 'Click me', onClick: () => {} }
});
```

## Examples in Codebase

### In App.tsx
```tsx
const { success, error } = useNotification();

try {
  await performAction();
  success('Action completed!');
} catch (err) {
  error('Action failed: ' + err.message);
}
```

### In ReportIssueModal.tsx
```tsx
const { success, error } = useNotification();

const handleSubmit = async () => {
  if (!title.trim()) {
    error('Please enter a report title');
    return;
  }
  
  try {
    await createReport({ title, description, ... });
    success('Thank you — report submitted successfully');
    onClose();
  } catch (err) {
    error(err.message);
  }
};
```

### In Auth.tsx
```tsx
const { success, error } = useNotification();

const handleSendCode = async () => {
  try {
    await sendOTP({ email });
    success(`Login code sent to ${email}`);
  } catch (err) {
    error(err.message);
  }
};
```

## Styling
Sonner notifications use Tailwind CSS and are automatically styled. Customize by modifying the `Toaster` component props in `NotificationProvider.tsx`:

```tsx
<Toaster 
  position="top-right"           // top-left, top-center, bottom-*
  theme="light"                  // light, dark, system
  richColors                     // Use rich colors for different types
  expand={true}                  // Expand notifications on hover
  closeButton                    // Show close button
  pauseWhenPageIsHidden          // Pause when page is hidden
/>
```

## Best Practices

1. **Use specific error messages** - Help users understand what went wrong
2. **Include action buttons** - Allow users to undo or retry operations
3. **Keep messages concise** - Avoid long, wordy notifications
4. **Match notification type** - Use `error` for failures, `success` for achievements
5. **Never show alerts()** - Use notifications instead

## Migration Guide
Replace all `alert()` calls with appropriate notifications:

**Before:**
```tsx
alert('Profile saved');
```

**After:**
```tsx
const { success } = useNotification();
success('Profile saved');
```

## Troubleshooting

### Notifications not appearing?
- Ensure component is wrapped with `useNotification()` hook
- Check that `NotificationProvider` wraps the App in `index.tsx`
- Verify no CSS is hiding the Toaster element

### Notifications disappearing too fast?
- Increase `duration` option: `success('message', { duration: 6000 })`

### Need to hide Toaster temporarily?
- Unwrap component from `NotificationProvider` scope
- Or set `duration: 0` (requires manual close button click)

## API Reference

### `useNotification()` Hook

Returns:
- `success(message, options?)` - Show success notification
- `error(message, options?)` - Show error notification
- `warning(message, options?)` - Show warning notification
- `info(message, options?)` - Show info notification
- `notify(message, type, options?)` - Show generic notification

### Options Interface
```typescript
interface NotificationOptions {
  duration?: number;           // Auto-dismiss milliseconds
  action?: {
    label: string;            // Button label
    onClick: () => void;      // Callback function
  };
  description?: string;        // Optional sub-text
}
```
