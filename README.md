# AI Interview Prep Kit

Full-stack assessment implementation for the Trao Full-Stack Engineering Assessment.

## Stack
- Next.js + Tailwind CSS frontend
- Node.js + Express + TypeScript backend
- MongoDB via Mongoose
- Gemini API via REST (provider/model configurable)
- Cheerio-based website retrieval
- JWT authentication

## Features
- Registration/login/logout
- JD + company URL + days input
- Dynamic company crawl/link ranking
- Public interview-research search via configurable search endpoint
- Multi-step AI generation: extraction -> research -> questions -> coverage -> gap pass -> flashcards -> deterministic schedule
- Exact Appendix A kit contract
- Editing/add/delete/reorder questions and flashcards
- Section regeneration without replacing edited/pinned items
- Flashcard practice with confidence tracking
- Batch command: `npm run evaluate -- --input cases.json --output kits.json`
- Tests for coverage, schedule, structure validation

## Quick start

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment
Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_interview_prep
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash
SEARCH_URL=https://www.google.com/search?q={query}
```

Gemini currently has a Free Tier for eligible models/projects, but rate limits vary by model and project; the app therefore includes retry/backoff and a configurable provider/model. Verify your active quota in AI Studio before deployment. urlGemini billing/free-tier documentationhttps://ai.google.dev/gemini-api/docs/billing

## Deployment
Deploy the frontend and backend separately. Set `NEXT_PUBLIC_API_URL` in the frontend to the public backend URL. Set backend environment variables in your backend host. Use MongoDB Atlas for production MongoDB.

## Assessment notes
The batch command uses the same pipeline as the HTTP application. It continues after individual case failures and emits Appendix B-compatible output. Retrieved website text is treated as untrusted data, not instructions. Private/loopback URLs are rejected.
