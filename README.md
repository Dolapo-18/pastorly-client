# Pastorly Client

Mobile app for pastors and church members — prayer groups, pastoral care, and branch-scoped ministry tools. Built with **Expo SDK 56**, **Expo Router**, **NativeWind**, and **TypeScript**.

## Quick start

```bash
npm install
npx expo start
```

Open in iOS Simulator, Android emulator, or Expo Go. See [Expo docs](https://docs.expo.dev/versions/v56.0.0/) for platform setup.

## Project structure

```
src/
├── app/                 # Expo Router screens (file-based routes)
│   ├── index.tsx        # Splash → welcome
│   ├── (auth)/          # Public / unauthenticated flow
│   └── (app)/           # Authenticated app shell
├── components/          # Reusable UI (auth, common, dashboard, form, prayer)
├── constants/           # Design tokens (theme, fonts)
├── features/            # Feature-specific helpers and legacy mock data
├── hooks/
├── layouts/             # PublicLayout, AuthenticatedLayout (route guards)
├── lib/                 # Utilities (navigation, routes, color)
├── mocks/               # Mock fixtures — import from here in new code
│   └── fixtures/
├── services/            # API layer (mock today, HTTP later)
├── store/               # Zustand client state
└── types/               # Shared TypeScript contracts (auth, branch, api)
```

### Naming conventions

| Area | Convention |
|------|------------|
| Screens | `src/app/...` — Expo Router file names map to URLs |
| UI components | `src/components/{domain}/` — PascalCase files |
| Mock data | `src/mocks/` or `src/mocks/fixtures/` — not inline in screens |
| Services | `src/services/{name}.service.ts` — UI never calls fetch directly |
| Types | `src/types/` — shared contracts; feature-only types stay colocated |

## Routing

| Route | Layout | Purpose |
|-------|--------|---------|
| `/` | Root | Branded splash |
| `/welcome` | Public | Landing |
| `/login` | Public | Sign in (mock auth) |
| `/signup` | Public | Create account → onboarding |
| `/forgot-password` | Public | Password reset (mock) |
| `/role-select` | Public | Legacy — redirects to sign up |
| `/onboarding` | Authenticated | Find church or set up branch |
| `/account/profile` | Authenticated | Global profile edit |
| `/dashboard` | Authenticated | Redirects by membership state |
| `/pastor/...` | Authenticated | Pastor tabs and pushed screens |
| `/member/...` | Authenticated | Member home (placeholder) |

**Layouts:** [`src/layouts/public-layout.tsx`](src/layouts/public-layout.tsx) guards unauthenticated routes; [`src/layouts/authenticated-layout.tsx`](src/layouts/authenticated-layout.tsx) guards the app shell.

## Mock data & services

UI code should call **services**, not hardcode API responses:

```ts
import { authService } from "@/services";
import { prayerGroups } from "@/mocks";

const session = await authService.login({ email, password });
```

| Service | Status | Location |
|---------|--------|----------|
| `authService` | Mock (AsyncStorage session) | [`src/services/auth.service.ts`](src/services/auth.service.ts) |
| `membershipService` | Mock (AsyncStorage memberships) | [`src/services/membership.service.ts`](src/services/membership.service.ts) |
| `branchService` | Stub (throws until Sprint 2) | [`src/services/branch.service.ts`](src/services/branch.service.ts) |

Legacy feature mocks live under `src/features/**/*.data.ts` and are re-exported from [`src/mocks/index.ts`](src/mocks/index.ts). New fixtures go in `src/mocks/fixtures/`.

**MSW** is not wired yet; Sprint 1 may add it for realistic loading/error states.

### Dev test accounts

| Email | Password | Result after sign-in |
|-------|----------|----------------------|
| `pastor@mfm.org` | any | Seeded with MFM Ikeja + Abuja → pastor dashboard |
| new signup | any | No branches → onboarding hub |

Invite codes in dev: `GRACE-2024` (instant member), `MFM-IKEJA` (pending approval).

## Types & API contracts

Shared shapes for client and future backend:

- [`src/types/auth.ts`](src/types/auth.ts) — `User`, `Session`, `UserProfile`
- [`src/types/branch.ts`](src/types/branch.ts) — `Organization`, `Branch`, `BranchMembership`, setup requests
- [`src/types/api.ts`](src/types/api.ts) — `AuthService`, `BranchService` method signatures

Import from `@/types` or `@/types/auth`.

## Design system

Tokens: [`src/constants/theme.ts`](src/constants/theme.ts), [`tailwind.config.js`](tailwind.config.js).

Mockup reference: [`assets/mockups/pastorly-ui-screens.png`](assets/mockups/pastorly-ui-screens.png).

## Sprint status

| Sprint | Focus | Status |
|--------|-------|--------|
| **0** | Foundation (this repo structure) | Complete |
| **1** | Auth & global profile | Complete |
| **2** | Branch context | Next — `BranchProvider`, MFM seed data |
| **3+** | Switcher, discover, pastor wizard, admin | Planned |

## Scripts

```bash
npm start          # Expo dev server
npm run ios        # Expo + iOS
npm run android    # Expo + Android
npm run lint       # Expo lint
```

## Agent / contributor notes

- Read Expo v56 docs before changing navigation or native APIs: https://docs.expo.dev/versions/v56.0.0/
- See [`AGENTS.md`](AGENTS.md) for the same pointer.
- Do not commit secrets (`.env`, credentials).
