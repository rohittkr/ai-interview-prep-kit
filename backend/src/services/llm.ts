import { Kit, Requirement, Question } from '../lib/types';

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const configuredModel =
    process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  const models = [
    configuredModel,
    ...(configuredModel !== 'gemini-3.1-flash-lite'
      ? ['gemini-3.1-flash-lite']
      : [])
  ];

  const temporaryStatuses = [429, 500, 502, 503, 504];

  let lastError = '';

  for (const model of models) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` +
      `?key=${encodeURIComponent(key)}`;

    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      const body = await response.text();

      if (response.ok) {
        const jsonResponse: any = JSON.parse(body);

        const text =
          jsonResponse.candidates?.[0]?.content?.parts
            ?.map((part: any) => part.text || '')
            .join('') || '';

        if (!text) {
          throw new Error(
            `Gemini returned an empty response using model ${model}`
          );
        }

        console.log(
          `Gemini generation succeeded using ${model}`
        );

        return text;
      }

      lastError =
        `LLM HTTP ${response.status}: ${body.slice(0, 1000)}`;

      if (temporaryStatuses.includes(response.status)) {
        if (attempt < 1) {
          const retryAfter =
            response.headers.get('retry-after');

          const retrySeconds = retryAfter
            ? Number(retryAfter)
            : NaN;

          const delay = Number.isFinite(retrySeconds)
            ? Math.max(1000, retrySeconds * 1000)
            : 2000;

          console.log(
            `Gemini ${response.status} on ${model}; ` +
              `retrying in ${delay}ms (attempt 2/2)`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, delay)
          );

          continue;
        }

        console.warn(
          `Gemini model ${model} unavailable after retries. ` +
            `Trying fallback model if available.`
        );

        break;
      }

      throw new Error(lastError);
    }
  }

  throw new Error(
    lastError ||
      'All configured Gemini models are temporarily unavailable'
  );
}

function json<T>(value: string): T {
  const clean = value
    .replace(/^```json\s*/, '')
    .replace(/```$/, '')
    .trim();

  return JSON.parse(clean);
}

export async function extractJD(jd: string) {
  return json<{
    company: string;
    role: string;
    location: string;
    seniority: string;
    responsibilities: string[];
    requirements: Requirement[];
  }>(
    await callGemini(`
You are a requirements extraction engine.

Extract ONLY facts explicitly present in the supplied job description.

Never invent requirements.

Return JSON with:
{
  "company": string,
  "role": string,
  "location": string,
  "seniority": string,
  "responsibilities": string[],
  "requirements": []
}

Each requirement must have:
- id: r1, r2, r3...
- text
- kind: technical | behavioural | domain
- priority: must | nice

Rules:
- Treat explicit required/must/need requirements as "must".
- Treat bonus/nice/preferred requirements as "nice".
- Do not infer information that is not present in the JD.

Job description:
${jd.slice(0, 50000)}
`)
  );
}

export async function generateQuestions(
  reqs: Requirement[],
  context: string
) {
  const questions = await json<Question[]>(
    await callGemini(`
Generate interview questions for the supplied requirements using the supplied company/research context.

Generate separate questions for:
- technical
- behavioural
- system-design
- company-fit

where relevant.

Every question MUST reference one or more existing requirement IDs.

Do not invent company facts.

IMPORTANT DIFFICULTY RULE:
The "difficulty" field MUST be exactly one of:
1
2
3

Use:
1 = easy
2 = medium
3 = hard

The difficulty MUST be a JSON number, NOT a string.

Never return:
- 0
- 4
- 5
- "easy"
- "medium"
- "hard"
- any other value

Return a JSON array only.

Each question should have this structure:

{
  "id": "q1",
  "requirement_ids": ["r1"],
  "category": "technical",
  "prompt": "...",
  "answer_outline": "...",
  "difficulty": 1
}

Requirements:
${JSON.stringify(reqs)}

Context:
${context.slice(0, 50000)}
`)
  );

  return questions.map((question: any) => {
    const numericDifficulty = Number(question.difficulty);

    let difficulty: 1 | 2 | 3;

    if (Number.isFinite(numericDifficulty)) {
      difficulty = Math.min(
        3,
        Math.max(1, Math.round(numericDifficulty))
      ) as 1 | 2 | 3;
    } else {
      difficulty = 2;
    }

    return {
      ...question,
      difficulty
    };
  });
}

export async function generateGapQuestions(
  gaps: Requirement[],
  context: string
) {
  return generateQuestions(gaps, context);
}

export async function generateBrief(
  company: string,
  pages: string,
  research: string
) {
  return json<Kit['company_brief']>(
    await callGemini(`
Create a factual company brief.

Use ONLY the supplied text.

If evidence is missing, explicitly say so.

Never invent company facts.

Return JSON:

{
  "summary": "...",
  "what_they_do": "...",
  "sources": []
}

Company:
${company}

Pages:
${pages.slice(0, 50000)}

Public interview research:
${research.slice(0, 20000)}
`)
  );
}

export async function generateFlashcards(
  reqs: Requirement[],
  questions: Question[]
) {
  return json<Kit['flashcards']>(
    await callGemini(`
Create concise interview flashcards from the supplied requirements and questions.

Use ONLY the supplied material.

Return a JSON array.

Each flashcard must have:

{
  "id": "f1",
  "front": "...",
  "back": "...",
  "requirement_ids": ["r1"]
}

Do not invent company facts.

Requirements:
${JSON.stringify(reqs)}

Questions:
${JSON.stringify(questions)}
`)
  );
}