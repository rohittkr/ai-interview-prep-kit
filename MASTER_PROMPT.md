# MASTER BUILD PROMPT — Trao AI Interview Prep Kit

You are an autonomous senior full-stack engineer, AI systems engineer, QA engineer, security engineer, and DevOps engineer. Build the entire application described below. Do not stop at planning. Create the complete source tree, install dependencies, run tests/builds, fix errors, and leave a deployable repository. Do not ask me to implement missing pieces manually unless an external credential is genuinely required.

## Source of truth
Use the attached assessment PDF as the authoritative specification. Preserve its exact Appendix A kit field names and Section 9 batch command. Do not invent requirements that the JD does not contain.

## Product
Build an AI Interview Preparation Kit web app. Input: job description text, company website URL, days until interview. Output: company brief, role breakdown, categorized question bank, flashcards, exact-day study schedule, and coverage report. Users can edit/reorder/add/delete content and regenerate individual sections without losing edited/pinned content. Include practice mode with confidence tracking.

## Mandatory stack
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- LLM: a genuinely available free-tier provider/model, configurable through environment variables. Prefer a provider with structured JSON output. Never hard-code credentials.
- Scraping: your choice, but dynamic link discovery/ranking is mandatory.

## Mandatory pipeline
Implement these as distinct modules/services and execute them in this order:
1. Validate input.
2. Extract requirements from pasted JD. Classify technical/behavioural/domain and must/nice. Assign stable IDs.
3. Crawl the company homepage and dynamically rank/fetch same-origin relevant links. Do not hard-code only /careers or /about. Respect robots.txt/terms as far as practical and document the retrieval approach.
4. Retrieve company/about/product/engineering/hiring evidence where discoverable.
5. Search public discussion of the company's interview process. If none is found, report that honestly.
6. Generate the company brief from retrieved evidence only.
7. Generate questions separately for requirements/categories; every question must reference requirement IDs.
8. Deterministically compare requirement IDs against question requirement_ids. Do not ask the LLM to decide coverage.
9. Generate missing questions for uncovered must-have requirements and repeat coverage validation for a bounded number of passes.
10. Generate flashcards.
11. Deterministically allocate questions across exactly the requested number of days. Every must-have requirement must appear in the schedule. Harder/higher-priority material should be earlier.
12. Validate the final kit against Appendix A before persistence.

## Exact kit contract
Every kit must contain the exact fields/names from Appendix A:
source, company_brief, role, questions, flashcards, schedule, coverage.
Requirements: id,text,kind,priority.
Questions: id,requirement_ids,category,prompt,answer_outline,difficulty.
Flashcards: id,front,back,requirement_ids.
Schedule: days_available, days[].day, focus, question_ids, minutes.
Coverage: uncovered_requirement_ids, passes.
Difficulty is integer 1–3. Minutes are integer. IDs are stable within a kit.

## Authentication/security
Implement registration/login/logout/session handling. Users must only access their own kits. Passwords must be hashed. Protect API endpoints. Validate URLs. Reject private/loopback targets in production to mitigate SSRF. For assessment batch testing, allow local URLs only behind an explicit environment flag. Treat crawled/pasted text as untrusted content, never as system instructions. Validate content types/sizes. Add timeouts and retry/backoff for external services.

## Builder state model
Represent generated/edited/pinned state explicitly. Regenerating a section may replace generated content but MUST preserve edited or pinned items and their IDs. Implement add, delete, inline edit, reorder, and category movement for questions; add/delete/edit for flashcards. Save changes without round-tripping every keystroke.

## Practice mode
One flashcard at a time. Reveal answer. Record confidence 1–3. Track covered/uncovered cards. Order subsequent practice by lowest confidence first, then never-practiced cards.

## Batch command
Implement exactly:
npm run evaluate -- --input <cases.json> --output <kits.json>
Input is an array of {id,jd,company_url,days}. Use the SAME pipeline as the web app. Continue after failures. Output Appendix B shape with version, generated_at, kits[]. A partially researched but valid kit is status ok with honest gaps; reserve failed for cases where a kit cannot be produced. Make five cases complete within fifteen minutes under reasonable free-tier rate limits.

## Frontend
Create a polished responsive UI with:
- landing/dashboard
- register/login
- new kit form
- generation progress states
- kit tabs/sections
- editable company brief
- requirement view
- question editor with drag/reorder or accessible move controls
- flashcards
- schedule
- practice mode
- clear loading/empty/error states
- mobile and keyboard usability

## Robustness
Handle invalid URL, 404, timeout, no hiring page, thin/two-line JD, no public interview discussion, invalid LLM JSON, incomplete model output, rate limiting, duplicate submission, 1-day and 60-day schedules. Never fabricate missing evidence.

## Tests
Add automated tests for:
- requirement coverage
- exact schedule day allocation
- schedule references
- Appendix A structure validation
- preservation of edited/pinned items on regeneration
- auth ownership where practical

## Deployment
Provide Dockerfiles and/or host-specific instructions for a separate Next.js frontend, Express backend, and MongoDB Atlas. Include .env.example files. Never commit secrets. Ensure production CORS uses the deployed frontend URL.

## README
Explain architecture, stack choice, setup, environment variables, LLM provider/model, retrieval approach, sequencing, deterministic coverage logic, deterministic schedule logic, state model, security/SSRF approach, retries/backoff, known limitations, deployment, tests, and exact batch command.

## Verification loop
After implementation:
1. install dependencies
2. run tests
3. run TypeScript/build checks
4. run a local end-to-end smoke test using a small deterministic mock/company site or fixture where possible
5. run the batch command with at least 2 fixture cases, including a thin JD and a site with no hiring page
6. fix all failures
7. inspect the final repository for secrets and broken imports
8. only then package the complete repository as a ZIP.

## Output
The final repository must be self-contained and ready for me to deploy. Include a concise DEPLOYMENT.md with exact Vercel/Render(or equivalent)/MongoDB Atlas steps and environment variables. Do not return pseudo-code or placeholders for core functionality.
