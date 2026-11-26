/*!
 * surya-siddhanta-panchanga
 * Copyright 2026 Attuli Sivakumar Sharma (Sivaswamy) / అత్తూలి శివకుమార్ శర్మ (శివస్వామి)
 * Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
 * You must keep this notice in all copies and derived works.
 */
'use strict';
// Node.js entry point. The three files in src/ are plain browser scripts (they attach
// NK_TABLES, NKEngine and NKP to window/globalThis); here they are loaded into a private
// sandbox so that requiring this package never touches your own globals.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load() {
  const ctx = { console, Intl, Date, Math };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['tables.js', 'engine.js', 'panchang.js']) {
    const file = path.join(__dirname, 'src', f);
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  }
  ctx.NKEngine.init(ctx.NK_TABLES);
  return ctx;
}

const ctx = load();
const engine = ctx.NKEngine;
const P = ctx.NKP;

/**
 * Panchanga for one civil date at a place.
 * place = { lat, lon, tzid?: 'Asia/Kolkata', tz?: 5.5 }  (east longitude positive)
 * All instants in the result are absolute minutes: t = JDN*1440 + UTC minutes.
 * Use toLocal(place, t) or clock(place, t) to read them as local clock time.
 */
function day(y, m, d, place) { return P.day(y, m, d, place); }
function month(y, m, place) { return P.month(y, m, place); }
function year(y, place) { return P.year(y, place); }
function ganita(y, m, d, place) { return P.ganita(y, m, d, place); }

function toLocal(place, t) { P.prep(place); return place.L(t); }
function clock(place, t) { return P.clock24(toLocal(place, t)); }

/** A compact, JSON-friendly summary of one day (local 24-hour clock strings). */
function summary(y, m, d, place) {
  const r = day(y, m, d, place), c = t => clock(place, t);
  const list = k => r[k].map(s => ({ name: s.name, ends: s.end < r.sr1 ? c(s.end) : null }));
  return JSON.parse(JSON.stringify({
    date: P.dstr({ y, m, d }), vara: r.varaName,
    sunrise: c(r.sr), sunset: c(r.ss),
    masa: r.masa && r.masa.label, paksha: r.paksha, samvatsara: r.masa && r.masa.samv, ritu: r.masa && r.masa.ritu,
    ayana: r.ayana,
    tithi: list('T'), nakshatra: list('N'), yoga: list('Y'), karana: list('K'),
    rahu: [c(r.rahu.from), c(r.rahu.to)], yamagandam: [c(r.yama.from), c(r.yama.to)], gulika: [c(r.guli.from), c(r.guli.to)],
    varjyam: r.varjyam.map(v => [c(v.from), c(v.to)]), amritam: r.amritam.map(v => [c(v.from), c(v.to)]),
    sun: r.sun.txt, moon: r.moon.txt,
    sankramana: r.sank.map(s => ({ rashi: s.rashi, at: c(s.t) })),
  }));
}

module.exports = { day, month, year, ganita, summary, toLocal, clock, names: P.N, engine, panchanga: P };
