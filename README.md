# Quiz Project (Frontend + Backend)

Backend (Express) lives in `/server`. Frontend is the single `index.html` at project root.

Quick start (locally):

1. Create a `.env` in `/server` based on `.env.example` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```powershell
cd server
npm install
npm run dev
```

3. Open `index.html` in browser or serve it via static hosting. Update `API_URL` in the front-end JS if needed.

Deploy:

- Frontend: Netlify (deploy `index.html` + assets)
- Backend: Render (deploy `/server`, set environment variables on Render)
- Database: MongoDB Atlas

Socket.IO is used for real-time broadcasting of newly created tests and submitted results.
