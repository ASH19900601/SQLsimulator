export const STORAGE_KEY = 'querypath.v1';
export function emptyState() {
  return {version:1,level:'ig',year:'2026',theme:'light',drafts:{},attempts:{},bookmarks:[],history:[],lastExercise:null,lab:null,exam:null};
}
export function readState(storage = globalThis.localStorage) {
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {state:emptyState()};
    return {state:validateBackup(JSON.parse(raw))};
  } catch {
    let recovered=false;
    if(raw)try{storage.setItem(`${STORAGE_KEY}.recovery`,raw);recovered=true;}catch{}
    return {state:emptyState(),warning:recovered?"Saved records were damaged. The original data was kept; export a recovery file from Progress.":"Saved records could not be read. Check browser storage permissions or import a backup."};
  }
}
export function validateBackup(input) {
  if(!input || typeof input !== 'object' || input.version!==1) throw new Error("This file is not a supported QueryPath backup.");
  const output=emptyState();
  output.level=input.level==='as'?'as':'ig';
  output.year=['2026','2027','2028','2029'].includes(input.year)?input.year:'2026';
  output.theme=input.theme==='dark'?'dark':'light';
  const safeKey=k=>typeof k==='string'&&/^[a-z0-9_-]{1,80}$/i.test(k)&&!['__proto__','constructor','prototype'].includes(k);
  for(const [key,value] of Object.entries(input.drafts || {})) if(safeKey(key)&&typeof value==='string'&&value.length<=20000) output.drafts[key]=value;
  for(const [key,value] of Object.entries(input.attempts || {})) {
    if(!safeKey(key)||!value||typeof value!=='object') continue;
    output.attempts[key]={tries:Math.max(0,Math.min(100000,Number(value.tries)||0)),passed:!!value.passed,independent:!!value.independent,assisted:!!value.assisted,lastPassed:!!value.lastPassed,updated:Number(value.updated)||0,hints:Math.max(0,Math.min(3,Number(value.hints)||0))};
  }
  output.bookmarks=Array.isArray(input.bookmarks)?[...new Set(input.bookmarks.filter(x=>typeof x==='string'&&safeKey(x)))]:[];
  output.history=Array.isArray(input.history)?input.history.filter(x=>x&&safeKey(x.id)&&typeof x.passed==='boolean'&&Number.isFinite(x.at)).slice(-200):[];
  output.lastExercise=typeof input.lastExercise==='string'&&safeKey(input.lastExercise)?input.lastExercise:null;
  if(input.lab&&typeof input.lab==='object'&&Array.isArray(input.lab.snapshot?.bytes)&&input.lab.snapshot.bytes.length<5000000&&input.lab.snapshot.bytes.every(x=>Number.isInteger(x)&&x>=0&&x<=255)) output.lab={dataset:String(input.lab.dataset||'campus'),sql:String(input.lab.sql||'').slice(0,20000),snapshot:input.lab.snapshot};
  if(input.exam&&typeof input.exam==='object'&&Array.isArray(input.exam.ids)&&input.exam.ids.length<=20&&input.exam.ids.every(x=>typeof x==='string'&&safeKey(x))&&Number.isFinite(input.exam.deadline)) output.exam={...input.exam,ids:input.exam.ids,index:Math.max(0,Math.min(input.exam.ids.length-1,Number(input.exam.index)||0)),answers:input.exam.answers&&typeof input.exam.answers==='object'?input.exam.answers:{},finished:!!input.exam.finished};
  return output;
}
export function mergeBackup(current,incoming) {
  const out=validateBackup(incoming);
  const merged={...current,drafts:{...out.drafts,...current.drafts},attempts:{...current.attempts},bookmarks:[...new Set([...current.bookmarks,...out.bookmarks])]};
  for(const [id,a] of Object.entries(out.attempts)){
    const old=merged.attempts[id];
    merged.attempts[id]=old?{...(a.updated>old.updated?a:old),passed:a.passed||old.passed,independent:a.independent||old.independent,tries:Math.max(a.tries,old.tries)}:a;
  }
  for(const [id,draft] of Object.entries(out.drafts)) if(!current.drafts[id]) merged.drafts[id]=draft;
  merged.history=[...new Map([...current.history,...out.history].map(x=>[`${x.id}:${x.at}`,x])).values()].sort((a,b)=>a.at-b.at).slice(-200);
  return merged;
}
export function recordAttempt(state,id,passed,{assisted=false}={}){
  const previous=state.attempts[id]||{};
  state.attempts[id]={...previous,tries:(previous.tries||0)+1,passed:!!(previous.passed||passed),independent:!!(previous.independent||(passed&&!assisted)),lastPassed:passed,assisted:!!(previous.assisted||assisted),updated:Date.now()};
  state.history.push({id,passed,assisted,at:Date.now()});state.history=state.history.slice(-200);state.lastExercise=id;
}
