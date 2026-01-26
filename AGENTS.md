# AGENTS.md

This file provides guidance to agentic coding agents working in the Laika repository.

## Build, Lint, and Test Commands

### Standard Commands

- `bun run dev` - Start development server with hot reload
- `bun run build` - TypeScript compilation + Vite production build
- `bun run lint` - Run ESLint on all files
- `bun run format` - Run Prettier formatter on all JS/TS/JSON files
- `bun run preview` - Preview production build locally

### Pre-commit Hooks

- Husky runs `lint-staged` on pre-commit
- Lint-staged runs ESLint and Prettier on staged files automatically

### Testing

- No test framework is currently configured in this project
- Manual testing is done via `bun run dev` and browser testing

## Code Style Guidelines

### TypeScript Conventions

**Type Safety (Strict Mode)**

- NEVER use `any` - prefer `unknown` or proper types
- Always use explicit return types for functions
- Prefer `interface` over `type` for object shapes
- TypeScript strict mode is enabled with all checks

**Naming Conventions**

- PascalCase: types, interfaces, components, enums
- camelCase: variables, functions, files (non-components)
- Store names end with `Store` (e.g., `useEVMTabStore`)

**Example:**

```typescript
// ✅ Correct
interface ContractABI {
  name: string
  type: string
}

const parseABI = (data: unknown): ContractABI[] | null => {
  if (typeof data === 'object' && data !== null && 'abi' in data) {
    return data.abi as ContractABI[]
  }
  return null
}

// ❌ Avoid
const parseABI = (data: any) => {
  return data.abi
}
```

### Import Organization

**Order (enforced by Prettier):**

1. Built-in Node.js modules (rare in frontend)
2. React imports
3. Third-party libraries (wagmi, viem, Zustand, TanStack, etc.)
4. Internal modules with `@/` alias
5. Relative imports

**Example:**

```typescript
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useAccount } from 'wagmi'
import { create } from 'zustand'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEVMTabStore } from '@/store/tabs'

import { LocalComponent } from './local-component'
```

### Formatting Rules (Prettier)

- Single quotes for strings
- No semicolons
- Trailing commas in multiline structures
- 2-space indentation
- 120 character line width
- Prettier auto-formats on save and pre-commit

### Component Structure

**Organization (in order):**

1. State declarations at top (React state + Zustand stores)
2. Web3 hooks (wagmi, viem)
3. Event handlers after hooks
4. Memoized values (`useMemo`, `useCallback`)
5. JSX at the end
6. Keep components under 250 lines

**Example:**

```tsx
export function ContractInteraction() {
  // 1. State declarations
  const [loading, setLoading] = useState(false)
  const { tabs, activeTabId, addTab } = useEVMTabStore()

  // 2. Web3 hooks
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  // 3. Event handlers
  const handleConnect = useCallback(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  // 4. Memoized values
  const activeContract = useMemo(() => {
    return tabs.find((tab) => tab === activeTabId)
  }, [tabs, activeTabId])

  // 5. JSX
  return <div>{/* Component JSX */}</div>
}
```

### File and Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── EnvironmentDropdown/  # Environment variable management
│   │   ├── index.tsx           # Main dropdown component
│   │   ├── EnvironmentDialog.tsx
│   │   ├── GlobalEnvironmentDialog.tsx
│   │   ├── DeleteEnvironmentDialog.tsx
│   │   ├── VariableTable.tsx   # Reusable variable table
│   │   └── EnvironmentItem.tsx
│   └── *.tsx           # Custom components (PascalCase)
├── hooks/              # Custom React hooks (camelCase, prefix 'use')
│   ├── useContractMethod.ts    # Shared contract method logic
│   ├── useVariableManager.ts   # Variable CRUD operations
│   └── useSubstitutedAddress.ts # Address variable substitution
├── lib/                # Utility functions and helpers
│   ├── utils.ts        # General utilities (cn, etc.)
│   ├── environment.ts  # Variable substitution utilities
│   └── codegens/       # Code generation utilities
├── routes/             # TanStack Router file-based routing
│   ├── __root.tsx      # Root layout
│   ├── -components/    # Route-specific components
│   │   └── EVM/        # EVM feature components
│   └── *.tsx           # Route components
├── store/              # Zustand stores (camelCase)
│   ├── tabs.ts         # Tab management (EVMTabStore)
│   ├── collections.ts  # Collections with helper functions
│   ├── environments.ts # Environment variables
│   ├── chains.ts       # Chain data
│   ├── responses.ts    # Contract responses
│   └── docs.ts         # Documentation state
└── main.tsx            # App entry point
```

### Path Aliases

- Use `@/` for all internal imports from `src/`
- Public folder assets use absolute paths: `/laika-labs.svg`

**Examples:**

```typescript
import { Button } from '@/components/ui/button'
import { useEVMTabStore } from '@/store/tabs'

import laikaLogo from '/laika-labs.svg'
```

### UI and Styling

- Use shadcn/ui components when possible before creating custom ones
- Tailwind CSS v4 for all styling
- Use Lucide React for all icons: `import { IconName } from 'lucide-react'`
- Follow "new-york" style preset for shadcn/ui
- Use existing CSS variable system for theming
- Prefer utility classes over custom CSS

### State Management (Zustand)

- Each store should have single responsibility
- Always use TypeScript interfaces
- Use persistence middleware when needed
- Export a single hook per store

**Example:**

```typescript
interface TabStore {
  tabs: string[]
  activeTabId: string | null
  addTab: (id: string) => void
  removeTab: (id: string) => void
}

export const useEVMTabStore = create<TabStore>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      addTab: (id: string) =>
        set((state) => ({
          tabs: [...state.tabs, id],
          activeTabId: id,
        })),
      removeTab: (id: string) =>
        set((state) => {
          const tabs = state.tabs.filter((t) => t !== id)
          return { tabs, activeTabId: tabs[0] || null }
        }),
    }),
    { name: 'tab-store' },
  ),
)
```

### Web3 Integration Patterns

- Use wagmi hooks: `useAccount`, `useConnect`, `useReadContract`, `useWriteContract`
- Use viem utilities: `parseAbi`, `formatEther`, `parseEther`
- Handle wallet connection states properly
- Wrap app in `EVMProvider` for Web3 functionality

### Error Handling

- Use try-catch for async operations
- Log errors with `console.error` for debugging
- Return `null` or default values on error for graceful degradation
- Show user-friendly error messages via toast (using `sonner`)

**Example:**

```typescript
const fetchContractData = async (address: string): Promise<ContractABI | null> => {
  try {
    const response = await fetch(`/api/contracts/${address}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching contract:', error)
    toast.error('Failed to fetch contract data')
    return null
  }
}
```

## Key Technologies

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: TanStack Router (file-based)
- **State**: Zustand with persistence
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Web3**: wagmi + viem + RainbowKit
- **Package Manager**: Bun

## Important Notes

- TanStack Router auto-generates `routeTree.gen.ts` - do not edit manually
- All stores use Zustand persistence to localStorage
- Components follow shadcn/ui patterns
- Monaco Editor is used for ABI display and code editing
- Allotment library for resizable panes
- Environment variables use `{{variableName}}` syntax
- Use custom hooks (`useContractMethod`, `useVariableManager`) to reduce code duplication
