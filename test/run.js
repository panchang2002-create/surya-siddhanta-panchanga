/*!
 * Copyright 2026 Attuli Sivakumar Sharma (Sivaswamy). Apache-2.0.
 * Tests: (1) golden snapshot — results must not change silently;
 *        (2) invariants that must hold for any correct panchanga.
 * Regenerate the snapshot only after a deliberate, reviewed ganita change:
 *   node test/run.js --update
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const ssp = require('..');

const PLACES = {
  ujjain: { lat: 23.1765, lon: 75.7885, tzid: 'Asia/Kolkata' },
  hyderabad: { lat: 17.385, lon: 78.4867, tzid: 'Asia/Kolkata' },
  chennai: { lat: 13.0827, lon: 80.2707, tzid: 'Asia/Kolkata' },
  varanasi: { lat: 25.3176, lon: 82.9739, tzid: 'Asia/Kolkata' },
};
const DATES = ['2026-01-14', '2026-03-19', '2026-08-15', '2027-04-07', '2027-10-29', '2028-02-29', '2030-06-21'];

const GOLDEN = path.join(__dirname, 'golden.json');
let failed = 0, passed = 0;
const ok = (cond, msg) => { if (cond) passed++; else { failed++; console.error('FAIL:', msg); } };

// 1. golden snapshot
const now = {};
for (const [pn, pl] of Object.entries(PLACES))
  for (const iso of DATES) { const [y, m, d] = iso.split('-').map(Number); now[`${pn} ${iso}`] = JSON.parse(JSON.stringify(ssp.summary(y, m, d, { ...pl }))); }
if (process.argv.includes('--update')) { fs.writeFileSync(GOLDEN, JSON.stringify(now, null, 1) + '\n'); console.log('golden.json updated'); }
const golden = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
for (const k of Object.keys(golden)) {
  try { assert.deepStrictEqual(now[k], golden[k]); passed++; } catch (e) { failed++; console.error('FAIL golden:', k); }
}

// 2. invariants over a full year at Ujjain
const pl = { ...PLACES.ujjain };
let prevT = null;
for (let m = 1; m <= 12; m++) {
  for (const r of ssp.month(2027, m, pl)) {
    const tag = `${r.y}-${r.m}-${r.d}`;
    ok(r.sr < r.ss && r.ss < r.sr1, `${tag}: sunrise < sunset < next sunrise`);
    const dayLen = (r.ss - r.sr) / 60;
    ok(dayLen > 10 && dayLen < 14, `${tag}: day length ${dayLen.toFixed(2)} h at Ujjain`);
    ok(r.T.length >= 1 && r.T.length <= 3, `${tag}: 1–3 tithis touch a day`);
    ok(r.N.length >= 1 && r.N.length <= 3, `${tag}: 1–3 nakshatras touch a day`);
    for (const k of ['T', 'N', 'Y', 'K']) for (let i = 1; i < r[k].length; i++) ok(r[k][i].end > r[k][i - 1].end, `${tag}: ${k} endings increase`);
    const t0 = r.T[0].idx;
    if (prevT !== null) ok(t0 === prevT || t0 === (prevT + 1) % 30 || t0 === (prevT + 2) % 30, `${tag}: tithi continuity`);
    prevT = r.T[r.T.length - 1].end < r.sr1 ? (r.T[r.T.length - 1].idx + 1) % 30 : r.T[r.T.length - 1].idx;
    ok(r.rahu.to - r.rahu.from > 60 && r.rahu.to - r.rahu.from < 110, `${tag}: rahu kalam is 1/8 of daytime`);
  }
}
const y27 = ssp.year(2027, { ...pl });
ok(y27.sank.length === 12, `2027 has 12 sankramanas (got ${y27.sank.length})`);
ok(y27.amavasya.length >= 12 && y27.amavasya.length <= 13, `2027 has 12–13 amavasyas`);

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
