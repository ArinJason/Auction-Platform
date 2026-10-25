# Auction Platform

A local-development auction platform with a React/Vite frontend and an Express,
MongoDB, and Mongoose backend.

## Features

- Buyer and seller registration and login
- Auction listing, bidding, and seller auction management
- Auction winner selection when an auction is ended or reaches its end time
- Buyer dashboard with won-auction notifications

## Requirements

- Node.js and npm
- MongoDB, either local or hosted

## Setup

1. Configure the backend environment:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```

   Set `MONGO_URI` to your MongoDB connection string, replace `JWT_SECRET`
   with a private, randomly generated value, and set `FRONTEND_URL` to
   `http://localhost:5173`.

2. Install and start the backend:

   ```powershell
   cd backend
   npm install
   npm start
   ```

   The API listens on port `5000` by default.

3. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   The frontend uses the API at `http://localhost:5000/api` by default.
   `frontend/.env.example` documents the optional `VITE_API_URL` override.

## Deploy with Netlify and Render

The repository includes `netlify.toml` and `render.yaml` for deployment from
GitHub. Push the repository to GitHub, then:

1. In Render, create a Blueprint from the repository and apply `render.yaml`.
   Set `MONGO_URI` to your hosted MongoDB connection string. Render generates
   `JWT_SECRET`; keep it private.
2. After Render deploys, copy the backend service URL, such as
   `https://auction-platform-api.onrender.com`.
3. In Netlify, import the same GitHub repository. Netlify reads `netlify.toml`
   and builds the `frontend` directory. Set the `VITE_API_URL` environment
   variable to the Render backend URL (without `/api`), then deploy.
4. Copy the Netlify site URL and set Render's `FRONTEND_URL` environment
   variable to that exact origin (for example, `https://your-site.netlify.app`).
   If using more than one frontend origin, separate the origins with commas.
   Redeploy the Render service after changing environment variables.

Keep credentials in Render environment settings, Netlify build settings, or
ignored local `.env` files—never commit them to GitHub. MongoDB Atlas must also
allow connections from the deployed backend; configure its Network Access
rules for your deployment.

Render's local filesystem is ephemeral, so files written to `backend/uploads`
may not persist across deploys or restarts. Use persistent storage or an
external object-storage service if the application needs durable uploads.

## Validation

From `frontend`, run `npm run build` to create a production build and
`npm run lint` to run ESLint.

## Environment and credentials

Never commit `.env` files, tokens, database credentials, or private keys.
`backend/.env.example` contains placeholders only. Configure deployment
secrets through the hosting provider's environment settings.
