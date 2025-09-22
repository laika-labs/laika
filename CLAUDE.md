# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Laika is a request builder for web3 - like Postman for blockchains. It allows users to interact with smart contracts without writing code, supporting all EVM-compatible blockchains with universal UI for ABIs.

## Development Commands

- **Development server**: `bun run dev`
- **Build**: `bun run build` (TypeScript compilation + Vite build)
- **Linting**: `bun run lint` (ESLint)
- **Formatting**: `bun run format` (Prettier)
- **Preview build**: `bun run preview`

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand with persistence middleware
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Web3**: wagmi + viem + RainbowKit for wallet connections
- **Code Editor**: Monaco Editor for ABI/code display
- **Layout**: Allotment for resizable panes

### Key Directory Structure

- `src/routes/`: File-based routing with TanStack Router
- `src/components/`: Reusable UI components (shadcn/ui based)
- `src/store/`: Zustand stores for state management
- `src/lib/`: Utility functions and helpers
- `src/hooks/`: Custom React hooks

### State Management

All state is managed through Zustand stores with persistence:

- `tabs.ts`: Tab management for contract requests
- `collections.ts`: Project collections (folders, contracts)
- `chains.ts`: Blockchain network management
- `responses.ts`: Contract call response storage
- `docs.ts`: Documentation state

### Core Features Architecture

1. **Collections**: Hierarchical organization (Collections → Folders → Smart Contracts)
2. **Contract Interaction**: Read/Write methods with ABI parsing
3. **Multi-chain Support**: EVM blockchain switching via wagmi
4. **Code Generation**: JavaScript code snippets (web3.js, ethers.js)
5. **Documentation**: Integrated ABI documentation viewer

### Code Organization Principles

#### Component Structure

1. State declarations at top
2. Event handlers after state
3. Memoize properly
4. JSX at the end
5. Keep components under 250 lines

#### TypeScript Conventions

- Do not use `any`, prefer `unknown`
- Always consider strict mode
- Use explicit return types
- PascalCase for types/interfaces
- camelCase for variables/functions
- String enums with initializers

### UI Layout Structure

The app uses a fixed layout with Allotment panes:

- Top: Announcement bar (24px)
- Header: Main navigation (48px)
- Main: Sidebar (80px) + Content area
- Footer: Status bar (32px)

### Important Files

- `src/main.tsx`: App entry point with TanStack Router setup
- `src/routes/__root.tsx`: Root layout with providers and pane structure
- `src/routeTree.gen.ts`: Auto-generated route tree (don't edit manually)
- `src/store/collections.ts`: Core data model for contracts and collections

### Code Generation

The `src/lib/codegens/` directory contains code generators for:

- JavaScript (web3.js)
- JavaScript (ethers.js)
  These generate executable code snippets from contract ABIs and user inputs.

## Development Notes

- Uses `@` alias for `./src` directory
- TanStack Router generates `routeTree.gen.ts` automatically
- All stores use Zustand persistence to localStorage
- Components follow shadcn/ui patterns with Tailwind CSS
- EVMProvider wraps wagmi for Web3 functionality
- Monaco Editor is used for ABI display and code editing
