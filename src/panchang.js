/*!
 * surya-siddhanta-panchanga
 * Copyright 2026 Attuli Sivakumar Sharma (Sivaswamy) / అత్తూలి శివకుమార్ శర్మ (శివస్వామి)
 * Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
 * You must keep this notice in all copies and derived works.
 */
/* శివస్వామి నృసింహ తిథి చక్రం 2.0 – పంచాంగ నిర్మాణం (దిన / మాస / సంవత్సర) */
(function(G){
'use strict';
const E=G.NKEngine;
const N={
 tithi:['పాడ్యమి','విదియ','తదియ','చవితి','పంచమి','షష్ఠి','సప్తమి','అష్టమి','నవమి','దశమి','ఏకాదశి','ద్వాదశి','త్రయోదశి','చతుర్దశి','పూర్ణిమ','అమావాస్య'],
 nak:['అశ్విని','భరణి','కృత్తిక','రోహిణి','మృగశిర','ఆర్ద్ర','పునర్వసు','పుష్యమి','ఆశ్లేష','మఘ','పుబ్బ','ఉత్తర','హస్త','చిత్త','స్వాతి','విశాఖ','అనూరాధ','జ్యేష్ఠ','మూల','పూర్వాషాఢ','ఉత్తరాషాఢ','శ్రవణం','ధనిష్ఠ','శతభిషం','పూర్వాభాద్ర','ఉత్తరాభాద్ర','రేవతి'],
 yoga:['విష్కంభం','ప్రీతి','ఆయుష్మాన్','సౌభాగ్యం','శోభనం','అతిగండం','సుకర్మ','ధృతి','శూలం','గండం','వృద్ధి','ధృవం','వ్యాఘాతం','హర్షణం','వజ్రం','సిద్ధి','వ్యతీపాతం','వరీయాన్','పరిఘ','శివం','సిద్ధం','సాధ్యం','శుభం','శుక్లం','బ్రాహ్మం','ఐంద్రం','వైధృతి'],
 k7:['బవ','బాలువ','కౌలువ','తైతుల','గరజి','వణిజి','భద్ర (విష్టి)'],
 rashi:['మేషం','వృషభం','మిథునం','కర్కాటకం','సింహం','కన్య','తుల','వృశ్చికం','ధనుస్సు','మకరం','కుంభం','మీనం'],
 masa:['చైత్రం','వైశాఖం','జ్యేష్ఠం','ఆషాఢం','శ్రావణం','భాద్రపదం','ఆశ్వయుజం','కార్తీకం','మార్గశిరం','పుష్యం','మాఘం','ఫాల్గుణం'],
 vara:['ఆదివారం','సోమవారం','మంగళవారం','బుధవారం','గురువారం','శుక్రవారం','శనివారం'],
 vs:['ఆది','సోమ','మంగళ','బుధ','గురు','శుక్ర','శని'],
 ritu:['వసంత','గ్రీష్మ','వర్ష','శరత్','హేమంత','శిశిర'],
 samv:['ప్రభవ','విభవ','శుక్ల','ప్రమోదూత','ప్రజోత్పత్తి','ఆంగీరస','శ్రీముఖ','భావ','యువ','ధాత','ఈశ్వర','బహుధాన్య','ప్రమాది','విక్రమ','వృష','చిత్రభాను','స్వభాను','తారణ','పార్థివ','వ్యయ','సర్వజిత్','సర్వధారి','విరోధి','వికృతి','ఖర','నందన','విజయ','జయ','మన్మథ','దుర్ముఖి','హేవిళంబి','విళంబి','వికారి','శార్వరి','ప్లవ','శుభకృత్','శోభకృత్','క్రోధి','విశ్వావసు','పరాభవ','ప్లవంగ','కీలక','సౌమ్య','సాధారణ','విరోధికృత్','పరీధావి','ప్రమాదీచ','ఆనంద','రాక్షస','నల','పింగళ','కాళయుక్తి','సిద్ధార్థి','రౌద్రి','దుర్మతి','దుందుభి','రుధిరోద్గారి','రక్తాక్షి','క్రోధన','అక్షయ']
};
const VARJYA=[50,24,30,40,14,21,30,20,32,30,20,18,21,20,14,14,10,14,20,24,20,10,10,18,16,24,30]; // మూలకు 56 కూడా
const AMRITA=[42,48,54,52,38,35,54,44,56,54,44,42,45,44,38,38,34,38,44,48,44,34,34,42,40,48,54];
const DURM={0:[[14]],1:[[9],[12]],2:[[4],['n',7]],3:[[8]],4:[[6],[12]],5:[[4],[9]],6:[[1,2]]}; // దిన ముహూర్త సంఖ్య (n = రాత్రి)
const RAHU=[8,2,7,5,6,4,3], YAMA=[5,4,3,2,1,7,6], GULI=[7,6,5,4,3,2,1];

function name(kind,i){
 if(kind==='T') return N.tithi[i===29?15:(i%15)];
 if(kind==='N'||kind==='Q') return N.nak[kind==='Q'?Math.floor(i/4):i];
 if(kind==='Y') return N.yoga[i];
 if(kind==='K') return i===0?'కింస్తుఘ్నం':i>=57?['శకుని','చతుష్పాత్','నాగవం'][i-57]:N.k7[(i-1)%7];
 if(kind==='S'||kind==='R') return N.rashi[i];
 if(kind==='P') return N.nak[Math.floor(i/4)]+' '+(i%4+1);
}
/* time helpers: t = J*1440 + minutes */
const pad=n=>String(n).padStart(2,'0');
function hm(t){let m=Math.round(E.fmod(t,1440));if(m===1440)m=0;return [Math.floor(m/60),m%60];}
function clock24(t){const [h,m]=hm(t);return pad(h)+':'+pad(m);}
function ttdClock(t,srMin){ // ఉ/ప/సా/రా/తె
 const [h,m]=hm(t), x=h*60+m; let p;
 if(x>=srMin&&x<720)p='ఉ'; else if(x>=720&&x<960)p='ప'; else if(x>=960&&x<1140)p='సా';
 else if(x>=1140||x<180)p='రా'; else if(x>=180&&x<srMin)p='తె'; else p='ఉ';
 let h12=h%12; if(h12===0)h12=12; return p+'.'+h12+'.'+pad(m);
}
function ghati(t,sr){const g=(t-sr)/24; let G=Math.floor(g), V=Math.round((g-G)*60); if(V===60){G++;V=0;} return G+'-'+pad(V);}
function dateOf(t){return E.fromJdn(Math.floor(t/1440));}
function dstr(o){return pad(o.d)+'-'+pad(o.m)+'-'+o.y;}
/* kona-vighati -> nak-gh-vi  and  rashi° ′ ″ */
function kv(v){v=E.fmod(v,E.CIRC);const n=Math.floor(v/3600),r=v-n*3600,g=Math.floor(r/60),s=r-g*60;return n+'-'+pad(g)+'-'+pad(Math.floor(s+1e-9));}
function deg(v){let d=E.fmod(v,E.CIRC)/270;const r=Math.floor(d/30),x=d-r*30,D=Math.floor(x),mm=(x-D)*60,M=Math.floor(mm),S=Math.floor((mm-M)*60);return {r,txt:N.rashi[r]+' '+D+'° '+pad(M)+'′ '+pad(S)+'″',abs:d};}

/* కాల మండలం: t (UTC) -> స్థానిక నిమిషాల తేడా */
const FMT={};
function tzOffset(tzid,ms){
 const f=FMT[tzid]||(FMT[tzid]=new Intl.DateTimeFormat('en-US',{timeZone:tzid,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}));
 const p={}; f.formatToParts(new Date(ms)).forEach(x=>p[x.type]=x.value);
 return Math.round((Date.UTC(+p.year,+p.month-1,+p.day,(+p.hour)%24,+p.minute,+p.second)-ms)/60000);
}
const UNIX0=2440588*1440;
function prep(place){
 if(place.off) return place;
 const cache={};
 if(place.tzid&&place.tzid!=='Asia/Kolkata'){
  place.off=t=>{const k=Math.floor(t/60); if(cache[k]==null){try{cache[k]=tzOffset(place.tzid,(k*60-UNIX0)*60000);}catch(e){cache[k]=Math.round((place.tz??0)*60);}} return cache[k];};
 } else { const o=Math.round((place.tz??5.5)*60); place.off=()=>o; }
 place.L=t=>t+place.off(t);
 return place;
}
function ctx(J0,n,place){const {S,E:EV}=E.allEvents(J0,n,place);return {S,EV,place};}
/* స్థానిక తేదీ J కి సూర్యోదయ/అస్తమయాలు (UTC); ధ్రువ ప్రాంతాల్లో ఉదయం లేకపోతే స్థానిక 6:00 */
function sunTimes(J,place){
 prep(place); let best=null;
 for(const Jx of [J-1,J,J+1]){const r=E.sunRS(Jx,place.lat,place.lon,place.zen);const rise=Jx*1440+r.rise;
  if(Math.floor(place.L(rise)/1440)===J){best={rise,set:Jx*1440+r.set,polar:r.polar};break;}}
 if(!best||best.polar){const base=J*1440+360; const rise=base-place.off(base);
  return {rise,set:rise+720,polar:best?best.polar:'night',fallback:true};}
 return best;
}

/* elements overlapping [a,b) */
function spans(ev,kind,a,b){
 const out=[]; for(let i=0;i<ev.length;i++){const e=ev[i]; if(e.t<=a)continue;
  out.push({kind,idx:e.idx,name:name(kind,e.idx),end:e.t,start:i>0?ev[i-1].t:null});
  if(e.t>=b)break;}
 return out;
}
/* ---- క్షయ మాస చక్రం (14-11-2026) ----
   ధర్మసింధు: క్షయ మాసానికి ముందటి అధిక (అసంక్రాంతి) మాసం "సంసర్పం" – అన్ని కర్మలకు యోగ్యం;
   క్షయానంతర అధిక మాసం కర్మలకు వర్జ్యం. సంసర్పం నుండి క్షయం వరకు మధ్య మాసాలు కర్మలకు తరువాతి మాస నామంతో,
   క్షయ (ద్విసంక్రాంతి) మాసం కర్మలకు రెండవ సంక్రమణ నామంతో. ms: [{start,end,cnt,idx,idx2}] */
function classifyMonths(ms){
 for(const m of ms){m.kidx=m.cnt===2?m.idx2:m.idx;m.adhika=m.cnt===0;m.kshaya=m.cnt===2;m.samsarpa=false;m.postKshaya=false;}
 for(let k=0;k<ms.length;k++){if(!ms[k].kshaya)continue;let p=k-1,q=k+1;
  while(p>=0&&ms[p].cnt===1)p--; while(q<ms.length&&ms[q].cnt===1)q++;
  if(p<0||q>=ms.length||ms[p].cnt!==0||ms[q].cnt!==0||q-p>13){ms[k].incomplete=true;continue;}
  ms[p].samsarpa=true;ms[p].adhika=false;
  for(let j=p+1;j<k;j++)ms[j].kidx=E.fmod(ms[j].idx+1,12);
  ms[q].postKshaya=true;}
 return ms;}
function monthsFrom(EV){const am=EV.T.filter(e=>e.idx===29),sk=EV.S,ms=[];
 for(let i=0;i<am.length-1;i++){const a0=am[i].t,a1=am[i+1].t,ins=sk.filter(e=>e.t>a0&&e.t<=a1);let idx,idx2=null;
  if(!ins.length){const nx=sk.find(e=>e.t>a1);if(!nx)continue;idx=E.fmod(nx.idx+1,12);}
  else{idx=E.fmod(ins[0].idx+1,12);if(ins.length>1)idx2=E.fmod(ins[1].idx+1,12);}
  ms.push({start:a0,end:a1,cnt:ins.length,idx,idx2});}
 return classifyMonths(ms);}
const LC=new Map();
function lunations(J,pl){const B=Math.floor(J/240)*240,key=pl.lat+','+pl.lon+','+B;
 if(!LC.has(key)){if(LC.size>40)LC.clear();LC.set(key,monthsFrom(E.allEvents(B-420,1080,pl).E));}
 return LC.get(key);}
function masaLabel(m,short){if(!m)return'';const n=N.masa,c=x=>short?n[x].slice(0,-1):n[x];
 if(m.kshaya)return c(m.masa)+'–'+c(m.idx2)+(short?' క్ష.':' (క్షయ మాసం)');
 if(m.samsarpa)return(short?'సం.':'సంసర్ప ')+c(m.masa);
 if(m.adhika)return(short?'అ.':'అధిక ')+c(m.masa)+(m.postKshaya&&!short?' (క్షయానంతరం)':'');
 return c(m.masa)+(m.kidx!==m.masa&&!short?' (కర్మలకు '+n[m.kidx]+')':'');}
function masaAt(C,t){ const pl=C.place;
 const m=lunations(Math.floor(pl.L(t)/1440),pl).find(x=>x.start<=t&&t<x.end); if(!m) return null;
 const masa=m.idx,a0=m.start,a1=m.end;
 const st=dateOf(pl.L(a0)); let saka=st.y-78; if(masa>=9&&st.m<=4) saka-=1;
 const o={masa,adhika:m.adhika,kshaya:m.kshaya,samsarpa:m.samsarpa,postKshaya:m.postKshaya,kidx:m.kidx,idx2:m.idx2,start:a0,end:a1,saka,samv:N.samv[E.fmod(saka+11,60)],ritu:N.ritu[Math.floor(masa/2)]};
 o.label=masaLabel(o);o.short=masaLabel(o,true);return o;
}
function intervalsFromNak(Nsp,table,dur,a,b){ // వర్జ్యం / అమృతం
 const out=[];
 for(const s of Nsp){ if(s.start==null)continue; const L=s.end-s.start; const starts=[table[s.idx]]; if(table===VARJYA&&s.idx===18)starts.push(56);
  for(const g of starts){const t0=s.start+L*g/60,t1=t0+L*dur/60; if(t0>=a&&t0<b) out.push({nak:s.name,from:t0,to:t1});}}
 return out.sort((x,y)=>x.from-y.from);
}
function day(y,m,d,place){
 prep(place); const J=E.jdn(y,m,d), C=ctx(J-35,110,place);
 const st=sunTimes(J,place), st1=sunTimes(J+1,place), sr=st.rise, sr1=st1.rise;
 const srMin=Math.round(E.fmod(place.L(sr),1440));
 const vara=E.fmod(J+1,7);
 const P={J,y,m,d,place,sr,ss:st.set,sr1,srMin,vara,varaName:N.vara[vara],polar:st.polar,fallback:st.fallback};
 for(const k of ['T','N','Y','K','R','P']) P[k]=spans(C.EV[k],k,sr,sr1);
 // నక్షత్రాలు వర్జ్యం కోసం: ముందు రోజు నుండి
 const Nall=spans(C.EV.N,'N',sr-2*1440,sr1+1440);
 P.varjyam=intervalsFromNak(Nall,VARJYA,4,sr,sr1);
 P.amritam=intervalsFromNak(Nall,AMRITA,4,sr,sr1);
 const dl=(st.set-sr)/15, nl=(sr1-st.set)/15;
 P.durm=DURM[vara].map(g=>g[0]==='n'?{from:st.set+(g[1]-1)*nl,to:st.set+g[1]*nl,night:true}:{from:sr+(g[0]-1)*dl,to:sr+g[g.length-1]*dl});
 const e8=(st.set-sr)/8, part=k=>({from:sr+(k-1)*e8,to:sr+k*e8});
 P.rahu=part(RAHU[vara]); P.yama=part(YAMA[vara]); P.guli=part(GULI[vara]);
 P.masa=masaAt(C,sr);
 const ti=P.T[0].idx; P.paksha=ti<15?'శుక్ల':'కృష్ణ (బహుళ)';
 const sp=E.sphutaAt(C.S,sr); P.sun=deg(sp.s); P.moon=deg(sp.m); P.spSr=sp;
 P.ayana=(P.sun.abs>=270||P.sun.abs<90)?'ఉత్తరాయణం':'దక్షిణాయనం';
 P.sank=C.EV.S.filter(e=>e.t>=sr&&e.t<sr1).map(e=>({rashi:N.rashi[E.fmod(e.idx+1,12)],t:e.t}));
 P.pada=C.EV.P.filter(e=>e.t>=sr&&e.t<sr1).map(e=>({name:name('P',E.fmod(e.idx+1,108)),t:e.t}));
 P.sunPadaNow=name('P',Math.floor(sp.s/900));
 return P;
}
/* గణిత వివరణ – ఉజ్జయిని మధ్యాహ్న ధ్రువాలు, పదకాలు */
function ganita(y,m,d,place){
 const J=E.jdn(y,m,d),A=J-E.EPOCH,p=E.calc(A,true),DL=(place.lon-75.77)/360;
 return {J,A,kali:Math.floor(E.KALI0+A),p,DL,desh:{s:p.sg*DL,m:p.mg*DL},local:{s:E.fmod(p.sun-p.sg*DL,E.CIRC),m:E.fmod(p.moon-p.mg*DL,E.CIRC)}};
}
function month(y,m,place){const out=[];const n=new Date(Date.UTC(y,m,0)).getUTCDate();for(let d=1;d<=n;d++)out.push(day(y,m,d,place));return out;}
function year(y,place){ // జనవరి–డిసెంబర్: సంక్రమణాలు, రవి పాదాలు, మాసాలు
 prep(place); const J0=E.jdn(y,1,1),n=E.jdn(y+1,1,1)-J0,C=ctx(J0-40,n+80,place),a=J0*1440-place.off(J0*1440),b=(J0+n)*1440-place.off((J0+n)*1440);
 const sank=C.EV.S.filter(e=>e.t>=a&&e.t<b).map(e=>({rashi:N.rashi[E.fmod(e.idx+1,12)],t:e.t}));
 const pada=C.EV.P.filter(e=>e.t>=a&&e.t<b).map(e=>({name:name('P',E.fmod(e.idx+1,108)),t:e.t}));
 const am=C.EV.T.filter(e=>e.idx===29), pu=C.EV.T.filter(e=>e.idx===14);
 const masas=[];for(let i=0;i<am.length-1;i++){const mm=masaAt(C,am[i].t+1); if(mm&&am[i+1].t>a&&am[i].t<b)masas.push(mm);}
 return {sank,pada,masas,amavasya:am.filter(e=>e.t>=a&&e.t<b),purnima:pu.filter(e=>e.t>=a&&e.t<b)};
}
G.NKP={classifyMonths,monthsFrom,masaLabel,prep,tzOffset,N,day,month,year,ganita,name,clock24,ttdClock,ghati,dateOf,dstr,kv,deg,pad,sunTimes,VARJYA,AMRITA};
})(typeof window!=='undefined'?window:globalThis);
