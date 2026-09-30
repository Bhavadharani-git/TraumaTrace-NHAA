# NHAA (14566) Integrated Support Portal - React

React + Vite + Tailwind CSS version of the NHAA 14566 Integrated Support Portal prototype.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

- `src/components/PortalPage.jsx` - full portal page markup as a React component
- `src/portalController.js` - step/tab workflow, modals, language & mode selection, toasts
- `src/index.css` - Tailwind layers plus custom animations (waveform, pulse ring, gauge)
- `tailwind.config.js` - gov colour tokens (govNavy, govCrimson, ...) and Inter font
- `public/` - ministry emblem and NHAA logo
