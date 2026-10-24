import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,readState,validateBackup,mergeBackup,recordAttempt,STORAGE_KEY} from '../src/state.js';
test('corrupted saved progress is retained for recovery before opening fresh state',()=>{
 const map=new Map([[STORAGE_KEY,'{broken']]);const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const result=readState(storage);assert.ok(result.warning);assert.equal(map.get(STORAGE_KEY+'.recovery'),'{broken');assert.equal(result.state.version,1);
});
test('merging a second device retains local drafts and earned mastery',()=>{
 const local=emptyState();local.drafts.a='local unfinished answer';recordAttempt(local,'a',true);
 const other=emptyState();other.drafts.a='remote';other.drafts.b='new';recordAttempt(other,'a',false);other.bookmarks=['b'];
 const merged=mergeBackup(local,other);assert.equal(merged.drafts.a,'local unfinished answer');assert.equal(merged.drafts.b,'new');assert.equal(merged.attempts.a.independent,true);assert.equal(merged.attempts.a.passed,true);assert.deepEqual(merged.bookmarks,['b']);
});
test('reference-assisted answer does not count as independent mastery',()=>{const s=emptyState();recordAttempt(s,'a',true,{assisted:true});assert.equal(s.attempts.a.independent,false);assert.equal(s.attempts.a.passed,true);});
test('invalid backup format rejected without changing current data',()=>{assert.throws(()=>validateBackup({version:9}));assert.throws(()=>validateBackup(null));const s=emptyState();s.drafts.good='SELECT * FROM STUDENT;';const data=JSON.parse('{"version":1,"drafts":{"__proto__":"bad","safe":"SELECT 1"}}');const result=mergeBackup(s,data);assert.equal(result.drafts.good,s.drafts.good);assert.equal(Object.prototype.bad,undefined);});
