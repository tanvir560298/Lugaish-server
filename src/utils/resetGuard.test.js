import test from'node:test';import assert from'node:assert/strict';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const cwd=fileURLToPath(new URL('../../',import.meta.url));
test('reset refuses implicit database selection before connecting',()=>{for(const args of[[],['archive']]){const r=spawnSync(process.execPath,['scripts/course-reset.mjs',...args],{cwd,encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/no default target/);}});
test('archive cannot execute without a backup',()=>{const r=spawnSync(process.execPath,['scripts/course-reset.mjs','archive','--database','not-a-real-target'],{cwd,encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/backup file is mandatory/);});
