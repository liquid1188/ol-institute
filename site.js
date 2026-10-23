(function(){
var d=document,root=d.documentElement;root.classList.add('js');
// menu
var b=d.getElementById('menu-btn'),n=d.getElementById('site-nav');
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus();}});}
// desktop version toggle
var KEY='ol-desktop',vp=d.querySelector('meta[name=viewport]'),t=d.getElementById('desk-toggle');
function getPref(){try{return localStorage.getItem(KEY)==='1';}catch(e){return false;}}
function setPref(v){try{v?localStorage.setItem(KEY,'1'):localStorage.removeItem(KEY);}catch(e){}}
function fit(){if(!root.classList.contains('desktop-view')){d.body.style.zoom='';return;}var w=window.innerWidth||root.clientWidth;d.body.style.zoom=w<1180?(w/1200).toFixed(5):'';window.scrollTo(0,window.scrollY);}
function apply(on){if(vp)vp.setAttribute('content',on?'width=1200':'width=device-width, initial-scale=1, viewport-fit=cover');root.classList.toggle('desktop-view',on);if(t)t.textContent=on?'View mobile version':'View desktop version';requestAnimationFrame(fit);}
window.addEventListener('resize',fit);
if(getPref())apply(true);
if(t)t.addEventListener('click',function(){var on=!root.classList.contains('desktop-view');setPref(on);apply(on);});
// volume tabs
var tabs=d.querySelectorAll('.vol-tabs [data-vol]'),vols=d.querySelectorAll('.vol');
function show(id,scroll){var ok=false;vols.forEach(function(v){var m=v.id===id;v.hidden=!m;if(m)ok=true;});if(!ok)return false;
 tabs.forEach(function(a){a.setAttribute('aria-selected',a.dataset.vol===id?'true':'false');if(a.dataset.vol===id){var st=a.parentElement;if(st)st.scrollLeft=Math.max(0,a.offsetLeft-st.offsetLeft-24);}});
 if(scroll){var tb=d.querySelector('.vol-tabs');if(tb)window.scrollTo({top:tb.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'});}return true;}
if(vols.length){var h=(location.hash||'').slice(1);if(!show(h,false))show(vols[0].id,false);
 d.querySelectorAll('[data-vol]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show(a.dataset.vol,true);});});
 window.addEventListener('hashchange',function(){show((location.hash||'').slice(1),true);});}
// lecture search
var lq=d.getElementById('lq'),lr=d.getElementById('lq-results'),lcnt=d.getElementById('lq-count'),ld=d.getElementById('ldata');
if(lq&&ld){var L=JSON.parse(ld.textContent),zone=d.querySelector('.vol-zone');
 function esc(x){return x.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function norm(x){return x.toLowerCase();}
 function variants(q){var v=[q];if(q.indexOf('saint')===0)v.push('st.'+q.slice(5));if(q.indexOf('st ')===0)v.push('st. '+q.slice(3));return v;}
 function find(t,vs){t=t.toLowerCase();for(var k=0;k<vs.length;k++){var i=t.indexOf(vs[k]);if(i>-1)return [i,vs[k].length];}return null;}
 function hi(t,vs){var m=find(t,vs);return !m?esc(t):esc(t.slice(0,m[0]))+'<mark>'+esc(t.slice(m[0],m[0]+m[1]))+'</mark>'+esc(t.slice(m[0]+m[1]));}
 function run(){var q=norm(lq.value.trim());d.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed',norm(c.dataset.q)===q?'true':'false');});
  if(q.length<2){lr.hidden=true;lr.innerHTML='';lcnt.textContent='';zone.classList.remove('searching');return;}
  var vs=variants(q),hits=L.filter(function(x){return !!find(x.t+' | '+x.p+' | '+x.vn,vs);});
  zone.classList.add('searching');lr.hidden=false;
  lcnt.textContent=hits.length?(hits.length+(hits.length===1?' lecture':' lectures')):'No lectures match';
  lr.innerHTML=hits.map(function(x){return '<li><a href="#'+x.s+'" data-go="'+x.id+'" data-v="'+x.s+'"><span class="lv">Volume '+x.v+' · '+esc(x.vn)+'</span><b>'+hi(x.t,vs)+'</b><small>'+hi(x.p,vs)+'</small></a></li>';}).join('')||'<li class="none">Try a broader word, or browse the volumes below.</li>';}
 lq.addEventListener('input',run);
 d.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){lq.value=(lq.value===c.dataset.q)?'':c.dataset.q;run();});});
 lr.addEventListener('click',function(e){var a=e.target.closest('a[data-go]');if(!a)return;e.preventDefault();lq.value='';run();show(a.dataset.v,false);
  var el=d.getElementById(a.dataset.go);if(el){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');window.scrollTo({top:el.getBoundingClientRect().top+window.pageYOffset-220,behavior:'smooth'});}});}
// campaign bar fills when it comes into view
d.querySelectorAll('.bar-fill').forEach(function(bf){if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){bf.classList.add('in');io.disconnect();}});},{threshold:.4});io.observe(bf);}else bf.classList.add('in');});
// East and West calendar, live
var cw=d.getElementById('cal-w');if(cw){(function(){
 function W(y){var a=y%19,b=Math.floor(y/100),c=y%100,dd=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-dd-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);return new Date(y,Math.floor((h+l-7*m+114)/31)-1,((h+l-7*m+114)%31)+1);}
 function E(y){var a=y%4,b=y%7,c=y%19,dd=(19*c+15)%30,e=(2*a+4*b-dd+34)%7;var x=new Date(y,Math.floor((dd+e+114)/31)-1,((dd+e+114)%31)+1);x.setDate(x.getDate()+13);return x;}
 var now=new Date(),t=new Date(now.getFullYear(),now.getMonth(),now.getDate()),Y=t.getFullYear();
 function next(F){var x=F(Y);return x>=t?x:F(Y+1);}
 var M=['January','February','March','April','May','June','July','August','September','October','November','December'],D=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 function f(x){return D[x.getDay()]+', '+M[x.getMonth()]+' '+x.getDate()+', '+x.getFullYear();}
 function n(x){var k=Math.round((x-t)/864e5);return k===0?'Today. Christ is risen!':(k===1?'Tomorrow':k+' days away');}
 var w=next(W),e=next(E),j=new Date(t);j.setDate(j.getDate()-13);
 cw.textContent=f(w);d.getElementById('cal-wn').textContent=n(w);d.getElementById('cal-e').textContent=f(e);d.getElementById('cal-en').textContent=n(e);
 d.getElementById('cal-today').innerHTML='Today is <b>'+M[t.getMonth()]+' '+t.getDate()+'</b> on the Gregorian calendar and <b>'+M[j.getMonth()]+' '+j.getDate()+'</b> on the Julian calendar.';
 var tg=d.getElementById('cal-tog');
 if(w.getTime()===e.getTime())tg.innerHTML='This year East and West keep Pascha together, on <b>'+M[w.getMonth()]+' '+w.getDate()+'</b>.';
 else for(var y=Y;y<Y+40;y++){var a=W(y);if(a>t&&a.getTime()===E(y).getTime()){tg.innerHTML='East and West next keep Pascha on the same Sunday in <b>'+y+'</b>, on '+M[a.getMonth()]+' '+a.getDate()+'.';break;}}})();}
// find-your-path guide
var gf=d.getElementById('guide-form');if(gf){var G=JSON.parse(d.getElementById('guide-data').textContent),gr=d.getElementById('guide-result');
 function val(n){var x=gf.querySelector('input[name='+n+']:checked');return x?x.value:null;}
 function card(k,title,href,text,interest){return {k:k,t:title,h:href,x:text,i:interest};}
 gf.addEventListener('change',function(){var dr=val('draw'),tm=val('time'),sj=val('subj');if(!(dr&&tm&&sj))return;var S=G.subjects[+sj],a,b;
  var flag=+sj===0;
  if(tm==='two'){a=dr==='earn'?card('Graduate degree',S.m,'#'+S.ms,flag?'Our flagship. Two years or 36 credit hours, and the first master’s degree in ecumenical studies in the United States.':'Two years or 36 credit hours of in-depth graduate study.',flag?'MA in Ecumenical Studies':'Other graduate programs'):card('Diploma',S.d,'#'+S.ds,'Two years or 36 credit hours, built for formation and service rather than an academic degree.','Diplomas');}
  else if(tm==='one'){a=card('Certificate',S.c,'#'+S.cs,'One year or 18 credit hours. A focused start that can count toward a diploma or degree later.','Certificates');}
  else if(tm==='days'){a=dr==='pray'?card('Spiritual formation','Retreats through the Church’s year','formation.html#retreats','Retreats keyed to the great fasts and feasts, with spiritual direction available.','Retreats and spiritual direction'):dr==='go'?card('Spiritual formation','Study pilgrimages','formation.html#pilgrimages','The Holy Land, Constantinople, and Rome, prepared in class and prayed on site.','Study pilgrimages'):card('Gatherings','Conferences and lectures','gatherings.html','An annual flagship conference and a lecture series through the academic year.','Conferences and lectures');}
  else{a=dr==='learn'?card('At your own pace','The Kallistos Lectures','lectures-from-oxford.html','Over 100 lectures by Metropolitan Kallistos as books, video, and audio, to take up whenever you can.','Continuing education'):card('Continuing education','Continuing education','#continuing','Courses for adult learners, catechists, and clergy, without a full program commitment.','Continuing education');}
  var academic=tm==='two'||tm==='one';
  b=academic?(dr==='pray'?card('','Retreats and spiritual direction','formation.html#retreats','',''):dr==='go'?card('','Study pilgrimages','formation.html#pilgrimages','',''):card('','The Kallistos Lectures','lectures-from-oxford.html','','')):card('',S.c,'#'+S.cs,'','');
  gr.innerHTML='<p class="kicker">Your path</p><p class="gr-k">'+a.k+'</p><h3><a href="'+a.h+'">'+a.t+'</a></h3><p>'+a.x+'</p><p class="gr-pair">Pair it with <a href="'+b.h+'">'+b.t+'</a></p><div class="actions"><a class="btn gold" href="'+a.h+'">See this path</a><a class="textlink" href="#interest" data-int="'+a.i+'">Join the interest list</a></div>';
  gr.hidden=false;});
 gr.addEventListener('click',function(e){var l=e.target.closest('[data-int]');if(!l)return;var sel=d.querySelector('#interest select');if(sel){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===l.dataset.int||sel.options[i].value===l.dataset.int){sel.selectedIndex=i;break;}}}});}
// pilgrimage map: highlight a year's route
var rm=d.querySelector('.route-map');if(rm){var fig=rm.querySelector('.pmap');rm.querySelectorAll('.route [data-rt]').forEach(function(li){function on(){fig.setAttribute('data-on',li.dataset.rt);}function off(){fig.removeAttribute('data-on');}li.addEventListener('mouseenter',on);li.addEventListener('focus',on);li.addEventListener('mouseleave',off);li.addEventListener('blur',off);});}
// lightbox
var lb=d.getElementById('lightbox'),li=d.getElementById('lb-img'),lc=d.getElementById('lb-cap'),cl=d.getElementById('lb-close'),last;
function close(){if(lb){lb.hidden=true;if(last)last.focus();}}
d.querySelectorAll('[data-zoom]').forEach(function(img){img.setAttribute('tabindex','0');img.setAttribute('role','button');
 function open(){last=img;li.src=img.currentSrc||img.src;li.alt=img.alt;lc.textContent=img.dataset.cap||img.alt;lb.hidden=false;cl.focus();}
 img.addEventListener('click',open);img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
if(lb){cl.addEventListener('click',close);lb.addEventListener('click',function(e){if(e.target===lb)close();});d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)close();});}
// Web3Forms: contact form and interest lists
d.querySelectorAll('form.w3f, #contact-form').forEach(function(f){var note=f.querySelector('.hint');
 f.addEventListener('submit',function(e){e.preventDefault();var key=f.querySelector('[name=access_key]').value;
 if(!f.checkValidity()){f.reportValidity();return;}
 if(key.indexOf('YOUR-')===0){note.textContent='This preview does not send yet. Please email jackfigel@ol-institute.com.';return;}
 note.textContent='Sending…';fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){return r.json();}).then(function(j){note.textContent=j.success?(f.classList.contains('w3f')?'Thank you. You are on the list.':'Thank you. Your message was sent.'):'That did not go through. Please email jackfigel@ol-institute.com.';if(j.success)f.reset();}).catch(function(){note.textContent='That did not go through. Please email jackfigel@ol-institute.com.';});});});
})();
(function(){var b=document.getElementById('letter-toggle'),m=document.getElementById('letter-more');if(!b||!m)return;b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'Show less':'Read the full letter';if(!o)document.getElementById('welcome').scrollIntoView({block:'start'});});})();
