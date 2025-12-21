# Copilot Instructions for Aasha Medix

## Architecture Overview

This is a monorepo containing:
- **Web App** (root): React + Vite application for the medical platform website
- **Mobile App** (`aasha_medix/`): Flutter application for mobile access

Key components:
- Authentication via Supabase with role-based access (patient, staff, admin)
- Visual content editor for React components using custom Vite plugins
- Medical services: doctor booking, diagnostic tests, medicine ordering

## Critical Workflows

### Development
- **Web**: `npm run dev` starts Vite dev server on port 3000 (accessible on all interfaces via `::`)
- **Mobile**: Standard Flutter commands (`flutter run`, `flutter build`)
- Visual editing enabled in dev mode via custom plugins (edit-mode, inline-editor, selection-mode)

### Build & Deploy
- Web: `npm run build` for production build
- Use `npm run lint` for ESLint checks

## Project Conventions

### React App
- **Imports**: Use `@/` alias for `src/` directory
- **Styling**: Tailwind CSS with custom animations via Framer Motion
- **Components**: Reusable in `src/components/`, pages in `src/pages/`
- **UI Library**: Radix UI primitives with custom variants via `class-variance-authority`
- **Auth**: Supabase integration with roles checked from `staff`, `admin_users`, `patients` tables

### Visual Editor
- Custom Vite plugins enable inline editing of JSX elements (tags: a, Button, p, h1-h6, etc.)
- Edits modify source code via AST parsing (see `plugins/visual-editor/`)
- Error handling posts messages to parent iframe for overlay display

### Data Flow
- All data via Supabase: auth, user roles, medical records
- Role hierarchy: admin > staff > patient
- Protected routes based on user roles

## Key Files
- `src/contexts/SupabaseAuthContext.jsx`: Auth and role management
- `plugins/visual-editor/vite-plugin-react-inline-editor.js`: Inline editing logic
- `src/App.jsx`: Main routing with protected routes
- `aasha_medix/lib/main.dart`: Flutter app entry

## Patterns
- Use `motion` components from Framer Motion for animations
- Lucide React icons for UI elements
- Toast notifications via Radix UI
- PDF generation with jsPDF for reports