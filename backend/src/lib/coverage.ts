import { Question, Requirement } from './types';
export function uncovered(requirements:Requirement[],questions:Question[]):string[]{const covered=new Set(questions.flatMap(q=>q.requirement_ids));return requirements.filter(r=>r.priority==='must'&&!covered.has(r.id)).map(r=>r.id)}
