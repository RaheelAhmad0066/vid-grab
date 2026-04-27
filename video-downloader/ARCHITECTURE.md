# VidGrab - Clean Architecture Documentation 🏗️

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TopBar.jsx
│   └── PlatformBadges.jsx
├── constants/           # Application constants
│   └── platforms.js
├── hooks/              # Custom React hooks
│   ├── useVideoDownload.js
│   ├── useClipboard.js
│   └── useKeyboardShortcuts.js
├── services/           # API and external services
│   └── api.js
├── store/              # State management (Zustand)
│   └── useAppStore.js
├── utils/              # Utility functions
│   ├── validators.js
│   └── platform.js
├── assets/             # Static assets (images, icons)
├── App.jsx             # Main application component
├── App.css             # Global styles
└── main.jsx            # Application entry point
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
Each layer has a single responsibility:
- **Components**: UI rendering only
- **Hooks**: Business logic and side effects
- **Services**: API communication
- **Store**: Global state management
- **Utils**: Pure utility functions

### 2. **State Management (Zustand)**

#### Why Zustand?
- ✅ Lightweight (< 1KB)
- ✅ No boilerplate
- ✅ TypeScript ready
- ✅ DevTools support
- ✅ Easy to test

#### Store Structure
```javascript
useAppStore
├── UI State (darkMode, showSettings)
├── Download State (url, status, videoInfo, etc.)
├── History State (history array)
└── Actions (setters, toggles, loaders)
```

### 3. **Custom Hooks Pattern**

#### `useVideoDownload`
- Handles video analysis
- Manages download process
- Polls for progress
- Updates store state

#### `useClipboard`
- Paste from clipboard
- Copy to clipboard
- Share functionality
- Toast notifications

#### `useKeyboardShortcuts`
- Keyboard event handling
- Shortcut registration
- Event cleanup

### 4. **Service Layer**

#### `ApiService`
- Centralized API calls
- Error handling
- Response transformation
- URL management

```javascript
class ApiService {
  fetchVideoInfo(url)
  startDownload(url, formatId, isAudio)
  getProgress(jobId)
  getFileUrl(jobId)
}
```

### 5. **Constants Management**

#### `platforms.js`
- Platform configurations
- API endpoints
- Status enums
- Storage keys

Benefits:
- Single source of truth
- Easy to update
- Type-safe (with TypeScript)
- No magic strings

### 6. **Utility Functions**

#### Pure Functions
```javascript
isValidUrl(url)        // URL validation
formatBytes(bytes)     // File size formatting
detectPlatform(url)    // Platform detection
```

Benefits:
- Testable
- Reusable
- No side effects
- Easy to maintain

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (Business Logic)
    ↓
Service Layer (API Call)
    ↓
Store Update (Zustand)
    ↓
Component Re-render
```

## 📊 State Management Flow

### Example: Video Download

```javascript
1. User clicks "Analyze"
   ↓
2. useVideoDownload.analyzeVideo()
   ↓
3. apiService.fetchVideoInfo(url)
   ↓
4. useAppStore.setVideoInfo(data)
   ↓
5. Component re-renders with new data
```

## 🎨 Component Design

### Principles
1. **Single Responsibility**: Each component does one thing
2. **Composition**: Build complex UIs from simple components
3. **Props Down, Events Up**: Unidirectional data flow
4. **Presentational vs Container**: Separate logic from UI

### Example Component Structure

```javascript
// Presentational Component
export const TopBar = () => {
  const { darkMode, toggleDarkMode } = useAppStore()
  
  return (
    <div className="top-bar">
      <button onClick={toggleDarkMode}>
        {darkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  )
}
```

## 🧪 Testing Strategy

### Unit Tests
- Utils functions
- Custom hooks
- Service methods

### Integration Tests
- Component + Hook
- Store + Service
- Full user flows

### E2E Tests
- Critical user journeys
- Download flow
- Error scenarios

## 🚀 Performance Optimizations

### 1. **Code Splitting**
```javascript
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### 2. **Memoization**
```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

### 3. **Zustand Selectors**
```javascript
const url = useAppStore(state => state.url) // Only re-render when url changes
```

### 4. **Lazy Loading**
- Images
- Components
- Routes

## 📦 Dependencies

### Core
- **React 19**: UI library
- **Zustand**: State management
- **Framer Motion**: Animations

### UI/UX
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

### Build
- **Vite**: Build tool
- **ESLint**: Code quality

## 🔐 Best Practices

### 1. **Naming Conventions**
- Components: PascalCase (`TopBar.jsx`)
- Hooks: camelCase with 'use' prefix (`useVideoDownload.js`)
- Utils: camelCase (`validators.js`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 2. **File Organization**
- One component per file
- Co-locate related files
- Index files for exports

### 3. **Error Handling**
```javascript
try {
  const data = await apiService.fetchVideoInfo(url)
  setVideoInfo(data)
} catch (error) {
  setError(error.message)
  toast.error(error.message)
}
```

### 4. **Type Safety** (Future: TypeScript)
```typescript
interface VideoInfo {
  title: string
  thumbnail: string
  duration: string
  formats: Format[]
}
```

## 🔄 State Updates

### Immutable Updates
```javascript
// ❌ Bad
state.history.push(newItem)

// ✅ Good
set({ history: [...state.history, newItem] })
```

### Batch Updates
```javascript
set({ 
  status: 'ready',
  videoInfo: data,
  selectedFormat: data.formats[0]
})
```

## 📝 Code Style

### ESLint Rules
- No unused variables
- Consistent spacing
- Arrow functions preferred
- Destructuring encouraged

### Prettier Config
- 2 spaces indentation
- Single quotes
- Trailing commas
- Semicolons

## 🎯 Future Improvements

### 1. **TypeScript Migration**
- Type safety
- Better IDE support
- Fewer runtime errors

### 2. **React Query**
- Server state management
- Caching
- Automatic refetching

### 3. **Component Library**
- Reusable UI components
- Consistent design system
- Storybook documentation

### 4. **Testing**
- Jest + React Testing Library
- Cypress for E2E
- 80%+ code coverage

### 5. **Performance**
- React.memo for expensive components
- Virtual scrolling for history
- Service Worker for offline support

## 📚 Learning Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Patterns](https://reactpatterns.com/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn)

## 🎉 Summary

This architecture provides:
- ✅ **Scalability**: Easy to add new features
- ✅ **Maintainability**: Clear code organization
- ✅ **Testability**: Isolated, pure functions
- ✅ **Performance**: Optimized re-renders
- ✅ **Developer Experience**: Easy to understand and modify

**Clean Architecture = Happy Developers = Better Product** 🚀
