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

   Set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET`
   with a private, randomly generated value.

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

   The frontend uses the API at `http://localhost:5000/api`.

## Validation

From `frontend`, run `npm run build` to create a production build and
`npm run lint` to run ESLint.

## Environment and credentials

Never commit `.env` files, tokens, database credentials, or private keys.
`backend/.env.example` contains placeholders only. Configure deployment
secrets through the hosting provider's environment settings.
