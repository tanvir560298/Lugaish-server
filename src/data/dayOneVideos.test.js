import assert from 'node:assert/strict';
import test from 'node:test';
import { DAY_ONE_VIDEOS } from './dayOneVideos.js';

test('English and Arabic Day 1 use the requested YouTube videos', () => {
  const byLanguage = new Map(DAY_ONE_VIDEOS.map(video => [video.language, video]));

  assert.equal(byLanguage.get('english')?.youtubeId, 'BAC6IiD28yg');
  assert.equal(byLanguage.get('arabic')?.youtubeId, 'DVV9_7V7WEI');
  assert.ok(DAY_ONE_VIDEOS.every(video => video.day === 1));
  assert.ok(DAY_ONE_VIDEOS.every(video => video.managedContentKey.includes(video.youtubeId)));
});

test('managed Day 1 videos have valid playlist metadata', () => {
  for (const video of DAY_ONE_VIDEOS) {
    assert.match(video.youtubeId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(video.videoTitle);
    assert.ok(video.durationMinutes > 0);
  }
});
