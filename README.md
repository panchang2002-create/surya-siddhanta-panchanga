# surya-siddhanta-panchanga

**శుద్ధ సూర్యసిద్ధాంత పంచాంగ గణిత లైబ్రరీ** — A pure Surya Siddhanta panchanga engine in JavaScript, based on the corrected tables of *Siddhanta Narakanteeravamu* (1934).

రచయిత / Author: **అత్తూలి శివకుమార్ శర్మ (శివస్వామి) — Attuli Sivakumar Sharma (Sivaswamy)**, Madanapalle, Andhra Pradesh, India.

---

## తెలుగులో

పంచాంగాన్ని చేతితో లెక్కించడంలో వచ్చే తప్పులు, ప్రూఫ్ దిద్దుబాట్ల కష్టం పంచాంగకర్తలందరికీ తెలుసు. ఆ కష్టం ఇంకెవరికీ రాకూడదనే ఉద్దేశంతో ఈ గణిత ఇంజిన్‌ను అందరికీ ఉచితంగా అందిస్తున్నాను.

ఇది ఏం లెక్కిస్తుంది:

- తిథి, నక్షత్రం, యోగం, కరణం — ప్రారంభ, అంత్య సమయాలు
- సూర్యోదయ, సూర్యాస్తమయాలు (సూర్యసిద్ధాంత క్రాంతి, చరం)
- రవి, చంద్ర స్ఫుటాలు; రవి సంక్రమణాలు, రవి నక్షత్ర పాదాలు
- మాసం (అధిక, క్షయ మాసాలతో సహా), పక్షం, సంవత్సరం, ఋతువు, అయనం
- రాహుకాలం, యమగండం, గుళికకాలం, దుర్ముహూర్తం, వర్జ్యం, అమృత ఘడియలు
- ఉజ్జయిని మధ్యాహ్న ధ్రువాలతో "గణిత వివరణ" — విద్యార్థులు ప్రతి అడుగూ పరిశీలించుకోవచ్చు

గణిత పద్ధతి: అహర్గణం → సిద్ధాంత నరకంఠీరవం (1934) సవరించిన రవి, చంద్ర పట్టికలు → దేశాంతర సంస్కారం → అంగాల అంత్య సమయాలు. అయనాంశ సూర్యసిద్ధాంత త్రిప్రశ్నాధికారం ప్రకారం.

## In English

A small, dependency-free JavaScript library that computes a complete daily panchanga by the **Surya Siddhanta** method, using the corrected Sun and Moon tables of *Siddhanta Narakanteeravamu* (1934), with the bhurekha at Ujjain (75.77° E). It is written for panchanga makers, jyotisha teachers and students, and app developers who need the traditional (non-drik) reckoning with full, inspectable working.

Features: tithi / nakshatra / yoga / karana end times, sunrise and sunset by Surya Siddhanta declination, Sun and Moon sphuta, sankramanas, lunar months with adhika and kshaya handling, rahu / yama / gulika, durmuhurta, varjyam and amrita, and a step-by-step `ganita()` view of the mean positions for teaching.

### Install and use (Node.js 18+)

```bash
npm install surya-siddhanta-panchanga
```

```js
const ssp = require('surya-siddhanta-panchanga');
const place = { lat: 17.385, lon: 78.4867, tzid: 'Asia/Kolkata' };   // Hyderabad
console.log(ssp.summary(2027, 4, 7, place));
```

Or from a clone: `node examples/day.js 2027-04-07 17.385 78.4867`.

### Use in a web page

```html
<script src="src/tables.js"></script>
<script src="src/engine.js"></script>
<script src="src/panchang.js"></script>
<script>
  NKEngine.init(NK_TABLES);
  const d = NKP.day(2027, 4, 7, { lat: 17.385, lon: 78.4867, tzid: 'Asia/Kolkata' });
</script>
```

### API

| Function | Returns |
|---|---|
| `summary(y, m, d, place)` | Plain JSON for one day, times as local `HH:MM` |
| `day(y, m, d, place)` | Full detail for one day (absolute minutes `t = JDN×1440 + UTC minutes`) |
| `month(y, m, place)`, `year(y, place)` | All days of a month; a year's sankramanas, masas, amavasyas, purnimas |
| `ganita(y, m, d, place)` | Ahargana, cycles, Ujjain mean-noon dhruvas and deshantara correction |
| `clock(place, t)`, `toLocal(place, t)` | Convert an absolute instant to local time |

`place` = `{ lat, lon, tzid }` with east longitude positive.

### Tests

```bash
npm test
```

Runs a golden snapshot (4 cities × 7 dates) and over 4,000 consistency checks for a full year. During development the Sun and Moon positions were also checked independently against the pure Surya Siddhanta formulas for 17,856 values.

## Credit — please keep it / దయచేసి క్రెడిట్ ఉంచండి

You may use, change and share this code freely, including in commercial apps, under the Apache License 2.0. The license requires you to keep the copyright line and the [NOTICE](NOTICE) file in every copy and derived work. A visible line such as *"Panchanga ganita: surya-siddhanta-panchanga by Attuli Sivakumar Sharma (Sivaswamy)"* in your app's About screen is requested.

ఈ కోడ్‌ను ఎవరైనా ఉచితంగా వాడుకోవచ్చు, మార్చుకోవచ్చు. కానీ కాపీరైట్ లైన్, NOTICE ఫైల్ తప్పనిసరిగా ఉంచాలి — అది లైసెన్స్ నియమం.

To cite this work in research or teaching, see [CITATION.cff](CITATION.cff).

## గురువందనం / Acknowledgements

ఈ గణితం గురువుల కృప వల్లనే సాధ్యమైంది.

మంత్రదీక్ష ఇచ్చి ఈ మార్గంలో నడిపించిన గురువులు:
- పూజ్య శ్రీ శ్రీ శ్రీ అప్పాస్వామి వారు — శ్రీ శివకోటి శ్రీ మహాలక్ష్మి శ్రీ పీఠం, అనంతపురం

సిద్ధాంత గణితం నేర్పిన గురువులు:
- బ్రహ్మశ్రీ బో. శ్రీ వేంకటేశ్వర శర్మ అవధాని సిద్ధాంతి గారు
- బ్రహ్మశ్రీ బట్టిప్రోలు తుకారాం శర్మ గారు
- శ్రీ దేవరభొట్ల సత్య సురవర్ధన శర్మ గారు

సిద్ధాంత నరకంఠీరవ గ్రంథాన్ని పరిచయం చేసిన శ్రీ తెన్నేటి శ్రీనివాస శర్మ గారికి కృతజ్ఞతలు.

With reverence to Pujya Sri Sri Sri Appaswamy (Sri Sivakoti Sri Mahalakshmi Sri Peetham, Anantapur), who gave mantra-diksha and set me on this path; to my siddhanta gurus Brahmasri Bo. Sri Venkateswara Sharma Avadhani Siddhanti, Brahmasri Bhattiprolu Tukaram Sharma and Sri Devarabhotla Satya Suravardhana Sharma; and with thanks to Sri Tenneti Srinivasa Sharma, who introduced me to Siddhanta Narakanteeravamu.

## License

Copyright 2026 Attuli Sivakumar Sharma (Sivaswamy). Licensed under the [Apache License, Version 2.0](LICENSE).
