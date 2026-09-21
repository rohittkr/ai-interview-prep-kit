import { Kit, Requirement } from './types';
export function allocateSchedule(requirements:Requirement[], questions:Kit['questions'], days:number):Kit['schedule']{
 const n=Math.max(1,Math.min(60,Math.floor(days))); const must=requirements.filter(r=>r.priority==='must');
 const byReq=new Map<string,Kit['questions']>(); for(const q of questions) for(const id of q.requirement_ids){const a=byReq.get(id)||[];a.push(q);byReq.set(id,a)}
 const ranked=[...must].sort((a,b)=>{const qa=byReq.get(a.id)||[],qb=byReq.get(b.id)||[];const sa=Math.max(...qa.map(q=>q.difficulty),1),sb=Math.max(...qb.map(q=>q.difficulty),1);return sb-sa});
 const buckets:Array<Kit['questions']>=Array.from({length:n},()=>[]); ranked.forEach((r,i)=>{const qs=byReq.get(r.id)||[]; if(qs[0]) buckets[i%n].push(qs.sort((a,b)=>b.difficulty-a.difficulty)[0]);});
 const used=new Set(buckets.flat().map(q=>q.id)); questions.filter(q=>!used.has(q.id)).sort((a,b)=>b.difficulty-a.difficulty).forEach((q,i)=>buckets[i%n].push(q));
 return {days_available:n,days:buckets.map((qs,i)=>({day:i+1,focus:qs.length?qs.slice(0,3).map(q=>q.category).filter((v,j,a)=>a.indexOf(v)===j).join(' + '):'Revision and review',question_ids:qs.map(q=>q.id),minutes:Math.max(30,Math.round((qs.reduce((s,q)=>s+30+q.difficulty*5,0)||45)/5)*5)}))};
}
