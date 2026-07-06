# Auction Platform

A full-stack Auction Platform built using the MERN stack where users can register, log in, create products, start auctions, place bids, and view their bidding history.

---

## Features

- User Registration and Login
- JWT Authentication
- Create Products
- View Products
- Create Auctions
- Place Bids
- View My Bids
- MongoDB Atlas Database
- RESTful API
- Responsive React UI

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer

---

## Project Structure

```
Auction-Platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── ...
│
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/<your-github-username>/Auction-Platform.git
```

Move into the project folder:

```bash
cd Auction-Platform
```

---

# Backend Setup

Move to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL=your_email
EMAIL_PASSWORD=your_email_app_password
```

Start the backend server:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Move to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

## Products

- GET `/api/products`
- POST `/api/products`

## Auctions

- GET `/api/auctions`
- POST `/api/auctions`

## Bids

- POST `/api/bids/:auctionId`
- GET `/api/bids/my-bids`

---

# Deployment

## Frontend

Deployed on **Netlify**

## Backend

Deployed on **Render**

## Database

MongoDB Atlas

---

# Environment Variables

## Backend

```env
MONGO_URI=
JWT_SECRET=
EMAIL=
EMAIL_PASSWORD=
```

## Frontend

```env
VITE_API_URL=
```

---

# Author

Arin Jason
