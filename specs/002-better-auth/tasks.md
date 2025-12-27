# Tasks: Enhanced Authentication System with Better Auth

**Input**: Design documents from `/specs/002-better-auth/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/auth-api.yaml ✓

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **API Server**: `api/src/` (Express + Better Auth backend)
- **Frontend**: `src/` (Docusaurus React components)
- **Specs**: `specs/002-better-auth/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and API server structure

- [X] T001 Create `api/` directory structure per plan.md
- [X] T002 Initialize `api/package.json` with TypeScript and dependencies
- [X] T003 [P] Create `api/tsconfig.json` with strict TypeScript configuration
- [X] T004 [P] Create `.env.example` with all required environment variables
- [X] T005 [P] Update root `.gitignore` with api-specific patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Schema (Drizzle ORM)

- [X] T006 Create `api/src/lib/db.ts` - Neon serverless connection with Drizzle
- [X] T007 [P] Create `api/src/lib/schema/user.ts` - User entity per data-model.md
- [X] T008 [P] Create `api/src/lib/schema/session.ts` - Session entity per data-model.md
- [X] T009 [P] Create `api/src/lib/schema/account.ts` - Account entity per data-model.md
- [X] T010 [P] Create `api/src/lib/schema/verification.ts` - Verification token entity
- [X] T011 [P] Create `api/src/lib/schema/emailQueue.ts` - Email queue entity (custom)
- [X] T012 Create `api/src/lib/schema/index.ts` - Export all schema entities
- [X] T013 Create `api/drizzle.config.ts` - Drizzle Kit configuration
- [ ] T014 Run database migrations via Better Auth CLI

### Better Auth Configuration

- [X] T015 Create `api/src/lib/auth.ts` - Better Auth configuration with:
  - Email/password authentication enabled
  - Session config (30-day sliding, daily refresh)
  - Custom username field
  - Rate limiting (5 attempts/60s)
  - Email verification hooks
- [X] T016 Create `api/src/lib/email.ts` - Nodemailer email utility with queue support
- [X] T017 Create `api/src/types/auth.types.ts` - TypeScript types for auth

### Express API Server

- [X] T018 Create `api/src/server.ts` - Express entry point with:
  - CORS configuration for Docusaurus origin
  - Better Auth route handler at `/api/auth/*`
  - Health check endpoint
  - Error handling middleware
- [X] T019 Add `api/package.json` scripts for dev and build

### Frontend Auth Client

- [X] T020 Install frontend dependencies (react-hook-form, zod, @hookform/resolvers)
- [X] T021 Create `src/lib/auth-client.ts` - Better Auth React client configuration
- [X] T022 Create `src/components/Auth/AuthProvider.tsx` - Auth context wrapper
- [X] T023 Create `src/hooks/useAuth.ts` - Custom auth hook for components
- [X] T024 Create `src/theme/Root.js` - Wrap app with AuthProvider

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Visitors can create accounts with username, email, password and verify via email

**Independent Test**: Complete signup form, verify email, confirm user can log in

### Implementation for User Story 1

- [X] T025 [P] [US1] Create `src/components/Auth/AuthModal.css` - Shared modal styles
- [X] T026 [P] [US1] Create `src/components/Auth/PasswordStrength.tsx` - Password strength indicator
- [X] T027 [US1] Create `src/components/Auth/SignupModal.tsx` - Registration form with:
  - Username, email, password, confirm password fields
  - Password strength indicator integration
  - Terms checkbox
  - Zod validation schema
  - Loading states and error display
  - Dark/light theme support
- [X] T028 [US1] Create `src/pages/verify-email.tsx` - Email verification handler page with:
  - Token extraction from URL
  - Verification API call
  - Success/error states
  - Redirect to login on success
- [ ] T029 [US1] Add resend verification endpoint integration to SignupModal
- [X] T030 [US1] Implement email queue retry mechanism in `api/src/lib/email.ts`

**Checkpoint**: Users can register and verify email independently

---

## Phase 4: User Story 2 - User Login (Priority: P1) 🎯 MVP

**Goal**: Registered users can authenticate and maintain sessions

**Independent Test**: Enter valid credentials, verify authentication, navbar state, session persistence

### Implementation for User Story 2

- [X] T031 [US2] Create `src/components/Auth/LoginModal.tsx` - Login form with:
  - Email, password fields
  - Remember me checkbox
  - Forgot password link
  - Zod validation schema
  - Loading states and error display
  - Link to signup modal
- [X] T032 [US2] Swizzle Navbar: `npm run swizzle @docusaurus/theme-classic Navbar -- --wrap`
- [X] T033 [US2] Create `src/components/Auth/UserMenu.tsx` - Authenticated user dropdown with:
  - Avatar/username display
  - Profile link
  - Logout button
- [X] T034 [US2] Update `src/theme/Navbar/index.tsx` - Integrate auth components:
  - Show Login/Signup buttons for unauthenticated
  - Show UserMenu for authenticated
  - Handle loading state with skeleton
- [ ] T035 [US2] Test session persistence across page refreshes
- [ ] T036 [US2] Verify rate limiting blocks after 5 failed attempts

**Checkpoint**: Users can register, verify, login, and see authenticated navbar

---

## Phase 5: User Story 3 - User Logout (Priority: P2)

**Goal**: Authenticated users can securely terminate their sessions

**Independent Test**: Login, click logout, verify session terminated and navbar shows unauthenticated

### Implementation for User Story 3

- [X] T037 [US3] Add logout handler to `src/components/Auth/UserMenu.tsx`
- [X] T038 [US3] Clear local session state on logout in AuthProvider
- [ ] T039 [US3] Verify logout redirects to home and clears cookies

**Checkpoint**: Full login/logout cycle functional

---

## Phase 6: User Story 4 - Password Reset (Priority: P2)

**Goal**: Users can recover access via password reset email

**Independent Test**: Request reset, click email link, set new password, login with new password

### Implementation for User Story 4

- [X] T040 [US4] Create `src/components/Auth/ForgotPasswordModal.tsx` - Password reset request form:
  - Email field
  - Neutral success message (prevents enumeration)
  - Loading states
- [X] T041 [US4] Create `src/pages/reset-password.tsx` - Password reset page with:
  - Token extraction from URL
  - New password form with strength indicator
  - Success redirect to login
  - Expired/invalid token handling
- [X] T042 [US4] Integrate ForgotPasswordModal trigger in LoginModal
- [X] T043 [US4] Add password reset email template to `api/src/lib/email.ts`

**Checkpoint**: Complete password recovery flow functional

---

## Phase 7: User Story 5 - Profile Management (Priority: P3)

**Goal**: Authenticated users can view and update their profile information

**Independent Test**: Access profile page, edit username/name, verify changes persist

### Implementation for User Story 5

- [X] T044 [US5] Create `src/pages/profile.tsx` - User profile page with:
  - Display current user information
  - Edit username form
  - Edit name form
  - Email change section (triggers re-verification)
  - Active sessions list
- [X] T045 [US5] Add profile link to UserMenu dropdown
- [ ] T046 [US5] Create session revocation UI in profile page
- [X] T047 [US5] Style profile page for light/dark theme compatibility

**Checkpoint**: Users can manage their profile information

---

## Phase 8: User Story 6 - Password Change (Priority: P3)

**Goal**: Authenticated users can proactively change their password

**Independent Test**: Enter current password, new password, verify login works with new password

### Implementation for User Story 6

- [X] T048 [US6] Add password change section to `src/pages/profile.tsx`:
  - Current password field
  - New password field with strength indicator
  - Confirm new password field
  - Success/error feedback
- [X] T049 [US6] Validate current password before allowing change
- [X] T050 [US6] Keep user logged in after successful password change

**Checkpoint**: Users can change their password from profile

---

## Phase 9: User Story 7 - Account Deletion (Priority: P4)

**Goal**: Users can permanently delete their account and associated data

**Independent Test**: Initiate deletion, confirm action, verify account no longer exists

### Implementation for User Story 7

- [X] T051 [US7] Add danger zone section to `src/pages/profile.tsx`:
  - Clear warning about permanent deletion
  - Password confirmation field
  - Delete button with confirmation dialog
- [ ] T052 [US7] Implement cascading delete (sessions, accounts, verification tokens)
- [ ] T053 [US7] Clear email queue for deleted user
- [X] T054 [US7] Logout user and redirect after successful deletion

**Checkpoint**: Complete account deletion flow functional

---

## Phase 10: Protected Content (Cross-Cutting)

**Goal**: Gate certain content behind email verification

### Implementation

- [X] T055 Create `src/components/Auth/ProtectedContent.tsx` - Content wrapper:
  - Check authentication status
  - Check email verification status
  - Show login prompt for unauthenticated
  - Show verification prompt for unverified
  - Render children for verified users
- [ ] T056 Identify pages/sections to protect in documentation
- [ ] T057 Add ProtectedContent wrappers to identified content
- [X] T058 Style protected content prompts for theme compatibility

**Checkpoint**: Protected content properly gated

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Styling & Accessibility

- [ ] T059 [P] Review all components for light/dark theme consistency
- [ ] T060 [P] Add loading skeletons where appropriate
- [ ] T061 [P] Add smooth transitions/animations to modals
- [ ] T062 Verify ARIA labels on all form elements
- [ ] T063 Test keyboard navigation through all auth flows
- [ ] T064 Verify Lighthouse accessibility score 90+
- [ ] T065 Test responsive design on viewports 320px - 1920px

### Security Hardening

- [ ] T066 Verify password hashing (bcrypt, 10 rounds)
- [ ] T067 Verify CSRF protection on all auth endpoints
- [ ] T068 Verify secure cookie settings (httpOnly, sameSite, secure)
- [ ] T069 Test rate limiting behavior
- [ ] T070 Audit for XSS vulnerabilities in form inputs

### Documentation

- [ ] T071 [P] Update README with auth setup instructions
- [ ] T072 [P] Document environment variables for deployment
- [ ] T073 Create troubleshooting guide for common issues

---

## Phase 12: Deployment & Testing

**Purpose**: Production readiness

### Testing

- [ ] T074 [P] Write unit tests for email utility functions
- [ ] T075 [P] Write unit tests for validation schemas
- [ ] T076 Write E2E test for registration flow
- [ ] T077 Write E2E test for login flow
- [ ] T078 Write E2E test for password reset flow
- [ ] T079 Cross-browser testing (Chrome, Firefox, Safari)

### Deployment

- [ ] T080 Configure Vercel for API deployment (vercel.json)
- [ ] T081 Set up production environment variables
- [ ] T082 Configure production CORS settings
- [ ] T083 Deploy to staging environment
- [ ] T084 Final production deployment

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ─────────────────┐
                                ▼
Phase 2: Foundational ──────────┤ (BLOCKS all user stories)
                                ▼
    ┌───────────────────────────┴───────────────────────────┐
    ▼                           ▼                           ▼
Phase 3: US1 (P1)          Phase 4: US2 (P1)          Phase 5: US3 (P2)
Registration               Login                      Logout
    │                           │                           │
    └───────────────────────────┼───────────────────────────┘
                                ▼
    ┌───────────────────────────┴───────────────────────────┐
    ▼                           ▼                           ▼
Phase 6: US4 (P2)          Phase 7: US5 (P3)          Phase 8: US6 (P3)
Password Reset             Profile Mgmt              Password Change
    │                           │                           │
    └───────────────────────────┼───────────────────────────┘
                                ▼
                        Phase 9: US7 (P4)
                        Account Deletion
                                │
                                ▼
                        Phase 10: Protected Content
                                │
                                ▼
                        Phase 11: Polish
                                │
                                ▼
                        Phase 12: Deployment
```

### User Story Dependencies

- **US1 (Registration)**: Depends on Phase 2 only - standalone entry point
- **US2 (Login)**: Depends on Phase 2 - can start in parallel with US1
- **US3 (Logout)**: Depends on US2 (login must work to test logout)
- **US4 (Password Reset)**: Depends on Phase 2 - can start after Phase 2
- **US5 (Profile)**: Depends on US2 (login required)
- **US6 (Password Change)**: Depends on US5 (profile page required)
- **US7 (Account Deletion)**: Depends on US5 (profile page required)

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel
- All Phase 2 schema tasks (T007-T011) can run in parallel
- US1 and US2 can be developed in parallel after Phase 2
- All Polish tasks (T059-T065) marked [P] can run in parallel
- All E2E tests (T074-T079) marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Login)
5. **STOP and VALIDATE**: Test registration + login flow end-to-end
6. Deploy MVP with basic auth

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 + US2 → Registration & Login work
2. **+Logout**: Add US3 → Complete session lifecycle
3. **+Recovery**: Add US4 → Password reset available
4. **+Profile**: Add US5 + US6 → Users can manage accounts
5. **+GDPR**: Add US7 → Account deletion for compliance
6. **+Polish**: Add Phase 10-12 → Production ready

---

## Task Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| 1 | Setup | 5 |
| 2 | Foundational | 19 |
| 3 | US1 - Registration (P1) | 6 |
| 4 | US2 - Login (P1) | 6 |
| 5 | US3 - Logout (P2) | 3 |
| 6 | US4 - Password Reset (P2) | 4 |
| 7 | US5 - Profile (P3) | 4 |
| 8 | US6 - Password Change (P3) | 3 |
| 9 | US7 - Account Deletion (P4) | 4 |
| 10 | Protected Content | 4 |
| 11 | Polish | 15 |
| 12 | Deployment | 11 |
| **Total** | | **84** |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Reference: `specs/002-better-auth/quickstart.md` for setup commands
