# Deployment

## MongoDB Atlas
1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Allow the deployment provider's outbound IPs (or temporarily allow `0.0.0.0/0` for an assessment, with a strong DB password).
4. Copy the connection string into `MONGODB_URI`.

## Backend (Render/Railway/Fly or equivalent)
Root directory: `backend`
Build: `npm install && npm run build`
Start: `npm start`
Environment:
- `PORT` supplied by host
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL` = deployed frontend URL
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `SEARCH_URL` optional
- `ALLOW_LOCAL_URLS=false` in production

## Frontend (Vercel)
Root directory: `frontend`
Build: `npm run build`
Environment:
- `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND/api`

## Important
Never put `GEMINI_API_KEY`, `JWT_SECRET`, or MongoDB credentials in the frontend. They belong only in backend environment variables.

## Batch evaluation
Run from backend:
```bash
npm run evaluate -- --input cases.json --output kits.json
```
For local assessment fixtures that intentionally use localhost company URLs, set `ALLOW_LOCAL_URLS=true` only for that evaluation process.
