/*!
 * surya-siddhanta-panchanga
 * Copyright 2026 Attuli Sivakumar Sharma (Sivaswamy) / అత్తూలి శివకుమార్ శర్మ (శివస్వామి)
 * Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
 * You must keep this notice in all copies and derived works.
 */
/* శివస్వామి నృసింహ తిథి చక్రం 2.0 – గణిత ఇంజిన్ (శుద్ధ సూర్యసిద్ధాంతం, సవరించిన 1934 పట్టికలు)
   Siddhanta Narakanteeravamu (1934) corrected tables · bhurekha Ujjain 75.77°E */
(function(G){
'use strict';
const CIRC=97200, NAKU=3600;
const fdiv=(a,b)=>Math.floor(a/b), fmod=(a,b)=>((a%b)+b)%b;
const val=a=>a.reduce((s,x)=>s*60+x,0);
let SOL=null, MOON=null;
function init(T){ SOL={}; MOON={};
 if(T.s){ T.s.forEach(a=>SOL[a[0]]={day:a[0],position:a.slice(1,4),speed:a.slice(4,6),chandra:a[6],varshanka:a[7]});
          T.m.forEach(a=>MOON[a[0]]={day:a[0],position:a.slice(1,4),speed:a.slice(4,6),vruttanka:a[6]}); return; }
 T.solar.forEach(r=>SOL[r.day]=r); T.moon.forEach(r=>MOON[r.day]=r); }

/* civil date -> integer JDN (Gregorian) */
function jdn(y,m,d){const a=fdiv(14-m,12),y2=y+4800-a,m2=m+12*a-3;return d+fdiv(153*m2+2,5)+365*y2+fdiv(y2,4)-fdiv(y2,100)+fdiv(y2,400)-32045;}
function fromJdn(J){const a=J+32044,b=fdiv(4*a+3,146097),c=a-fdiv(146097*b,4),d=fdiv(4*c+3,1461),e=c-fdiv(1461*d,4),m=fdiv(5*e+2,153);
 return {y:100*b+d-4800+fdiv(m,10), m:m+3-12*fdiv(m,10), d:e-fdiv(153*m+2,5)+1};}
const EPOCH=2236508;          // A=0 : 1411-04-02
const KALI0=1648042.5;

function closedPadaka(r,n){ if(r===0) return [-1,n]; const c=fdiv(r-1,n); return [c,r-c*n]; }
function cycles(A){
 const akr=fdiv(A,31047), r1=fmod(A,31047), ch=fdiv(r1,1461), r2=fmod(r1,1461);
 const [vr,rp]=closedPadaka(r2,365);
 const am=fdiv(A,9589), r3=fmod(A,9589), pr=fdiv(r3,3279), r4=fmod(r3,3279);
 const [vt,cp]=closedPadaka(r4,248);
 return {akr,ch,vr,rp,am,pr,vt,cp};
}
/* Ujjain mean noon positions (kona-vighati) for ahargana A */
function calc(A,detail){
 const c=cycles(A), sr=SOL[c.rp], cr=MOON[c.cp];
 const sunDh=val([26,47,29])+c.akr*2/79*60-c.ch*9/58*60-c.vr*31/27*60;
 const sunVar=c.vr*sr.varshanka/60+c.ch*sr.varshanka/420;
 const sun=fmod(sunDh+val(sr.position)+sunVar,CIRC);
 const mDh=val([26,28,9])-c.am*(1-27/262)*NAKU+c.pr*28/71*NAKU+c.vt*(2+21/262)*NAKU;
 const mVr=c.vt*cr.vruttanka/60+c.pr*cr.vruttanka/180-c.am*cr.vruttanka/660;
 const moon=fmod(mDh+val(cr.position)+sr.chandra+mVr,CIRC);
 const out={sun,moon,sg:val(sr.speed),mg:val(cr.speed)};
 if(detail) Object.assign(out,{c,sr,cr,sunDh:fmod(sunDh,CIRC),sunVar,mDh:fmod(mDh,CIRC),mVr,chandra:sr.chandra});
 return out;
}
/* ---- శుద్ధ సూర్యసిద్ధాంతం: అయనాంశ, కాల సమీకరణం, ఉదయాస్తమయాలు ----
   కలి ఆరంభం (లంకా అర్ధరాత్రం) JD 588465.5 · మహాయుగ సావన దినాలు 1577917828 · రవి భగణాలు 4320000 · పరమ క్రాంతి 24°
   అయనాంశ (త్రిప్రశ్న 9–12): మహాయుగానికి 600 భగణాలు; భుజాంశ × 3/10 */
const KJD=588465.5, YUGA=1577917828, RD=Math.PI/180, EPS=24*RD;
function ayanSS(jd){const L=fmod((jd-KJD)*600/YUGA*360,360);
 const b=L<=90?L:L<=180?180-L:L<=270?L-180:360-L;return b*0.3;}
/* ″ / సంవత్సరం (భుజ పెరుగుతున్నప్పుడు +) */
function ayanRate(jd){const L=fmod((jd-KJD)*600/YUGA*360,360);return ((L<90||(L>=180&&L<270))?1:-1)*54;}
/* సాయన స్ఫుట రవి (డిగ్రీలు) — తేదీ J ఉజ్జయిని మధ్యాహ్నం నుండి f దినాలు తరువాత, దేశాంతరం DL */
function sayanaSun(J,f){const p=calc(J-EPOCH);return fmod(p.sun+p.sg*f,CIRC)/270+ayanSS(J+f-75.77/360);}
/* కాల సమీకరణం (నిమిషాలు): మధ్యమ రవి − స్ఫుట రవి విషువాంశం (భుజాంతర + ఉదయాంతర) */
function eot(J){const ay=ayanSS(J-75.77/360);
 const mean=fmod((J-KJD)*4320000/YUGA,1)*360+ay;
 const lam=(fmod(calc(J-EPOCH).sun,CIRC)/270+ay)*RD;
 const ra=Math.atan2(Math.cos(EPS)*Math.sin(lam),Math.cos(lam))/RD;
 return 4*(fmod(mean-ra+180,360)-180);}
/* ఉదయాస్తమయాలు (UTC నిమిషాలు, తేదీ J): సూ.సి. క్రాంతి, చరం; బింబ మధ్యం, వక్రీభవనం లేదు */
function sunRS(J,lat,lon){
 const DL=(lon-75.77)/360, noon=720-4*lon-eot(J), res=[]; let polar=null;
 for(const sg of [1,-1]){
  const lam=sayanaSun(J,-DL-sg*0.25)*RD, dec=Math.asin(Math.sin(EPS)*Math.sin(lam));
  let x=Math.tan(lat*RD)*Math.tan(dec);           // చరజ్యా
  if(x>1){polar='day';x=1;} else if(x<-1){polar='night';x=-1;}
  const c=Math.asin(x)/RD;                         // చరం (అంశలు)
  res.push(noon-sg*(90+c)*4);
 }
 return {rise:res[0],set:res[1],polar};
}
/* daily rows: positions at local apparent noon (deshantara applied) */
function rows(J0,n,place){
 const DL=(place.lon-75.77)/360, out=[];
 for(let k=0;k<n;k++){
  const J=J0+k, A=J-EPOCH, p=calc(A);
  out.push({J,s:fmod(p.sun-p.sg*DL,CIRC),m:fmod(p.moon-p.mg*DL,CIRC),sg:p.sg,mg:p.mg,
   noon:720-4*place.lon-eot(J)});   // UTC minutes of local apparent noon
 }
 return out;
}
function unwrap(v){const o=[v[0]];for(let i=1;i<v.length;i++){o.push(o[i-1]+fmod(v[i]-o[i-1],CIRC));}return o;}
/* events: element index that ENDS, absolute time t = J*1440 + UTC minutes */
function events(S,fn,rate,width,count){
 const v=unwrap(S.map(fn)), rt=S.map(rate), ev=[];
 for(let i=0;i<S.length-1;i++){
  const a=v[i],b=v[i+1],da=rt[i],db=rt[i+1];
  const k0=Math.floor(a/width),k1=Math.floor(b/width);
  for(let k=k0+1;k<=k1;k++){
   const tgt=k*width; let lo=0,hi=1;
   const H=t=>{const h00=2*t**3-3*t**2+1,h10=t**3-2*t**2+t,h01=-2*t**3+3*t**2,h11=t**3-t**2;return h00*a+h10*da+h01*b+h11*db;};
   for(let it=0;it<50;it++){const mid=(lo+hi)/2; if(H(mid)<tgt)lo=mid; else hi=mid;}
   const t=(lo+hi)/2, noon=S[i].noon+(S[i+1].noon-S[i].noon)*t;
   ev.push({idx:fmod(k-1,count),t:S[i].J*1440+noon+t*1440});
  }
 }
 return ev;
}
const KINDS={
 T:[r=>r.m-r.s,r=>r.mg-r.sg,3240,30],
 N:[r=>r.m,r=>r.mg,3600,27],
 Y:[r=>r.s+r.m,r=>r.sg+r.mg,3600,27],
 K:[r=>r.m-r.s,r=>r.mg-r.sg,1620,60],
 P:[r=>r.s,r=>r.sg,900,108],      // Ravi nakshatra pada
 S:[r=>r.s,r=>r.sg,8100,12],      // Ravi sankramana (rashi)
 R:[r=>r.m,r=>r.mg,8100,12],      // Chandra rashi
 Q:[r=>r.m,r=>r.mg,900,108]       // Chandra nakshatra pada
};
function allEvents(J0,n,place){
 const S=rows(J0-1,n+3,place), E={};
 for(const k in KINDS){const q=KINDS[k];E[k]=events(S,q[0],q[1],q[2],q[3]);}
 return {S,E};
}
/* instantaneous sphuta at absolute time t (Hermite on daily rows) */
function sphutaAt(S,t){
 for(let i=0;i<S.length-1;i++){
  const t0=S[i].J*1440+S[i].noon,t1=S[i+1].J*1440+S[i+1].noon;
  if(t>=t0&&t<t1){const x=(t-t0)/(t1-t0);
   const H=(a,b,da,db)=>{const h00=2*x**3-3*x**2+1,h10=x**3-2*x**2+x,h01=-2*x**3+3*x**2,h11=x**3-x**2;return h00*a+h10*da+h01*b+h11*db;};
   const ds=fmod(S[i+1].s-S[i].s,CIRC),dm=fmod(S[i+1].m-S[i].m,CIRC);
   return {s:fmod(H(S[i].s,S[i].s+ds,S[i].sg,S[i+1].sg),CIRC),m:fmod(H(S[i].m,S[i].m+dm,S[i].mg,S[i+1].mg),CIRC),
     sg:S[i].sg+(S[i+1].sg-S[i].sg)*x,mg:S[i].mg+(S[i+1].mg-S[i].mg)*x};}
 }
 return null;
}
G.NKEngine={init,jdn,fromJdn,calc,cycles,rows,events,allEvents,sphutaAt,sunRS,eot,ayanSS,ayanRate,EPOCH,KALI0,CIRC,fmod,fdiv,val};
})(typeof window!=='undefined'?window:globalThis);
