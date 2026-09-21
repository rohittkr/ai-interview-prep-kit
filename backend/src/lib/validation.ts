import { Kit } from './types';
export function validateKit(kit:Kit): string[] {
 const errors:string[]=[]; const reqIds=new Set(kit.role.requirements.map(r=>r.id)); const qIds=new Set(kit.questions.map(q=>q.id));
 if(kit.schedule.days.length!==kit.schedule.days_available) errors.push('schedule day count mismatch');
 for(const r of kit.role.requirements){if(!r.id||!r.text) errors.push('invalid requirement');}
 for(const q of kit.questions){if(!q.id||q.requirement_ids.some(id=>!reqIds.has(id))) errors.push(`question ${q.id} references unknown requirement`);if(![1,2,3].includes(q.difficulty)) errors.push(`question ${q.id} invalid difficulty`);}
 for(const d of kit.schedule.days){if(!Number.isInteger(d.minutes)||d.minutes<1) errors.push(`day ${d.day} invalid minutes`);for(const q of d.question_ids)if(!qIds.has(q))errors.push(`day ${d.day} references unknown question ${q}`);}
 return errors;
}
