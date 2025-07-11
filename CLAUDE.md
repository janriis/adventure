# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with Create React App and TypeScript. The project is currently in its initial state with the default CRA setup.

## Development Commands

- `npm start` - Runs the development server on http://localhost:3000
- `npm test` - Runs tests in interactive watch mode
- `npm run build` - Creates production build in `build/` folder
- `npm run eject` - Ejects from Create React App (irreversible)

## Architecture

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Testing**: Jest with React Testing Library
- **Entry Point**: `src/index.tsx`
- **Main Component**: `src/App.tsx`

## TypeScript Configuration

- Target: ES5 with DOM libraries
- Strict mode enabled
- JSX: react-jsx (React 17+ transform)
- Module resolution: Node
- Source files: `src/` directory only

## Testing Setup

- Jest configured via react-scripts
- React Testing Library included
- Test files: `*.test.tsx` pattern
- Setup file: `src/setupTests.ts`

## Code Style

- ESLint configured with react-app preset
- TypeScript strict mode enforced
- Consistent casing required for filenames