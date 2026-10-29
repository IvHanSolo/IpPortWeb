/* Ivan Philips portfolio - shared app. Content lives in /content.json (edit it, or use ?edit Studio). */

/* ============ CONTENT ============
 The easy way: open this page with ?edit on the end of the address, use the Studio button, then download content.json and upload it next to this file.
 You can still edit the defaults below by hand.
 Sections with Leisure / Work: writing, photography, video.
 Writing: {title, desc, text, pdf:'writing/piece.pdf'}  -> pdf shows as preview + download button.
 Photography: albums {title, desc, folder:'images/thane/', items:['a.jpg','b.jpg']}. Layouts and pages are made automatically; tags are not shown.
 Video: {title, desc, embed:'https://youtu.be/XXXXXXXXXXX'}
 Other works: albums with status 'Completed' or 'WIP'. Items: src:'decks/x.pdf' or embed:'<slides link>'.
 Special thanks: {n:'Name', r:'What they did'} */
const FILE={cover:'index.html',index:'contents.html',writing:'writing.html',photography:'photography.html',video:'video.html',other:'other-works.html',about:'about.html',thanks:'special-thanks.html'},PAGE=document.body.dataset.page||'cover',QS=/[?&]edit/.test(location.search)?location.search:'',hs=()=>{const m=/^#s(\d+)$/.exec(location.hash);return m?+m[1]:0};
const SUB='https://substack.com/@ivanphilips';
const P=(n,l,x={})=>Array.from({length:n},(_,i)=>({title:`${l} ${i+1}`,src:'',desc:'Short description goes here.',...x}));
const CONTENT={
 intro:'Welcome to a glimpse of my work. I hope that you enjoy your journey and gain an understanding of what I can do, and why I do it.',
 about:{photo:''},
 writing:{leisure:P(3,'Piece title',{text:'Paste the full piece here.\n\nA blank line starts a new paragraph.',pdf:''}),work:P(2,'Piece title',{text:'Paste the full piece here.',pdf:''})},
 photography:{
  leisure:[{group:'Travel',title:'Himachal',desc:'Description goes here.',items:P(14,'Himachal')},{group:'Travel',title:'Lonavala',desc:'Description goes here.',items:P(14,'Lonavala')},{group:'Travel',title:'Goa',desc:'Description goes here.',items:P(14,'Goa')},{group:'Travel',title:'Singapore',desc:'Description goes here.',items:P(14,'Singapore')},{group:'Travel',title:'Andaman',desc:'Description goes here.',items:P(14,'Andaman')},{title:'Animals',desc:'Description goes here.',items:P(9,'Animal')},{title:'People',desc:'Description goes here.',items:P(14,'Portrait')},{title:'Misc',desc:'Description goes here.',items:P(14,'Photo')}],
  wall:P(8,'Art piece')},
 video:{showreel:{title:'Showreel',desc:'A short cut of recent work. One line about it goes here.',embed:''},folders:[{title:'Ads for classwork',desc:'Description goes here.',items:P(3,'Ad',{embed:''})},{title:'Short Films',desc:'Description goes here.',items:P(3,'Short film',{embed:''})},{title:'Shorter Short Films',desc:'Description goes here.',items:P(3,'Shorter short film',{embed:''})}]},
 other:[
  {title:'Presentations',status:'Completed',desc:'Client and internal presentations.',label:'Deck',items:P(3,'Presentation')},
  {title:'Assignments',status:'Completed',desc:'Coursework and academic submissions.',label:'Document',items:P(3,'Assignment')},
  {title:'CSM',status:'WIP',desc:'An ongoing process.',items:P(3,'CSM')},
  {title:'Album Art',status:'WIP',desc:'An ongoing process.',items:P(3,'Album art')},
  ],
 thanks:[{"h": "Family"}, {"n": "Parents", "r": "For allowing me to do what I want to.", "g": 1}, {"n": "GrandParents", "r": "For Loving and Believing in me unconditionally", "g": 1}, {"n": "Aunts & Uncles and extended family", "r": "For allowing me to be who I am and always supporting me in anyway ya'll can.", "g": 1}, {"n": "Cousins", "g": 1}, {"n": "Sarah", "r": "For being there with tasty food and listening to everything I have to say"}, {"n": "Ryan", "r": "For hanging out with me even after so many fights as kids"}, {"n": "Tresu", "r": "For being a partner in crime and always having discussions even after having a different perspective"}, {"n": "Aaron", "r": "For being down to hangout whenever asked to no matter what"}, {"n": "Alan, Akash, Rachel, Rahul", "r": "For helping and guiding me whenever I have needed it"}, {"n": "Michelle", "r": "For introducing me to new content and always hitting the nail with it"}, {"n": "Lynette", "r": "For always being ready to gossip about anything"}, {"n": "Little Rhea, Little Rachel", "r": "For having fun with me anytime and everytime"}, {"h": "Friends"}, {"n": "Soum", "r": "For allowing me to be a collaborator on an incredible project amongst other things"}, {"n": "Vibh", "r": "For always being there to talk about nerdy shit and allowing me to enjoy it tenfolds"}, {"n": "Nick", "r": "For being someone I can always end up having fun with, regardless of however life is going"}, {"n": "Arun", "r": "For being someone who has been always there to talk about how life is treating us"}, {"n": "Om, Jahir, Divye", "r": "For having your door always open for me even when ya'll might not be there yourself at home"}, {"n": "Kritika, Divya, Aleena, Daniel, Jiby", "r": "For enduring and indulging in various shenanigans through college and beyond"}, {"n": "Shreya, Kavya, Aisha, Shanti", "r": "For being my friends and making school worth looking forward to every week"}, {"h": "Teachers"}, {"n": "Vijaya Aunty", "r": "For being one of the first people to believe in me as a kid and making me feel good about being myself"}, {"n": "Perrie Ma'am", "r": "For tolerating me when I did not deserve the kindness and give me more than ample chances to be a better version of myself without asking for anything in return"}, {"n": "Neelima Aunty", "r": "For making me fall in love with a subject I almost came to despise"}, {"n": "Kalpana Ma'am", "r": "For allowing me to appreciate myself through my art"}]
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const order=['cover','index','writing','photography','video','other','about','thanks'],MODED=['writing'];
const names={cover:'Cover',index:'Index',writing:'Writing',photography:'Photography',video:'Video',other:'Other works',about:'About',thanks:'Special thanks'};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PREV={},REG=[],reg=(o,m)=>REG.push(Object.assign(o,m))-1,isVid=o=>o.embed||/\.(mp4|webm|mov)$/i.test(o.src||''),isDoc=o=>/\.(pdf|pptx?)$/i.test(o.src||'');
const cap=t=>t?t[0].toUpperCase()+t.slice(1):'';
const norm=(x,b={})=>{const o=typeof x=='string'?{src:x}:{...x};if(o.src&&b.folder&&!/^(https?:|\/|data:)/.test(o.src))o.src=b.folder+o.src;if(o.src&&PREV[o.src])o.src=PREV[o.src];if(o.pdf&&PREV[o.pdf])o.pdf=PREV[o.pdf];
o.title=o.title||(o.src?o.src.split('/').pop().replace(/\.\w+$/,'').replace(/[-_]+/g,' '):'Untitled');return o};
const sw=m=>`<div class="switch" role="group" aria-label="Collection">${['work','leisure'].map(k=>`<button data-mode="${k}" aria-selected="${k===m}">${cap(k)}</button>`).join('')}</div>`;
const lab=o=>o.label||(isVid(o)?'Video':isDoc(o)?'Document':'Image');
const tl=(o,r)=>`<button class="tile" data-r="${r}" aria-label="Open ${esc(o.title)}">${o.src&&!isDoc(o)&&!isVid(o)?`<img src="${esc(o.src)}" alt="${esc(o.title)}" loading="lazy">`:`<span>${lab(o)}</span>`}</button>`;
const note=(o,a,n,on)=>`<button class="note${on?' on':''}" ${a}><b>${esc(o.title)}${n?` <small>${esc(n)}</small>`:''}</b>${o.desc?`<em>${esc(o.desc)}</em>`:''}</button>`;
const mk=(t,l)=>`<h1>${t}</h1><p class="lede">${l}</p>`;
const MAG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
const sbar=()=>`<form class="sbar" role="search"><button type="button" class="mag" aria-label="Search the book" aria-expanded="false">${MAG}</button><input type="search" id="q" placeholder="Search titles, headings, albums" aria-label="Search" autocomplete="off"><div class="sres" hidden></div></form>`;
const sub='<a class="btn" href="'+SUB+'" target="_blank" rel="noopener">Read on Substack</a>';
const B={
cover:()=>[['',`<div class="cv"><h1>Ivan<br>Philips</h1><p class="lede">Film, television and digital content</p><button type="button" class="btn cvb" data-t="1">Open</button></div>`]],
index:()=>[[`<h1>Ivan<br>Philips</h1><p class="lede">${esc(CONTENT.intro)}</p>`,'@toc']],
writing:m=>[[mk('Writing','Everything begins and ends with a story and this is how I choose to tell them.')+sub+'<br>'+sw(m),(CONTENT.writing[m]||[]).map(x=>norm(x)).map(o=>`<div class="item" role="button" tabindex="0" data-r="${reg(o,{_v:'writing',_m:m})}"><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p><span class="more">Click to read more<i>→</i></span></div>`).join('')||'<p>Nothing here yet.</p>']],
photography:m=>{const als=CONTENT.photography[m]||[],pages=[],first=[],C=[3,2,4,1,3,2],LY={1:['hero'],2:['duo','pair'],3:['tri','strip'],4:['mos']};let li=0;
 als.forEach((al,i)=>{first[i]=pages.length;const its=(al.items||[]).map(x=>{const o=norm(x,al);return{o,id:reg(o,{_v:'photography',_al:al.title,tags:al.group?[al.group]:[]})}});let k=0;
  while(its.length){const t=its.splice(0,C[li%C.length]),l=LY[t.length];pages.push({al:al.title,g:al.group,c:l[li%l.length],its:t,n:(al.notes||[])[k]??(k?'':al.note||'Write about this folder here.')});li++;k++}});
 const spOf=j=>1+(j>>1);pages.forEach((p,j)=>p.its.forEach(x=>REG[x.id]._sp=spOf(j)));
 const pg=p=>`<div class="phead">${p.g?esc(p.g)+' · ':''}${esc(p.al)}</div><div class="lay ${p.c}">${p.its.map(x=>tl(x.o,x.id)).join('')}</div>${p.n?`<div class="pnote"><p>${esc(p.n)}</p></div>`:''}`,end='<p class="lede">End of this folder. Turn back, or pick another.</p>';
 const out=[[mk('Photography','Take a look through my lens for now')+`<div class="agrid">${als.map((al,i)=>pages.length?`<div class="al" role="button" tabindex="0" draggable="true" data-ai="${i}" data-sv="photography" data-sp="${spOf(first[i])}">${acv(al)}<span class="ov"></span><span class="tw" data-towall="${i}" title="Show these photos on the art wall" aria-label="Show ${esc(al.title)} on the art wall">▦</span><span class="ai">${al.group?`<span class="ag">${esc(al.group)}</span>`:''}<b>${esc(al.title)}</b><span class="ad">${esc(al.desc)}</span><small>${(al.items||[]).length} photos</small></span></div>`:'').join('')}</div>`,sbar()+WALL]];
 const ch=p=>als.length>1?`<div class="alb"><span>Other albums</span>${als.map((a,i)=>a.title===p.al?'':`<button type="button" class="chip" data-sv="photography" data-sp="${spOf(first[i])}">${esc(a.title)}</button>`).join('')}</div>`:'';
 for(let j=0;j<pages.length;j+=2)out.push([pg(pages[j]),sbar()+(pages[j+1]?pg(pages[j+1]):end)+ch(pages[j+1]||pages[j])]);return out},
video:()=>{const fs=(CONTENT.video.folders||[]).map((f,i)=>{const its=(f.items||[]).map(x=>norm(x,f)),ids=its.map((o,j)=>reg(o,{_v:'video',_al:f.title,_ix:j,_sp:i+1}));return{f,its,ids,i}}),sr=CONTENT.video.showreel||{},se=sr.embed?emb(sr.embed):'';
 const out=[[mk('Video','Get immersed into a piece of what is')+`<div class="folders">${fs.map(a=>`<button class="fold" data-sv="video" data-sp="${a.i+1}"><b>${esc(a.f.title)}</b><span>${esc(a.f.desc)}</span><small>${a.its.length} videos</small></button>`).join('')}</div>`,
 `<div class="vt"><div class="vp">${se?`<iframe src="${esc(se)}" title="Showreel" allowfullscreen></iframe>`:'<span>Showreel goes here. Add a YouTube or Vimeo link as CONTENT.video.showreel.embed</span>'}</div>${se?VFB:''}<h2>${esc(sr.title||'Showreel')}</h2>${sr.desc?`<p>${esc(sr.desc)}</p>`:''}</div>`]];
 fs.forEach(a=>out.push([mk(esc(a.f.title),esc(a.f.desc||''))+`<div class="notes">${a.its.map((o,j)=>note(o,`data-vid="${a.ids[j]}"`,'',!j)).join('')}</div>`,`<div class="vt" id="vt">${a.its.length?vh(a.its[0]):'<p>Nothing here yet.</p>'}</div>`]));return out},
other:()=>{const A=CONTENT.other.map((al,i)=>{const its=(al.items||[]).map(x=>{const o=norm(x,al);o.label=o.label||al.label;return o}),ids=its.map(o=>reg(o,{_v:'other',_al:al.title,_sp:i+1}));return{al,its,ids,i}});
 const grp=st=>A.filter(a=>a.al.status===st).map(a=>`<button class="fold" data-sv="other" data-sp="${a.i+1}"><b>${esc(a.al.title)}</b><span>${esc(a.al.desc)}</span><small>${a.its.length} items</small></button>`).join('')||'<p>Nothing here yet.</p>';
 const out=[[mk('Other works','Completed pieces and work in progress. Pick one to open its pages.'),`<h2>Completed</h2><div class="folders">${grp('Completed')}</div>${A.some(a=>a.al.status==='WIP')?`<h2 class="s">Work in progress</h2><div class="folders">${grp('WIP')}</div>`:''}`]];
 A.forEach(a=>out.push([`<h1>${esc(a.al.title)}</h1><p class="lede">${esc(a.al.desc)}</p><span class="badge">${esc(a.al.status)}</span><div class="pnote"><p>${esc(a.al.note||'Write about this piece here.')}</p></div>`,`<div class="grid">${a.its.map((o,j)=>tl(o,a.ids[j])).join('')}</div>`]));return out},
about:()=>[[mk('About','Creative and production-focused communications professional, bridging creative vision with execution.')+`<div class="abx abl"><div class="tile portrait">${CONTENT.about.photo?`<img src="${esc(CONTENT.about.photo)}" alt="Ivan Philips">`:'<span>Portrait</span>'}</div><div class="links"><a href="mailto:Ivan913.ip@gmail.com"><b>Email</b>Ivan913.ip@gmail.com</a><a href="tel:+919317291752"><b>Phone</b>+91 93172 91752</a><a href="https://instagram.com/pp_fr_2" target="_blank" rel="noopener"><b>Instagram</b>@pp_fr_2</a></div></div>`,
`<div class="abx abr"><h2>Profile</h2><p>Thane-based MBA candidate in Communications Management at FLAME University, with a grounding in film, television and digital content. I have worked across scripting, content creation, on-set assistance and post-production, at Entre Nous Experiences, Caliac Studios and Juggernaut Productions, and on live events such as Lollapalooza India. I am growing into creative management, with Photoshop, Lightroom and Canva alongside photography and videography.</p></div>`]],
thanks:()=>{let h='',open=false,first=true;const cl=()=>{if(open){h+='</p>';open=false}},op=()=>{if(!open){h+='<p class="tp">';open=true;first=true}};
(CONTENT.thanks||[]).forEach(t=>{if(t.h){cl();h+=`<h2 class="th2">${esc(t.h)}</h2>`;return}
 if(!t.r){cl();h+=`<div class="tsub">${esc(t.n)}</div>`;return}
 op();if(!first)h+=' <i class="ipb" aria-hidden="true">IP</i> ';first=false;
 h+=`<span class="te"><b class="${t.g?'tg':'tn'}">${esc(t.n)}</b> ${esc(t.r)}</span>`});cl();
 return [['',`<div class="tk"><h1 class="ty">Thank You!</h1><p class="tq">nothing here was made alone</p>${h}<h2 class="th2 tend">The End</h2></div>`]]}};
function vh(o){const e=o.embed?emb(o.embed):'';return `<div class="vp">${e?`<iframe src="${esc(e)}" title="${esc(o.title)}" allowfullscreen></iframe>`:'<span>Paste a YouTube link into CONTENT.video</span>'}</div>${e?VFB:''}<h2>${esc(o.title)}</h2>${o.desc?`<p>${esc(o.desc)}</p>`:''}`}
const emb=u=>{let m=u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);if(m)return'https://www.youtube.com/embed/'+m[1];m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/);return m?'https://player.vimeo.com/video/'+m[1]:u};
const WP=[[4,6,30,-3],[38,4,26,2],[68,8,26,-2],[8,44,24,3],[38,38,30,-1.5],[70,44,24,2.5],[18,72,28,-2],[54,70,30,1.5]],AR=['4/5','1/1','3/4','5/4'],WPM=[[3,2,38,-3],[50,3,34,2],[28,19,34,-2],[3,35,34,3],[56,30,38,-1.5],[30,52,34,2.5],[4,62,36,-2],[54,70,38,1.5]];
const EXP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><g class="e1"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></g><g class="e2"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></g></svg>';
let WALL='';const mkWall=()=>`<div class="phead">Art wall</div><div class="wallw"><div class="wall">${(CONTENT.photography.wall||[]).map((x,i)=>{const o=norm(x),id=reg(o,{_v:'photography',_al:'Art wall',_sp:0}),p=WP[i%8],q=WPM[i%8];return `<button class="wi" data-r="${id}" data-i="${i}" aria-label="${esc(o.title)}" data-o="${esc(o.src||'')}" style="--l:${p[0]}%;--t:${p[1]}%;--w:${p[2]}%;--rt:${p[3]}deg;--ar:${AR[i%4]};--ml:${q[0]}%;--mt:${q[1]}%;--mw:${q[2]}%">${o.src?`<img src="${esc(o.src)}" alt="${esc(o.title)}" draggable="false">`:esc(o.title)}</button>`}).join('')}</div><button class="wfs" data-wfs type="button" aria-label="Expand art wall to full screen" title="Full screen">${EXP}</button></div><div class="wh"><p>A new mix of photos every visit. Drag to arrange inside the board. Tap a piece to visit it in the main photographs. Double-tap a piece to swap its image. Drag an album onto the board to show only its photos.</p><button class="btn" data-reset>Reset</button></div>`;
function applyWall(){let sv={},im={};try{sv=JSON.parse(localStorage.getItem(WK())||'{}');im=JSON.parse(localStorage.getItem('ipwallimg')||'{}')}catch(_){}$$('.wi').forEach(w=>{const p=sv[w.dataset.i];if(p){w.style.left=p[0];w.style.top=p[1]}if(im[w.dataset.i])setImg(w,im[w.dataset.i],false)})}
function setImg(t,u,sv=true){const o=REG[+t.dataset.r];o.src=u;t.innerHTML=`<img src="${esc(u)}" alt="${esc(o.title)}" draggable="false">`;if(sv){let m={};try{m=JSON.parse(localStorage.getItem('ipwallimg')||'{}')}catch(_){}m[t.dataset.i]=u;try{localStorage.setItem('ipwallimg',JSON.stringify(m))}catch(_){}}}
function pick(t){const m=document.createElement('div');m.className='lb pk';const ph=REG.filter(o=>o._v==='photography'&&o._al!=='Art wall'&&o.src&&!isDoc(o)&&!isVid(o));
m.innerHTML=`<button class="x" aria-label="Close">×</button><div class="panel"><h2>Swap this piece</h2><ol class="steps"><li>Pick a photo from the portfolio below,</li><li>or upload one from your device.</li></ol><p class="d">This only changes your own wall, on this device. Press Reset under the wall to bring the originals back.</p><label class="btn">Upload from my device<input type="file" accept="image/*" hidden></label><div class="grid">${ph.map(o=>`<button class="tile" data-u="${esc(o.src)}"><img src="${esc(o.src)}" alt="${esc(o.title)}"></button>`).join('')||'<p class="d">Portfolio photos will appear here once they are added.</p>'}</div></div>`;
m.onclick=ev=>{const u=ev.target.closest('[data-u]');if(u){setImg(t,u.dataset.u);m.remove()}else if(ev.target===m||ev.target.closest('.x'))m.remove()};
$('input',m).onchange=ev=>{const f=ev.target.files[0];if(!f)return;const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);setImg(t,c.toDataURL('image/jpeg',.82));m.remove()};im.src=fr.result};fr.readAsDataURL(f)};document.body.append(m)}
document.addEventListener('pointerdown',e=>{const w=e.target.closest('.wi');if(!w)return;dg={w,bx:w.parentElement.getBoundingClientRect(),sx:e.clientX,sy:e.clientY,l:w.offsetLeft,t:w.offsetTop};moved=false;w.style.zIndex=++zt});
document.addEventListener('pointermove',e=>{if(!dg)return;const dx=e.clientX-dg.sx,dy=e.clientY-dg.sy;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;if(!moved)return;const{w,bx}=dg;w.style.left=Math.max(-MG,Math.min(bx.width-w.offsetWidth+MG,dg.l+dx))/bx.width*100+'%';w.style.top=Math.max(-MG,Math.min(bx.height-w.offsetHeight+MG,dg.t+dy))/bx.height*100+'%'});
addEventListener('pointerup',()=>{if(dg&&moved){let sv={};$$('.wi').forEach(w=>sv[w.dataset.i]=[w.style.left,w.style.top]);try{localStorage.setItem(WK(),JSON.stringify(sv))}catch(_){}}dg=null;setTimeout(()=>moved=false,50)});
let S={};function build(){REG.length=0;WALL=mkWall();S={};order.forEach(v=>{S[v]={};(MODED.includes(v)?['leisure','work']:['leisure']).forEach(m=>S[v][m]=B[v](m))});regHeads()}
let leaving=false;const L=$('#L'),R=$('#R'),BK=$('#book');let cur='cover',sp=0,want=null,busy=false,mode=(()=>{try{return localStorage.getItem('ipmode')||'work'}catch(_){return'work'}})(),pending=null;
const sets=v=>S[v||cur][MODED.includes(v||cur)?mode:'leisure'];
const base=v=>1+order.slice(0,order.indexOf(v)).reduce((a,u)=>a+(u==='cover'?0:2*sets(u).length),0);
const toc=()=>'<h2>Contents</h2><div class="toc">'+order.slice(2).map(v=>`<a href="${FILE[v]+QS}">${names[v]}<i></i></a>`).join('')+'</div>';
$('#tabs').innerHTML=order.slice(1).map((v,i)=>`<a href="${FILE[v]+QS}" data-v="${v}" style="--i:${i}">${names[v]}</a>`).join('');
const tg=d=>{const n=sets().length,i=order.indexOf(cur);const v=order[i+d];return (d>0&&(sp<n-1||v))||(d<0&&(sp>0||v))?(d>0?'Next':'Previous'):''};
const EG=d=>`<button class="edge ${d<0?'pv':'nx'}" data-t="${d}" aria-label="${d<0?'Previous':'Next'}"><i></i><span>${tg(d)}</span></button>`;
const nb=(i,n,s)=>`<div class="nb">${i||s?'<button class="pv" data-t="-1"><i></i>'+tg(-1)+'</button>':'<span class="gap"></span>'}${n?`<em>${n}</em>`:''}${i<order.length-1||s<sets().length-1?'<button data-t="1">'+tg(1)+'<i></i></button>':'<span class="gap"></span>'}</div>`;
function render(v,s=0){wallFs(false);vidFx(null,false);cur=v;sp=s;let[l,r]=sets()[s];const i=order.indexOf(v),b=base(v)+2*s,n=sets().length;
const SO=v==='thanks'||v==='cover';let hd=false;
if(matchMedia('(max-width:900px)').matches&&!SO&&v!=='about'&&r!=='@toc'&&typeof l==='string'){const m=l.match(/^(<h1>.*?<\/h1><p class="lede">.*?<\/p>)([\s\S]*)$/);if(m&&m[2].trim()){hd=true;const sb=r.match(/^<form class="sbar"[\s\S]*?<\/form>/);l=m[1];r=(sb?sb[0]:'')+m[2]+(sb?r.slice(sb[0].length):r)}}
BK.classList.toggle('hd',hd||v==='about');document.body.classList.toggle('nt',SO);$('#tabs').hidden=SO;const CR=crumbs(v,l,s);BK.classList.toggle('solo',SO);R.dataset.theme=v==='thanks'?'thanks':v==='cover'?'cover':(MODED.includes(v)&&mode==='work')?'dark':'light';
const nsL=(v==='photography'&&s>0)?' ns':'',nsR=v==='photography'?' ns':'';L.innerHTML='<div class="dots"></div><div class="sc'+nsL+'">'+CR+(v==='photography'?'':sbar())+l+`</div>${!SO&&(i||s)?EG(-1):''}`;
R.innerHTML=(v==='cover'?'<div class="dots"></div>':'')+'<div class="sc'+nsR+'">'+(SO&&v==='thanks'?CR:'')+(r==='@toc'?toc():r)+`</div>${v==='thanks'?TKN:''}${SO?'':(i<order.length-1||s<n-1)?EG(1):''}`;
$('#top').innerHTML=nb(i,names[v]+(n>1?` ${s+1}/${n}`:''),s);
$$('#tabs a').forEach(a=>a.toggleAttribute('aria-current',a.dataset.v===v));
$$('.dots').forEach(d=>{for(let k=0;k<(innerWidth<900?5:9);k++){const e=document.createElement('i'),z=Math.random();e.className='dot';e.dataset.z=z.toFixed(2);e.textContent=k%2?'P':'I';e.style.cssText=`font-size:${22+z*58}px;left:${Math.random()*92}%;top:${Math.random()*92}%;rotate:${Math.round(Math.random()*120-60)}deg;opacity:${.25+z*.3}`;d.append(e)}});
applyWall();fit();
if(pending){const o=pending;pending=null;if(o._h){const h=$$('h1,h2,h3,.phead,.fold b,.al b').find(x=>htxt(x)===o.title);if(h){h.scrollIntoView({block:'center'});h.classList.add('hh');setTimeout(()=>h.classList.remove('hh'),2400)}}else if(o._v==='video'){const x=$('[data-vid="'+REG.indexOf(o)+'"]');x&&x.click()}else{const g=o._k&&$('[data-go="'+o._k+'"]');g&&g.click();const t=tileOf(REG.indexOf(o)),nl=nolb;nolb=false;t&&t.offsetParent&&setTimeout(()=>{if(nl){t.classList.add('hl');t.scrollIntoView({block:'center'});setTimeout(()=>t.classList.remove('hl'),2400)}else t.click()},60)}}}
const fade=(el,d)=>el.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:d,easing:'cubic-bezier(.2,.8,.3,1)'});
function nav(){if(!S.cover)return;const v=PAGE,s=want!==null?want:(v===cur&&L.innerHTML?sp:Math.min(hs(),S[v][MODED.includes(v)?mode:'leisure'].length-1));if(busy||(v===cur&&s===sp&&L.innerHTML))return;want=null;
const fwd=order.indexOf(v)>order.indexOf(cur)||(v===cur&&s>sp);if(reduce){render(v,s);return}if(!L.innerHTML){render(v,s);R.classList.remove('nox');fade(L,420);fade(R,500);return}
busy=true;const mob=matchMedia('(max-width:900px)').matches,fx=mob?'rotateX':'rotateY',ang=(mob?90:-90)+'deg',fin=()=>{busy=false;nav()};
const shade=(a,b,o)=>{try{return R.animate([{opacity:a},{opacity:b}],Object.assign({pseudoElement:'::after'},o))}catch(_){return null}};
if(fwd){shade(0,.5,{duration:520,easing:'cubic-bezier(.55,0,.75,.45)',fill:'forwards'});R.animate([{transform:fx+'(0)'},{transform:fx+'('+ang+')'}],{duration:520,easing:'cubic-bezier(.55,0,.75,.45)',fill:'forwards'}).finished.then(()=>{render(v,s);R.getAnimations({subtree:true}).forEach(a=>a.cancel());fade(L,480);fade(R,560).finished.then(fin)})}
else{render(v,s);fade(L,480);shade(.5,0,{duration:620,easing:'cubic-bezier(.2,.7,.2,1)'});R.animate([{transform:fx+'('+ang+')'},{transform:fx+'(0)'}],{duration:620,easing:'cubic-bezier(.2,.7,.2,1)'}).finished.then(fin)}}
function leave(u){if(reduce||leaving){return location.href=u}leaving=true;let done=false;const f=()=>{if(!done){done=true;location.href=u}};setTimeout(f,320);try{BK.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-10px) scale(.992)'}],{duration:240,easing:'ease-in',fill:'forwards'}).finished.then(f,f)}catch(_){f()}}
function go(v,s=0){if(v!==PAGE){leave(FILE[v]+QS+(s?'#s'+s:''));return}want=s;nav();try{history.replaceState(null,'',s?'#s'+s:location.pathname+location.search)}catch(_){}}
function turn(d){const n=sets().length;if(d>0&&sp<n-1)return go(cur,sp+1);if(d<0&&sp>0)return go(cur,sp-1);const v=order[order.indexOf(cur)+d];if(v)go(v,d<0?sets(v).length-1:0)}
function setMode(m){mode=m;try{localStorage.setItem('ipmode',m)}catch(_){}render(cur,0)}
addEventListener('hashchange',()=>{want=hs();nav()});
const MG=0;let lc=0,lt=null,lw=null,lb,idx,last,dg=null,moved=false,zt=5;const open=()=>lb&&!lb.hidden;
addEventListener('keydown',e=>{if($('.vp.fx')){if(e.key==='Escape')vidFx(null,false);return}if($('.wallw.fs')){if(e.key==='Escape')wallFs(false);return}if(open()){if(e.key==='Escape')close();if(e.key==='ArrowRight')show(idx+1);if(e.key==='ArrowLeft')show(idx-1);return}if(e.target.closest&&e.target.closest('input'))return;if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)});
let sx=0,sy=0;addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
addEventListener('touchend',e=>{if(open()||e.target.closest('.sc,iframe,.wall'))return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>90&&Math.abs(dy)<50)turn(dx<0?1:-1)},{passive:true});
if(!reduce)addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;$$('.dot').forEach(o=>o.style.transform=`translate(${-x*90*o.dataset.z}px,${-y*90*o.dataset.z}px)`)});
const vis=()=>$$('[data-r]').filter(t=>t.offsetParent),tileOf=n=>$('[data-r="'+n+'"]');
function show(n){const l=vis();idx=(n+l.length)%l.length;const o=REG[+l[idx].dataset.r],w=o._v==='writing';let m='';
if(w)m=o.pdf?`<iframe class="pdf" src="${esc(o.pdf)}" title="Preview of ${esc(o.title)}"></iframe>`:'<div class="ph">PDF preview</div>';
else if(o.embed)m=`<iframe src="${esc(emb(o.embed))}" title="${esc(o.title)}" allowfullscreen></iframe>`;
else if(o.src)m=/\.(mp4|webm|mov)$/i.test(o.src)?`<video src="${esc(o.src)}" controls></video>`:/\.pdf$/i.test(o.src)?`<iframe class="pdf" src="${esc(o.src)}" title="${esc(o.title)}"></iframe>`:isDoc(o)?'<div class="ph">Export to PDF to preview</div>':`<img src="${esc(o.src)}" alt="${esc(o.title)}">`;
else m=`<div class="ph">${lab(o)} placeholder</div>`;
const st=$('.stage',lb);st.innerHTML=m;st.hidden=!m;
$('.panel',lb).innerHTML=`<h2>${esc(o.title)}</h2>`+(o.desc?`<p class="d">${esc(o.desc)}</p>`:'')+(o.text?String(o.text).split(/\n\s*\n/).map(p=>`<p class="w">${esc(p)}</p>`).join(''):'')+(w?`<a class="btn" ${o.pdf?`href="${esc(o.pdf)}" download`:'aria-disabled="true"'}>Download PDF</a>`:'')+(o.url?`<p><a href="${esc(o.url)}" target="_blank" rel="noopener">Open original</a></p>`:'');$('.panel',lb).scrollTop=0}
function close(){ssStop();fsOn(false);lb.hidden=true;$('.stage',lb).innerHTML='';last&&last.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[role=button]'))e.target.click()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-r]');if(!t||moved)return;if(t.classList.contains('wi')){if(lw===t&&Date.now()-lc<380){clearTimeout(lt);lw=null;pick(t);return}lw=t;lc=Date.now();clearTimeout(lt);lt=setTimeout(()=>{lw=null;wallGo(t)},380);return}openAt(t)});
function openAt(t){last=t;
if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<button class="x" aria-label="Close">×</button><div class="tools"><button data-fs>Full screen</button><button data-ss>Slideshow</button></div><button class="p" aria-label="Previous">‹</button><div class="wrap"><div class="stage"></div><div class="panel"></div></div><button class="n" aria-label="Next">›</button>';
lb.onclick=ev=>{const T2=ev.target.closest('[data-fs],[data-ss]');if(T2){if(T2.hasAttribute('data-fs')){ssStop();fsOn(!lb.classList.contains('fs'))}else ssT?ssStop():ssStart();return}if(ev.target.matches('.x,.lb'))close();if(ev.target.matches('.p'))show(idx-1);if(ev.target.matches('.n'))show(idx+1)};document.body.append(lb)}
lb.hidden=false;show(vis().indexOf(t));$('.x',lb).focus()}
document.addEventListener('click',e=>{if(cur==='cover'&&e.target.closest('#R')&&!e.target.closest('[data-t]')){turn(1);return}if(e.target.closest('[data-reset]')){try{localStorage.removeItem('ipwall');localStorage.removeItem('ipwallm');localStorage.removeItem('ipwallimg')}catch(_){}wallAlbum=null;render(cur,sp);return}const CC=e.target.closest('[data-cr]');if(CC){const q=CC.dataset.cr.split('|');go(q[0],+q[1]);return}const T=e.target.closest('[data-t]');if(T){turn(+T.dataset.t);return}
const M=e.target.closest('[data-mode]');if(M){setMode(M.dataset.mode);return}
const F=e.target.closest('[data-sp]');if(F){go(F.dataset.sv||'photography',+F.dataset.sp);return}
const V=e.target.closest('[data-vid]');if(V){$$('[data-vid]').forEach(b=>b.classList.toggle('on',b===V));$('#vt').innerHTML=vh(REG[+V.dataset.vid]);return}
const g=e.target.closest('[data-go]');if(g){$$('[data-proj]').forEach(x=>x.hidden=x.dataset.proj!==g.dataset.go);$$('[data-go]').forEach(b=>b.classList.toggle('on',b===g))}});
function goTo(o){pending=o;mode=o._m||mode;lb&&!lb.hidden&&close();if(cur===o._v&&sp===(o._sp||0)){const p=pending;render(cur,sp)}else{try{sessionStorage.setItem('ippend',String(REG.indexOf(o)));if(o._m)localStorage.setItem('ipmode',o._m)}catch(_){}go(o._v,o._sp||0)}}
const hay=o=>o._s=o._s||[o.title,o.desc,(o.tags||[]).join(' '),o._al,names[o._v],o._m].join(' ').toLowerCase();
const pth=o=>names[o._v]+(MODED.includes(o._v)?' · '+cap(o._m):'')+(o._al?' · '+o._al:'')+(o._h?' · Heading':'');
function find(t){const b=$('.sres');if(!b)return;const ws=t.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!ws.length){b.hidden=true;return}
const ts=o=>ws.every(w=>String(o.title).toLowerCase().includes(w))?0:1,h=REG.filter(o=>o._v&&ws.every(w=>hay(o).includes(w))).sort((a,b)=>ts(a)-ts(b)||(!!b._h-!!a._h)).slice(0,30);
b.innerHTML=h.length?h.map(o=>`<button type="button" class="hit" data-hit="${REG.indexOf(o)}"><b>${esc(o.title)}</b><small>${esc(pth(o))}</small></button>`).join(''):'<p>No matches. Try a folder or section name.</p>';b.hidden=false}
const shut=f=>{if(f&&!$('input',f).value){f.classList.remove('open');$('.mag',f).setAttribute('aria-expanded','false');$('.sres',f).hidden=true}};
function openS(f){f.classList.add('open');$('.mag',f).setAttribute('aria-expanded','true');setTimeout(()=>$('input',f).focus(),120)}
document.addEventListener('input',e=>{if(e.target.id==='q')find(e.target.value)});
document.addEventListener('submit',e=>{e.preventDefault();const h=$('.hit');h&&h.click()});
document.addEventListener('click',e=>{const m=e.target.closest('.mag');if(m){const f=m.closest('.sbar');f.classList.contains('open')&&$('input',f).value?$('form.sbar').requestSubmit():f.classList.contains('open')?shut(f):openS(f);return}
const h=e.target.closest('[data-hit]');if(h){goTo(REG[+h.dataset.hit]);return}
if(!e.target.closest('.sbar'))$$('.sbar').forEach(f=>{const b=$('.sres',f);b.hidden=true;shut(f)})});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.closest('input,textarea')&&!open()){e.preventDefault();const f=$('.sbar');f&&openS(f)}
if(e.key==='Escape'&&e.target.id==='q'){const f=e.target.closest('.sbar');e.target.value='';$('.sres',f).hidden=true;shut(f)}});

const EDIT=/[?&]edit/.test(location.search),slug=t=>String(t||'misc').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),UP={};
const saveD=()=>{try{localStorage.setItem('ipdraft',JSON.stringify(CONTENT))}catch(_){}};
function studio(){let p=$('.studio');if(p){p.hidden=!p.hidden;return}p=document.createElement('aside');p.className='studio';
p.innerHTML=`<button class="x" data-sx aria-label="Close">×</button><h2>Studio</h2><p class="d">Add content and see it live here. Then download content.json and upload it, with the files listed below, to your site.</p>
<label>What<select id="s-t"><option value="writing">Writing</option><option value="photo">Photo (into a folder)</option><option value="wall">Art wall piece</option><option value="video">Video (into a video folder)</option><option value="showreel">Showreel (YouTube link)</option><option value="other">Other work</option><option value="thanks">Special thanks</option></select></label>
<label>Collection (writing only)<select id="s-m"><option value="work">Work</option><option value="leisure">Leisure</option></select></label>
<label>Folder or group name<input id="s-g" placeholder="Goa  or  Travel / Goa  or  Short Films"></label><label>Status (other works)<select id="s-s"><option>Completed</option><option>WIP</option></select></label>
<label>Title or name<input id="s-ti"></label><label>Description or role<input id="s-d"></label><label>Text<textarea id="s-x" rows="5"></textarea></label>
<label>Link (YouTube or web)<input id="s-l"></label><label>Files (photos, PDF, deck)<input id="s-f" type="file" multiple></label>
<button class="btn" data-sadd>Add</button><p id="s-msg" class="d"></p><hr style="width:100%;border-color:#333">
<div><button class="btn" data-sdl>Download content.json</button> <label class="btn">Import<input id="s-i" type="file" accept=".json" hidden></label> <button class="btn" data-sreset>Discard draft</button></div><div id="s-up" class="d"></div>`;
$('#s-i',p).onchange=e=>{const f=e.target.files[0];f&&f.text().then(t=>{Object.assign(CONTENT,JSON.parse(t));saveD();build();render(cur,0)})};document.body.append(p)}
function addItem(){const v=id=>$('#'+id).value.trim(),t=v('s-t'),m=v('s-m'),g=v('s-g'),ti=v('s-ti'),d=v('s-d'),x=v('s-x'),l=v('s-l'),fs=[...$('#s-f').files],C=CONTENT,msg=$('#s-msg');
const put=(dir,f)=>{const p=dir+f.name;PREV[p]=URL.createObjectURL(f)+'#'+f.name;UP[p]=1;return p},grp=(arr,n,o)=>{let a=arr.find(z=>z.title===n);if(!a){a=o;arr.push(a)}return a};
if(t==='writing')(C.writing[m]=C.writing[m]||[]).push({title:ti||'Untitled',desc:d,text:x,pdf:fs[0]?put('writing/',fs[0]):l});
else if(t==='photo'){const pp=(g||'Untitled folder').split('/').map(z=>z.trim()).filter(Boolean),at=pp.pop(),ag=pp[0],dir='images/'+slug(at)+'/',a=grp(C.photography.leisure=C.photography.leisure||[],at,Object.assign({title:at,desc:d,items:[]},ag?{group:ag}:{}));a.folder=a.folder||dir;
 if(!fs.length)a.items.push({title:ti||'Photo',src:'',text:x});fs.forEach(f=>{put(a.folder,f);a.items.push({title:ti||f.name.replace(/\.\w+$/,''),src:f.name,text:x})})}
else if(t==='showreel')C.video.showreel={title:ti||'Showreel',desc:d,embed:l};
else if(t==='video'){const a=grp(C.video.folders=C.video.folders||[],g||'Untitled folder',{title:g||'Untitled folder',desc:'',items:[]});a.items.push({title:ti||'Untitled',desc:d,embed:l})}
else if(t==='other'){const a=grp(C.other,g||'Untitled',{title:g||'Untitled',status:v('s-s'),desc:d,items:[]});fs.length?fs.forEach(f=>a.items.push({title:ti||f.name.replace(/\.\w+$/,''),src:put('decks/',f),desc:d})):a.items.push({title:ti||'Untitled',embed:l,desc:d,text:x})}
else if(t==='wall'){const w=C.photography.wall=C.photography.wall||[];fs.length?fs.forEach(f=>w.push({title:ti||f.name,src:put('images/wall/',f)})):w.push({title:ti||'Art piece',src:''})}
else (C.thanks=C.thanks||[]).push({n:ti||'Name',r:d});
saveD();build();render(cur,0);msg.textContent='Added. The preview is live on this device.';$('#s-up').innerHTML=Object.keys(UP).length?'Upload these files:<br>'+Object.keys(UP).join('<br>'):'';$('#s-ti').value=$('#s-x').value=$('#s-f').value=''}
document.addEventListener('click',e=>{if(e.target.closest('[data-sx]'))$('.studio').hidden=true;if(e.target.closest('[data-sadd]'))addItem();
if(e.target.closest('[data-sdl]')){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(CONTENT,null,1)],{type:'application/json'}));a.download='content.json';a.click()}
if(e.target.closest('[data-sreset]')){try{localStorage.removeItem('ipdraft')}catch(_){}location.reload()}});
if(EDIT){const b=document.createElement('button');b.className='btn sbtn';b.textContent='Studio';b.onclick=studio;document.body.append(b)}
Promise.race([Promise.all(['1em OtraMas','400 1em PF','italic 400 1em PF','1em SketchF'].map(f=>document.fonts.load(f).catch(()=>0))),new Promise(r=>setTimeout(r,700))]).then(()=>fetch('content.json',EDIT?{cache:'no-store'}:{})).then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{if(j)Object.assign(CONTENT,j);if(EDIT)try{const d=JSON.parse(localStorage.getItem('ipdraft')||'null');d&&Object.assign(CONTENT,d)}catch(_){}build();try{const k=sessionStorage.getItem('ippend');if(k!==null){sessionStorage.removeItem('ippend');pending=REG[+k]||null}}catch(_){}nav()});

var ssT=null;
function fsOn(on){if(!lb)return;lb.classList.toggle('fs',on);try{if(on&&!document.fullscreenElement&&lb.requestFullscreen)lb.requestFullscreen().catch(()=>{});else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(_){}}
function ssStop(){clearInterval(ssT);ssT=null;if(lb)lb.classList.remove('ss')}
function ssStart(){fsOn(true);lb.classList.add('ss');clearInterval(ssT);ssT=setInterval(()=>show(idx+1),4000)}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&lb&&lb.classList.contains('fs')){ssStop();lb.classList.remove('fs')}});
function fit(){$$('.tk,.abx').forEach(t=>{const sc=t.closest('.sc');let f=t.classList.contains('abr')?(innerWidth<900?17:24):t.classList.contains('abx')?(innerWidth<900?14:20):(innerWidth<900?13:16);t.style.fontSize=f+'px';while(sc.scrollHeight>sc.clientHeight+1&&f>4.5){f-=.5;t.style.fontSize=f+'px'}});{const ab=$$('.abx');if(ab.length&&0){const m=Math.min(...ab.map(t=>parseFloat(t.style.fontSize)));ab.forEach(t=>t.style.fontSize=m+'px')}}$$('.sc').forEach(e=>{if(e.querySelector('.tk,.abx'))return;let k=1;e.style.setProperty('--k',1);while(e.scrollHeight>e.clientHeight+2&&k>.64){k-=.06;e.style.setProperty('--k',k.toFixed(2))}})}
addEventListener('resize',()=>fit());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fit());

var nolb=false,wfsPh=null;const WK=()=>matchMedia('(max-width:900px)').matches?'ipwallm':'ipwall';
const htxt=el=>{const c=el.cloneNode(true);c.querySelectorAll('br').forEach(b=>b.replaceWith(' '));return c.textContent.replace(/\s+/g,' ').trim()};
function regHeads(){const seen=new Set();order.forEach(v=>(MODED.includes(v)?['leisure','work']:['leisure']).forEach(m=>S[v][m].forEach((pg,s)=>pg.forEach(h=>{const d=document.createElement('template');d.innerHTML=h==='@toc'?'<h2>Contents</h2>':h;
 d.content.querySelectorAll('h1,h2,h3,.phead,.fold,.al').forEach(x=>{let sv=v,sp=s;if(x.classList.contains('fold')||x.classList.contains('al')){sv=x.dataset.sv||v;sp=+x.dataset.sp;x=x.querySelector('b')}
  const t=x&&htxt(x);if(!t)return;const k=[sv,MODED.includes(sv)?m:'',sp,t].join('|');if(seen.has(k))return;seen.add(k);
  const ex={_v:sv,_sp:sp,_h:1};if(MODED.includes(sv))ex._m=m;reg({title:t,desc:''},ex)})}))))}
function wallFs(on){if(on){const w=$('.wallw');if(!w||w.classList.contains('fs'))return;wfsPh=document.createComment('wall');w.before(wfsPh);document.body.append(w);w.classList.add('fs');try{const r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();r&&r.catch&&r.catch(()=>{})}catch(_){}}
else{const w=$('.wallw.fs');if(!w)return;w.classList.remove('fs');if(wfsPh&&wfsPh.parentNode)wfsPh.replaceWith(w);else w.remove();wfsPh=null;try{document.fullscreenElement&&document.exitFullscreen()}catch(_){}}}
function wallGo(t){wallFs(false);const o=REG[+t.dataset.r],m=o.src&&REG.find(x=>x!==o&&x._v==='photography'&&x._al!=='Art wall'&&x.src===o.src);
 if(m){nolb=true;goTo(m)}else go('photography',sets('photography').length>1?1:0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-wfs]');if(b)wallFs(!b.closest('.wallw').classList.contains('fs'))});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&$('.wallw.fs'))wallFs(false)});

function crumbs(v,l,s){if(v==='cover')return '';const P=[{t:'Index',g:'index|0'}];
 if(v!=='index'){P.push({t:names[v],g:v+'|0'});if(MODED.includes(v))P.push({t:cap(mode)});let al='';
  if(v==='photography'&&s>0){const m=String(l).match(/class="phead">(.*?)<\/div>/);al=m?m[1]:''}else if((v==='other'||v==='video')&&s>0){const m=String(l).match(/<h1>(.*?)<\/h1>/);al=m?m[1]:''}
  if(al)P.push({t:al,raw:1})}
 return '<nav class="crumb" aria-label="Breadcrumb">'+P.map((p,i)=>{const t=p.raw?p.t:esc(p.t);return i===P.length-1?'<b>'+t+'</b>':p.g?`<a data-cr="${p.g}">${t}</a>`:`<span>${t}</span>`}).join('<span class="sep">›</span>')+'</nav>'}
function fcv(al){const c=(al.items||[]).map(x=>norm(x,al)).find(o=>o.src&&!isDoc(o)&&!isVid(o));return c?`<img class="fcv" src="${esc(c.src)}" alt="" loading="lazy">`:''}
(function(){const orig=applyWall;applyWall=function(){orig();mixWall()}})();
function mixWall(){const ws=$$('.wi');if(!ws.length)return;let im={};try{im=JSON.parse(localStorage.getItem('ipwallimg')||'{}')}catch(_){}
 const seen=new Set();let pool=[];
 if(wallAlbum)pool=wallAlbum.photos.slice();else{REG.forEach(o=>{if(o._v==='photography'&&o._al!=='Art wall'&&o.src&&!isDoc(o)&&!isVid(o)&&!seen.has(o.src)){seen.add(o.src);pool.push({src:o.src,title:o.title})}});
  ws.forEach(w=>{if(w.dataset.o&&!seen.has(w.dataset.o)){seen.add(w.dataset.o);pool.push({src:w.dataset.o,title:REG[+w.dataset.r].title})}})}
 const hp=$('.wh p');if(hp){hp.dataset.t=hp.dataset.t||hp.textContent;hp.textContent=wallAlbum?'Showing '+wallAlbum.name+'. Press Reset for a mix of everything.':hp.dataset.t}
 if(!pool.length)return;for(let i=pool.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[pool[i],pool[j]]=[pool[j],pool[i]]}
 let k=0;ws.forEach(w=>{if(!wallAlbum&&im[w.dataset.i])return;const p=pool[k++%pool.length],o=REG[+w.dataset.r];o.src=p.src;o.title=p.title;delete o._s;w.setAttribute('aria-label',p.title);w.innerHTML=`<img src="${esc(p.src)}" alt="${esc(p.title)}" draggable="false">`})}

const TKN='<div class="tkn"><button type="button" class="btn" data-t="-1">‹ Previous</button><button type="button" class="btn" data-cv>Back to cover</button></div>',VFB='<div class="vfr"><button type="button" class="btn" data-vfs>Full screen</button></div>';
var vfsPh=null;
function vidFs(vp){if(!vp)return;if(document.fullscreenElement){document.exitFullscreen();return}const f=vp.requestFullscreen||vp.webkitRequestFullscreen;if(f){try{const r=f.call(vp);r&&r.catch&&r.catch(()=>vidFx(vp,true))}catch(_){vidFx(vp,true)}}else vidFx(vp,true)}
function vidFx(vp,on){if(on){vfsPh=document.createComment('v');vp.before(vfsPh);document.body.append(vp);vp.classList.add('fx');const x=document.createElement('button');x.className='vx';x.setAttribute('data-vx','');x.setAttribute('aria-label','Close full screen');x.textContent='×';vp.append(x)}
else{const w=$('.vp.fx');if(!w)return;w.classList.remove('fx');const x=$('.vx',w);x&&x.remove();if(vfsPh&&vfsPh.parentNode)vfsPh.replaceWith(w);else w.remove();vfsPh=null}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vfs]');if(b){vidFs(b.closest('.vt').querySelector('.vp'));return}if(e.target.closest('[data-vx]')){vidFx(null,false);return}if(e.target.closest('[data-cv]'))go('cover')});

{let vx=0,vy=0,vb={t:1,b:1};R.addEventListener('touchstart',e=>{vx=e.touches[0].clientX;vy=e.touches[0].clientY;const sc=e.target.closest('.sc');vb=sc?{t:sc.scrollTop<=2,b:sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2}:{t:1,b:1}},{passive:true});
R.addEventListener('touchend',e=>{if(!matchMedia('(max-width:900px)').matches||open()||$('.wallw.fs')||$('.vp.fx')||e.target.closest('.wall,iframe,.sres,.wallw,[data-vfs]'))return;const dx=e.changedTouches[0].clientX-vx,dy=e.changedTouches[0].clientY-vy;
 if(Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx)*1.6){if(dy<0&&vb.b)turn(1);else if(dy>0&&vb.t)turn(-1)}},{passive:true})}

var dragAl=null,wallAlbum=null;
function acv(al){const c=(al.items||[]).map(x=>norm(x,al)).find(o=>o.src&&!isDoc(o)&&!isVid(o));return c?`<img class="ac" src="${esc(c.src)}" alt="" loading="lazy" draggable="false">`:''}
document.addEventListener('dragstart',e=>{const a=e.target.closest&&e.target.closest('.al');if(!a)return;dragAl=+a.dataset.ai;try{e.dataTransfer.setData('text/plain','album');e.dataTransfer.effectAllowed='copy'}catch(_){}});
document.addEventListener('dragend',()=>{dragAl=null;$$('.wallw.dro').forEach(w=>w.classList.remove('dro'))});
document.addEventListener('dragover',e=>{const w=dragAl!==null&&e.target.closest&&e.target.closest('.wallw');if(w){e.preventDefault();w.classList.add('dro')}});
document.addEventListener('dragleave',e=>{const w=e.target.closest&&e.target.closest('.wallw');if(w&&!w.contains(e.relatedTarget))w.classList.remove('dro')});
document.addEventListener('drop',e=>{const w=dragAl!==null&&e.target.closest&&e.target.closest('.wallw');if(!w)return;e.preventDefault();w.classList.remove('dro');albumToWall(dragAl);dragAl=null});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-towall]');if(!t)return;e.stopPropagation();e.preventDefault();albumToWall(+t.dataset.towall)},true);
function albumToWall(i){const al=(CONTENT.photography.leisure||[])[i];if(!al)return;const ph=REG.filter(o=>o._v==='photography'&&o._al===al.title&&o.src&&!isDoc(o)&&!isVid(o)).map(o=>({src:o.src,title:o.title})),hp=$('.wh p');
 if(!ph.length){if(hp)hp.textContent='No photos in '+al.title+' yet.';return}
 wallAlbum={name:al.title,photos:ph};mixWall()}

/* ---- smooth multi-page hand-off ---- */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||!/\.html$|\/$/.test(u.pathname)||u.pathname===location.pathname)return;e.preventDefault();leave(u.href)});
addEventListener('pageshow',e=>{if(e.persisted){leaving=false;BK.getAnimations().forEach(a=>a.cancel())}});
(window.requestIdleCallback||setTimeout)(()=>{Object.values(FILE).forEach(f=>{if(f===location.pathname.split('/').pop()||(f==='index.html'&&/\/$/.test(location.pathname)))return;const l=document.createElement('link');l.rel='prefetch';l.href=f;document.head.append(l)})});
