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
| `/forgot-password` | Public | Request OTP → `/forgot-password/reset` (mock OTP: `123456`) |
| `/role-select` | Public | Legacy — redirects to sign up |
| `/onboarding` | Authenticated | Find church or set up branch |
| `/onboarding/discover` | Authenticated | Browse/search branches |
| `/onboarding/setup-branch` | Authenticated | Pastor branch setup wizard |
| `/onboarding/setup-branch/pending` | Authenticated | Setup request pending approval |
| `/onboarding/branch/[slug]` | Authenticated | Branch detail + join |
| `/account/branches` | Authenticated | My branches — switch, leave, pending badges |
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
| `branchService` | Mock (catalogue + active branch persistence) | [`src/services/branch.service.ts`](src/services/branch.service.ts) |

Legacy feature mocks live under `src/features/**/*.data.ts` and are re-exported from [`src/mocks/index.ts`](src/mocks/index.ts). New fixtures go in `src/mocks/fixtures/`.

**MSW** is not wired yet; Sprint 1 may add it for realistic loading/error states.

### Dev test accounts

| Email | Password | Result after sign-in |
|-------|----------|----------------------|
| `pastor@mfm.org` | any | Seeded with MFM Ikeja + Abuja → pastor dashboard |
| new signup | any | No branches → onboarding hub |

Invite codes in dev: `MFM-ABUJA` (instant join), `MFM-IKEJA` / `GRACE-2024` (pending approval).

### Branch context (Sprint 2)

- `BranchProvider` in [`src/app/_layout.tsx`](src/app/_layout.tsx) syncs branch state after auth
- Hooks: [`useActiveBranch()`](src/hooks/use-active-branch.ts), [`useMyBranches()`](src/hooks/use-my-branches.ts)
- Active branch id persisted under `pastorly.activeBranch` (per user)
- Minimal switcher on pastor/member home when the user has multiple active branches

Sign in as `pastor@mfm.org` to switch between **MFM Ikeja** and **MFM Abuja**.

### My branches (Sprint 3)

- Route: [`/(app)/account/branches`](src/app/(app)/account/branches.tsx)
- Header branch switcher on pastor dashboard and tab screens
- Leave branch flow with confirmation (blocks sole `branch_admin`)
- Pending approval badges on onboarding and My branches

### Discover & join (Sprint 4)

- Route: [`/(app)/onboarding/discover`](src/app/(app)/onboarding/discover.tsx) — search/filter catalogue
- Branch detail: [`/(app)/onboarding/branch/[slug]`](src/app/(app)/onboarding/branch/[slug].tsx)
- `branchService.joinBranch` + `membershipService.cancelPending`
- Open branches join instantly; approval-required branches go pending

### Pastor setup wizard (Sprint 5)

- Wizard: [`/(app)/onboarding/setup-branch`](src/app/(app)/onboarding/setup-branch/index.tsx) — network → branch → contact → review
- Pending screen: [`/(app)/onboarding/setup-branch/pending`](src/app/(app)/onboarding/setup-branch/pending.tsx)
- `branchService.submitBranchSetup` stores a pending request (no admin access until approved)
- Dev: **Simulate approval** on the pending screen calls `branchServiceDev.approveSetupRequest`

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
| **2** | Branch context | Complete — `BranchProvider`, `useActiveBranch`, active branch persistence |
| **3** | My branches & switcher | Complete — header switcher, leave flow, pending badges |
| **4** | Discover & join | Complete — browse, branch detail, join, cancel pending |
| **5** | Pastor setup wizard | Complete — 4-step wizard, pending approval, dev approve |
| **6+** | Platform admin, branch admin shell | Planned |

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
