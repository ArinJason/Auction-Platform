# Atlas connection check

1. Optional: create `.env` from `.env.example` and replace the placeholder
   `MONGO_URI` with your Atlas connection string. If `dummy1/.env` is absent,
   the checker uses `backend/.env`.
2. From this folder, run:

   ```powershell
   npm install
   npm start
   ```

The script reports success only after connecting to Atlas. On failure, it prints
the connection error. It uses Cloudflare DNS (`1.1.1.1`) for Node.js SRV
lookups. Keep `.env` private and do not commit it.
