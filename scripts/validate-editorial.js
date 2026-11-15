#!/usr/bin/env node
// MADARIK editorial release gate. Run before any geography fact or quiz change.
const fs=require('node:fs');
const factFiles=['data/geography/europe.json','data/geography/asia.json'];
const facts=factFiles.map(file=>({file,data:JSON.parse(fs.readFileSync(file,'utf8'))}));
const quiz=JSON.parse(fs.readFileSync('data/geography/europe-questions.json','utf8'));
const errors=[],seen=new Map();
const norm=s=>s.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/[^\p{L}\p{N}]+/gu,' ').trim().toLowerCase();
const tokens=s=>new Set(norm(s).split(' ').filter(w=>w.length>2));
const similarity=(a,b)=>{const x=tokens(a),y=tokens(b);return [...x].filter(v=>y.has(v)).length/Math.max(1,Math.min(x.size,y.size))};
for(const {file,data} of facts)for(const section of data.sections||[]){
if(section.points.length!==section.pointReviews?.length||section.points.length!==section.pointIds?.length)errors.push(section.id+': misaligned review/id arrays');
section.points.forEach((point,i)=>{
const id=file+':'+section.pointIds?.[i],review=section.pointReviews?.[i]||{};
if(!id||seen.has(id))errors.push('missing or duplicate fact ID: '+id);
if(review.status!=='verified'||!/^https:\/\//.test(review.sourceUrl||'')||!review.reviewedAt)errors.push('unapproved fact: '+id);
if(!point||point.length<20)errors.push('too short/empty fact: '+id);
const key=norm(point);
for(const [otherId,other] of seen){if(norm(other)===key)errors.push('exact duplicate: '+id+' / '+otherId);else if(similarity(point,other)>0.85&&tokens(point).size>=5)errors.push('possible semantic overlap (manual review required): '+id+' / '+otherId)}
seen.set(id,point);
});
}
const qSeen=new Set();
for(const q of quiz.questions||[]){
const k=norm(q.question);
if(qSeen.has(k))errors.push('duplicate question: '+q.id);qSeen.add(k);
if(q.status!=='verified'||!/^https:\/\//.test(q.sourceUrl||'')||!q.reviewedAt)errors.push('unapproved question: '+q.id);
if(!Array.isArray(q.options)||q.options.length<3||new Set(q.options.map(norm)).size!==q.options.length||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length)errors.push('invalid answer/distractors: '+q.id);
if(!q.explanation)errors.push('missing explanation: '+q.id);
}
if(errors.length){console.error('Editorial gate FAILED:\n'+errors.join('\n'));process.exit(1)}
console.log('Editorial structural checks passed. Source passage accuracy, question correctness and semantic overlap still require documented human/editorial review before publication.');
