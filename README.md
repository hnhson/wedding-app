# vibe-nextjs

A personal Next.js starter template for rapid web vibe coding. Clone this repo whenever starting a new web project to skip the boilerplate setup.

## Stack

- **[Next.js](https://nextjs.org)** 16 (App Router) + **React** 19
- **TypeScript**
- **Tailwind CSS** v4
- **PWA** via `@ducanh2912/next-pwa`
- **pnpm** workspaces

## Code Quality

| Tool        | Purpose                                                             |
| ----------- | ------------------------------------------------------------------- |
| ESLint      | Linting (Next.js + TypeScript rules)                                |
| Prettier    | Formatting (with Tailwind class sorting)                            |
| Husky       | Git hooks                                                           |
| lint-staged | Run linters only on staged files                                    |
| commitlint  | Enforce [Conventional Commits](https://www.conventionalcommits.org) |

### Commit types

`feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `build` · `ci` · `chore` · `revert`

## Getting Started

```bash
# 1. Clone and rename
git clone https://github.com/your-username/vibe-nextjs.git my-new-project
cd my-new-project

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start editing `src/app/page.tsx`.

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm format       # Format all files with Prettier
pnpm format:check # Check formatting without writing
pnpm type-check   # TypeScript type checking
```
