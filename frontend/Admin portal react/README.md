# NHAA 14566 Integrated Support Portal

A fully functional React (Vite + Tailwind CSS + React Router) rebuild of the Stitch-exported
NHAA 14566 administration mockups, wired into a single connected application flow.

## Flow implemented

```
Login → 2FA Verification → Dashboard
Dashboard → Cases → Case List → Select Case → Case Details
  Case Details tabs: Complaint · Person Information · AI-Assisted Assessment ·
                      Professional Review · Case History · Follow-up
Dashboard sidebar: Cases · Professionals · Follow-ups · Alerts · Reports
Header profile menu: Admin Profile · Security · Access & Permissions · Settings · Logout
Header search: opens a global search modal across Cases, Professionals, Follow-ups
```

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

Login with any username/password — the demo auth flow accepts anything and moves you into the
6-digit 2FA screen (also accepts any 6 digits) before landing on the Dashboard.

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

- `src/context/AuthContext.jsx` — drives the login → 2FA → authenticated session flow
- `src/components/AppShell.jsx` — sidebar + header + global search shell for all authenticated pages
- `src/components/Sidebar.jsx`, `Header.jsx`, `GlobalSearch.jsx` — shared navigation chrome
- `src/pages/` — one file per screen in the flow above
- `src/data/mockData.js` — mock case, professional, follow-up, alert, and report data (swap for
  real API calls when wiring up a backend)
- `src/assets/` — official Ministry of Social Justice & Empowerment and NHAA 14566 logos, used
  on the login screen and throughout the sidebar/dashboard chrome

## Notes

- All data is mocked in `src/data/mockData.js`. Replace `findCase`, `cases`, etc. with real API
  calls when you connect a backend.
- The design system (colors, type scale, spacing, elevation) follows the original Stitch
  `DESIGN.md` tokens, ported into `tailwind.config.js`.
