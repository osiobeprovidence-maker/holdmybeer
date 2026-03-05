User Testing System (HoldMyBeer)
================================

Overview
--------
This folder adds a lightweight user testing system into the existing app using Convex as the datastore.

What I added
- Convex schema tables: `test_sessions`, `tasks`, `task_feedback`, `final_feedback` (see `convex/schema.ts`).
- Convex server functions in `convex/api.ts` to create sessions, fetch tasks, submit feedback, seed default tasks, and an admin query.
- React components:
  - `components/usertest/TestLab.tsx` — full test flow (Intro → Task → Feedback → Final → Reward).
  - `components/usertest/AdminTests.tsx` — simple admin analytics view.
- Navigation link added to the footer (`Test Lab`).

How it works (high level)
-------------------------
- Frontend calls `api.api.getTasks` to list tasks; if none exist it will call `createDefaultTasks` to seed five example tasks.
- When a tester starts, the frontend calls `createTestSession` to create a `test_sessions` row and stores the session id locally.
- After each task, the frontend calls `submitTaskFeedback`.
- On completion, the frontend calls `submitFinalFeedback` which marks the session completed and stores final feedback.
- Admins can call `adminGetTestResponses` to retrieve all sessions, task feedback and final feedback for analytics.

How to use locally
-------------------
1. Start the app as you normally do for this repository (Vite / dev server).
2. Ensure Convex is configured and running for development — the repo already contains `convex/` server code.
3. Open the app and click the `Test Lab` link in the footer to start the test flow.
4. Admins: from any code console, call `setCurrentView('admin-tests')` or add a navigation link; the component `AdminTests` reads aggregated analytics.

Notes
-----
- This implementation integrates into the existing app (React + Tailwind + Convex) rather than switching the whole repo to Next.js. I can convert this to a Next.js app structure on request.
- The UI uses the existing Tailwind theme (dark background / white cards / amber accent).

Files edited
- `convex/schema.ts`, `convex/api.ts`
- `components/usertest/TestLab.tsx`, `components/usertest/AdminTests.tsx`
- `components/Layout.tsx` (footer link)
- `App.tsx` (imports and views)
