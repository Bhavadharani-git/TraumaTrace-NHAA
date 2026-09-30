# NHAA 14566 Professional Portal — Screen Workflow

## Sign-in path
```text
/  Professional Login
      |  "Login & Continue to 2FA"
      v
/verify  2FA Identity Verification
      |  "Verify & Continue"
      v
/dashboard  Professional Dashboard
```

## Password recovery path
```text
/  Login --"Forgot Password?"--> /reset-password  (Step 1: officer identification)
        --"Continue to 2FA"----> /recovery-verify (Step 2: code verification)
        --"Continue"-----------> /new-password    (Step 3: set new password)
        --"Update Password"----> /                (back to login)
```

## Signed-in area (shared sidebar on every page)
```text
/dashboard     Overview: caseload metrics, priority breakdown, follow-ups, AI screening
/cases         My Cases list  --click a case row-->  /cases/:caseId  Case dossier
/follow-ups    Follow-ups management
/alerts        Alerts & notifications
/reports       My reports & casework outcomes
/profile       Profile & security settings
```

## Notes
- Every design screen from the upload is now a page in the app, with the same
  colours, type scale and layout tokens moved into the shared style sheet.
- Screens are presentation only right now: data is the static sample content from
  the design. Sign-in, case data and follow-ups need a backend to become real.
