# Samridhi Gupta Portfolio

This repository contains a **fully functional MERN stack personal portfolio** showcasing Samridhi's identity, skills, projects, and experience.

## Features
- Pixel‑art design with cream/sage/orange palette.
- Dark/Light (Night Desk/Day Desk) themes.
- Typewriter / ASCII glitch effect in Hero.
- Interactive guest‑book with backend moderation.
- Resume download (PDF & DOCX) served via Express.
- Contact form persisting messages to MongoDB.
- Animated skill bars and scroll‑triggered section entrances.
- Deployed frontend (Vite) and backend (Express) ready.

## Setup
1. Clone the repo.
2. Create a `.env` file in `server/` based on `.env.example`:
   ```
   MONGODB_URI=<your‑atlas‑connection‑string>
   ADMIN_SECRET=<your‑admin‑passcode>
   CLIENT_ORIGIN=http://localhost:3000
   ```
3. Install dependencies:
   ```
   cd server && npm install
   cd ../client && npm install
   ```
4. Run development servers:
   ```
   npm run dev   # from server (starts Express on 5000)
   npm run dev   # from client (starts Vite on 3000)
   ```
5. Build production bundle:
   ```
   cd client && npm run build
   ```

## Deployment
- Frontend can be deployed to Vercel/Netlify (static `dist/`).
- Backend can be deployed to Render/Railway. Ensure environment variables are set.

## Notes
- Do **not** commit `.env` or any secrets.
- All assets are located in `assets/` and `documents/`.
- The repository follows the assignment checklist for MERN Portfolio.
