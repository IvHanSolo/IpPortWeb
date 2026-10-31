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
let PAGE=document.body.dataset.page||'cover';const FILE={cover:'index.html',index:'contents.html',writing:'writing.html',photography:'photography.html',video:'video.html',other:'other-works.html',about:'about.html',thanks:'special-thanks.html'},QS=/[?&]edit/.test(location.search)?location.search:'',hs=()=>{const m=/^#s(\d+)$/.exec(location.hash);return m?+m[1]:0};
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
const order=['cover','index','writing','photography','video','other','about','thanks'],MODED=[];
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
const ytid=u=>{const m=String(u||'').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);return m?m[1]:''};
const thumb=o=>o.thumb||(o.embed&&ytid(o.embed)?'https://i.ytimg.com/vi/'+ytid(o.embed)+'/hqdefault.jpg':'');
const RT=[-1.6,1.2,-.8,1.8,-1.2,.9,1.5,-1.9],PLAY='<svg class="pl" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="rgba(0,0,0,.55)" stroke="#fff" stroke-width="2.5"/><path d="M19 15v18l15-9z" fill="#fff"/></svg>';
const ALB=[];
const mk=(t,l)=>`<h1>${t}</h1><p class="lede">${l}</p>`;
const PG=k=>(CONTENT.pages||{})[k]||{},PT=(k,t,l)=>{const p=PG(k);return mk(esc(p.title??t).replace(/\n/g,'<br>'),esc(p.lede??l))},WR=()=>[...(CONTENT.writing.items||[]),...(CONTENT.writing.work||[]),...(CONTENT.writing.leisure||[])];
const MAG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
const sbar=()=>`<form class="sbar" role="search"><button type="button" class="mag" aria-label="Search the book" aria-expanded="false">${MAG}</button><input type="search" id="q" placeholder="Search titles, headings, albums" aria-label="Search" autocomplete="off"><div class="sres" hidden></div></form>`;
const sub='<a class="btn" href="'+SUB+'" target="_blank" rel="noopener">Read on Substack</a>';
const B={
cover:()=>[['',`<div class="cv">${PT('cover','Ivan\nPhilips','Film, television and digital content')}<button type="button" class="btn cvb" data-t="1">Open</button></div>`]],
index:()=>[[PT('index','Ivan\nPhilips',CONTENT.intro),'@toc']],
writing:()=>[[PT('writing','Writing','Everything begins and ends with a story and this is how I choose to tell them.')+sub,WR().map(x=>norm(x)).map(o=>`<div class="item" role="button" tabindex="0" data-r="${reg(o,{_v:'writing'})}"><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p><span class="more">Click to read more<i>→</i></span></div>`).join('')||'<p>Nothing here yet.</p>']],
photography:()=>{const als=CONTENT.photography.leisure||[],all=[];
 als.forEach(al=>(al.items||[]).forEach(x=>{const o=norm(x,al);all.push({o,al:al.title,id:reg(o,{_v:'photography',_al:al.title,_sp:0,tags:al.group?[al.group]:[]})})}));
 const tabs=on=>`<div class="switch" role="tablist" aria-label="Photography"><button data-sv="photography" data-sp="0" aria-selected="${on===0}">Albums</button><button data-sv="photography" data-sp="1" aria-selected="${on===1}">Art wall</button></div>`;
 const tiles=all.filter(t=>t.o.src).map((t,i)=>`<button type="button" class="bt" data-r="${t.id}" data-o="${i}" data-vf="${esc(t.al)}" style="--rt:${RT[i%8]}deg">${t.o.src?`<img src="${esc(t.o.src)}" alt="${esc(t.o.title)}" loading="lazy" draggable="false">`:'<span class="nop"></span>'}<span class="cap"><small>${esc(t.al)}</small><b>${esc(t.o.title)}</b></span></button>`).join('');
 const chips=als.length?`<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-vfilter="">All</button>${als.map(a=>`<button type="button" class="chip" data-vfilter="${esc(a.title)}">${esc(a.title)}</button>`).join('')}</div>`:'';
 const wch=als.length?`<div class="alb"><span>Show only</span>${als.map((a,i)=>`<button type="button" class="chip" data-towall="${i}">${esc(a.title)}</button>`).join('')}</div>`:'';
 return [[PT('photography','Photography','Take a look through my lens for now')+tabs(0)+chips+'<p class="bh">Hover to peek. Click any photo to see it full screen.</p>',`<div class="boardw"><div class="board" id="vboard" data-kind="photos">${tiles||'<p>Photos will appear here once they are added.</p>'}</div></div>`],
 [PT('wall','Art wall','A new mix of your photos every visit. Drag the pieces to arrange them.')+tabs(1)+wch,WALL]]},
video:()=>{const sr=CONTENT.video.showreel||{},fs=CONTENT.video.folders||[],all=[];
 fs.forEach(f=>(f.items||[]).forEach(x=>{const o=norm(x,f);all.push({o,f:f.title,id:reg(o,{_v:'video',_al:f.title,_sp:0})})}));
 all.sort((a,b)=>String(b.o.date||'').localeCompare(String(a.o.date||'')));
 const tiles=all.map((t,i)=>{const th=thumb(t.o);return `<button type="button" class="bt vt2" data-vid="${t.id}" data-vf="${esc(t.f)}" style="--rt:${RT[i%8]}deg">${th?`<img src="${esc(th)}" alt="" loading="lazy" draggable="false" onerror="this.remove()">`:'<span class="nop"></span>'}${PLAY}<span class="cap"><small>${esc(t.f)}${t.o.date?' · '+esc(String(t.o.date).slice(0,4)):''}</small><b>${esc(t.o.title)}</b></span></button>`}).join('');
 const chips=fs.length?`<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-vfilter="">All</button>${fs.map(f=>`<button type="button" class="chip" data-vfilter="${esc(f.title)}">${esc(f.title)}</button>`).join('')}</div>`:'';
 return [[PT('video','Video','Get immersed into a piece of what is')+`<div class="vt sr">${(()=>{const e=sr.embed?emb(sr.embed):'';return `<div class="vp">${e?`<iframe src="${esc(e)}" title="Showreel" allowfullscreen></iframe>`:'<span>Showreel goes here</span>'}</div>${e?VFB:''}`})()}</div>`+chips+'<p class="bh">Newest first. Hover to peek. Click any piece to watch it full screen with its details.</p>',`<div class="boardw"><div class="board" id="vboard" data-kind="video">${tiles||'<p>Videos will appear here once you add YouTube or Vimeo links.</p>'}</div></div>`]]},
other:()=>{const A=CONTENT.other.map((al,i)=>{const its=(al.items||[]).map(x=>{const o=norm(x,al);o.label=o.label||al.label;return o}),ids=its.map(o=>reg(o,{_v:'other',_al:al.title,_sp:i+1}));return{al,its,ids,i}});
 const grp=st=>A.filter(a=>a.al.status===st).map(a=>`<button class="fold" data-sv="other" data-sp="${a.i+1}"><b>${esc(a.al.title)}</b><span>${esc(a.al.desc)}</span><small>${a.its.length} items</small></button>`).join('')||'<p>Nothing here yet.</p>';
 const out=[[PT('other','Other works','Completed pieces and work in progress. Pick one to open its pages.'),`<h2>Completed</h2><div class="folders">${grp('Completed')}</div>${A.some(a=>a.al.status==='WIP')?`<h2 class="s">Work in progress</h2><div class="folders">${grp('WIP')}</div>`:''}`]];
 A.forEach(a=>out.push([`<h1>${esc(a.al.title)}</h1><p class="lede">${esc(a.al.desc)}</p><span class="badge">${esc(a.al.status)}</span><div class="pnote"><p>${esc(a.al.note||'Write about this piece here.')}</p></div>`,`<div class="grid">${a.its.map((o,j)=>tl(o,a.ids[j])).join('')}</div>`]));return out},
about:()=>[[PT('about','About','Creative and production-focused communications professional, bridging creative vision with execution.')+`<div class="abx abl"><div class="tile portrait">${CONTENT.about.photo?`<img src="${esc(CONTENT.about.photo)}" alt="Ivan Philips">`:'<span>Portrait</span>'}</div><div class="links"><a href="mailto:${esc(CONTENT.about.email||'Ivan913.ip@gmail.com')}"><b>Email</b>${esc(CONTENT.about.email||'Ivan913.ip@gmail.com')}</a><a href="tel:${esc(String(CONTENT.about.phone||'+91 93172 91752').replace(/[^+\d]/g,''))}"><b>Phone</b>${esc(CONTENT.about.phone||'+91 93172 91752')}</a><a href="https://instagram.com/${esc(String(CONTENT.about.instagram||'pp_fr_2').replace('@',''))}" target="_blank" rel="noopener"><b>Instagram</b>@${esc(String(CONTENT.about.instagram||'pp_fr_2').replace('@',''))}</a></div></div>`,
`<div class="abx abr"><h2>Profile</h2><p>${esc(PG('about').body||'Thane-based MBA candidate in Communications Management at FLAME University, with a grounding in film, television and digital content. I have worked across scripting, content creation, on-set assistance and post-production, at Entre Nous Experiences, Caliac Studios and Juggernaut Productions, and on live events such as Lollapalooza India. I am growing into creative management, with Photoshop, Lightroom and Canva alongside photography and videography.')}</p></div>`]],
thanks:()=>{let h='',open=false,first=true;const cl=()=>{if(open){h+='</p>';open=false}},op=()=>{if(!open){h+='<p class="tp">';open=true;first=true}};
(CONTENT.thanks||[]).forEach(t=>{if(t.h){cl();h+=`<h2 class="th2">${esc(t.h)}</h2>`;return}
 if(!t.r){cl();h+=`<div class="tsub">${esc(t.n)}</div>`;return}
 op();if(!first)h+=' <i class="ipb" aria-hidden="true">IP</i> ';first=false;
 h+=`<span class="te"><b class="${t.g?'tg':'tn'}">${esc(t.n)}</b> ${esc(t.r)}</span>`});cl();
 return [['',`<div class="tk"><h1 class="ty">${esc(PG('thanks').title??'Thank You!')}</h1><p class="tq">${esc(PG('thanks').lede??'nothing here was made alone')}</p>${h}<h2 class="th2 tend">The End</h2></div>`]]}};
function vh(o){const e=o.embed?emb(o.embed):'';return `<div class="vp">${e?`<iframe src="${esc(e)}" title="${esc(o.title)}" allowfullscreen></iframe>`:'<span>Paste a YouTube link into CONTENT.video</span>'}</div>${e?VFB:''}<h2>${esc(o.title)}</h2>${o.desc?`<p>${esc(o.desc)}</p>`:''}`}
const emb=u=>{let m=u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);if(m)return'https://www.youtube.com/embed/'+m[1];m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/);return m?'https://player.vimeo.com/video/'+m[1]:u};
const WP=[[4,6,30,-3],[38,4,26,2],[68,8,26,-2],[8,44,24,3],[38,38,30,-1.5],[70,44,24,2.5],[18,72,28,-2],[54,70,30,1.5]],AR=['4/5','1/1','3/4','5/4'],WPM=[[3,2,38,-3],[50,3,34,2],[28,19,34,-2],[3,35,34,3],[56,30,38,-1.5],[30,52,34,2.5],[4,62,36,-2],[54,70,38,1.5]];
const EXP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><g class="e1"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></g><g class="e2"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></g></svg>';
let WALL='';const mkWall=()=>`<div class="phead">Art wall</div><div class="wallw"><div class="wall">${(CONTENT.photography.wall||[]).map((x,i)=>{const o=norm(x),id=reg(o,{_v:'photography',_al:'Art wall',_sp:1}),p=WP[i%8],q=WPM[i%8];return `<button class="wi" data-r="${id}" data-i="${i}" aria-label="${esc(o.title)}" data-o="${esc(o.src||'')}" style="--l:${p[0]}%;--t:${p[1]}%;--w:${p[2]}%;--rt:${p[3]}deg;--ar:${AR[i%4]};--ml:${q[0]}%;--mt:${q[1]}%;--mw:${q[2]}%">${o.src?`<img src="${esc(o.src)}" alt="${esc(o.title)}" draggable="false">`:esc(o.title)}</button>`}).join('')}</div><button class="wfs" data-wfs type="button" aria-label="Expand art wall to full screen" title="Full screen">${EXP}</button></div><div class="wh"><p>A new mix of photos every visit. Drag to arrange inside the board. Double-tap a piece to swap its image. Use Show only above to see just one album.</p><button class="btn" data-reset>Reset</button></div>`;
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
const L=$('#L'),R=$('#R'),BK=$('#book'),SH=$('#sheet')||BK,isM=()=>matchMedia('(max-width:900px)').matches;let cur='cover',sp=0,want=null,busy=false,mode=(()=>{try{return localStorage.getItem('ipmode')||'work'}catch(_){return'work'}})(),pending=null;
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
BK.classList.toggle('hd',hd||v==='about');document.body.classList.toggle('nt',SO);$('#tabs').hidden=SO;const CR=crumbs(v,l,s);BK.classList.toggle('solo',SO);R.dataset.theme=v==='thanks'?'thanks':v==='cover'?'cover':(v==='writing'||(v==='photography'&&s===1))?'dark':'light';
const nsL='',nsR=(v==='photography'&&s===1)?' ns':'';L.innerHTML='<div class="dots"></div><div class="sc'+nsL+'">'+CR+sbar()+l+`</div>${!SO&&(i||s)?EG(-1):''}`;
R.innerHTML=(v==='cover'?'<div class="dots"></div>':'')+'<div class="sc'+nsR+'">'+(SO&&v==='thanks'?CR:'')+(r==='@toc'?toc():r)+`</div>${v==='thanks'?TKN:''}${SO?'':(i<order.length-1||s<n-1)?EG(1):''}`;
$('#top').innerHTML=nb(i,names[v]+(n>1?` ${s+1}/${n}`:''),s);
$$('#tabs a').forEach(a=>a.toggleAttribute('aria-current',a.dataset.v===v));
$$('.dots').forEach(d=>{for(let k=0;k<(innerWidth<900?8:12);k++){const e=document.createElement('i'),z=Math.random();e.className='dot';e.dataset.z=z.toFixed(2);e.textContent=['I','P','i','p'][Math.random()*4|0];e.style.cssText=`font-size:${22+z*58}px;left:${Math.random()*92}%;top:${Math.random()*92}%;rotate:${Math.round(Math.random()*120-60)}deg;opacity:${.25+z*.3}`;d.append(e)}});
applyWall();ordBoard();fit();
if(pending){const o=pending;pending=null;if(o._h){const h=$$('h1,h2,h3,.phead,.fold b,.bt[data-album] b').find(x=>htxt(x)===o.title);if(h){h.scrollIntoView({block:'center'});h.classList.add('hh');setTimeout(()=>h.classList.remove('hh'),2400)}}else if(o._v==='video'){const x=$('[data-vid="'+REG.indexOf(o)+'"]');x&&x.click()}else{const g=o._k&&$('[data-go="'+o._k+'"]');g&&g.click();const t=tileOf(REG.indexOf(o)),nl=nolb;nolb=false;t&&t.offsetParent&&setTimeout(()=>{if(nl){t.classList.add('hl');t.scrollIntoView({block:'center'});setTimeout(()=>t.classList.remove('hl'),2400)}else t.click()},60)}}}
const fade=(el,d)=>el.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:d,easing:'cubic-bezier(.2,.8,.3,1)'});
const shade=(T,a,b,o)=>{try{return T.animate([{opacity:a},{opacity:b}],Object.assign({pseudoElement:'::after'},o))}catch(_){return null}};
function nav(){if(!S.cover)return;const v=PAGE,s=want!==null?want:(v===cur&&L.innerHTML?sp:Math.min(hs(),S[v][MODED.includes(v)?mode:'leisure'].length-1));if(busy||(v===cur&&s===sp&&L.innerHTML))return;want=null;
const fwd=order.indexOf(v)>order.indexOf(cur)||(v===cur&&s>sp);if(reduce||!L.innerHTML||NF){NF=false;render(v,s);R.classList.remove('nox');return}
busy=true;const mob=isM(),T=mob?SH:R,fx=mob?'rotateX':'rotateY',ang=(mob?90:-90)+'deg',fin=()=>{busy=false;nav()};
if(mob)T.style.transformOrigin='50% '+BK.scrollTop+'px';
const out={duration:480,easing:'cubic-bezier(.55,0,.75,.45)',fill:'forwards'},inn={duration:560,easing:'cubic-bezier(.2,.7,.2,1)'};
const done=()=>{T.getAnimations({subtree:true}).forEach(a=>a.cancel());if(mob)T.style.transformOrigin='';fin()};
if(fwd){shade(T,0,.5,out);T.animate([{transform:fx+'(0)'},{transform:fx+'('+ang+')'}],out).finished.then(()=>{render(v,s);BK.scrollTop=0;T.getAnimations({subtree:true}).forEach(a=>a.cancel());const k=T.animate([{opacity:.0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'});mob&&(T.style.transformOrigin='');k.finished.then(fin,fin)})}
else{render(v,s);BK.scrollTop=0;shade(T,.5,0,inn);T.animate([{transform:fx+'('+ang+')'},{transform:fx+'(0)'}],inn).finished.then(done,done)}}
const TT=v=>(v==='cover'?'':names[v]+' · ')+'Ivan Philips';
function go(v,s=0){if(v!==PAGE){try{history.pushState(null,'',FILE[v]+QS+(s?'#s'+s:''))}catch(_){location.href=FILE[v]+QS+(s?'#s'+s:'');return}PAGE=v;document.body.dataset.page=v;document.title=TT(v);want=s;nav();return}want=s;nav();try{history.replaceState(null,'',s?'#s'+s:location.pathname+location.search)}catch(_){}}
const pageOf=u=>{const f=u.pathname.split('/').pop()||'index.html';return Object.keys(FILE).find(k=>FILE[k]===f)};
addEventListener('popstate',()=>{const v=pageOf(location)||'cover';PAGE=v;document.body.dataset.page=v;document.title=TT(v);want=hs();nav()});
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;const v=pageOf(u);if(!v)return;e.preventDefault();go(v,0)});
function turn(d){const n=sets().length;if(d>0&&sp<n-1)return go(cur,sp+1);if(d<0&&sp>0)return go(cur,sp-1);const v=order[order.indexOf(cur)+d];if(v)go(v,d<0?sets(v).length-1:0)}
function setMode(m){mode=m;try{localStorage.setItem('ipmode',m)}catch(_){}render(cur,0)}
addEventListener('hashchange',()=>{want=hs();nav()});
const MG=0;let lc=0,lt=null,lw=null,lb,idx,last,dg=null,moved=false,zt=5;const open=()=>lb&&!lb.hidden;
addEventListener('keydown',e=>{if(rd&&!rd.hidden){if(e.key==='Escape')rClose();if(e.key==='ArrowRight')rGo(1);if(e.key==='ArrowLeft')rGo(-1);return}if($('.vp.fx')){if(e.key==='Escape')vidFx(null,false);return}if($('.wallw.fs')){if(e.key==='Escape')wallFs(false);return}if(open()){if(e.key==='Escape')close();if(e.key==='ArrowRight')show(idx+1);if(e.key==='ArrowLeft')show(idx-1);return}if(e.target.closest&&e.target.closest('input'))return;if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)});
/* ---- flip gestures: swipe up/down on phones, drag / trackpad / arrows on desktop ---- */
const NOFLIP='.rd,iframe,.wall,.wallw,.lb,.vfs,.afs,input,textarea,select,.sres,.sbar,.pk';
let g=null;const pull=y=>{SH.style.transition='none';SH.style.transform=y?`translateY(${y}px)`:''};
addEventListener('touchstart',e=>{if(open()||e.target.closest(NOFLIP)){g=null;return}const t=e.touches[0];g={x:t.clientX,y:t.clientY,top:BK.scrollTop<=1,bot:BK.scrollTop+BK.clientHeight>=BK.scrollHeight-2,m:isM()}},{passive:true});
addEventListener('touchmove',e=>{if(!g||!g.m||busy)return;const dy=e.touches[0].clientY-g.y;if((dy<0&&g.bot&&sets().length+order.length>0)||(dy>0&&g.top))pull(Math.max(-70,Math.min(70,dy*.3)))},{passive:true});
addEventListener('touchend',e=>{if(!g)return;const q=g;g=null;const t=e.changedTouches[0],dx=t.clientX-q.x,dy=t.clientY-q.y;SH.style.transition='transform .25s';SH.style.transform='';setTimeout(()=>SH.style.transition='',260);
if(q.m){if(Math.abs(dx)<90){if(dy<-70&&q.bot)turn(1);else if(dy>70&&q.top)turn(-1)}}else if(Math.abs(dx)>90&&Math.abs(dy)<60)turn(dx<0?1:-1)},{passive:true});
let md=null;addEventListener('pointerdown',e=>{md=null;if(e.pointerType!=='mouse'||e.button||isM()||open()||!e.target.closest('.pg')||e.target.closest(NOFLIP+',button,a,.wi,.bt,.tile,.fold,.note,.item,.chip,.btn,.switch,[data-r],[role=button],h1,h2,h3,p,li,span,b,em,small,label'))return;md={x:e.clientX,y:e.clientY}});
addEventListener('pointerup',e=>{if(!md)return;const dx=e.clientX-md.x,dy=e.clientY-md.y;md=null;if(Math.abs(dx)>130&&Math.abs(dy)<80&&!String(getSelection()).length)turn(dx<0?1:-1)});
let wl=0;addEventListener('wheel',e=>{if(open()||isM()||e.target.closest(NOFLIP))return;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.5&&Math.abs(e.deltaX)>30&&Date.now()-wl>900){wl=Date.now();turn(e.deltaX>0?1:-1)}},{passive:true});
if(!reduce)addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;$$('.dot').forEach(o=>o.style.transform=`translate(${-x*90*o.dataset.z}px,${-y*90*o.dataset.z}px)`)});

/* ---- fullscreen detail views (albums + videos) ---- */
const embA=u=>{const e=emb(u);return e+(e.includes('?')?'&':'?')+'autoplay=1&rel=0'};
let ovEl=null,ovKind='',ovList=[],ovI=0;
function ovClose(){if(!ovEl)return;const el=ovEl;ovEl=null;el.classList.add('out');setTimeout(()=>el.remove(),220);document.documentElement.classList.remove('ovo');ovBack&&ovBack.focus&&ovBack.focus()}
let ovBack=null;
function ovOpen(kind,html,from){ovClose();ovKind=kind;ovBack=from||null;const el=document.createElement('div');el.className=kind==='v'?'vfs':'afs';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.innerHTML='<button class="x" aria-label="Close">×</button>'+html;document.body.append(el);ovEl=el;document.documentElement.classList.add('ovo');
 if(from&&!reduce){const r=from.getBoundingClientRect(),s=Math.max(.2,Math.min(1,r.width/innerWidth));el.animate([{opacity:0,transform:`translate(${r.left+r.width/2-innerWidth/2}px,${r.top+r.height/2-innerHeight/2}px) scale(${s})`,borderRadius:'12px'},{opacity:1,transform:'none',borderRadius:'0px'}],{duration:380,easing:'cubic-bezier(.2,.8,.2,1)'})}
 $('.x',el).focus();return el}
function vShow(n){const l=$$('#vboard .bt[data-vid]').filter(t=>t.offsetParent);if(!l.length)return;ovList=l;ovI=(n+l.length)%l.length;const t=l[ovI],o=REG[+t.dataset.vid],e=o.embed?embA(o.embed):'';
 const el=ovEl;$('.vst',el).innerHTML=e?`<iframe src="${esc(e)}" title="${esc(o.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`:'<div class="ph">Add a YouTube or Vimeo link for this video</div>';
 $('.vi',el).innerHTML=`<small>${esc(o._al||'')}</small><h2>${esc(o.title)}</h2>${o.desc?`<p>${esc(o.desc)}</p>`:''}<span class="vn">${ovI+1} / ${l.length}</span>`}
function vOpen(t){const el=ovOpen('v','<button class="p" aria-label="Previous video">‹</button><div class="vm"><div class="vst"></div><div class="vi"></div></div><button class="n" aria-label="Next video">›</button>',t);vShow($$('#vboard .bt[data-vid]').filter(x=>x.offsetParent).indexOf(t))}
function aOpen(t){const i=+t.dataset.album,A=ALB[i];if(!A)return;const al=A.al,n=(al.items||[]).length;
 const tiles=A.ids.map((id,k)=>{const o=REG[id];return `<button type="button" class="bt" data-r="${id}" aria-label="Open ${esc(o.title)}" style="--rt:${RT[k%8]}deg">${o.src&&!isDoc(o)&&!isVid(o)?`<img src="${esc(o.src)}" alt="${esc(o.title)}" loading="lazy" draggable="false">`:'<span class="nop"></span>'}<span class="cap"><b>${esc(o.title)}</b></span></button>`}).join('');
 ovOpen('a',`<div class="ah">${al.group?`<small>${esc(al.group)}</small>`:''}<h2>${esc(al.title)}</h2><p>${esc(al.desc||'')}</p><span class="vn">${n} photo${n==1?'':'s'}</span><div class="ab"><button type="button" class="btn" data-sv="photography" data-sp="${t.dataset.sp}" data-ovx>Open in the book</button><button type="button" class="btn" data-towall="${i}" data-ovx>Show on art wall</button></div></div><div class="boardw"><div class="board" data-kind="photos">${tiles}</div></div>`,t)}
document.addEventListener('click',e=>{
 const vt=e.target.closest('.bt[data-vid]');if(vt&&!ovEl){e.stopPropagation();vOpen(vt);return}
 const at=e.target.closest('.bt[data-album]');if(at&&!ovEl&&!e.target.closest('[data-towall]')){e.stopPropagation();aOpen(at);return}
 const vf=e.target.closest('[data-vfilter]');if(vf){const f=vf.dataset.vfilter;$$('[data-vfilter]').forEach(c=>c.classList.toggle('on',c===vf));$$('#vboard .bt').forEach(t=>t.hidden=!!f&&t.dataset.vf!==f);ordBoard();return}
 if(ovEl&&!e.target.closest('.lb')){if(e.target.closest('[data-ovx]')){setTimeout(ovClose,0);return}if(e.target.matches('.x')||e.target===ovEl){ovClose();return}if(ovKind==='v'){if(e.target.closest('.p'))vShow(ovI-1);else if(e.target.closest('.n'))vShow(ovI+1)}}},true);
document.addEventListener('keydown',e=>{if(!ovEl||open())return;e.stopPropagation();if(e.key==='Escape')ovClose();else if(ovKind==='v'&&e.key==='ArrowRight')vShow(ovI+1);else if(ovKind==='v'&&e.key==='ArrowLeft')vShow(ovI-1)},true);
const vis=()=>$$('[data-r]',ovEl&&ovKind==='a'?ovEl:document).filter(t=>t.offsetParent),tileOf=n=>$('[data-r="'+n+'"]');
function show(n){const l=vis();idx=(n+l.length)%l.length;const o=REG[+l[idx].dataset.r],w=o._v==='writing';let m='';
if(w)m=o.pdf?`<iframe class="pdf" src="${esc(o.pdf)}" title="Preview of ${esc(o.title)}"></iframe>`:'<div class="ph">PDF preview</div>';
else if(o.embed)m=`<iframe src="${esc(emb(o.embed))}" title="${esc(o.title)}" allowfullscreen></iframe>`;
else if(o.src)m=/\.(mp4|webm|mov)$/i.test(o.src)?`<video src="${esc(o.src)}" controls></video>`:/\.pdf$/i.test(o.src)?`<iframe class="pdf" src="${esc(o.src)}" title="${esc(o.title)}"></iframe>`:isDoc(o)?'<div class="ph">Export to PDF to preview</div>':`<img src="${esc(o.src)}" alt="${esc(o.title)}">`;
else m=`<div class="ph">${lab(o)} placeholder</div>`;
const st=$('.stage',lb);st.innerHTML=m;st.hidden=!m;
$('.panel',lb).innerHTML=`<h2>${esc(o.title)}</h2>`+(o.desc?`<p class="d">${esc(o.desc)}</p>`:'')+(o.text?String(o.text).split(/\n\s*\n/).map(p=>`<p class="w">${esc(p)}</p>`).join(''):'')+(w?`<a class="btn" ${o.pdf?`href="${esc(o.pdf)}" download`:'aria-disabled="true"'}>Download PDF</a>`:'')+(o.url?`<p><a href="${esc(o.url)}" target="_blank" rel="noopener">Open original</a></p>`:'');$('.panel',lb).scrollTop=0}
function close(){ssStop();fsOn(false);lb.hidden=true;$('.stage',lb).innerHTML='';last&&last.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[role=button]'))e.target.click()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-r]');if(!t||moved)return;if(t.classList.contains('wi')){if(lw===t&&Date.now()-lc<380){clearTimeout(lt);lw=null;pick(t);return}lw=t;lc=Date.now();clearTimeout(lt);lt=setTimeout(()=>{lw=null},380);return}if(REG[+t.dataset.r]._v==='writing'){rOpen(t);return}openAt(t)});
function openAt(t){last=t;
if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<button class="x" aria-label="Close">×</button><div class="tools"><button data-fs>Full screen</button><button data-ss>Slideshow</button></div><button class="p" aria-label="Previous">‹</button><div class="wrap"><div class="stage"></div><div class="panel"></div></div><button class="n" aria-label="Next">›</button>';
lb.onclick=ev=>{const T2=ev.target.closest('[data-fs],[data-ss]');if(T2){if(T2.hasAttribute('data-fs')){ssStop();fsOn(!lb.classList.contains('fs'))}else ssT?ssStop():ssStart();return}if(ev.target.matches('.x,.lb'))close();if(ev.target.matches('.p'))show(idx-1);if(ev.target.matches('.n'))show(idx+1)};document.body.append(lb)}
lb.hidden=false;show(vis().indexOf(t));$('.x',lb).focus()}
document.addEventListener('click',e=>{if(cur==='cover'&&e.target.closest('#R')&&!e.target.closest('[data-t]')){turn(1);return}if(e.target.closest('[data-reset]')){try{localStorage.removeItem('ipwall');localStorage.removeItem('ipwallm');localStorage.removeItem('ipwallimg')}catch(_){}wallAlbum=null;render(cur,sp);return}const CC=e.target.closest('[data-cr]');if(CC){const q=CC.dataset.cr.split('|');go(q[0],+q[1]);return}const T=e.target.closest('[data-t]');if(T){turn(+T.dataset.t);return}
const M=e.target.closest('[data-mode]');if(M){setMode(M.dataset.mode);return}
const F=e.target.closest('[data-sp]');if(F){if(F.closest('.switch'))NF=true;go(F.dataset.sv||'photography',+F.dataset.sp);return}
const g=e.target.closest('[data-go]');if(g){$$('[data-proj]').forEach(x=>x.hidden=x.dataset.proj!==g.dataset.go);$$('[data-go]').forEach(b=>b.classList.toggle('on',b===g))}});
function goTo(o){pending=o;mode=o._m||mode;lb&&!lb.hidden&&close();if(cur===o._v&&sp===(o._sp||0)){const p=pending;render(cur,sp)}else{try{if(o._m)localStorage.setItem('ipmode',o._m)}catch(_){}go(o._v,o._sp||0)}}
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
<label>What<select id="s-t"><option value="writing">Writing</option><option value="photo">Photo (into a folder)</option><option value="wall">Art wall piece</option><option value="video">Video (into a video folder)</option><option value="showreel">Showreel (YouTube link)</option><option value="other">Other work</option><option value="thanks">Special thanks</option><option value="page">Page heading and text</option></select></label>
<label>Page (for heading and text)<select id="s-pg"><option value="cover">Cover</option><option value="index">Index</option><option value="writing">Writing</option><option value="photography">Photography</option><option value="wall">Art wall</option><option value="video">Video</option><option value="other">Other works</option><option value="about">About</option><option value="thanks">Special thanks</option></select></label>
<label>Folder or group name<input id="s-g" placeholder="Goa  or  Travel / Goa  or  Short Films"></label><label>Status (other works)<select id="s-s"><option>Completed</option><option>WIP</option></select></label>
<label>Title or name (page: heading)<input id="s-ti"></label><label>Description or role (page: intro line)<input id="s-d"></label><label>Text (page: body, About only)<textarea id="s-x" rows="5"></textarea></label>
<label>Date (videos: newest shows first)<input id="s-dt" type="date"></label><label>Link (YouTube or web)<input id="s-l"></label><label>Files (photos, PDF, deck)<input id="s-f" type="file" multiple></label>
<button class="btn" data-sadd>Add</button><p id="s-msg" class="d"></p><hr style="width:100%;border-color:#333">
<div><button class="btn" data-sdl>Download content.json</button> <label class="btn">Import<input id="s-i" type="file" accept=".json" hidden></label> <button class="btn" data-sreset>Discard draft</button></div><div id="s-up" class="d"></div>`;
$('#s-i',p).onchange=e=>{const f=e.target.files[0];f&&f.text().then(t=>{Object.assign(CONTENT,JSON.parse(t));saveD();build();render(cur,0)})};document.body.append(p)}
function addItem(){const v=id=>$('#'+id).value.trim(),t=v('s-t'),g=v('s-g'),ti=v('s-ti'),d=v('s-d'),x=v('s-x'),l=v('s-l'),fs=[...$('#s-f').files],C=CONTENT,msg=$('#s-msg');
const put=(dir,f)=>{const p=dir+f.name;PREV[p]=URL.createObjectURL(f)+'#'+f.name;UP[p]=1;return p},grp=(arr,n,o)=>{let a=arr.find(z=>z.title===n);if(!a){a=o;arr.push(a)}return a};
if(t==='page'){const k=v('s-pg'),P=C.pages=C.pages||{};P[k]=Object.assign(P[k]||{},ti?{title:ti}:{},d?{lede:d}:{},x?{body:x}:{})}
else if(t==='writing')(C.writing.items=C.writing.items||[]).push({title:ti||'Untitled',desc:d,text:x,pdf:fs[0]?put('writing/',fs[0]):l});
else if(t==='photo'){const pp=(g||'Untitled folder').split('/').map(z=>z.trim()).filter(Boolean),at=pp.pop(),ag=pp[0],dir='images/'+slug(at)+'/',a=grp(C.photography.leisure=C.photography.leisure||[],at,Object.assign({title:at,desc:d,items:[]},ag?{group:ag}:{}));a.folder=a.folder||dir;
 if(!fs.length)a.items.push({title:ti||'Photo',src:'',text:x});fs.forEach(f=>{put(a.folder,f);a.items.push({title:ti||f.name.replace(/\.\w+$/,''),src:f.name,text:x})})}
else if(t==='showreel')C.video.showreel={title:ti||'Showreel',desc:d,embed:l};
else if(t==='video'){const a=grp(C.video.folders=C.video.folders||[],g||'Untitled folder',{title:g||'Untitled folder',desc:'',items:[]});a.items.push({title:ti||'Untitled',desc:d,embed:l,date:v('s-dt')})}
else if(t==='other'){const a=grp(C.other,g||'Untitled',{title:g||'Untitled',status:v('s-s'),desc:d,items:[]});fs.length?fs.forEach(f=>a.items.push({title:ti||f.name.replace(/\.\w+$/,''),src:put('decks/',f),desc:d})):a.items.push({title:ti||'Untitled',embed:l,desc:d,text:x})}
else if(t==='wall'){const w=C.photography.wall=C.photography.wall||[];fs.length?fs.forEach(f=>w.push({title:ti||f.name,src:put('images/wall/',f)})):w.push({title:ti||'Art piece',src:''})}
else (C.thanks=C.thanks||[]).push({n:ti||'Name',r:d});
saveD();build();render(cur,0);msg.textContent='Added. The preview is live on this device.';$('#s-up').innerHTML=Object.keys(UP).length?'Upload these files:<br>'+Object.keys(UP).join('<br>'):'';$('#s-ti').value=$('#s-d').value=$('#s-x').value=$('#s-f').value=''}
document.addEventListener('click',e=>{if(e.target.closest('[data-sx]'))$('.studio').hidden=true;if(e.target.closest('[data-sadd]'))addItem();
if(e.target.closest('[data-sdl]')){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(CONTENT,null,1)],{type:'application/json'}));a.download='content.json';a.click()}
if(e.target.closest('[data-sreset]')){try{localStorage.removeItem('ipdraft')}catch(_){}location.reload()}});
if(EDIT){const b=document.createElement('button');b.className='btn sbtn';b.textContent='Studio';b.onclick=studio;document.body.append(b)}
Promise.race([Promise.all(['1em "Bebas Neue"','400 1em Newsreader','italic 400 1em Newsreader','1em Caveat'].map(f=>document.fonts.load(f).catch(()=>0))),new Promise(r=>setTimeout(r,700))]).then(()=>fetch('content.json',EDIT?{cache:'no-store'}:{})).then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{if(j)Object.assign(CONTENT,j);if(EDIT)try{const d=JSON.parse(localStorage.getItem('ipdraft')||'null');d&&Object.assign(CONTENT,d)}catch(_){}build();nav()});

var ssT=null;
function fsOn(on){if(!lb)return;lb.classList.toggle('fs',on);try{if(on&&!document.fullscreenElement&&lb.requestFullscreen)lb.requestFullscreen().catch(()=>{});else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(_){}}
function ssStop(){clearInterval(ssT);ssT=null;if(lb)lb.classList.remove('ss')}
function ssStart(){fsOn(true);lb.classList.add('ss');clearInterval(ssT);ssT=setInterval(()=>show(idx+1),4000)}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&lb&&lb.classList.contains('fs')){ssStop();lb.classList.remove('fs')}});
function fit(){$$('.tk,.abx').forEach(t=>{const sc=t.closest('.sc');let f=t.classList.contains('abr')?(innerWidth<900?17:24):t.classList.contains('abx')?(innerWidth<900?14:20):(innerWidth<900?13:16);t.style.fontSize=f+'px';while(innerWidth>=900&&sc.scrollHeight>sc.clientHeight+1&&f>4.5){f-=.5;t.style.fontSize=f+'px'}});{const ab=$$('.abx');if(ab.length&&0){const m=Math.min(...ab.map(t=>parseFloat(t.style.fontSize)));ab.forEach(t=>t.style.fontSize=m+'px')}}$$('.sc').forEach(e=>{if(e.querySelector('.tk,.abx'))return;let k=1;e.style.setProperty('--k',1);while(e.scrollHeight>e.clientHeight+2&&k>.64){k-=.06;e.style.setProperty('--k',k.toFixed(2))}})}
addEventListener('resize',()=>fit());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fit());

var nolb=false,wfsPh=null;const WK=()=>matchMedia('(max-width:900px)').matches?'ipwallm':'ipwall';
const htxt=el=>{const c=el.cloneNode(true);c.querySelectorAll('br').forEach(b=>b.replaceWith(' '));return c.textContent.replace(/\s+/g,' ').trim()};
function regHeads(){const seen=new Set();order.forEach(v=>(MODED.includes(v)?['leisure','work']:['leisure']).forEach(m=>S[v][m].forEach((pg,s)=>pg.forEach(h=>{const d=document.createElement('template');d.innerHTML=h==='@toc'?'<h2>Contents</h2>':h;
 d.content.querySelectorAll('h1,h2,h3,.phead,.fold,.bt[data-album]').forEach(x=>{let sv=v,sp=s;if(x.classList.contains('fold')||x.classList.contains('bt')){sv=x.dataset.sv||v;sp=+x.dataset.sp;x=x.querySelector('b')}
  const t=x&&htxt(x);if(!t)return;const k=[sv,MODED.includes(sv)?m:'',sp,t].join('|');if(seen.has(k))return;seen.add(k);
  const ex={_v:sv,_sp:sp,_h:1};if(MODED.includes(sv))ex._m=m;reg({title:t,desc:''},ex)})}))))}
function wallFs(on){if(on){const w=$('.wallw');if(!w||w.classList.contains('fs'))return;wfsPh=document.createComment('wall');w.before(wfsPh);document.body.append(w);w.classList.add('fs');try{const r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();r&&r.catch&&r.catch(()=>{})}catch(_){}}
else{const w=$('.wallw.fs');if(!w)return;w.classList.remove('fs');if(wfsPh&&wfsPh.parentNode)wfsPh.replaceWith(w);else w.remove();wfsPh=null;try{document.fullscreenElement&&document.exitFullscreen()}catch(_){}}}
function wallGo(t){wallFs(false);const o=REG[+t.dataset.r],m=o.src&&REG.find(x=>x!==o&&x._v==='photography'&&x._al!=='Art wall'&&x.src===o.src);
 if(m){nolb=true;goTo(m)}else go('photography',0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-wfs]');if(b)wallFs(!b.closest('.wallw').classList.contains('fs'))});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&$('.wallw.fs'))wallFs(false)});

function crumbs(v,l,s){if(v==='cover')return '';const P=[{t:'Index',g:'index|0'}];
 if(v!=='index'){P.push({t:names[v],g:v+'|0'});if(MODED.includes(v))P.push({t:cap(mode)});let al='';
  if(v==='photography'&&s>0)al='Art wall';else if((v==='other'||v==='video')&&s>0){const m=String(l).match(/<h1>(.*?)<\/h1>/);al=m?m[1]:''}
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



var dragAl=null,wallAlbum=null;
function acv(al){const c=(al.items||[]).map(x=>norm(x,al)).find(o=>o.src&&!isDoc(o)&&!isVid(o));return c?`<img class="ac" src="${esc(c.src)}" alt="" loading="lazy" draggable="false">`:''}
document.addEventListener('dragstart',e=>{const a=e.target.closest&&e.target.closest('.bt[data-ai]');if(!a)return;dragAl=+a.dataset.ai;try{e.dataTransfer.setData('text/plain','album');e.dataTransfer.effectAllowed='copy'}catch(_){}});
document.addEventListener('dragend',()=>{dragAl=null;$$('.wallw.dro').forEach(w=>w.classList.remove('dro'))});
document.addEventListener('dragover',e=>{const w=dragAl!==null&&e.target.closest&&e.target.closest('.wallw');if(w){e.preventDefault();w.classList.add('dro')}});
document.addEventListener('dragleave',e=>{const w=e.target.closest&&e.target.closest('.wallw');if(w&&!w.contains(e.relatedTarget))w.classList.remove('dro')});
document.addEventListener('drop',e=>{const w=dragAl!==null&&e.target.closest&&e.target.closest('.wallw');if(!w)return;e.preventDefault();w.classList.remove('dro');albumToWall(dragAl);dragAl=null});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-towall]');if(!t)return;e.stopPropagation();e.preventDefault();albumToWall(+t.dataset.towall)},true);
function albumToWall(i){const al=(CONTENT.photography.leisure||[])[i];if(!al)return;const ph=REG.filter(o=>o._v==='photography'&&o._al===al.title&&o.src&&!isDoc(o)&&!isVid(o)).map(o=>({src:o.src,title:o.title})),hp=$('.wh p');
 if(!ph.length){if(hp)hp.textContent='No photos in '+al.title+' yet.';return}
 wallAlbum={name:al.title,photos:ph};mixWall()}


var NF=false,rd=null;
function ordBoard(){const b=$('#vboard[data-kind="photos"]');if(!b)return;const t=[...b.children].filter(x=>x.classList.contains('bt')),c=$('.chip.on[data-vfilter]'),f=c&&c.dataset.vfilter;
 if(f)t.sort((a,b)=>a.dataset.o-b.dataset.o);else for(let i=t.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[t[i],t[j]]=[t[j],t[i]]}t.forEach(x=>b.append(x))}
function rOpen(t){const list=$$('.item[data-r]').map(x=>+x.dataset.r);
 if(!rd){rd=document.createElement('div');rd.className='rd';rd.setAttribute('role','dialog');rd.setAttribute('aria-modal','true');
  rd.innerHTML='<button class="rx" aria-label="Close reader">×</button><div class="rs"><div class="rv"><div class="rt"></div></div></div><div class="rb"><button class="rp" aria-label="Previous page">‹</button><span class="rn"></span><button class="rq" aria-label="Next page">›</button></div><div class="rl"><button class="rpp">‹ Previous piece</button><button class="rnp">Next piece ›</button></div>';
  rd.onclick=e=>{if(e.target.closest('.rx'))rClose();else if(e.target.closest('.rp'))rGo(-1);else if(e.target.closest('.rq'))rGo(1);else if(e.target.closest('.rpp'))rPiece(-1);else if(e.target.closest('.rnp'))rPiece(1)};
  let sx=0;rd.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});rd.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)rGo(d<0?1:-1)},{passive:true});
  addEventListener('resize',()=>{if(!rd.hidden)rLay(rd._i)});document.body.append(rd)}
 rd._list=list;rd._pi=Math.max(0,list.indexOf(+t.dataset.r));rd.hidden=false;document.body.classList.add('rdo');rLoad()}
function rLoad(){const o=REG[rd._list[rd._pi]],tx=o.text?String(o.text).split(/\n\s*\n/).map(x=>`<p>${esc(x)}</p>`).join(''):'<p class="rdd">The full text of this piece goes here. Add it in Studio or in content.json.</p>';
 $('.rt',rd).innerHTML=`<h1>${esc(o.title)}</h1>${o.desc?`<p class="rdd">${esc(o.desc)}</p>`:''}${tx}${o.pdf?`<p><a class="btn" href="${esc(o.pdf)}" download>Download PDF</a></p>`:''}`;
 $('.rpp',rd).disabled=rd._pi<=0;$('.rnp',rd).disabled=rd._pi>=rd._list.length-1;rd._i=0;requestAnimationFrame(()=>rLay(0))}
function rLay(i){const v=$('.rv',rd),t=$('.rt',rd),W=v.clientWidth,H=v.clientHeight,c=innerWidth>=900?2:1,G=c>1?64:0,cw=(W-(c-1)*G)/c;
 t.style.cssText=`height:${H}px;width:${W}px;column-width:${cw}px;column-gap:${G}px;column-fill:auto`;rd._W=W+G;rd._n=Math.max(1,Math.ceil((t.scrollWidth+G)/(W+G)-.01));rd._i=Math.max(0,Math.min(i,rd._n-1));rShow()}
function rShow(){const t=$('.rt',rd);t.style.transform=`translateX(${-rd._i*rd._W}px)`;$('.rn',rd).textContent=`${rd._i+1} / ${rd._n}`;$('.rp',rd).disabled=rd._i<=0;$('.rq',rd).disabled=rd._i>=rd._n-1}
function rGo(d){if(!rd||rd.hidden)return;const i=rd._i+d;if(i<0||i>=rd._n)return;rd._i=i;rShow()}
function rPiece(d){const n=rd._pi+d;if(n<0||n>=rd._list.length)return;rd._pi=n;rLoad()}
function rClose(){rd.hidden=true;document.body.classList.remove('rdo')}
