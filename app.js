'use strict';
// Valeurs converties depuis W/m² : 1 W/m² = 0,1 mW/cm².
// Mesures individuelles fournies par le vendeur : sommation hypothétique uniquement.
const WAVES = Object.freeze([
  {nm:630, irradiance:13.48203, category:'Rouge'},
  {nm:660, irradiance:19.16997, category:'Rouge'},
  {nm:810, irradiance:12.03299, category:'NIR'},
  {nm:850, irradiance:15.04495, category:'NIR'},
  {nm:940, irradiance:15.79912, category:'NIR'}
]);
// Irradiance totale annoncée par le vendeur (mW/cm²). Chiffre commercial, non vérifié de façon indépendante.
const VENDOR_CLAIM = 109;

const $=id=>document.getElementById(id);
const format=(v,d=2)=>v.toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
const selected = new Set(WAVES.map(w=>w.nm));
const waveList=$('wavelengths');

for(const wave of WAVES){
  const isRed=wave.category==='Rouge';
  const label=document.createElement('label');label.className='wave';label.dataset.kind=isRed?'red':'nir';
  const input=document.createElement('input');input.type='checkbox';input.checked=true;input.value=wave.nm;input.setAttribute('aria-label',`${wave.nm} nanomètres`);
  const info=document.createElement('div');info.className='info';
  const name=document.createElement('b');name.textContent=`${wave.nm} nm`;
  const kind=document.createElement('small');kind.textContent=isRed?'Lumière rouge':'Proche infrarouge';info.append(name,kind);
  const reading=document.createElement('div');reading.className='reading';reading.textContent=`${format(wave.irradiance)} mW/cm²`;
  const legend=document.createElement('small');legend.textContent='Mesure individuelle à 100 %';reading.append(legend);
  input.addEventListener('change',()=>{input.checked?selected.add(wave.nm):selected.delete(wave.nm);update()});
  label.append(input,info,reading);waveList.append(label);
}

function setSelection(all){
  document.querySelectorAll('#wavelengths input').forEach(el=>{el.checked=all;const nm=Number(el.value);all?selected.add(nm):selected.delete(nm)});update();
}

function calculate(){
  const power=Number($('power').value),minutes=Number($('minutes').value);
  const factor=power/100;
  const red=WAVES.filter(w=>selected.has(w.nm)&&w.category==='Rouge').reduce((s,w)=>s+w.irradiance,0)*factor;
  const nir=WAVES.filter(w=>selected.has(w.nm)&&w.category==='NIR').reduce((s,w)=>s+w.irradiance,0)*factor;
  const total=red+nir;
  const dose=total*minutes*60/1000;
  return {red,nir,total,dose,power,minutes,count:selected.size,percent:total/VENDOR_CLAIM*100};
}

function paintRange(el){const min=Number(el.min),max=Number(el.max);el.style.setProperty('--p',`${(Number(el.value)-min)/(max-min)*100}%`)}
function update(){
  const r=calculate();
  paintRange($('power'));paintRange($('minutes'));
  $('power-out').textContent=`${r.power} %`;$('minutes-out').textContent=`${r.minutes} min`;
  $('red').textContent=format(r.red);$('nir').textContent=format(r.nir);
  $('total').textContent=format(r.total);$('dose').textContent=format(r.dose);
  $('percent').textContent=`${format(r.percent,1)} %`;
  $('bar').style.width=`${Math.min(100,Math.max(0,r.percent))}%`;
  const redShare=r.total>0?r.red/r.total*100:0, nirShare=r.total>0?r.nir/r.total*100:0;
  $('split-red').style.width=`${redShare}%`;$('split-nir').style.width=`${nirShare}%`;
  $('selection-count').textContent=`${r.count} longueur${r.count>1?'s':''} d’onde sélectionnée${r.count>1?'s':''}`;
  $('formula').textContent=`${format(r.total)} × ${format(r.minutes*60,0)} / 1 000 = ${format(r.dose)} J/cm²`;
  document.querySelectorAll('#presets button').forEach(b=>b.classList.toggle('active',Number(b.dataset.time)===r.minutes));
}

$('all').addEventListener('click',()=>setSelection(true));
$('none').addEventListener('click',()=>setSelection(false));
$('power').addEventListener('input',update);$('minutes').addEventListener('input',update);
$('presets').addEventListener('click',e=>{const btn=e.target.closest('button[data-time]');if(btn){$('minutes').value=btn.dataset.time;update()}});
$('reset').addEventListener('click',()=>{$('power').value=100;$('minutes').value=20;setSelection(true)});
$('copy').addEventListener('click',async()=>{
  const r=calculate();const active=WAVES.filter(w=>selected.has(w.nm)).map(w=>`${w.nm} nm`).join(', ')||'aucune';
  const content=`RE.SOURCE — Simulation PBM ZEN PLUS\nLongueurs d’onde : ${active}\nPuissance relative : ${r.power} %\nDurée : ${r.minutes} min\nRouge : ${format(r.red)} mW/cm²\nNIR : ${format(r.nir)} mW/cm²\nIrradiance totale théorique : ${format(r.total)} mW/cm²\nFluence théorique : ${format(r.dose)} J/cm²\nAttention : calcul indicatif, valeurs individuelles non validées en simultané.`;
  try{await navigator.clipboard.writeText(content);$('copy').textContent='Résultats copiés';setTimeout(()=>$('copy').textContent='Copier les résultats',1800)}catch{window.prompt('Copie les résultats :',content)}
});
update();

if("serviceWorker" in navigator&&location.protocol.startsWith("http")){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}
