import test from 'node:test';import assert from 'node:assert/strict';import {getPublishedQuizAnswers} from './publishedQuizAnswers.js';
for(const language of ['english','arabic','paid_batch'])test(`${language} cannot reuse a retired bundled answer key`,()=>{for(let day=1;day<=365;day++)assert.deepEqual(getPublishedQuizAnswers(language,day),[]);});
