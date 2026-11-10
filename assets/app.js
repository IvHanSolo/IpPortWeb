/* Ivan Philips portfolio - shared app. Content lives in /content.json (edit it, or use ?edit Studio). */

/* ============ CONTENT ============
 The easy way: open this page with ?edit on the end of the address, use the Studio button, then download content.json and upload it next to this file.
 You can still edit the defaults below by hand.
 Writing: {title, desc, text, pdf:'writing/piece.pdf'}  -> pdf shows as preview + download button.
 Photography: albums {title, desc, folder:'images/thane/', items:['a.jpg','b.jpg']}. Layouts and pages are made automatically; tags are not shown.
 Video: {title, desc, embed:'https://youtu.be/XXXXXXXXXXX'}
 Other works: albums with status 'Completed' or 'WIP'. Items: src:'decks/x.pdf' or embed:'<slides link>'.
 Special thanks: {n:'Name', r:'What they did'}
==================================== */

let PAGE = document.body.dataset.page || 'cover';

const FILE = {
  cover: 'index.html',
  index: 'contents.html',
  writing: 'writing.html',
  photography: 'photography.html',
  video: 'video.html',
  other: 'other-works.html',
  about: 'about.html',
  thanks: 'special-thanks.html'
};

const QS = /[?&]edit/.test(location.search) ? location.search : '';

const hs = () => {
  const m = /^#s(\d+)$/.exec(location.hash);
  return m ? +m[1] : 0;
};

const SUB = 'https://substack.com/@ivanphilips';

const P = (n, l, x = {}) =>
  Array.from({ length: n }, (_, i) => ({
    title: `${l} ${i + 1}`,
    src: '',
    desc: 'Short description goes here.',
    ...x
  }));

const CONTENT = {
  intro: 'Welcome to a glimpse of my work. I hope that you enjoy your journey and gain an understanding of what I can do, and why I do it.',
  about: { photo: 'images/profile.jpg' },
  writing: {
    items: P(5, 'Piece title', { text: 'Paste the full piece here.\n\nA blank line starts a new paragraph.', pdf: '' })
  },
  photography: {
    leisure: [
      { group: 'Travel', title: 'Himachal', desc: 'Description goes here.', items: P(14, 'Himachal') },
      { group: 'Travel', title: 'Lonavala', desc: 'Description goes here.', items: P(14, 'Lonavala') },
      { group: 'Travel', title: 'Goa', desc: 'Description goes here.', items: P(14, 'Goa') },
      { group: 'Travel', title: 'Singapore', desc: 'Description goes here.', items: P(14, 'Singapore') },
      { group: 'Travel', title: 'Andaman', desc: 'Description goes here.', items: P(14, 'Andaman') },
      { title: 'Abstract fun with colours', desc: 'Playful portraits and chromatic experiments with bold color, tonality, and character.', folder: 'images/abstract-colours/', items: [] }
    ],
    otherSections: [
      { title: 'Animals', desc: 'Description goes here.', items: P(9, 'Animal') },
      { title: 'People', desc: 'Description goes here.', items: P(14, 'Portrait') },
      { title: 'Misc', desc: 'Description goes here.', items: P(14, 'Photo') }
    ],
    wall: P(8, 'Art piece')
  },
  video: {
    folders: [
      { title: 'Ads for classwork', desc: 'Description goes here.', items: P(3, 'Ad', { embed: '' }) },
      { title: 'Short Films', desc: 'Description goes here.', items: P(3, 'Short film', { embed: '' }) },
      { title: 'Shorter Short Films', desc: 'Description goes here.', items: P(3, 'Shorter short film', { embed: '' }) }
    ]
  },
  other: [
    { title: 'Presentations', status: 'Completed', desc: 'Client and internal presentations.', label: 'Deck', items: P(3, 'Presentation') },
    { title: 'Assignments', status: 'Completed', desc: 'Coursework and academic submissions.', label: 'Document', items: P(3, 'Assignment') },
    { title: 'CSM', status: 'WIP', desc: 'An ongoing process.', items: P(3, 'CSM') },
    { title: 'Album Art', status: 'WIP', desc: 'An ongoing process.', items: P(3, 'Album art') }
  ],
  thanks: []
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const order = ['cover', 'index', 'writing', 'photography', 'video', 'other', 'about', 'thanks'];
const names = {
  cover: 'Cover',
  index: 'Index',
  writing: 'Writing',
  photography: 'Photography',
  video: 'Video',
  other: 'Other works',
  about: 'About',
  thanks: 'Special thanks'
};

const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const PREV = {};
const REG = [];
const reg = (o, m) => REG.push(Object.assign(o, m)) - 1;
const isVid = o => Boolean(o.embed || /\.(mp4|webm|mov)$/i.test(o.src || ''));
const isDoc = o => Boolean(/\.(pdf|pptx?)$/i.test(o.src || ''));
const cap = t => (t ? t[0].toUpperCase() + t.slice(1) : '');

const norm = (x, b = {}) => {
  const o = typeof x === 'string' ? { src: x } : { ...x };
  if (o.src && b.folder && !/^(https?:|\/|data:)/.test(o.src)) {
    o.src = b.folder + o.src;
  }
  if (o.src && PREV[o.src]) o.src = PREV[o.src];
  if (o.pdf && PREV[o.pdf]) o.pdf = PREV[o.pdf];
  o.title = o.title || (o.src ? o.src.split('/').pop().replace(/\.\w+$/, '').replace(/[-_]+/g, ' ') : 'Untitled');
  return o;
};

const getPhotoAlbums = () => {
  const seen = new Set();
  const res = [];
  [...(CONTENT.photography?.leisure || []), ...(CONTENT.photography?.otherSections || [])].forEach(a => {
    if (a && a.title && !seen.has(a.title)) {
      seen.add(a.title);
      res.push(a);
    }
  });
  return res;
};

const lab = o => o.label || (isVid(o) ? 'Video' : isDoc(o) ? 'Document' : 'Image');

const tl = (o, r) => {
  const pdfAttr = /\.pdf$/i.test(o.src || '') ? ` data-pdf="${esc(o.src)}"` : '';
  const mpClass = o.kind === 'album' ? ' mp' : '';
  let inner = '';
  if (o.kind === 'album' && o.src) {
    inner = poster(o, 1);
  } else if (o.cover && isDoc(o)) {
    inner = `<img src="${esc(o.cover)}" alt="${esc(o.title)}" loading="lazy">`;
  } else if (o.src && !isDoc(o) && !isVid(o)) {
    inner = `<img src="${esc(o.src)}" alt="${esc(o.title)}" loading="lazy">`;
  } else {
    inner = `<span>${lab(o)}</span>`;
  }
  return `<button class="tile${mpClass}" data-r="${r}" aria-label="Open ${esc(o.title)}"${pdfAttr}>${inner}</button>`;
};

const ytid = u => {
  const m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : '';
};

const thumb = o => o.thumb || (o.embed && ytid(o.embed) ? 'https://i.ytimg.com/vi/' + ytid(o.embed) + '/hqdefault.jpg' : '');

const RT = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9, 1.5, -1.9];
const PLAY = '<svg class="pl" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="rgba(0,0,0,.55)" stroke="#fff" stroke-width="2.5"/><path d="M19 15v18l15-9z" fill="#fff"/></svg>';
const ALB = [];

const mk = (t, l) => `<h1>${t}</h1><p class="lede">${l}</p>`;
const PG = k => (CONTENT.pages || {})[k] || {};
const PT = (k, t, l) => {
  const p = PG(k);
  return mk(esc(p.title ?? t).replace(/\n/g, '<br>'), esc(p.lede ?? l));
};

const WR = () => [
  ...(CONTENT.writing?.items || []),
  ...(CONTENT.writing?.work || []),
  ...(CONTENT.writing?.leisure || [])
];

const MAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
const sbar = () => `<form class="sbar" role="search"><button type="button" class="mag" aria-label="Search the book" aria-expanded="false">${MAG}</button><input type="search" id="q" placeholder="Search titles, headings, albums" aria-label="Search" autocomplete="off"><div class="sres" hidden></div></form>`;
const sub = `<a class="btn" href="${SUB}" target="_blank" rel="noopener">Read on Substack</a>`;

const B = {
  cover: () => [
    ['', `<div class="cv cvw"><div class="cwn">${PT('cover', 'Ivan Philips', 'Audio Visual Content')}<button type="button" class="btn cvb" data-t="1">Open</button><p class="cvh">(If you are seeing this on your mobile device, feel free to swipe up and down to change pages.)</p></div><div class="cwall">@wall</div></div>`]
  ],
  index: () => [
    [PT('index', 'Ivan\nPhilips', CONTENT.intro), '@toc']
  ],
  writing: () => {
    const WT = [...new Set([...(CONTENT.writing?.filters || []), ...WR().flatMap(x => x.tags || [])])];
    const chips = WT.length
      ? `<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-wfilter="">All</button>${WT.map(t => `<button type="button" class="chip" data-wfilter="${esc(t)}">${esc(t)}</button>`).join('')}</div>`
      : '';
    const cards = WR().map(x => norm(x)).map(o => {
      const pu = o.pdf ? esc(o.pdf) : '';
      const tg = o.tags || [];
      const id = reg(o, { _v: 'writing' });
      return `
<article class="wk" data-r="${id}" data-tags="${esc(tg.join('|'))}">
  <div class="cvr" role="button" tabindex="0" aria-label="Read ${esc(o.title)}"${o.cover || !pu ? '' : ` data-pdf="${pu}"`}>
    ${o.cover ? `<img src="${esc(o.cover)}" alt="Cover of ${esc(o.title)}">` : '<span>PDF cover</span>'}
    ${pu || o.text ? '<span class="rmo">Read more</span>' : ''}
  </div>
  <h3>${esc(o.title)}</h3>
  ${tg.length ? `<div class="wkt">${tg.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
  ${o.desc ? `<p>${esc(o.desc)}</p>` : ''}
  <div class="wkb">
    <button type="button" class="btn wkr${pu ? '' : ' off'}" data-wo>Read</button>
    ${o.watch ? `<button type="button" class="btn" data-watch="${esc(o.watch)}" data-wt="${esc(o.title)}">Watch</button>` : ''}
    ${pu ? `<a class="btn wkd" href="${pu}" download>Download</a>` : '<span class="btn wkd off" aria-disabled="true">Download</span>'}
  </div>
</article>`.trim();
    }).join('');

    return [
      [
        PT('writing', 'Writing', 'Everything begins and ends with a story and this is how I choose to tell them.') + sub + chips,
        `<div class="wkw">${cards}<p class="wke" hidden>Nothing here yet. More on the way.</p></div>`
      ]
    ];
  },
  photography: () => {
    const als = getPhotoAlbums();
    const all = [];
    ALB.length = 0;

    als.forEach((al, i) => {
      const ids = [];
      (al.items || []).forEach(x => {
        const o = norm(x, al);
        const id = reg(o, {
          _v: 'photography',
          _al: al.title,
          _sp: 0,
          _it: o.tags || [],
          tags: [...(al.group ? [al.group] : []), ...(o.tags || []), ...(o.location ? [o.location] : [])]
        });
        ids.push(id);
        all.push({ o, al: al.title, id });
      });
      ALB.push({ al, ids, i });
    });

    const tabs = on => `<div class="switch" role="tablist" aria-label="Photography"><button data-sv="photography" data-sp="0" aria-selected="${on === 0}">All Images</button><button data-sv="photography" data-sp="1" aria-selected="${on === 1}">Albums</button><button data-sv="photography" data-sp="2" aria-selected="${on === 2}">Photo wall</button></div>`;

    const photoItems = all.filter(t => t.o.src);
    const mixedItems = shuf(photoItems.slice());
    const tilesAll = mixedItems.map((t, i) => `
<button type="button" class="bt" data-r="${t.id}" data-o="${i}" data-vf="${esc(t.al)}" data-tags="${esc([t.al, ...(t.o.tags || [])].join(','))}" style="--rt:${RT[i % 8]}deg">
  <img src="${esc(t.o.src)}" alt="${esc(t.o.title)}" loading="lazy" draggable="false">
  <span class="cap"><small>${esc(t.al)}</small><b>${esc(t.o.title)}</b></span>
</button>`.trim()).join('');

    const activeCats = [];
    als.forEach(a => {
      const aLower = a.title.toLowerCase();
      const count = all.filter(t => t.al.toLowerCase() === aLower || (t.o.tags || []).some(tg => String(tg).toLowerCase() === aLower)).length;
      if (count > 0 && !activeCats.some(c => c.toLowerCase() === aLower)) {
        activeCats.push(a.title);
      }
    });
    // Add user tags like F&F
    ['F&F', 'Boat', 'Sky', 'Night'].forEach(tg => {
      const tgLower = tg.toLowerCase();
      const count = all.filter(t => (t.o.tags || []).some(x => String(x).toLowerCase() === tgLower)).length;
      if (count > 0 && !activeCats.some(c => c.toLowerCase() === tgLower)) {
        activeCats.push(tg);
      }
    });

    const chips = activeCats.length
      ? `<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-vfilter="">All</button>${activeCats.map(c => `<button type="button" class="chip" data-vfilter="${esc(c)}">${esc(c)}</button>`).join('')}</div>`
      : '';

    const mixedAls = shuf(als.slice());
    const albumFolders = mixedAls.map(al => {
      const items = (al.items || []).filter(x => norm(x, al).src);
      return `
<button class="fold" type="button" data-album="${als.indexOf(al)}">
  <b>${esc(al.title)}</b>
  <span>${esc(al.desc || (al.group ? al.group : ''))}</span>
  <small>${items.length} photo${items.length === 1 ? '' : 's'}</small>
</button>`.trim();
    }).join('');

    const wch = activeCats.length
      ? `<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-towall="all">All</button>${activeCats.map(c => `<button type="button" class="chip" data-towall="${esc(c)}">${esc(c)}</button>`).join('')}</div>`
      : '';

    const sortedAls = als.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const albIndex = `
<div class="alb-index" aria-label="Alphabetical album index">
  <div class="alb-index-hdr">
    <h3>Albums (A–Z)</h3>
  </div>
  <ul class="alb-list">
    ${sortedAls.map(al => {
      const items = (al.items || []).filter(x => norm(x, al).src);
      const origIdx = als.indexOf(al);
      return `<li>
        <button type="button" class="alb-item" data-album="${origIdx}">
          <span class="alb-item-name">${esc(al.title)}</span>
          <span class="alb-item-meta">${al.group ? `<span class="alb-item-grp">${esc(al.group)}</span>` : ''}<span class="alb-item-cnt">${items.length} photo${items.length === 1 ? '' : 's'}</span></span>
        </button>
      </li>`;
    }).join('')}
  </ul>
</div>`.trim();

    return [
      [
        PT('photography', 'All Images', 'A glimpse through my lens across all collections') + tabs(0) + chips + '<p class="bh">Hover to peek. Click any photo to see it full screen.</p>',
        `<div class="boardw"><div class="board" id="vboard" data-kind="photos">${tilesAll || '<p>Photos will appear here once they are added.</p>'}</div></div>`
      ],
      [
        PT('albums', 'Albums', 'Photographs organized by collection and destination') + tabs(1) + albIndex + '<p class="bh">Click any album folder to view its collection.</p>',
        `<div class="folders">${albumFolders || '<p>Albums will appear here once they are added.</p>'}</div>`
      ],
      [
        PT('wall', 'Photo wall', 'A new mix of your photos every visit. Drag the pieces to arrange them.') + tabs(2) + wch,
        WALL
      ]
    ];
  },
  video: () => {
    const fs = CONTENT.video?.folders || [];
    const all = [];

    fs.forEach(f => {
      (f.items || []).forEach(x => {
        const o = norm(x, f);
        all.push({
          o,
          f: f.title,
          id: reg(o, { _v: 'video', _al: f.title, _sp: 0 })
        });
      });
    });

    const tiles = all.map((t, i) => {
      const th = thumb(t.o);
      return `
<button type="button" class="bt vt2" data-vid="${t.id}" data-vf="${esc(t.f)}" style="--rt:${RT[i % 8]}deg">
  ${th ? `<img src="${esc(th)}" alt="" loading="lazy" draggable="false" onerror="this.remove()">` : '<span class="nop"></span>'}
  ${PLAY}
  <span class="cap"><small>${esc(t.f)}${t.o.date ? ' · ' + esc(String(t.o.date).slice(0, 4)) : ''}</small><b>${esc(t.o.title)}</b></span>
</button>`.trim();
    }).join('');

    const chips = fs.length
      ? `<div class="alb vch"><span>Show</span><button type="button" class="chip on" data-vfilter="">All</button>${fs.map(f => `<button type="button" class="chip" data-vfilter="${esc(f.title)}">${esc(f.title)}</button>`).join('')}</div>`
      : '';

    return [
      [
        PT('video', 'Video', 'A few immersive experiences') + chips + '<p class="bh">A new mix every visit. Press and hold a piece to move it. Tap or click one to watch it full screen.</p>',
        `<div class="boardw"><div class="board" id="vboard" data-kind="video">${tiles || '<p>Videos will appear here once you add YouTube or Vimeo links.</p>'}</div></div>`
      ]
    ];
  },
  other: () => {
    const A = (CONTENT.other || []).map((al, i) => {
      const its = (al.items || []).map(x => {
        const o = norm(x, al);
        o.label = o.label || al.label;
        return o;
      });
      const ids = its.map(o => reg(o, { _v: 'other', _al: al.title, _sp: i + 1 }));
      return { al, its, ids, i };
    });

    const grp = st =>
      A.filter(a => a.al.status === st)
        .map(a => `<button class="fold" data-sv="other" data-sp="${a.i + 1}"><b>${esc(a.al.title)}</b><span>${esc(a.al.desc)}</span><small>${a.its.length} item${a.its.length === 1 ? '' : 's'}</small></button>`)
        .join('') || '<p>Nothing here yet.</p>';

    const out = [
      [
        PT('other', 'Other works', 'Assignments and creative pieces that have been rehomed'),
        `<h2>Completed</h2><div class="folders">${grp('Completed')}</div>${A.some(a => a.al.status === 'WIP') ? `<h2 class="s">Work in progress</h2><div class="folders">${grp('WIP')}</div>` : ''}`
      ]
    ];

    A.forEach(a => {
      out.push([
        `<h1>${esc(a.al.title)}</h1><p class="lede">${esc(a.al.desc)}</p><span class="badge">${esc(a.al.status)}</span><div class="pnote"><p>${esc(a.al.note || 'Write about this piece here.')}</p></div>`,
        `<div class="grid">${a.its.map((o, j) => tl(o, a.ids[j])).join('')}</div>`
      ]);
    });

    return out;
  },
  about: () => [
    [
      PT('about', 'About', 'Creative and production-focused communications professional, bridging creative vision with execution.') +
      `<div class="abx abl">
        <div class="tile portrait">
          ${CONTENT.about?.photo ? `<img src="${esc(CONTENT.about.photo)}" alt="Ivan Philips">` : '<span>Portrait</span>'}
        </div>
        <div class="links">
          <a href="mailto:${esc(CONTENT.about?.email || 'Ivan913.ip@gmail.com')}"><b>Email</b>${esc(CONTENT.about?.email || 'Ivan913.ip@gmail.com')}</a>
          <a href="tel:${esc(String(CONTENT.about?.phone || '+91 93172 91752').replace(/[^+\d]/g, ''))}"><b>Phone</b>${esc(CONTENT.about?.phone || '+91 93172 91752')}</a>
          <a href="https://instagram.com/${esc(String(CONTENT.about?.instagram || 'pp_fr_2').replace('@', ''))}" target="_blank" rel="noopener"><b>Instagram</b>@${esc(String(CONTENT.about?.instagram || 'pp_fr_2').replace('@', ''))}</a>
        </div>
      </div>`,
      `<div class="abx abr">
        <h2>Profile</h2>
        <p>${esc(PG('about').body || 'Thane-based MBA candidate in Communications Management at FLAME University, with a grounding in film, television and digital content. I have worked across scripting, content creation, on-set assistance and post-production, at Entre Nous Experiences, Caliac Studios and Juggernaut Productions, and on live events such as Lollapalooza India. I am growing into creative management, with Photoshop, Lightroom and Canva alongside photography and videography.')}</p>
        <div class="abb">
          <button type="button" class="btn" data-pop="work">Work Ex</button>
          <button type="button" class="btn" data-pop="education">Education</button>
        </div>
      </div>`
    ]
  ],
  thanks: () => {
    let h = '';
    let open = false;
    let first = true;
    const cl = () => {
      if (open) {
        h += '</p>';
        open = false;
      }
    };
    const op = () => {
      if (!open) {
        h += '<p class="tp">';
        open = true;
        first = true;
      }
    };

    (CONTENT.thanks || []).forEach(t => {
      if (t.h) {
        cl();
        h += `<h2 class="th2">${esc(t.h)}</h2>`;
        return;
      }
      if (!t.r) {
        cl();
        h += `<div class="tsub">${esc(t.n)}</div>`;
        return;
      }
      op();
      if (!first) h += ' <i class="ipb" aria-hidden="true">IP</i> ';
      first = false;
      h += `<span class="te"><b class="${t.g ? 'tg' : 'tn'}">${esc(t.n)}</b> ${esc(t.r)}</span>`;
    });
    cl();

    return [
      [
        '',
        `<div class="tk"><h1 class="ty">${esc(PG('thanks').title ?? 'Thank You!')}</h1><p class="tq">${esc(PG('thanks').lede ?? 'nothing here was made alone')}</p>${h}<h2 class="th2 tend">The End</h2></div>`
      ]
    ];
  }
};

const emb = u => {
  let m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  m = String(u || '').match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? 'https://player.vimeo.com/video/' + m[1] : u;
};

const WP = [[4, 6, 30, -3], [38, 4, 26, 2], [68, 8, 26, -2], [8, 44, 24, 3], [38, 38, 30, -1.5], [70, 44, 24, 2.5], [18, 72, 28, -2], [54, 70, 30, 1.5]];
const AR = ['4/5', '1/1', '3/4', '5/4'];
const WPM = [[3, 2, 38, -3], [50, 3, 34, 2], [28, 19, 34, -2], [3, 35, 34, 3], [56, 30, 38, -1.5], [30, 52, 34, 2.5], [4, 62, 36, -2], [54, 70, 38, 1.5]];
const EXP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><g class="e1"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></g><g class="e2"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></g></svg>';
const WI_UI = '<span class="wi-indicators" aria-hidden="true"><span class="wi-c tl" data-h="tl"></span><span class="wi-c tr" data-h="tr"></span><span class="wi-c bl" data-h="bl"></span><span class="wi-c br" data-h="br"></span><span class="wi-edge-bar top" data-h="t"></span><span class="wi-edge-bar right" data-h="r"></span><span class="wi-edge-bar bottom" data-h="b"></span><span class="wi-edge-bar left" data-h="l"></span><span class="wi-rot-stem"></span><span class="wi-rot-handle" data-h="rot" title="Rotate"></span><span class="wi-deg"></span></span>';

let WALL = '';
const mkWall = () => {
  const wallItems = (CONTENT.photography?.wall?.length ? CONTENT.photography.wall : (CONTENT.wall?.length ? CONTENT.wall : P(8, 'Art piece')));
  return `
<div class="phead">Photo wall</div>
<div class="wallw">
  <div class="wall">
    ${wallItems.map((x, i) => {
      const o = norm(x);
      const id = reg(o, { _v: 'photography', _al: 'Photo wall', _sp: 2 });
      const p = WP[i % 8];
      const q = WPM[i % 8];
      return `<button class="wi" data-r="${id}" data-i="${i}" aria-label="${esc(o.title)}" data-o="${esc(o.src || '')}" style="--l:${p[0]}%;--t:${p[1]}%;--w:${p[2]}%;--rt:${p[3]}deg;--ar:${AR[i % 4]};--ml:${q[0]}%;--mt:${q[1]}%;--mw:${q[2]}%">${o.src ? `<img src="${esc(o.src)}" alt="${esc(o.title)}" draggable="false">` : esc(o.title)}${WI_UI}</button>`;
    }).join('')}
  </div>
  <button class="wfs" data-wfs type="button" aria-label="Expand photo wall to full screen" title="Full screen">${EXP}</button>
</div>
<div class="wh">
  <p>A new mix of photos every visit. Drag to arrange inside the board. Double-tap a piece to swap its image. Use Show only above to see just one album.</p>
  <div class="wh-actions">
    <button type="button" class="btn" data-reset title="Reset positions of current pictures">Reset</button>
    <button type="button" class="btn" data-mix title="Get a new mix of pictures">Mix</button>
  </div>
</div>`.trim();
};

function applyWall() {
  let sv = {};
  let im = {};
  let locked = {};
  try {
    sv = JSON.parse(localStorage.getItem(WK()) || '{}');
    im = JSON.parse(localStorage.getItem('ipwallimg') || '{}');
    locked = JSON.parse(localStorage.getItem('ipwalllocked') || '{}');
  } catch (_) {}
  $$('.wi').forEach(w => {
    const isLocked = !!locked[w.dataset.i];
    w.classList.toggle('is-locked', isLocked);
    const p = sv[w.dataset.i];
    if (p) {
      if (p[0]) w.style.left = p[0];
      if (p[1]) w.style.top = p[1];
      if (p[2]) {
        w.style.setProperty('--rt', p[2]);
        w.style.rotate = p[2];
      }
      if (p[3]) {
        w.style.setProperty('--w', p[3]);
        w.style.width = p[3];
      }
    }
    if (im[w.dataset.i]) setImg(w, im[w.dataset.i], false);
  });
}

function setImg(t, u, sv = true) {
  const o = REG[+t.dataset.r];
  o.src = u;
  const imEl = t.querySelector('img');
  if (imEl) {
    imEl.src = u;
    imEl.alt = o.title || '';
  } else {
    t.innerHTML = `<img src="${esc(u)}" alt="${esc(o.title)}" draggable="false">${WI_UI}`;
  }
  if (sv) {
    let m = {};
    try {
      m = JSON.parse(localStorage.getItem('ipwallimg') || '{}');
    } catch (_) {}
    m[t.dataset.i] = u;
    try {
      localStorage.setItem('ipwallimg', JSON.stringify(m));
    } catch (_) {}
  }
}

const lockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const unlockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

function pick(t) {
  if (document.querySelector('.lb.pk')) return;
  const m = document.createElement('div');
  m.className = 'lb pk';
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  const ph = REG.filter(o => o._v === 'photography' && o._al !== 'Photo wall' && o.src && !isDoc(o) && !isVid(o));

  let locked = {};
  try {
    locked = JSON.parse(localStorage.getItem('ipwalllocked') || '{}');
  } catch (_) {}
  const isLocked = !!locked[t.dataset.i];

  m.innerHTML = `
<button class="x pk-overlay-x" aria-label="Close" type="button">×</button>
<div class="panel">
  <button class="x pk-panel-x" aria-label="Close modal" type="button">×</button>
  <h2>Swap this piece</h2>
  <ol class="steps">
    <li>Pick a photo from the portfolio below,</li>
    <li>or upload one from your device <span class="priv-note">(This does not take your image it only shows it to you for you)</span>.</li>
  </ol>
  <p class="d">This only changes your own wall, on this device. Press Mix under the wall for a new mix, or Reset to restore positions.</p>
  <div class="pk-actions">
    <label class="btn">Upload from my device<input type="file" accept="image/*" hidden></label>
    <button type="button" class="btn btn-lock${isLocked ? ' is-locked' : ''}" data-lock="${t.dataset.i}">${isLocked ? lockSvg + ' Locked' : unlockSvg + ' Lock picture'}</button>
  </div>
  <div class="grid">
    ${ph.map(o => `<button class="tile" data-u="${esc(o.src)}"><img src="${esc(o.src)}" alt="${esc(o.title)}"></button>`).join('') || '<p class="d">Portfolio photos will appear here once they are added.</p>'}
  </div>
</div>`;

  const dismissModal = () => {
    m.classList.add('closing');
    setTimeout(() => { if (m.parentNode) m.remove(); }, 160);
  };

  m.onclick = ev => {
    if (ev.target.closest('.x') || ev.target === m) {
      dismissModal();
      return;
    }
    const lk = ev.target.closest('[data-lock]');
    if (lk) {
      let lState = {};
      try {
        lState = JSON.parse(localStorage.getItem('ipwalllocked') || '{}');
      } catch (_) {}
      const idx = lk.dataset.lock;
      const willLock = !lState[idx];
      if (willLock) {
        lState[idx] = true;
        const curImg = t.querySelector('img')?.getAttribute('src') || (REG[+t.dataset.r] && REG[+t.dataset.r].src);
        if (curImg) {
          let mIm = {};
          try { mIm = JSON.parse(localStorage.getItem('ipwallimg') || '{}'); } catch (_) {}
          mIm[idx] = curImg;
          try { localStorage.setItem('ipwallimg', JSON.stringify(mIm)); } catch (_) {}
        }
      } else {
        delete lState[idx];
      }
      try {
        localStorage.setItem('ipwalllocked', JSON.stringify(lState));
      } catch (_) {}
      lk.innerHTML = willLock ? lockSvg + ' Locked' : unlockSvg + ' Lock picture';
      lk.classList.toggle('is-locked', willLock);
      t.classList.toggle('is-locked', willLock);
      return;
    }
    const u = ev.target.closest('[data-u]');
    if (u) {
      setImg(t, u.dataset.u);
      dismissModal();
      return;
    }
  };

  m.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.x')) {
      ev.stopPropagation();
      dismissModal();
    }
  });

  $('input', m).onchange = ev => {
    const f = ev.target.files[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 800 / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = im.width * k;
        c.height = im.height * k;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        setImg(t, c.toDataURL('image/jpeg', 0.82));
        m.remove();
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  };

  document.body.append(m);
}

const MG = 0;
let lc = 0;
let lt = null;
let lw = null;
let lb;
let idx;
let last;
let dg = null;
let moved = false;
let zt = 5;

// Simple white Canva-style rotate and resize cursors with a thin black stroke
const ROT_PATH = "M20.5 11.2 A8.6 8.6 0 0 0 5.2 7.2 M5.2 2.8 V7.2 H9.6 M3.5 12.8 A8.6 8.6 0 0 0 18.8 16.8 M18.8 21.2 V16.8 H14.4";
const rotSvg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'><path d='${ROT_PATH}' fill='none' stroke='#000' stroke-width='3.4' stroke-linecap='square' stroke-linejoin='miter'/><path d='${ROT_PATH}' fill='none' stroke='#fff' stroke-width='1.8' stroke-linecap='square' stroke-linejoin='miter'/></svg>`);
const curRot = `url("data:image/svg+xml,${rotSvg}") 14 14, crosshair`;

const resSvg = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'><path d='M6.5 12H17.5' fill='none' stroke='#000' stroke-width='3.2' stroke-linecap='round'/><polygon points='2.5,12 8,8 8,16' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><polygon points='21.5,12 16,8 16,16' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><path d='M6.5 12H17.5' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round'/><polygon points='2.5,12 8,8 8,16' fill='#fff'/><polygon points='21.5,12 16,8 16,16' fill='#fff'/></svg>");
const curResEw = `url("data:image/svg+xml,${resSvg}") 14 14, ew-resize`;

const resVertSvg = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'><path d='M12 6.5V17.5' fill='none' stroke='#000' stroke-width='3.2' stroke-linecap='round'/><polygon points='12,2.5 8,8 16,8' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><polygon points='12,21.5 8,16 16,16' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><path d='M12 6.5V17.5' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round'/><polygon points='12,2.5 8,8 16,8' fill='#fff'/><polygon points='12,21.5 8,16 16,16' fill='#fff'/></svg>");
const curResNs = `url("data:image/svg+xml,${resVertSvg}") 14 14, ns-resize`;

const resNwseSvg = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'><path d='M7.2 7.2L16.8 16.8' fill='none' stroke='#000' stroke-width='3.2' stroke-linecap='round'/><polygon points='4,4 10.6,5 5,10.6' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><polygon points='20,20 13.4,19 19,13.4' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><path d='M7.2 7.2L16.8 16.8' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round'/><polygon points='4,4 10.6,5 5,10.6' fill='#fff'/><polygon points='20,20 13.4,19 19,13.4' fill='#fff'/></svg>");
const curResNwse = `url("data:image/svg+xml,${resNwseSvg}") 14 14, nwse-resize`;

const resNeswSvg = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'><path d='M16.8 7.2L7.2 16.8' fill='none' stroke='#000' stroke-width='3.2' stroke-linecap='round'/><polygon points='20,4 13.4,5 19,10.6' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><polygon points='4,20 10.6,19 5,13.4' fill='#000' stroke='#000' stroke-width='1.8' stroke-linejoin='round'/><path d='M16.8 7.2L7.2 16.8' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round'/><polygon points='20,4 13.4,5 19,10.6' fill='#fff'/><polygon points='4,20 10.6,19 5,13.4' fill='#fff'/></svg>");
const curResNesw = `url("data:image/svg+xml,${resNeswSvg}") 14 14, nesw-resize`;

const H_DIR = {
  tl: [-1, -1, 225],
  tr: [1, -1, 315],
  bl: [-1, 1, 135],
  br: [1, 1, 45],
  t: [0, -1, 270],
  b: [0, 1, 90],
  l: [-1, 0, 180],
  r: [1, 0, 0]
};

const getWiRtDeg = w => parseFloat(w.style.getPropertyValue('--rt') || w.style.rotate) || 0;

function resCursorFor(w, h) {
  const d = H_DIR[h];
  if (!d) return curResEw;
  const eff = (((d[2] + getWiRtDeg(w)) % 180) + 180) % 180;
  const bucket = Math.round(eff / 45) % 4;
  return bucket === 0 ? curResEw : bucket === 1 ? curResNwse : bucket === 2 ? curResNs : curResNesw;
}

function detectWiHandle(w, target, clientX, clientY) {
  const hEl = target && target.closest && target.closest('[data-h]');
  if (hEl && w.contains(hEl)) {
    const h = hEl.dataset.h;
    return h === 'rot' ? { zone: 'rot', handle: 'rot' } : { zone: 'res', handle: h };
  }
  const parent = w.parentElement;
  const bx = parent.getBoundingClientRect();
  const cx = bx.left + parent.clientLeft + w.offsetLeft + w.offsetWidth / 2;
  const cy = bx.top + parent.clientTop + w.offsetTop + w.offsetHeight / 2;
  const rad = (-getWiRtDeg(w) * Math.PI) / 180;
  const dx = clientX - cx;
  const dy = clientY - cy;
  const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
  const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
  const hw = w.offsetWidth / 2;
  const hh = w.offsetHeight / 2;

  const cTol = Math.min(20, Math.min(hw, hh) * 0.35);
  const sTol = Math.min(14, Math.min(hw, hh) * 0.24);
  const nL = lx <= -hw + cTol;
  const nR = lx >= hw - cTol;
  const nT = ly <= -hh + cTol;
  const nB = ly >= hh - cTol;

  if ((nL || nR) && (nT || nB)) {
    return { zone: 'res', handle: (nT ? 't' : 'b') + (nL ? 'l' : 'r') };
  }
  if (lx <= -hw + sTol) return { zone: 'res', handle: 'l' };
  if (lx >= hw - sTol) return { zone: 'res', handle: 'r' };
  if (ly <= -hh + sTol) return { zone: 'res', handle: 't' };
  if (ly >= hh - sTol) return { zone: 'res', handle: 'b' };
  return { zone: 'drag', handle: '' };
}

function startWallDrag(w, hit, clientX, clientY) {
  const parent = w.parentElement;
  const parentBx = parent.getBoundingClientRect();
  const ox = parentBx.left + parent.clientLeft;
  const oy = parentBx.top + parent.clientTop;
  const pw = parent.clientWidth || parentBx.width;
  const ph = parent.clientHeight || parentBx.height;
  const w0 = w.offsetWidth;
  const h0 = w.offsetHeight;
  const cx0 = w.offsetLeft + w0 / 2;
  const cy0 = w.offsetTop + h0 / 2;
  const cx = ox + cx0;
  const cy = oy + cy0;
  const isWall = Boolean(w.closest('.wall'));
  const action = (isWall && (hit.zone === 'rot' || hit.zone === 'res')) ? hit.zone : 'drag';

  const st = {
    w,
    action,
    handle: hit.handle,
    bx: parentBx,
    ox,
    oy,
    pw,
    ph,
    sx: clientX,
    sy: clientY,
    cx,
    cy,
    w0,
    h0,
    startWPct: (w0 / pw) * 100,
    l: w.offsetLeft,
    t: w.offsetTop
  };

  if (action === 'rot') {
    st.startAngle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    st.startRt = getWiRtDeg(w);
    w.classList.add('is-rotating');
  } else if (action === 'res') {
    const dir = H_DIR[hit.handle] || [1, 1];
    const rad = (getWiRtDeg(w) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const axLoc = -dir[0] * (w0 / 2);
    const ayLoc = -dir[1] * (h0 / 2);
    const axRot = axLoc * cos - ayLoc * sin;
    const ayRot = axLoc * sin + ayLoc * cos;
    st.oppX = cx + axRot;
    st.oppY = cy + ayRot;
    st.vx = -2 * axRot;
    st.vy = -2 * ayRot;
    st.vLenSq = st.vx * st.vx + st.vy * st.vy || 1;
    st.offX = (cx - axRot) - clientX;
    st.offY = (cy - ayRot) - clientY;
  }

  dg = st;
  moved = false;
  w.style.zIndex = ++zt;
  w.classList.add('is-interacting', 'is-selected');
  $$('.wall .wi').forEach(other => { if (other !== w) other.classList.remove('is-selected'); });
}

function applyWallDrag(clientX, clientY) {
  if (!dg) return;
  const { w, action, ox, oy, pw, ph, sx, sy, cx, cy, l, t } = dg;
  const dx = clientX - sx;
  const dy = clientY - sy;

  if (action === 'rot') {
    const curAngle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    let dAngle = curAngle - dg.startAngle;
    while (dAngle > 180) dAngle -= 360;
    while (dAngle < -180) dAngle += 360;
    let degVal = dg.startRt + dAngle;
    while (degVal > 180) degVal -= 360;
    while (degVal < -180) degVal += 360;
    for (const snap of [-180, -90, 0, 90, 180]) {
      if (Math.abs(degVal - snap) < 2.5) {
        degVal = snap;
        break;
      }
    }
    const rounded = Math.round(degVal);
    const degStr = rounded + 'deg';
    w.style.setProperty('--rt', degStr);
    w.style.rotate = degStr;
    const degEl = w.querySelector('.wi-deg');
    if (degEl) degEl.textContent = rounded + '°';
  } else if (action === 'res') {
    const px = clientX + dg.offX;
    const py = clientY + dg.offY;
    const rawScale = ((px - dg.oppX) * dg.vx + (py - dg.oppY) * dg.vy) / dg.vLenSq;
    const minScale = 10 / dg.startWPct;
    const maxScale = 85 / dg.startWPct;
    const scale = Math.max(minScale, Math.min(maxScale, rawScale));
    const nwPct = dg.startWPct * scale;
    const pctStr = nwPct.toFixed(2) + '%';
    const newWpx = dg.w0 * scale;
    const newHpx = dg.h0 * scale;
    const newCx = (dg.oppX - ox) + (dg.vx * scale) / 2;
    const newCy = (dg.oppY - oy) + (dg.vy * scale) / 2;
    const leftPx = Math.max(-MG, Math.min(pw - newWpx + MG, newCx - newWpx / 2));
    const topPx = Math.max(-MG, Math.min(ph - newHpx + MG, newCy - newHpx / 2));

    w.style.setProperty('--w', pctStr);
    w.style.width = pctStr;
    w.style.left = ((leftPx / pw) * 100).toFixed(2) + '%';
    w.style.top = ((topPx / ph) * 100).toFixed(2) + '%';
  } else {
    w.style.left = (Math.max(-MG, Math.min(pw - w.offsetWidth + MG, l + dx)) / pw) * 100 + '%';
    w.style.top = (Math.max(-MG, Math.min(ph - w.offsetHeight + MG, t + dy)) / ph) * 100 + '%';
  }
}

function saveWallState() {
  let sv = {};
  try { sv = JSON.parse(localStorage.getItem(WK()) || '{}'); } catch (_) {}
  $$('.wi').forEach(w => {
    sv[w.dataset.i] = [
      w.style.left || '',
      w.style.top || '',
      w.style.getPropertyValue('--rt') || '',
      w.style.getPropertyValue('--w') || ''
    ];
  });
  try { localStorage.setItem(WK(), JSON.stringify(sv)); } catch (_) {}
}

// Dynamic cursor reflecting Canva corner/side enlarge and floating rotate handle
document.addEventListener('pointermove', e => {
  if (dg) {
    if (e.pointerType === 'touch') return;
    const dx = e.clientX - dg.sx;
    const dy = e.clientY - dg.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    if (!moved) return;
    applyWallDrag(e.clientX, e.clientY);
    return;
  }

  const w = e.target && e.target.closest && e.target.closest('.wall .wi');
  if (!w) {
    $$('.wall .wi').forEach(other => {
      delete other.dataset.activeHandle;
      if (other.dataset.zone) delete other.dataset.zone;
    });
    return;
  }
  const hit = detectWiHandle(w, e.target, e.clientX, e.clientY);
  w.dataset.zone = hit.zone;
  if (hit.handle) w.dataset.activeHandle = hit.handle;
  else delete w.dataset.activeHandle;

  if (hit.zone === 'rot') {
    w.style.cursor = curRot;
    const rh = w.querySelector('.wi-rot-handle');
    if (rh) rh.style.cursor = curRot;
  } else if (hit.zone === 'res') {
    const cur = resCursorFor(w, hit.handle);
    w.style.cursor = cur;
    const hEl = w.querySelector(`[data-h="${hit.handle}"]`);
    if (hEl) hEl.style.cursor = cur;
  } else {
    w.style.cursor = 'grab';
  }
});

document.addEventListener('pointerdown', e => {
  const w = e.target.closest && e.target.closest('.wall .wi');
  if (!w) {
    if (e.target.closest && e.target.closest('.wall')) {
      $$('.wall .wi.is-selected').forEach(x => x.classList.remove('is-selected'));
    }
    return;
  }
  if (e.pointerType === 'touch') return;
  try {
    if (w.setPointerCapture) w.setPointerCapture(e.pointerId);
  } catch (_) {}
  const hit = detectWiHandle(w, e.target, e.clientX, e.clientY);
  startWallDrag(w, hit, e.clientX, e.clientY);
});

// Mobile double-tap detection & 1-finger Canva handles + 2-finger zoom/rotate on Art Wall
let lastWiTap = 0;
let lastWiTarget = null;
let wiTouchStartPos = null;
let wiTouchMoved = false;
let wallTouch = null;

document.addEventListener('touchstart', e => {
  const w = e.target.closest && e.target.closest('.wall .wi');
  if (!w) {
    if (!e.target.closest('.wallw') || (e.target.closest('.wall') && !e.target.closest('.wi'))) {
      $$('.wall .wi.is-selected').forEach(x => x.classList.remove('is-selected'));
    }
    wiTouchStartPos = null;
    return;
  }

  $$('.wall .wi').forEach(other => { if (other !== w) other.classList.remove('is-selected'); });
  w.classList.add('is-selected');

  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const hit = detectWiHandle(w, e.target, touch.clientX, touch.clientY);
    wiTouchStartPos = { x: touch.clientX, y: touch.clientY, target: w, onHandle: hit.zone !== 'drag' };
    wiTouchMoved = false;
    startWallDrag(w, hit, touch.clientX, touch.clientY);
  } else if (e.touches.length === 2) {
    if (e.cancelable) e.preventDefault();
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const angle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
    const parentBx = w.parentElement.getBoundingClientRect();
    const curW = parseFloat(w.style.getPropertyValue('--w') || w.style.width) || ((w.offsetWidth / parentBx.width) * 100);
    const curRt = getWiRtDeg(w);

    wallTouch = {
      w,
      parentBx,
      startDist: dist || 1,
      startAngle: angle,
      startW: curW,
      startRt: curRt
    };
    w.classList.add('is-interacting');
  }
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (wallTouch && e.touches.length === 2) {
    if (e.cancelable) e.preventDefault();
    const { w, startDist, startAngle, startW, startRt } = wallTouch;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const angle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);

    const scale = dist / startDist;
    const nw = Math.max(10, Math.min(85, startW * scale));
    const pct = nw.toFixed(1) + '%';
    w.style.setProperty('--w', pct);
    w.style.width = pct;

    const dAngle = angle - startAngle;
    const newRt = Math.round(startRt + dAngle) + 'deg';
    w.style.setProperty('--rt', newRt);
    w.style.rotate = newRt;
    return;
  }

  if (dg && e.touches.length === 1) {
    const t = e.touches[0];
    const dx = t.clientX - dg.sx;
    const dy = t.clientY - dg.sy;
    const thr = dg.action === 'drag' ? 6 : 3;
    if (Math.abs(dx) + Math.abs(dy) > thr) {
      moved = true;
      wiTouchMoved = true;
      if (e.cancelable) e.preventDefault();
      applyWallDrag(t.clientX, t.clientY);
    }
  }
}, { passive: false });

document.addEventListener('touchend', e => {
  if (wallTouch) {
    if (wallTouch.w) wallTouch.w.classList.remove('is-interacting', 'is-rotating');
    saveWallState();
    wallTouch = null;
  }

  if (dg) {
    if (dg.w) dg.w.classList.remove('is-interacting', 'is-rotating');
    if (moved) saveWallState();
    dg = null;
  }

  if (wiTouchStartPos && !wiTouchMoved && !wiTouchStartPos.onHandle) {
    const w = wiTouchStartPos.target;
    const now = Date.now();
    const dt = now - lastWiTap;
    if (lastWiTarget === w && dt > 40 && dt < 450) {
      lastWiTap = 0;
      lastWiTarget = null;
      wiTouchStartPos = null;
      moved = false;
      try { if (e.cancelable) e.preventDefault(); } catch (_) {}
      pick(w);
      return;
    }
    lastWiTap = now;
    lastWiTarget = w;
  }
  wiTouchStartPos = null;
  setTimeout(() => (moved = false), 60);
}, { passive: false });

document.addEventListener('dblclick', e => {
  if (e.target.closest && e.target.closest('[data-h]')) return;
  const w = e.target.closest && e.target.closest('.wall .wi');
  if (w) pick(w);
});

function endDrag(e) {
  if (dg) {
    try {
      if (e && e.pointerId && dg.w && dg.w.hasPointerCapture && dg.w.hasPointerCapture(e.pointerId)) {
        dg.w.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    if (dg.w) dg.w.classList.remove('is-interacting', 'is-rotating');
    if (moved) saveWallState();
  }
  dg = null;
  setTimeout(() => (moved = false), 60);
}
addEventListener('pointerup', endDrag);
addEventListener('pointercancel', endDrag);

let S = {};
function build() {
  REG.length = 0;
  WALL = mkWall();
  S = {};
  order.forEach(v => {
    S[v] = { leisure: B[v]() };
  });
  regHeads();
}

const L = $('#L');
const R = $('#R');
const BK = $('#book');
const SH = $('#sheet') || BK;
const isM = () => matchMedia('(max-width:900px)').matches;

let cur = 'cover';
let nextCwallHtml = '';
const preloadedCoverSrcs = new Set();
let sp = 0;
let want = null;
let busy = false;
let pending = null;

const sets = v => S[v || cur]['leisure'];
const base = v => 1 + order.slice(0, order.indexOf(v)).reduce((a, u) => a + (u === 'cover' ? 0 : 2 * sets(u).length), 0);
const toc = () => '<h2>Contents</h2><div class="toc">' + order.slice(2).map(v => `<a href="${FILE[v] + QS}">${names[v]}<i></i></a>`).join('') + '</div>';

$('#tabs').innerHTML = order.map((v, i) => `<a href="${FILE[v] + QS}" data-v="${v}" style="--i:${i}">${names[v]}</a>`).join('');

const tg = d => {
  const n = sets().length;
  const i = order.indexOf(cur);
  const v = order[i + d];
  return (d > 0 && (sp < n - 1 || v)) || (d < 0 && (sp > 0 || v)) ? (d > 0 ? 'Next' : 'Previous') : '';
};

const EG = d => `<button class="edge ${d < 0 ? 'pv' : 'nx'}" data-t="${d}" aria-label="${d < 0 ? 'Previous' : 'Next'}"><i></i><span>${tg(d)}</span></button>`;
const nb = (i, n, s) => `<div class="nb">${i || s ? '<button class="pv" data-t="-1"><i></i>' + tg(-1) + '</button>' : '<span class="gap"></span>'}${n ? `<em>${n}</em>` : ''}${i < order.length - 1 || s < sets().length - 1 ? '<button data-t="1">' + tg(1) + '<i></i></button>' : '<span class="gap"></span>'}</div>`;


// Auto-fit folder titles so single words never break or wrap mid-word
function fitFolderTitles() {
  $$('.folders .fold b, .fold b').forEach(b => {
    b.style.fontSize = '';
    const parent = b.parentElement;
    if (!parent) return;
    const maxW = parent.clientWidth - (parseFloat(getComputedStyle(parent).paddingLeft) || 0) - (parseFloat(getComputedStyle(parent).paddingRight) || 0);
    let sz = parseFloat(getComputedStyle(b).fontSize);
    let iter = 0;
    while (b.scrollWidth > maxW + 1 && sz > 7.5 && iter++ < 14) {
      sz -= 0.5;
      b.style.fontSize = sz + 'px';
    }
  });
}
window.addEventListener('resize', fitFolderTitles);

function render(v, s = 0) {
  wallFs(false);
  if (toTopBtn) toTopBtn.classList.remove('visible');
  const fromPage = cur;
  cur = v;
  if (v === 'cover') lastCoverY = 0;
  sp = s;
  let [l, r] = sets()[s];
  const i = order.indexOf(v);
  const n = sets().length;
  const SO = v === 'thanks' || v === 'cover';
  let hd = false;

  if (matchMedia('(max-width:900px)').matches && !SO && v !== 'about' && r !== '@toc' && typeof l === 'string') {
    const m = l.match(/^(<h1>.*?<\/h1><p class="lede">.*?<\/p>)([\s\S]*)$/);
    if (m && m[2].trim()) {
      hd = true;
      const sb = r.match(/^<form class="sbar"[\s\S]*?<\/form>/);
      l = m[1];
      r = (sb ? sb[0] : '') + m[2] + (sb ? r.slice(sb[0].length) : r);
    }
  }

  BK.classList.toggle('hd', hd || v === 'about');
  BK.classList.toggle('ix', v === 'index');
  document.body.classList.toggle('nt', SO);
  $('#tabs').hidden = SO;

  const CR = crumbs(v, l, s);
  BK.classList.toggle('solo', SO);
  R.dataset.theme = v === 'thanks' ? 'thanks' : v === 'cover' ? 'cover' : (v === 'writing' || (v === 'photography' && s === 2)) ? 'dark' : 'light';

  const nsR = (v === 'photography' && s === 2) ? ' ns' : '';
  L.innerHTML = '<div class="dots"></div><div class="sc"><div class="crw">' + CR + sbar() + '</div>' + l + `</div>${!SO && (i || s) ? EG(-1) : ''}`;
  const renderCwall = () => {
    if (nextCwallHtml) {
      const h = nextCwallHtml;
      nextCwallHtml = '';
      if (cwCols === cwN()) return h;
    }
    return cwall();
  };
  R.innerHTML = (v === 'cover' ? '<div class="dots"></div><div class="cover-frame" aria-hidden="true"></div>' : '') + '<div class="sc' + nsR + '">' + '' + (r === '@toc' ? toc() : r.replace('@wall', renderCwall)) + `</div>${v === 'thanks' ? TKN : ''}${SO ? '' : (i < order.length - 1 || s < n - 1) ? EG(1) : ''}`;

  $('#top').innerHTML = nb(i, names[v] + (n > 1 ? ` ${s + 1}/${n}` : ''), s);
  $$('#tabs a').forEach(a => a.toggleAttribute('aria-current', a.dataset.v === v));

  $$('.dots').forEach(d => {
    for (let k = 0; k < (innerWidth < 900 ? 8 : 12); k++) {
      const e = document.createElement('i');
      const z = Math.random();
      e.className = 'dot';
      e.dataset.z = z.toFixed(2);
      e.textContent = ['I', 'P', 'i', 'p'][Math.random() * 4 | 0];
      e.style.cssText = `font-size:${22 + z * 58}px;left:${Math.random() * 92}%;top:${Math.random() * 92}%;rotate:${Math.round(Math.random() * 120 - 60)}deg;opacity:${0.25 + z * 0.3}`;
      d.append(e);
    }
  });

  applyWall();
  ordBoard();
  pdfCovers();
  fit();
  if (v === 'cover') {
    const cw = $('.cwall');
    if (cw) cw.classList.remove('cw-settling');
    try { cwStk(); } catch (_) {}
  }
  fitFolderTitles();
  if (!document.fonts || document.fonts.status !== 'loaded') {
    setTimeout(fitFolderTitles, 120);
  }

  if (pending) {
    const o = pending;
    pending = null;
    if (o._h) {
      const h = $$('h1,h2,h3,.phead,.fold b,.bt[data-album] b').find(x => htxt(x) === o.title);
      if (h) {
        h.scrollIntoView({ block: 'center' });
        h.classList.add('hh');
        setTimeout(() => h.classList.remove('hh'), 2400);
      }
    } else if (o._v === 'video') {
      const x = $('[data-vid="' + REG.indexOf(o) + '"]');
      if (x && nolb) {
        nolb = false;
        setTimeout(() => {
          x.classList.add('hl');
          x.scrollIntoView({ block: 'center' });
          setTimeout(() => x.classList.remove('hl'), 2400);
        }, 60);
      } else if (x) {
        x.click();
      }
    } else {
      const g = o._k && $('[data-go="' + o._k + '"]');
      if (g) g.click();
      const t = tileOf(REG.indexOf(o));
      const nl = nolb;
      nolb = false;
      if (t && t.offsetParent) {
        setTimeout(() => {
          if (nl) {
            t.classList.add('hl');
            t.scrollIntoView({ block: 'center' });
            setTimeout(() => t.classList.remove('hl'), 2400);
          } else {
            t.click();
          }
        }, 60);
      }
    }
  }
}

const shade = (T, a, b, o) => {
  try {
    const anim = T.animate([{ opacity: a }, { opacity: b }], Object.assign({ pseudoElement: '::after' }, o));
    if (anim) {
      anim.finished.finally(() => {
        try { anim.cancel(); } catch (_) {}
      });
    }
    return anim;
  } catch (_) {
    return null;
  }
};

function nav() {
  if (!S.cover) return;
  const v = PAGE;
  const s = want !== null ? want : (v === cur && L.innerHTML ? sp : Math.min(hs(), S[v]['leisure'].length - 1));
  if (busy) return;
  if (v === cur && s === sp && L.innerHTML) {
    want = null;
    return;
  }
  want = null;

  const fwd = order.indexOf(v) > order.indexOf(cur) || (v === cur && s > sp);
  if (reduce || !L.innerHTML || NF) {
    NF = false;
    render(v, s);
    R.classList.remove('nox');
    return;
  }

  busy = true;
  const mob = isM();
  const fx = mob ? 'rotateX' : 'rotateY';

  // Desktop:
  // Forward: R lifts towards spine (0deg -> -90deg), then L unfolds on other side (90deg -> 0deg)
  // Backward: L lifts towards spine (0deg -> 90deg), then R unfolds on other side (-90deg -> 0deg)
  // Mobile:
  // Forward: R lifts towards spiral (0deg -> 90deg), then L unfolds on other side (-90deg -> 0deg)
  // Backward: L lifts towards spiral (0deg -> -90deg), then R unfolds on other side (90deg -> 0deg)
  const liftPage = fwd ? R : L;
  const dropPage = fwd ? L : R;

  const liftAng = (mob ? (fwd ? 90 : -90) : (fwd ? -90 : 90)) + 'deg';
  const dropStartAng = (mob ? (fwd ? -90 : 90) : (fwd ? 90 : -90)) + 'deg';

  const toCover = v === 'cover';
  if (toCover) {
    nextCwallHtml = cwall();
    const mAll = nextCwallHtml.matchAll(/<img\s+src="([^"]+)"[^>]*loading="eager"/g);
    for (const m of mAll) {
      const src = m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      if (src && !preloadedCoverSrcs.has(src)) {
        preloadedCoverSrcs.add(src);
        const im = new Image();
        im.src = src;
      }
    }
  }
  const liftOpts = {
    duration: toCover ? 210 : 170,
    easing: toCover ? 'cubic-bezier(0.35, 0, 0.45, 0.2)' : 'cubic-bezier(0.4, 0, 0.6, 0.2)',
    fill: 'forwards'
  };
  const dropOpts = {
    duration: toCover ? 240 : 190,
    easing: toCover ? 'cubic-bezier(0.16, 0.84, 0.25, 1)' : 'cubic-bezier(0.2, 0.7, 0.3, 1)',
    fill: 'forwards'
  };

  const fin = () => {
    busy = false;
    nav();
  };

  const done = () => {
    [L, R, SH].forEach(el => {
      if (!el) return;
      el.getAnimations({ subtree: true }).forEach(a => a.cancel());
      try {
        if (el.getAnimations) {
          el.getAnimations({ subtree: true, pseudoElement: '::after' }).forEach(a => a.cancel());
        }
      } catch (_) {}
    });
    L.style.transform = '';
    R.style.transform = '';
    L.style.opacity = '';
    R.style.opacity = '';
    fin();
  };

  const waitCoverImgs = () => {
    if (!toCover) return Promise.resolve();
    const imgs = Array.from(R.querySelectorAll('.cwall img[loading="eager"]'));
    if (!imgs.length) return Promise.resolve();
    return Promise.race([
      Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
        });
      })),
      new Promise(res => setTimeout(res, 100))
    ]);
  };

  // Phase 1: lift active page towards the center spine
  shade(liftPage, 0, 0.45, liftOpts);
  liftPage.animate([{ transform: fx + '(0deg)' }, { transform: fx + '(' + liftAng + ')' }], liftOpts).finished.then(() => {
    // Content swap seamlessly at the midway vertical point
    render(v, s);
    BK.scrollTop = 0;
    [L, R, SH].forEach(el => el && el.getAnimations({ subtree: true }).forEach(a => a.cancel()));
    dropPage.style.transform = fx + '(' + dropStartAng + ')';
    if (toCover) dropPage.style.opacity = '0';

    const proceedDrop = () => {
      dropPage.style.opacity = '';
      try { cwStk(); } catch (_) {}
      // Phase 2: continue flowing smoothly down to the other side
      shade(dropPage, 0.45, 0, dropOpts);
      dropPage.animate([{ transform: fx + '(' + dropStartAng + ')' }, { transform: fx + '(0deg)' }], dropOpts).finished.then(done, done);
    };

    if (toCover) {
      waitCoverImgs().then(proceedDrop);
    } else {
      proceedDrop();
    }
  }).catch(done);
}

const TT = v => (v === 'cover' ? '' : names[v] + ' · ') + 'Ivan Philips';

function go(v, s = 0) {
  if (ovEl) ovClose(false);
  const url = FILE[v] + QS + (s ? '#s' + s : '');
  const replaceModal = Boolean(history.state && (history.state.ov || history.state.lb));
  if (v !== PAGE) {
    const st = { v, sp: s, fromOtherParent: false };
    try {
      if (replaceModal) {
        history.replaceState(st, '', url);
      } else {
        history.pushState(st, '', url);
      }
    } catch (_) {
      location.href = url;
      return;
    }
    PAGE = v;
    document.body.dataset.page = v;
    document.title = TT(v);
    want = s;
    nav();
    return;
  }
  const prevSp = (busy && want !== null) ? want : sp;
  const fromOtherParent = PAGE === 'other' && prevSp === 0 && s > 0;
  const st = { v: PAGE, sp: s, fromOtherParent };
  const targetUrl = s ? '#s' + s : location.pathname + location.search;
  if (s !== prevSp || replaceModal) {
    try {
      if (replaceModal) {
        history.replaceState(st, '', targetUrl);
      } else {
        history.pushState(st, '', targetUrl);
      }
    } catch (_) {}
  }
  want = s;
  nav();
}

const pageOf = u => {
  const f = u.pathname.split('/').pop() || 'index.html';
  return Object.keys(FILE).find(k => FILE[k] === f);
};

let closingLb = false;
let closingOv = false;
addEventListener('popstate', () => {
  if (closingLb) {
    closingLb = false;
    return;
  }
  if (closingOv) {
    closingOv = false;
    return;
  }
  if (lb && !lb.hidden) {
    if (lb.classList.contains('fs')) {
      fsOn(false);
    } else {
      close(false);
    }
    return;
  }
  if (ovEl) {
    ovClose(false);
    return;
  }
  const v = pageOf(location) || 'cover';
  PAGE = v;
  document.body.dataset.page = v;
  document.title = TT(v);
  want = hs();
  nav();
});

document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  const v = pageOf(u);
  if (!v) return;
  e.preventDefault();
  go(v, 0);
});

function turn(d) {
  const n = sets().length;
  if (d > 0 && sp < n - 1) return go(cur, sp + 1);
  if (d < 0 && sp > 0) return go(cur, sp - 1);
  const v = order[order.indexOf(cur) + d];
  if (v) go(v, d < 0 ? sets(v).length - 1 : 0);
}

addEventListener('hashchange', () => {
  want = hs();
  nav();
});

// drag & interaction vars hoisted above

const open = () => lb && !lb.hidden;

addEventListener('keydown', e => {
  if (rd && !rd.hidden) {
    if (e.key === 'Escape') rClose();
    if (e.key === 'ArrowRight') rGo(1);
    if (e.key === 'ArrowLeft') rGo(-1);
    return;
  }
  if ($('.wallw.fs')) {
    if (e.key === 'Escape') wallFs(false);
    return;
  }
  if (open()) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
    return;
  }
  if (e.target.closest && e.target.closest('input')) return;
  if (e.key === 'ArrowRight') turn(1);
  if (e.key === 'ArrowLeft') turn(-1);
});

/* ---- flip gestures: swipe up/down on phones, drag / trackpad / arrows on desktop ---- */
const NOFLIP = '.rd,iframe,.wall,.wallw,.lb,.vfs,.afs,input,textarea,select,.sres,.sbar,.pk';
const REF = 230;
const ptr = document.createElement('div');
ptr.className = 'ptr';
ptr.textContent = 'Release to refresh';
document.body.append(ptr);

let g = null;
const pull = y => {
  SH.style.transition = 'none';
  SH.style.transform = y ? `translateY(${y}px)` : '';
};

addEventListener('touchstart', e => {
  if (open() || e.target.closest(NOFLIP)) {
    g = null;
    return;
  }
  const t = e.touches[0];
  lastTouchY = t.clientY;
  const sc = (cur === 'cover' && $('#R .sc')) || BK;
  g = {
    x: t.clientX,
    y: t.clientY,
    top: sc.scrollTop <= 1,
    bot: sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2,
    m: isM()
  };
}, { passive: true });

addEventListener('touchmove', e => {
  if (cur === 'cover' && e.touches && e.touches[0]) {
    const cy = e.touches[0].clientY;
    const deltaTouch = cy - lastTouchY;
    lastTouchY = cy;
    const n = $('.cwn');
    if (n) {
      if (deltaTouch > 4) {
        n.classList.remove('faded-out');
      } else if (deltaTouch < -4) {
        const sc = $('#R .sc');
        const y = (sc && sc.scrollTop) || (BK && BK.scrollTop) || window.scrollY || 0;
        if (y > 60) {
          n.classList.add('faded-out');
        }
      }
    }
  }
  if (!g || !g.m || busy) return;
  const dy = e.touches[0].clientY - g.y;
  ptr.classList.toggle('on', dy >= REF && g.top);
  if ((dy < 0 && g.bot && sets().length + order.length > 0) || (dy > 0 && g.top)) {
    pull(Math.max(-70, Math.min(70, dy * 0.3)));
  }
}, { passive: true });

addEventListener('touchend', e => {
  if (!g) return;
  const q = g;
  g = null;
  const t = e.changedTouches[0];
  const dx = t.clientX - q.x;
  const dy = t.clientY - q.y;

  SH.style.transition = 'transform .25s';
  SH.style.transform = '';
  setTimeout(() => (SH.style.transition = ''), 260);

  if (q.m) {
    ptr.classList.remove('on');
    if (Math.abs(dx) < 90 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      if (dy >= REF && q.top) {
        location.reload();
        return;
      }
      if (dy < -70 && q.bot) turn(1);
      else if (dy > 70 && q.top) {
        if (cur === 'other' && sp > 0) {
          if (history.state && history.state.fromOtherParent) {
            try { history.back(); } catch (_) { go('other', 0); }
          } else {
            go('other', 0);
          }
        } else {
          turn(-1);
        }
      }
    }
  } else if (Math.abs(dx) > 90 && Math.abs(dy) < 60) {
    turn(dx < 0 ? 1 : -1);
  }
}, { passive: true });

addEventListener('touchcancel', () => {
  g = null;
  ptr.classList.remove('on');
}, { passive: true });

let md = null;
addEventListener('pointerdown', e => {
  md = null;
  if (
    e.pointerType !== 'mouse' ||
    e.button ||
    isM() ||
    open() ||
    !e.target.closest('.pg') ||
    e.target.closest(NOFLIP + ',button,a,.wi,.bt,.tile,.fold,.note,.item,.chip,.btn,.switch,[data-r],[role=button],h1,h2,h3,p,li,span,b,em,small,label')
  ) return;
  md = { x: e.clientX, y: e.clientY };
});

addEventListener('pointerup', e => {
  if (!md) return;
  const dx = e.clientX - md.x;
  const dy = e.clientY - md.y;
  md = null;
  if (Math.abs(dx) > 130 && Math.abs(dy) < 80 && !String(getSelection()).length) {
    turn(dx < 0 ? 1 : -1);
  }
});

let wl = 0;
addEventListener('wheel', e => {
  if (open() || isM() || e.target.closest(NOFLIP)) return;
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5 && Math.abs(e.deltaX) > 30 && Date.now() - wl > 900) {
    wl = Date.now();
    turn(e.deltaX > 0 ? 1 : -1);
  }
}, { passive: true });

if (!reduce) {
  addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    $$('.dot').forEach(o => {
      o.style.transform = `translate(${-x * 90 * o.dataset.z}px,${-y * 90 * o.dataset.z}px)`;
    });
  });
}

/* ---- fullscreen detail views (albums + videos) ---- */
const embA = u => {
  const e = emb(u);
  return e + (e.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
};

let ovEl = null;
let ovKind = '';
let ovList = [];
let ovI = 0;
let ovBack = null;

function ovClose(popHist = true) {
  if (!ovEl) return;
  const el = ovEl;
  ovEl = null;
  el.classList.add('out');
  setTimeout(() => el.remove(), 220);
  document.documentElement.classList.remove('ovo');
  if (popHist && history.state && history.state.ov) {
    closingOv = true;
    try { history.back(); } catch (_) {}
    setTimeout(() => { closingOv = false; }, 300);
  }
  if (ovBack && ovBack.focus) ovBack.focus();
}

function ovOpen(kind, html, from) {
  ovClose(false);
  ovKind = kind;
  ovBack = from || null;
  const el = document.createElement('div');
  el.className = kind === 'v' ? 'vfs' : kind === 'c' ? 'cvp' : 'afs';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = '<button class="x" aria-label="Close">×</button>' + html;
  document.body.append(el);
  ovEl = el;
  document.documentElement.classList.add('ovo');
  try {
    const st = { ov: kind, v: PAGE, sp };
    if (history.state && (history.state.ov || history.state.lb)) {
      history.replaceState(st, '', location.href);
    } else {
      history.pushState(st, '', location.href);
    }
  } catch (_) {}

  if (from && !reduce) {
    const r = from.getBoundingClientRect();
    const s = Math.max(0.2, Math.min(1, r.width / innerWidth));
    el.animate([
      { opacity: 0, transform: `translate(${r.left + r.width / 2 - innerWidth / 2}px,${r.top + r.height / 2 - innerHeight / 2}px) scale(${s})`, borderRadius: '12px' },
      { opacity: 1, transform: 'none', borderRadius: '0px' }
    ], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }

  $('.x', el).focus();
  return el;
}

function vShow(n) {
  const l = $$('#vboard .bt[data-vid]').filter(t => t.offsetParent);
  if (!l.length) return;
  ovList = l;
  ovI = (n + l.length) % l.length;
  const t = l[ovI];
  const o = REG[+t.dataset.vid];
  const e = o.embed ? embA(o.embed) : '';
  const el = ovEl;

  $('.vst', el).innerHTML = e
    ? `<iframe src="${esc(e)}" title="${esc(o.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    : '<div class="ph">Add a YouTube or Vimeo link for this video</div>';

  $('.vi', el).innerHTML = `<small>${esc(o._al || '')}</small><h2>${esc(o.title)}</h2>${o.desc ? `<p>${esc(o.desc)}</p>` : ''}<span class="vn">${ovI + 1} / ${l.length}</span>`;
}

function watch(b) {
  const u = b.dataset.watch;
  const t = b.dataset.wt || '';
  if (open()) close(false);
  ovOpen(
    'v',
    `<div class="vm"><div class="vst"><iframe src="${esc(embA(u))}" title="${esc(t)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><div class="vi"><small>Film</small><h2>${esc(t)}</h2></div></div>`,
    b
  );
}

document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-watch]');
  if (!b) return;
  e.stopPropagation();
  e.preventDefault();
  watch(b);
}, true);

/* About pop-ups: Work Ex and Education, from content.json "about" */
function cvHtml(k) {
  const A = CONTENT.about || {};
  const li = a => ((a || []).length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
  const en = e => `
<div class="cve">
  <b>${esc(e.role)}</b>
  ${e.org ? `<span>${esc(e.org)}</span>` : ''}
  ${e.when ? `<em>${esc(e.when)}</em>` : ''}
  ${e.note ? `<p>${esc(e.note)}</p>` : ''}
  ${li(e.points)}
</div>`.trim();

  const body = k === 'education'
    ? (A.education || []).map(en).join('')
    : (A.work || []).map(s => `
<h3>${esc(s.title)}</h3>
${(s.items || []).map(en).join('')}
${li(s.points)}
${(s.tags || []).length ? `<div class="facts">${s.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}`.trim()).join('');

  return `<div class="cvd"><h2>${k === 'education' ? 'Education' : 'Work Ex'}</h2>${body}</div>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-pop]');
  if (b) ovOpen('c', cvHtml(b.dataset.pop), b);
});

function vOpen(t) {
  const el = ovOpen('v', '<button class="p" aria-label="Previous video">‹</button><div class="vm"><div class="vst"></div><div class="vi"></div></div><button class="n" aria-label="Next video">›</button>', t);
  vShow($$('#vboard .bt[data-vid]').filter(x => x.offsetParent).indexOf(t));
}

function aOpen(t) {
  const i = +t.dataset.album;
  const A = ALB[i];
  if (!A) return;
  const al = A.al;
  const n = (al.items || []).length;
  const tiles = A.ids.map((id, k) => {
    const o = REG[id];
    return `<button type="button" class="bt" data-r="${id}" aria-label="Open ${esc(o.title)}" style="--rt:${RT[k % 8]}deg">${o.src && !isDoc(o) && !isVid(o) ? `<img src="${esc(o.src)}" alt="${esc(o.title)}" loading="lazy" draggable="false">` : '<span class="nop"></span>'}<span class="cap"><b>${esc(o.title)}</b></span></button>`;
  }).join('');

  ovOpen(
    'a',
    `<div class="ah">${al.group ? `<small>${esc(al.group)}</small>` : ''}<h2>${esc(al.title)}</h2><p>${esc(al.desc || '')}</p><span class="vn">${n} photo${n === 1 ? '' : 's'}</span><div class="ab"><button type="button" class="btn" data-towall="${i}" data-ovx>Show on photo wall</button><button type="button" class="btn" data-ovx>Close</button></div></div><div class="boardw"><div class="board" data-kind="photos">${tiles}</div></div>`,
    t
  );
}

document.addEventListener('click', e => {
  const vt = e.target.closest('.bt[data-vid]');
  if (vt && !ovEl) {
    e.stopPropagation();
    vOpen(vt);
    return;
  }
  const at = e.target.closest('[data-album]');
  if (at && !ovEl && !e.target.closest('[data-towall]')) {
    e.stopPropagation();
    aOpen(at);
    return;
  }
  const vf = e.target.closest('[data-vfilter]');
  if (vf) {
    const filterVal = (vf.dataset.vfilter || '').trim().toLowerCase();
    const container = vf.closest('.vch');
    const allChip = container ? container.querySelector('[data-vfilter=""]') : $('[data-vfilter=""]');

    if (!filterVal) {
      // User clicked "All": clear all specific filters in this container, turn All on
      const chipsInContainer = container ? $$('[data-vfilter]', container) : $$('[data-vfilter]');
      chipsInContainer.forEach(c => c.classList.toggle('on', c === vf));
    } else {
      // User clicked a specific filter: toggle it
      vf.classList.toggle('on');
      if (allChip) allChip.classList.remove('on');

      // If no specific filters remain active, turn "All" back on
      const chipsInContainer = container ? $$('[data-vfilter]', container) : $$('[data-vfilter]');
      const activeSpecific = chipsInContainer.filter(c => c.classList.contains('on') && c.dataset.vfilter);
      if (activeSpecific.length === 0) {
        if (allChip) allChip.classList.add('on');
      }
    }

    // Determine all active filters
    const chipsInContainer = container ? $$('[data-vfilter]', container) : $$('[data-vfilter]');
    const activeFilters = chipsInContainer
      .filter(c => c.classList.contains('on'))
      .map(c => (c.dataset.vfilter || '').trim().toLowerCase())
      .filter(Boolean);

    $$('#vboard .bt').forEach(t => {
      if (activeFilters.length === 0) {
        t.hidden = false;
        return;
      }
      const tAl = (t.dataset.vf || '').trim().toLowerCase();
      const tTags = (t.dataset.tags || '').toLowerCase().split(',').map(s => s.trim());
      const matches = activeFilters.some(f => tAl === f || tTags.includes(f) || tTags.some(tg => tg.includes(f)));
      t.hidden = !matches;
    });

    ordBoard();
    return;
  }
  if (ovEl && !e.target.closest('.lb')) {
    if (e.target.closest('[data-ovx]')) {
      if (e.target.closest('[data-towall]')) {
        ovClose(false);
      } else {
        setTimeout(() => ovClose(true), 0);
      }
      return;
    }
    if (e.target.matches('.x') || e.target === ovEl) {
      ovClose(true);
      return;
    }
    if (ovKind === 'v') {
      if (e.target.closest('.p')) vShow(ovI - 1);
      else if (e.target.closest('.n')) vShow(ovI + 1);
    }
  }
}, true);

document.addEventListener('keydown', e => {
  if (!ovEl || open()) return;
  e.stopPropagation();
  if (e.key === 'Escape') ovClose();
  else if (ovKind === 'v' && e.key === 'ArrowRight') vShow(ovI + 1);
  else if (ovKind === 'v' && e.key === 'ArrowLeft') vShow(ovI - 1);
}, true);

const vis = () => $$('[data-r]', ovEl && ovKind === 'a' ? ovEl : document).filter(t => t.offsetParent);
const tileOf = n => $('[data-r="' + n + '"]');

/* EXIF & photo detail formatting */
const EXL = [
  ['camera', 'Camera'],
  ['lens', 'Lens'],
  ['aperture', 'Aperture'],
  ['shutter', 'Shutter'],
  ['iso', 'ISO'],
  ['focal', 'Focal length'],
  ['date', 'Taken'],
  ['location', 'Location']
];

const exifHtml = o => {
  if (o._v !== 'photography' || !o.src) return '';
  const ex = Object.assign({ location: o.location }, o.exif || {});
  const rows = EXL.filter(([k]) => ex[k]).map(([k, l]) => `<dt>${l}</dt><dd>${esc(ex[k])}</dd>`).join('');
  const tg = (o._it || []).map(t => `<span>${esc(t)}</span>`).join('');
  return (tg ? `<div class="facts">${tg}</div>` : '') + (rows ? `<dl class="exif">${rows}</dl>` : '');
};

function show(n) {
  const l = vis();
  idx = (n + l.length) % l.length;
  if (lb) { lb.classList.remove('orient-landscape'); $$('.btn-orient', lb).forEach(b => b.classList.toggle('active', b.dataset.orient === 'portrait')); }
  const o = REG[+l[idx].dataset.r];
  const w = o._v === 'writing';
  const pv = w ? o.pdf || '' : /\.pdf$/i.test(o.src || '') ? o.src : '';
  const isPhoto = o._v === 'photography' && !w && !pv;
  const isReading = w || Boolean(pv) || (o._v === 'other' && (!o.src || Boolean(o.text)));

  if (lb) {
    const orientBox = $('.orient-opts', lb);
    if (orientBox) orientBox.style.display = isPhoto ? 'inline-flex' : 'none';
    const fsBtn = $('[data-fs]', lb);
    if (fsBtn) {
      const isFs = lb.classList.contains('fs') || Boolean(document.fullscreenElement);
      fsBtn.textContent = isFs ? 'Exit full screen' : 'Full screen';
    }
  }

  let m = '';

  if (pv) {
    m = '<div class="pdfv"><p class="pdfl">Loading the PDF...</p></div>';
  } else if (w) {
    m = '<div class="ph">PDF preview</div>';
  } else if (o.embed) {
    m = `<iframe src="${esc(emb(o.embed))}" title="${esc(o.title)}" allowfullscreen></iframe>`;
  } else if (o.src) {
    m = /\.(mp4|webm|mov)$/i.test(o.src)
      ? `<video src="${esc(o.src)}" controls></video>`
      : isDoc(o)
      ? '<div class="ph">Export to PDF to preview</div>'
      : `<img src="${esc(o.src)}" alt="${esc(o.title)}"><span class="lb-wm" aria-hidden="true">ip</span>`;
  } else {
    m = `<div class="ph">${lab(o)} placeholder</div>`;
  }

  if (o.kind === 'album') m = poster(o);

  const st = $('.stage', lb);
  st.onscroll = null;
  st.innerHTML = m;
  st.hidden = !m;
  st.scrollTop = 0;
  lb.classList.toggle('po', o.kind === 'album');
  if (o.kind === 'album') {
    posterPal();
    posterFit();
  }
  lb.classList.toggle('wr', isReading);

  const textParagraphs = o.text && !pv
    ? String(o.text).split(/\n\s*\n/).map(p => `<p class="w">${esc(p)}</p>`).join('')
    : '';

  $('.panel', lb).innerHTML =
    `<h2>${esc(o.title)}</h2>` +
    (o.desc ? `<p class="d">${esc(o.desc)}</p>` : '') +
    exifHtml(o) +
    textParagraphs +
    (pv ? '<p class="vn pgn"></p>' : '') +
    (w || pv ? `<a class="btn" ${pv ? `href="${esc(pv)}" download` : 'aria-disabled="true"'}>Download PDF</a>` : '') +
    (o.watch ? ` <a class="btn" href="${esc(o.watch)}" role="button" data-watch="${esc(o.watch)}" data-wt="${esc(o.title)}">Watch the film</a>` : '') +
    (pv ? '<nav class="pnav" aria-label="Headings" hidden><h3>Contents</h3><ol></ol></nav>' : '') +
    (o.url ? `<p><a href="${esc(o.url)}" target="_blank" rel="noopener">Open original</a></p>` : '');

  $('.panel', lb).scrollTop = 0;
  if (pv) pdfRead($('.pdfv', st), pv);
}

function close(popHist = true) {
  if (!lb) return;
  ssStop();
  fsOn(false);
  const el = lb;
  lb = null;
  el.classList.add('out');
  el.hidden = true;
  el.style.setProperty('display', 'none', 'important');
  setTimeout(() => {
    try { el.remove(); } catch (_) {}
  }, 180);
  if (popHist && history.state && history.state.lb) {
    closingLb = true;
    try { history.back(); } catch (_) {}
    setTimeout(() => { closingLb = false; }, 300);
  }
  if (last && last.focus) last.focus();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb && !lb.hidden) {
    if (lb.classList.contains('fs')) {
      fsOn(false);
    } else {
      close();
    }
    return;
  }
  if (e.key === 'Enter' && e.target.matches('[role=button]')) e.target.click();
});

document.addEventListener('click', e => {
  const t = e.target.closest('[data-r]');
  if (!t || moved) return;
  if (t.classList.contains('wi')) {
    if (lw === t && Date.now() - lc < 380) {
      clearTimeout(lt);
      lw = null;
      pick(t);
      return;
    }
    lw = t;
    lc = Date.now();
    clearTimeout(lt);
    lt = setTimeout(() => {
      lw = null;
    }, 380);
    return;
  }
  if (REG[+t.dataset.r]._v === 'writing') {
    if (!e.isTrusted) {
      t.classList.add('hl');
      t.scrollIntoView({ block: 'center' });
      setTimeout(() => t.classList.remove('hl'), 2400);
    } else if (!e.target.closest('[download]')) {
      openAt(t);
    }
    return;
  }
  openAt(t);
});

function openAt(t) {
  last = t;
  if (lb) {
    try { lb.remove(); } catch (_) {}
    lb = null;
  }
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="x" aria-label="Close" type="button">×</button><div class="tools"><button data-fs type="button">Full screen</button><button data-ss type="button">Slideshow</button><div class="orient-opts"><button type="button" class="btn-orient active" data-orient="portrait">Portrait</button><button type="button" class="btn-orient" data-orient="landscape">Landscape</button></div></div><button class="p" aria-label="Previous" type="button">‹</button><div class="wrap"><div class="stage"></div><div class="panel"></div></div><button class="n" aria-label="Next" type="button">›</button>';
    lb.onclick = ev => {
      if (ev.target.closest('.x')) {
        close();
        return;
      }
      const OB = ev.target.closest('[data-orient]');
      if (OB) {
        const orient = OB.dataset.orient;
        $$('.btn-orient', lb).forEach(b => b.classList.toggle('active', b === OB));
        lb.classList.toggle('orient-landscape', orient === 'landscape');
        return;
      }
      const T2 = ev.target.closest('[data-fs],[data-ss]');
      if (T2) {
        if (T2.hasAttribute('data-fs')) {
          ssStop();
          fsOn(!lb.classList.contains('fs'));
        } else {
          ssT ? ssStop() : ssStart();
        }
        return;
      }
      if (ev.target.matches('.stage img')) {
        ssStop();
        fsOn(!lb.classList.contains('fs'));
        return;
      }
      if ((ev.target === lb || (ev.target.matches('.wrap') && lb.classList.contains('fs'))) && !ev.target.closest('.panel')) close();
      if (ev.target.closest('.p')) show(idx - 1);
      if (ev.target.closest('.n')) show(idx + 1);
    };
    lb.addEventListener('pointerdown', ev => {
      if (ev.target.closest('.x')) {
        ev.stopPropagation();
        close();
      }
    });
    document.body.append(lb);
  }
  lb.hidden = false;
  show(vis().indexOf(t));
  try { history.pushState({ lb: true }, '', location.href); } catch (_) {}
  $('.x', lb).focus();
}

document.addEventListener('click', e => {
  const CW = e.target.closest('[data-cw]');
  if (CW) {
    nolb = true;
    goTo(REG[+CW.dataset.cw]);
    return;
  }
  if (e.target.closest('[data-reset]')) {
    try {
      localStorage.removeItem('ipwall');
      localStorage.removeItem('ipwallm');
    } catch (_) {}
    const wallEl = $('.wall');
    if (wallEl) {
      wallEl.classList.add('is-settling');
      setTimeout(() => wallEl.classList.remove('is-settling'), 460);
    }
    $$('.wi').forEach((w, idx) => {
      const i = Number.isFinite(+w.dataset.i) ? +w.dataset.i : idx;
      const p = WP[i % 8];
      const q = WPM[i % 8];
      w.style.left = '';
      w.style.top = '';
      w.style.width = '';
      w.style.rotate = '';
      w.style.zIndex = '';
      w.style.setProperty('--l', p[0] + '%');
      w.style.setProperty('--t', p[1] + '%');
      w.style.setProperty('--w', p[2] + '%');
      w.style.setProperty('--rt', p[3] + 'deg');
      w.style.setProperty('--ml', q[0] + '%');
      w.style.setProperty('--mt', q[1] + '%');
      w.style.setProperty('--mw', q[2] + '%');
      w.style.setProperty('--ar', AR[i % 4]);
      w.classList.remove('is-selected', 'is-interacting', 'is-rotating');
    });
    return;
  }
  if (e.target.closest('[data-mix]')) {
    let locked = {};
    let im = {};
    try {
      locked = JSON.parse(localStorage.getItem('ipwalllocked') || '{}');
      im = JSON.parse(localStorage.getItem('ipwallimg') || '{}');
    } catch (_) {}
    const nextIm = {};
    for (const k of Object.keys(im)) {
      if (locked[k]) nextIm[k] = im[k];
    }
    try {
      localStorage.setItem('ipwallimg', JSON.stringify(nextIm));
    } catch (_) {}
    wallAlbum = null;
    mixWall(true);
    return;
  }
  const CC = e.target.closest('[data-cr]');
  if (CC) {
    const q = CC.dataset.cr.split('|');
    go(q[0], +q[1]);
    return;
  }
  const T = e.target.closest('[data-t]');
  if (T) {
    turn(+T.dataset.t);
    return;
  }
  const F = e.target.closest('[data-sp]');
  if (F) {
    if (F.closest('.switch')) NF = true;
    go(F.dataset.sv || 'photography', +F.dataset.sp);
    return;
  }
  const g = e.target.closest('[data-go]');
  if (g) {
    $$('[data-proj]').forEach(x => (x.hidden = x.dataset.proj !== g.dataset.go));
    $$('[data-go]').forEach(b => b.classList.toggle('on', b === g));
  }
});

function goTo(o) {
  pending = o;
  const sameSpread = cur === o._v && sp === (o._sp || 0);
  if (lb && !lb.hidden) close(sameSpread);
  if (sameSpread) {
    render(cur, sp);
  } else {
    go(o._v, o._sp || 0);
  }
}

const hay = o =>
  (o._s = o._s || [o.title, o.desc, (o.tags || []).join(' '), o._al, names[o._v]].join(' ').toLowerCase());

const pth = o =>
  names[o._v] + (o._al ? ' · ' + o._al : '') + (o._h ? ' · Heading' : '');

function find(t) {
  const b = $('.sres');
  if (!b) return;
  const ws = t.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!ws.length) {
    b.hidden = true;
    return;
  }
  const ts = o => (ws.every(w => String(o.title).toLowerCase().includes(w)) ? 0 : 1);
  const h = REG.filter(o => o._v && ws.every(w => hay(o).includes(w)))
    .sort((a, b) => ts(a) - ts(b) || (Boolean(b._h) - Boolean(a._h)))
    .slice(0, 30);

  b.innerHTML = h.length
    ? h.map(o => `<button type="button" class="hit" data-hit="${REG.indexOf(o)}"><b>${esc(o.title)}</b><small>${esc(pth(o))}</small></button>`).join('')
    : '<p>No matches. Try a folder or section name.</p>';
  b.hidden = false;
}

const shut = f => {
  if (f && !$('input', f).value) {
    f.classList.remove('open');
    $('.mag', f).setAttribute('aria-expanded', 'false');
    $('.sres', f).hidden = true;
  }
};

function openS(f) {
  f.classList.add('open');
  $('.mag', f).setAttribute('aria-expanded', 'true');
  setTimeout(() => $('input', f).focus(), 120);
}

document.addEventListener('input', e => {
  if (e.target.id === 'q') find(e.target.value);
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const h = $('.hit');
  if (h) h.click();
});

document.addEventListener('click', e => {
  const m = e.target.closest('.mag');
  if (m) {
    const f = m.closest('.sbar');
    if (f.classList.contains('open') && $('input', f).value) {
      $('form.sbar').requestSubmit();
    } else if (f.classList.contains('open')) {
      shut(f);
    } else {
      openS(f);
    }
    return;
  }
  const h = e.target.closest('[data-hit]');
  if (h) {
    goTo(REG[+h.dataset.hit]);
    return;
  }
  if (!e.target.closest('.sbar')) {
    $$('.sbar').forEach(f => {
      const b = $('.sres', f);
      if (b) b.hidden = true;
      shut(f);
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.target.closest('input,textarea') && !open()) {
    e.preventDefault();
    const f = $('.sbar');
    if (f) openS(f);
  }
  if (e.key === 'Escape' && e.target.id === 'q') {
    const f = e.target.closest('.sbar');
    e.target.value = '';
    $('.sres', f).hidden = true;
    shut(f);
  }
});

const EDIT = /[?&]edit/.test(location.search);
const slug = t => String(t || 'misc').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const UP = {};

const saveD = () => {
  try {
    localStorage.setItem('ipdraft', JSON.stringify(CONTENT));
  } catch (_) {}
};

function studio() {
  let p = $('.studio');
  if (p) {
    p.hidden = !p.hidden;
    return;
  }
  p = document.createElement('aside');
  p.className = 'studio';
  p.innerHTML = `
<button class="x" data-sx aria-label="Close">×</button>
<h2>Studio</h2>
<p class="d">Add content and see it live here. Then download content.json and upload it, with the files listed below, to your site.</p>
<label>What
  <select id="s-t">
    <option value="writing">Writing</option>
    <option value="photo">Photo (into a folder)</option>
    <option value="wall">Photo wall piece</option>
    <option value="video">Video (into a video folder)</option>
    <option value="showreel">Showreel (YouTube link)</option>
    <option value="other">Other work</option>
    <option value="thanks">Special thanks</option>
    <option value="page">Page heading and text</option>
  </select>
</label>
<label>Page (for heading and text)
  <select id="s-pg">
    <option value="cover">Cover</option>
    <option value="index">Index</option>
    <option value="writing">Writing</option>
    <option value="photography">Photography</option>
    <option value="wall">Photo wall</option>
    <option value="video">Video</option>
    <option value="other">Other works</option>
    <option value="about">About</option>
    <option value="thanks">Special thanks</option>
  </select>
</label>
<label>Folder or group name<input id="s-g" placeholder="Goa  or  Travel / Goa  or  Short Films"></label>
<label>Status (other works)
  <select id="s-s"><option>Completed</option><option>WIP</option></select>
</label>
<label>Title or name (page: heading)<input id="s-ti"></label>
<label>Description or role (page: intro line)<input id="s-d"></label>
<label>Text (page: body, About only)<textarea id="s-x" rows="5"></textarea></label>
<label>Date (videos: newest shows first)<input id="s-dt" type="date"></label>
<label>Link (YouTube or web)<input id="s-l"></label>
<label>Files (photos, PDF, deck)<input id="s-f" type="file" multiple></label>
<button class="btn" data-sadd>Add</button>
<p id="s-msg" class="d"></p>
<hr style="width:100%;border-color:#333">
<div>
  <button class="btn" data-sdl>Download content.json</button>
  <label class="btn">Import<input id="s-i" type="file" accept=".json" hidden></label>
  <button class="btn" data-sreset>Discard draft</button>
</div>
<div id="s-up" class="d"></div>`;

  $('#s-i', p).onchange = e => {
    const f = e.target.files[0];
    if (f) {
      f.text().then(t => {
        Object.assign(CONTENT, JSON.parse(t));
        saveD();
        build();
        render(cur, 0);
      });
    }
  };

  document.body.append(p);
}

function addItem() {
  const v = id => $('#' + id).value.trim();
  const t = v('s-t');
  const g = v('s-g');
  const ti = v('s-ti');
  const d = v('s-d');
  const x = v('s-x');
  const l = v('s-l');
  const fs = [...$('#s-f').files];
  const C = CONTENT;
  const msg = $('#s-msg');

  const put = (dir, f) => {
    const p = dir + f.name;
    PREV[p] = URL.createObjectURL(f) + '#' + f.name;
    UP[p] = 1;
    return p;
  };

  const grp = (arr, n, o) => {
    let a = arr.find(z => z.title === n);
    if (!a) {
      a = o;
      arr.push(a);
    }
    return a;
  };

  if (t === 'page') {
    const k = v('s-pg');
    const P = (C.pages = C.pages || {});
    P[k] = Object.assign(P[k] || {}, ti ? { title: ti } : {}, d ? { lede: d } : {}, x ? { body: x } : {});
  } else if (t === 'writing') {
    (C.writing.items = C.writing.items || []).push({
      title: ti || 'Untitled',
      desc: d,
      text: x,
      pdf: fs[0] ? put('writing/', fs[0]) : l
    });
  } else if (t === 'photo') {
    const pp = (g || 'Untitled folder').split('/').map(z => z.trim()).filter(Boolean);
    const at = pp.pop();
    const ag = pp[0];
    const dir = 'images/' + slug(at) + '/';
    const a = grp(C.photography.leisure = C.photography.leisure || [], at, Object.assign({ title: at, desc: d, items: [] }, ag ? { group: ag } : {}));
    a.folder = a.folder || dir;

    if (!fs.length) a.items.push({ title: ti || 'Photo', src: '', text: x });
    fs.forEach(f => {
      put(a.folder, f);
      a.items.push({ title: ti || f.name.replace(/\.\w+$/, ''), src: f.name, text: x });
    });
  } else if (t === 'showreel') {
    C.video.showreel = { title: ti || 'Showreel', desc: d, embed: l };
  } else if (t === 'video') {
    const a = grp(C.video.folders = C.video.folders || [], g || 'Untitled folder', { title: g || 'Untitled folder', desc: '', items: [] });
    a.items.push({ title: ti || 'Untitled', desc: d, embed: l, date: v('s-dt') });
  } else if (t === 'other') {
    const a = grp(C.other, g || 'Untitled', { title: g || 'Untitled', status: v('s-s'), desc: d, items: [] });
    if (fs.length) {
      fs.forEach(f => a.items.push({ title: ti || f.name.replace(/\.\w+$/, ''), src: put('decks/', f), desc: d }));
    } else {
      a.items.push({ title: ti || 'Untitled', embed: l, desc: d, text: x });
    }
  } else if (t === 'wall') {
    const w = (C.photography.wall = C.photography.wall || []);
    if (fs.length) {
      fs.forEach(f => w.push({ title: ti || f.name, src: put('images/wall/', f) }));
    } else {
      w.push({ title: ti || 'Art piece', src: '' });
    }
  } else {
    (C.thanks = C.thanks || []).push({ n: ti || 'Name', r: d });
  }

  saveD();
  build();
  render(cur, 0);

  msg.textContent = 'Added. The preview is live on this device.';
  $('#s-up').innerHTML = Object.keys(UP).length ? 'Upload these files:<br>' + Object.keys(UP).join('<br>') : '';
  $('#s-ti').value = $('#s-d').value = $('#s-x').value = $('#s-f').value = '';
}

document.addEventListener('click', e => {
  if (e.target.closest('[data-sx]')) $('.studio').hidden = true;
  if (e.target.closest('[data-sadd]')) addItem();
  if (e.target.closest('[data-sdl]')) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(CONTENT, null, 1)], { type: 'application/json' }));
    a.download = 'content.json';
    a.click();
  }
  if (e.target.closest('[data-sreset]')) {
    try {
      localStorage.removeItem('ipdraft');
    } catch (_) {}
    location.reload();
  }
});

if (EDIT) {
  const b = document.createElement('button');
  b.className = 'btn sbtn';
  b.textContent = 'Studio';
  b.onclick = studio;
  document.body.append(b);
}

const contentReq = fetch('content.json', EDIT ? { cache: 'no-store' } : {})
  .then(r => (r.ok ? r.json() : null))
  .catch(() => null);

const fontsQuick = (document.fonts && document.fonts.load && document.fonts.status !== 'loaded')
  ? Promise.race([
      Promise.all([
        '400 1em "Champagne & Limousines"',
        '400 1em "Playfair Display"'
      ].map(f => document.fonts.load(f).catch(() => 0))),
      new Promise(r => setTimeout(r, 90))
    ])
  : Promise.resolve();

Promise.all([contentReq, fontsQuick]).then(([j]) => {
  if (j) Object.assign(CONTENT, j);
  if (EDIT) {
    try {
      const d = JSON.parse(localStorage.getItem('ipdraft') || 'null');
      if (d) Object.assign(CONTENT, d);
    } catch (_) {}
  }
  build();
  nav();
});

let ssT = null;

function fsOn(on) {
  if (!lb) return;
  lb.classList.toggle('fs', on);
  const fsBtn = $('[data-fs]', lb);
  if (fsBtn) fsBtn.textContent = on ? 'Exit full screen' : 'Full screen';
  try {
    if (on && !document.fullscreenElement && lb.requestFullscreen) {
      lb.requestFullscreen().catch(() => {});
    } else if (!on && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  } catch (_) {}
}

function ssStop() {
  clearInterval(ssT);
  ssT = null;
  if (lb) lb.classList.remove('ss');
}

function ssStart() {
  fsOn(true);
  lb.classList.add('ss');
  clearInterval(ssT);
  ssT = setInterval(() => show(idx + 1), 4000);
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && lb && lb.classList.contains('fs')) {
    ssStop();
    lb.classList.remove('fs');
    const fsBtn = $('[data-fs]', lb);
    if (fsBtn) fsBtn.textContent = 'Full screen';
  }
});

function fit() {
  $$('.tk,.abx').forEach(t => {
    const sc = t.closest('.sc');
    if (t.classList.contains('tk')) {
      if (innerWidth < 900) {
        t.style.fontSize = '14px';
        return;
      }
      let f = 13.5;
      t.style.fontSize = f + 'px';
      while (sc && sc.scrollHeight > sc.clientHeight + 1 && f > 11) {
        f -= 0.5;
        t.style.fontSize = f + 'px';
      }
      return;
    }
    let f = t.classList.contains('abr')
      ? (innerWidth < 900 ? 15 : 18.5)
      : (innerWidth < 900 ? 14 : 16.5);
    t.style.fontSize = f + 'px';
    while (innerWidth >= 900 && sc && sc.scrollHeight > sc.clientHeight + 1 && f > 4.5) {
      f -= 0.5;
      t.style.fontSize = f + 'px';
    }
  });

  if (innerWidth >= 901) {
    $$('.sc').forEach(e => {
      e.style.setProperty('--ix', 1);
      if (e.querySelector('.tk,.abx,.cwall,.board,.wkw,.folders,.grid,.alb-index,.vch')) return;
      if (BK.classList.contains('ix')) {
        let x = 1;
        while (e.scrollHeight > e.clientHeight + 2 && x > 0.4) {
          x -= 0.05;
          e.style.setProperty('--ix', x.toFixed(2));
        }
      }
      let k = 1;
      e.style.setProperty('--k', 1);
      while (e.scrollHeight > e.clientHeight + 2 && k > 0.64) {
        k -= 0.06;
        e.style.setProperty('--k', k.toFixed(2));
      }
    });
  }
}

addEventListener('resize', () => fit());
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    fit();
    fitFolderTitles();
  });
}

/* ---- cover wall: a scrolling gallery of the pieces named in content.json "coverWall", mixed each visit ---- */
function cwall() {
  const W = CONTENT.coverWall || {};
  const has = (l, x) => l === 'all' || (l || []).includes(x);
  const its = [];

  REG.forEach(o => {
    if (o._h) return;
    if (o._v === 'video') {
      if (o.embed && has(W.video, o.title)) its.push({ o, k: 'Video', im: thumb(o), r: '16/9' });
    } else if (o._v === 'writing') {
      if (has(W.writing, o.title)) its.push({ o, k: 'Script', r: '4/5' });
    } else if (o._v === 'photography') {
      if (o.src && o._al !== 'Photo wall' && has(W.photography, o._al)) its.push({ o, k: o._al, im: o.src, r: '3/2', nat: 1 });
    } else if (o._v === 'other' && o.src && has(W.other, o._al)) {
      its.push(
        o.kind === 'album'
          ? { o, k: o.artist || 'Album art', im: o.thumb || o.src, r: '1' }
          : o.paper
          ? { o, k: 'Screenplay', r: '4/5' }
          : { o, k: o._al, im: o.cover, r: '16/9' }
      );
    }
  });

  const n = (cwCols = cwN());
  const mx = n < 3 ? 2 : Math.min(3, n - 1);
  const ar = r => {
    const [a, b = 1] = r.split('/');
    return a / b;
  };

  let C = [];
  const ok = (t, c) => {
    if (!t.im) {
      const j = C.indexOf(c);
      return !C.some((o, e) => Math.abs(e - j) < 2 && o.t.some(x => !x.im && x.y < c.y + 1.29 && x.y + x.h > c.y - 0.04));
    }
    if (t.r !== '1') return true;
    const l = c.t.slice(-2);
    if (l.length > 1 && l.every(x => x.r === '1')) return false;
    return C.filter(o => o !== c && o.t.some(x => x.r === '1' && x.y < c.y + 1.04 && x.y + x.h > c.y - 0.04)).length < mx;
  };

  for (let a = 0, bad = 1; bad && a < 30; a++) {
    bad = 0;
    C = Array.from({ length: n }, () => ({ y: 0, t: [] }));
    const q = shuf(its.map(t => ({ ...t })));
    while (q.length) {
      const c = C.reduce((acc, b) => (b.y < acc.y - 0.001 ? b : acc));
      const p = Math.random() < 0.45 ? q.findIndex(t => !t.im && ok(t, c)) : -1;
      const i = p >= 0 ? p : q.findIndex(t => t.im && ok(t, c));
      const t = q.splice(Math.max(i, 0), 1)[0];
      if (i < 0) {
        bad = 1;
        t.r = '4/5';
      }
      t.y = c.y;
      t.h = 1 / ar(t.r);
      c.t.push(t);
      c.y += t.h + 0.03;
    }
  }

  return C.map(c => `
<div class="cwc">
  ${c.t.map(({ o, k, im, r, nat, y }) => `
    <button type="button" class="cw" data-cw="${REG.indexOf(o)}"${im ? '' : ' data-lt="1"'} aria-label="Open ${esc(o.title)}"${r ? ` style="aspect-ratio:${r}"` : ''}>
      ${im
        ? `<img src="${esc(im)}" alt="" loading="${y < 3 ? 'eager' : 'lazy'}" decoding="async" draggable="false"${nat ? ' onload="this.parentNode.style.aspectRatio=this.naturalWidth+\'/\'+this.naturalHeight"' : ''}>`
        : `<span class="cwsc"><b>${esc(o.title)}</b><small>${esc(k)}</small></span>`}
      ${o._v === 'video' ? PLAY : ''}
      ${im ? `<span class="cap"><small>${esc(k)}</small><b>${esc(o.title)}</b></span>` : ''}
    </button>`).join('')}
</div>`.trim()).join('');
}

const cwN = () => (innerWidth >= 1700 ? 5 : innerWidth > 1100 ? 4 : innerWidth > 640 ? 3 : 2);
let cwCols = 0;

addEventListener('resize', () => {
  const w = $('.cwall');
  if (w && cwCols !== cwN()) w.innerHTML = cwall();
});

/* cover text gets its black stroke only while a light piece, or the piece being chosen, sits behind that line of text */
function cwStk() {
  try {
    const n = $('.cwn');
    if (!n) return;
    const cws = $$('.cw');
    if (n.classList.contains('faded-out')) {
      cws.forEach(t => t.classList.remove('cwu'));
      return;
    }
    // Batch all DOM layout reads first before any classList writes
    const kids = [...n.children];
    const kidData = kids.map(x => ({ el: x, vis: Boolean(x.offsetParent), rect: x.getBoundingClientRect() }));
    const cwData = cws.map(t => ({
      el: t,
      lightOrHover: Boolean(t.dataset.lt || t.matches(':hover')),
      rect: t.getBoundingClientRect()
    }));
    const ts = cwData.filter(d => d.lightOrHover).map(d => d.rect);
    const ks = kidData.filter(d => d.vis).map(d => d.rect);

    // Batch all DOM writes
    kidData.forEach(({ el, rect: b }) => {
      el.classList.toggle('stk', ts.some(r => b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top));
    });
    cwData.forEach(({ el, rect: r }) => {
      el.classList.toggle('cwu', ks.some(b => b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top));
    });
  } catch (_) {}
}

let lastCoverY = 0;
let lastTouchY = 0;

function updateCoverFade() {
  const n = $('.cwn');
  if (!n) return;
  const sc = $('#R .sc');
  const y = (sc && sc.scrollTop) || (BK && BK.scrollTop) || window.scrollY || 0;

  if (y <= 30) {
    n.classList.remove('faded-out');
  } else if (y > 60 && y > lastCoverY + 2) {
    n.classList.add('faded-out');
  } else if (y < lastCoverY - 4) {
    n.classList.remove('faded-out');
  }
  lastCoverY = y;
}

let cwR = 0;
const cwQ = () => {
  cwR = cwR || requestAnimationFrame(() => {
    cwR = 0;
    updateCoverFade();
    cwStk();
  });
};

document.addEventListener('scroll', cwQ, true);
let tknTimer = null;
function tknScroll() {
  if (cur !== 'thanks') return;
  const el = $('.tkn');
  if (!el) return;
  el.classList.add('active');
  clearTimeout(tknTimer);
  tknTimer = setTimeout(() => {
    if (!el.matches(':hover') && !el.matches(':focus-within')) {
      el.classList.remove('active');
    }
  }, 2200);
}

document.addEventListener('scroll', tknScroll, true);
addEventListener('wheel', tknScroll, { passive: true });
addEventListener('touchmove', tknScroll, { passive: true });
document.addEventListener('pointerleave', e => {
  if (e.target && e.target.closest && e.target.closest('.tkn')) {
    clearTimeout(tknTimer);
    tknTimer = setTimeout(() => {
      const el = $('.tkn');
      if (el && !el.matches(':hover') && !el.matches(':focus-within')) {
        el.classList.remove('active');
      }
    }, 800);
  }
}, true);

document.addEventListener('mouseover', e => {
  if (cur === 'cover' && e.target && e.target.closest && e.target.closest('.cwall')) cwQ();
});
addEventListener('resize', () => { if (cur === 'cover') cwQ(); });

let toTopBtn = null;
let toTopR = 0;

function updateToTop() {
  if (window.innerWidth > 900) {
    if (toTopBtn) toTopBtn.classList.remove('visible');
    return;
  }

  if (!toTopBtn) {
    toTopBtn = document.createElement('button');
    toTopBtn.type = 'button';
    toTopBtn.id = 'btnToTop';
    toTopBtn.className = 'btn-to-top';
    toTopBtn.setAttribute('aria-label', 'Back to top');
    toTopBtn.innerHTML = '<span>To the top ↑</span>';
    toTopBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      scrollToTop();
    };
    toTopBtn.addEventListener('pointerdown', e => {
      e.stopPropagation();
      scrollToTop();
    });
    document.body.appendChild(toTopBtn);
  }

  const pkPanel = document.querySelector('.lb.pk .panel');
  const wrLb = lb && !lb.hidden && lb.classList.contains('wr') ? lb : null;
  const afsOv = ovEl && ovEl.isConnected && !ovEl.classList.contains('out') && ovEl.classList.contains('afs') ? ovEl : null;
  const covSc = cur === 'cover' ? $('.r[data-theme=cover] .sc') : null;
  const activeSc = pkPanel || wrLb || afsOv || covSc || BK;

  let y = 0;
  let totalH = 0;
  let viewH = window.innerHeight;

  if (activeSc) {
    y = activeSc.scrollTop;
    totalH = activeSc.scrollHeight;
    viewH = activeSc.clientHeight;
  } else {
    y = window.scrollY || document.documentElement.scrollTop || 0;
    totalH = document.documentElement.scrollHeight || 0;
    viewH = window.innerHeight;
  }

  // Show popup when scroll is long (totalH >= viewH * 1.5) and scrolled down roughly 2 swipes
  const isLong = totalH >= viewH * 1.5;
  const isDeep = y >= Math.min(500, Math.round(viewH * 0.85));

  if (isLong && isDeep) {
    toTopBtn.classList.add('visible');
  } else if (y < 240) {
    toTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  const pkPanel = document.querySelector('.lb.pk .panel');
  const wrLb = lb && !lb.hidden && lb.classList.contains('wr') ? lb : null;
  const afsOv = ovEl && ovEl.isConnected && !ovEl.classList.contains('out') && ovEl.classList.contains('afs') ? ovEl : null;
  const covSc = cur === 'cover' ? $('.r[data-theme=cover] .sc') : null;
  [pkPanel, wrLb, afsOv, covSc, BK].forEach(el => {
    if (el && el.scrollTop > 20) {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    if (toTopBtn) toTopBtn.classList.remove('visible');
  }, 350);
}

const qToTop = () => {
  toTopR = toTopR || requestAnimationFrame(() => {
    toTopR = 0;
    updateToTop();
  });
};

document.addEventListener('scroll', qToTop, true);
addEventListener('touchmove', qToTop, { passive: true });
addEventListener('resize', qToTop, { passive: true });


addEventListener('wheel', e => {
  if (cur !== 'cover') return;
  const n = $('.cwn');
  if (!n) return;
  if (e.deltaY < -3) {
    n.classList.remove('faded-out');
  } else if (e.deltaY > 3) {
    const sc = $('#R .sc');
    const y = (sc && sc.scrollTop) || (BK && BK.scrollTop) || window.scrollY || 0;
    if (y > 60) {
      n.classList.add('faded-out');
    }
  }
}, { passive: true });

document.addEventListener('load', e => {
  const i = e.target;
  const t = i.closest && i.closest('.cw');
  if (!t || i.tagName !== 'IMG') return;
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 12;
    const x = c.getContext('2d');
    x.drawImage(i, 0, 0, 12, 12);
    const d = x.getImageData(0, 0, 12, 12).data;
    let s = 0;
    for (let k = 0; k < d.length; k += 4) {
      s += d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11;
    }
    if (s / (d.length / 4) > 140) {
      t.dataset.lt = 1;
      cwQ();
    }
  } catch (_) {}
}, true);

let nolb = false;
let wfsPh = null;
function WK() {
  return matchMedia('(max-width:900px)').matches ? 'ipwallm' : 'ipwall';
}

const htxt = el => {
  const c = el.cloneNode(true);
  c.querySelectorAll('br').forEach(b => b.replaceWith(' '));
  return c.textContent.replace(/\s+/g, ' ').trim();
};

function regHeads() {
  const seen = new Set();
  order.forEach(v => {
    S[v]['leisure'].forEach((pg, s) => {
      pg.forEach(h => {
        const d = document.createElement('template');
        d.innerHTML = h === '@toc' ? '<h2>Contents</h2>' : h;
        d.content.querySelectorAll('h1,h2,h3,.phead,.fold,.bt[data-album]').forEach(x => {
          let sv = v;
          let sp = s;
          if (x.classList.contains('fold') || x.classList.contains('bt')) {
            sv = x.dataset.sv || v;
            sp = +x.dataset.sp;
            x = x.querySelector('b');
          }
          const t = x && htxt(x);
          if (!t) return;
          const k = [sv, sp, t].join('|');
          if (seen.has(k)) return;
          seen.add(k);
          reg({ title: t, desc: '' }, { _v: sv, _sp: sp, _h: 1 });
        });
      });
    });
  });
}

function wallFs(on) {
  if (on) {
    const w = $('.wallw');
    if (!w || w.classList.contains('fs')) return;
    wfsPh = document.createComment('wall');
    w.before(wfsPh);
    document.body.append(w);
    w.classList.add('fs');
    try {
      const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      if (r && r.catch) r.catch(() => {});
    } catch (_) {}
  } else {
    const w = $('.wallw.fs');
    if (!w) return;
    w.classList.remove('fs');
    if (wfsPh && wfsPh.parentNode) wfsPh.replaceWith(w);
    else w.remove();
    wfsPh = null;
    try {
      if (document.fullscreenElement) document.exitFullscreen();
    } catch (_) {}
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-wfs]');
  if (b) wallFs(!b.closest('.wallw').classList.contains('fs'));
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && $('.wallw.fs')) wallFs(false);
});

function crumbs(v, l, s) {
  if (v === 'cover' || v === 'thanks') return '';
  const P = [{ t: 'Index', g: 'index|0' }];
  if (v !== 'index') {
    P.push({ t: names[v], g: v + '|0' });
    let al = '';
    if (v === 'photography') {
      if (s === 1) al = 'Albums';
      else if (s === 2) al = 'Photo wall';
    }
    else if ((v === 'other' || v === 'video') && s > 0) {
      const m = String(l).match(/<h1>(.*?)<\/h1>/);
      al = m ? m[1] : '';
    }
    if (al) P.push({ t: al, raw: 1 });
  }
  return (
    '<nav class="crumb" aria-label="Breadcrumb">' +
    P.map((p, i) => {
      const t = p.raw ? p.t : esc(p.t);
      return i === P.length - 1 ? '<b>' + t + '</b>' : p.g ? `<a data-cr="${p.g}">${t}</a>` : `<span>${t}</span>`;
    }).join('<span class="sep">›</span>') +
    '</nav>'
  );
}

(function () {
  const orig = applyWall;
  applyWall = function () {
    orig();
    mixWall();
  };
})();

function mixWall(force = false) {
  const ws = $$('.wi');
  if (!ws.length) return;
  let im = {};
  let locked = {};
  try {
    im = JSON.parse(localStorage.getItem('ipwallimg') || '{}');
    locked = JSON.parse(localStorage.getItem('ipwalllocked') || '{}');
  } catch (_) {}

  const seen = new Set();
  let pool = [];

  if (wallAlbum) {
    pool = wallAlbum.photos.slice();
  } else {
    REG.forEach(o => {
      if (o._v === 'photography' && o._al !== 'Photo wall' && o.src && !isDoc(o) && !isVid(o) && !seen.has(o.src)) {
        seen.add(o.src);
        pool.push({ src: o.src, title: o.title });
      }
    });
    ws.forEach(w => {
      if (w.dataset.o && !seen.has(w.dataset.o)) {
        seen.add(w.dataset.o);
        pool.push({ src: w.dataset.o, title: REG[+w.dataset.r].title });
      }
    });
  }

  const hp = $('.wh p');
  if (hp) {
    hp.dataset.t = hp.dataset.t || hp.textContent;
    hp.textContent = wallAlbum ? 'Showing ' + wallAlbum.name + '. Press Mix for a new mix of pictures.' : hp.dataset.t;
  }

  if (!pool.length) return;
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let svD = {};
  let svM = {};
  try {
    svD = JSON.parse(localStorage.getItem('ipwall') || '{}');
    svM = JSON.parse(localStorage.getItem('ipwallm') || '{}');
  } catch (_) {}

  let freeSlots = [];
  if (force) {
    const lockedIdx = new Set(ws.filter(w => locked[w.dataset.i]).map(w => (+w.dataset.i) % 8));
    freeSlots = Array.from({ length: ws.length }, (_, idx) => idx).filter(s => !lockedIdx.has(s % 8));
    if (!freeSlots.length) freeSlots = Array.from({ length: ws.length }, (_, idx) => idx);
    for (let i = freeSlots.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [freeSlots[i], freeSlots[j]] = [freeSlots[j], freeSlots[i]];
    }
    const wallEl = $('.wall');
    if (wallEl) {
      wallEl.classList.add('is-settling');
      setTimeout(() => wallEl.classList.remove('is-settling'), 460);
    }
  }

  const jit = (v, r) => v + (Math.random() * 2 - 1) * r;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  let k = 0;
  let sk = 0;
  ws.forEach(w => {
    const wiKey = w.dataset.i;
    if (locked[wiKey]) return;
    if (force) {
      const sIdx = freeSlots[sk++ % freeSlots.length];
      const baseD = WP[sIdx % 8];
      const baseM = WPM[sIdx % 8];
      const nw = clamp(jit(baseD[2], 3), 20, 34);
      const nl = clamp(jit(baseD[0], 3.5), 2, 100 - nw - 3);
      const nt = clamp(jit(baseD[1], 4), 2, 73);
      const nrt = Math.round(clamp(jit(baseD[3], 6), -12, 12));
      const nmw = clamp(jit(baseM[2], 3), 28, 42);
      const nml = clamp(jit(baseM[0], 3), 2, 100 - nmw - 3);
      const nmt = clamp(jit(baseM[1], 3), 2, 72);
      const ar = AR[(sIdx + ((Math.random() * AR.length) | 0)) % AR.length];

      w.style.left = '';
      w.style.top = '';
      w.style.width = '';
      w.style.rotate = '';
      w.style.setProperty('--l', nl.toFixed(1) + '%');
      w.style.setProperty('--t', nt.toFixed(1) + '%');
      w.style.setProperty('--w', nw.toFixed(1) + '%');
      w.style.setProperty('--rt', nrt + 'deg');
      w.style.setProperty('--ml', nml.toFixed(1) + '%');
      w.style.setProperty('--mt', nmt.toFixed(1) + '%');
      w.style.setProperty('--mw', nmw.toFixed(1) + '%');
      w.style.setProperty('--ar', ar);
      w.classList.remove('is-selected');

      svD[wiKey] = [nl.toFixed(1) + '%', nt.toFixed(1) + '%', nrt + 'deg', nw.toFixed(1) + '%'];
      svM[wiKey] = [nml.toFixed(1) + '%', nmt.toFixed(1) + '%', nrt + 'deg', nmw.toFixed(1) + '%'];
    }
    if (!force && !wallAlbum && im[wiKey] && w.querySelector('img')) return;
    const p = pool[k++ % pool.length];
    const o = REG[+w.dataset.r];
    if (o) {
      o.src = p.src;
      o.title = p.title;
      delete o._s;
    }
    w.setAttribute('aria-label', p.title);
    const existingImg = w.querySelector('img');
    if (existingImg) {
      existingImg.src = p.src;
      existingImg.alt = p.title;
    } else {
      w.innerHTML = `<img src="${esc(p.src)}" alt="${esc(p.title)}" draggable="false">${WI_UI}`;
    }
  });

  if (force) {
    try {
      localStorage.setItem('ipwall', JSON.stringify(svD));
      localStorage.setItem('ipwallm', JSON.stringify(svM));
    } catch (_) {}
  }
}

const TKN = '<div class="tkn"><button type="button" class="btn" data-t="-1">‹ Previous</button><button type="button" class="btn" data-cv>Back to cover</button></div>';
document.addEventListener('click', e => {
  if (e.target.closest('[data-cv]')) {
    go('cover');
  }
});

let dragAl = null;
let wallAlbum = null;

document.addEventListener('dragstart', e => {
  const a = e.target.closest && e.target.closest('.bt[data-ai]');
  if (!a) return;
  dragAl = +a.dataset.ai;
  try {
    e.dataTransfer.setData('text/plain', 'album');
    e.dataTransfer.effectAllowed = 'copy';
  } catch (_) {}
});

document.addEventListener('dragend', () => {
  dragAl = null;
  $$('.wallw.dro').forEach(w => w.classList.remove('dro'));
});

document.addEventListener('dragover', e => {
  const w = dragAl !== null && e.target.closest && e.target.closest('.wallw');
  if (w) {
    e.preventDefault();
    w.classList.add('dro');
  }
});

document.addEventListener('dragleave', e => {
  const w = e.target.closest && e.target.closest('.wallw');
  if (w && !w.contains(e.relatedTarget)) {
    w.classList.remove('dro');
  }
});

document.addEventListener('drop', e => {
  const w = dragAl !== null && e.target.closest && e.target.closest('.wallw');
  if (!w) return;
  e.preventDefault();
  w.classList.remove('dro');
  albumToWall(dragAl);
  dragAl = null;
});

document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-towall]');
  if (!t) return;
  e.stopPropagation();
  e.preventDefault();
  const val = t.dataset.towall;
  if (!val || val === 'all') {
    filterWall('all');
  } else if (!isNaN(val) && String(val).trim() !== '') {
    const al = getPhotoAlbums()[+val] || (CONTENT.photography?.leisure || [])[+val];
    if (al) filterWall(al.title);
  } else {
    filterWall(val);
  }
}, true);

function filterWall(cat) {
  const hp = $('.wh p');
  if (!cat || cat.toLowerCase() === 'all') {
    wallAlbum = null;
    $$('[data-towall]').forEach(c => c.classList.toggle('on', c.dataset.towall === 'all' || !c.dataset.towall));
    if (hp) hp.textContent = 'A new mix of your photos every visit. Drag the pieces to arrange them.';
    if (PAGE === 'photography' && sp === 2) {
      mixWall(true);
    }
    return;
  }
  const fLower = cat.toLowerCase();
  const ph = REG.filter(o => {
    if (o._v !== 'photography' || !o.src || isDoc(o) || isVid(o)) return false;
    const aMatch = (o._al || '').toLowerCase() === fLower;
    const tags = (o.tags || o._it || []).map(t => String(t).toLowerCase());
    return aMatch || tags.includes(fLower);
  }).map(o => ({ src: o.src, title: o.title }));

  if (!ph.length) {
    if (hp) hp.textContent = 'No photos in ' + cat + ' yet.';
    return;
  }
  wallAlbum = { name: cat, photos: ph };
  $$('[data-towall]').forEach(c => c.classList.toggle('on', (c.dataset.towall || '').toLowerCase() === fLower));
  if (hp) hp.textContent = 'Showing ' + cat + ' (' + ph.length + ' photos). Press Mix for a new mix.';
  if (PAGE !== 'photography' || sp !== 2) {
    go('photography', 2);
  } else {
    mixWall(true);
  }
}

let NF = false;
let rd = null;

const shuf = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function ordBoard() {
  const v = $('#vboard[data-kind="video"]');
  if (v && !v.dataset.mx) {
    v.dataset.mx = 1;
    shuf([...v.querySelectorAll('.bt')]).forEach(x => v.append(x));
  }
  const b = $('#vboard[data-kind="photos"]');
  if (!b) return;
  const t = [...b.children].filter(x => x.classList.contains('bt'));
  const hasSpecificFilter = $$('.chip.on[data-vfilter]').some(c => c.dataset.vfilter);
  if (hasSpecificFilter) t.sort((a, b) => a.dataset.o - b.dataset.o);
  else shuf(t);
  t.forEach(x => b.append(x));
}

/* ---- video board: press and hold a piece, then drag it to a new spot (mouse and touch) ---- */
let vh0 = null;
let vdg = null;
let vnc = false;
const vbt = e => e.target.closest && e.target.closest('#vboard[data-kind="video"] .bt');

const vScr = n => {
  for (; n && n !== document.body; n = n.parentElement) {
    const o = getComputedStyle(n).overflowY;
    if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) return n;
  }
  return document.scrollingElement;
};

function vLift() {
  const { t, x, y } = vh0;
  vh0 = null;
  g = null;
  md = null;
  SH.style.transform = '';
  const r = t.getBoundingClientRect();
  const gh = t.cloneNode(true);
  gh.removeAttribute('data-vid');
  gh.classList.add('vgh');
  gh.style.cssText += `;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
  document.body.append(gh);
  t.classList.add('vph');
  vdg = { t, gh, dx: x - r.left, dy: y - r.top, x, y, sc: vScr(t.parentElement) };
  if (navigator.vibrate) navigator.vibrate(12);
  requestAnimationFrame(vAuto);
}

function vMove() {
  const { t, gh, x, y } = vdg;
  gh.style.left = x - vdg.dx + 'px';
  gh.style.top = y - vdg.dy + 'px';
  const o = document.elementFromPoint(x, y);
  const u = o && o.closest('#vboard .bt');
  if (!u || u === t || u === vdg.last) return;
  vdg.last = u;
  const s = [...t.parentElement.children];
  if (s.indexOf(u) > s.indexOf(t)) {
    u.after(t);
  } else {
    u.before(t);
  }
}

function vAuto() {
  if (!vdg) return;
  const d = vdg.y < 70 ? -9 : vdg.y > innerHeight - 90 ? 9 : 0;
  if (d) {
    vdg.sc.scrollTop += d;
    vdg.last = null;
    vMove();
  }
  requestAnimationFrame(vAuto);
}

function vDrop() {
  if (vh0) {
    clearTimeout(vh0.k);
    vh0 = null;
  }
  if (!vdg) return;
  vdg.gh.remove();
  vdg.t.classList.remove('vph');
  vdg = null;
  vnc = true;
  setTimeout(() => (vnc = false), 400);
}

addEventListener('pointerdown', e => {
  const t = vbt(e);
  if (!t || e.button || ovEl) return;
  vh0 = { t, x: e.clientX, y: e.clientY, k: setTimeout(vLift, 380) };
});

addEventListener('pointermove', e => {
  if (vh0) {
    if (Math.hypot(e.clientX - vh0.x, e.clientY - vh0.y) > 8) {
      clearTimeout(vh0.k);
      vh0 = null;
    }
    return;
  }
  if (vdg) {
    vdg.x = e.clientX;
    vdg.y = e.clientY;
    vMove();
  }
});

addEventListener('pointerup', vDrop);
addEventListener('pointercancel', vDrop);
addEventListener('touchmove', e => {
  if (vdg) e.preventDefault();
}, { passive: false });
addEventListener('contextmenu', e => {
  if (vbt(e)) e.preventDefault();
});
addEventListener('click', e => {
  if (vnc) {
    vnc = false;
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

function rOpen(t) {
  const list = $$('.item[data-r]').map(x => +x.dataset.r);
  if (!rd) {
    rd = document.createElement('div');
    rd.className = 'rd';
    rd.setAttribute('role', 'dialog');
    rd.setAttribute('aria-modal', 'true');
    try {
      rd.classList.toggle('dk', localStorage.getItem('iprd') === 'dark');
    } catch (_) {}
    rd.innerHTML = '<button class="rx" aria-label="Close reader">×</button><div class="rtools"><button type="button" class="rtb rth"></button><a class="rtb rdl" download></a></div><div class="rs"><div class="rv"><div class="rt"></div></div></div><div class="rb"><button class="rp" aria-label="Previous page">‹</button><span class="rn"></span><button class="rq" aria-label="Next page">›</button></div><div class="rl"><button class="rpp">‹ Previous piece</button><button class="rnp">Next piece ›</button></div>';
    rd.onclick = e => {
      if (e.target.closest('.rth')) {
        const d = !rd.classList.contains('dk');
        rd.classList.toggle('dk', d);
        try {
          localStorage.setItem('iprd', d ? 'dark' : 'light');
        } catch (_) {}
        rThL();
      } else if (e.target.closest('.rx')) {
        rClose();
      } else if (e.target.closest('.rp')) {
        rGo(-1);
      } else if (e.target.closest('.rq')) {
        rGo(1);
      } else if (e.target.closest('.rpp')) {
        rPiece(-1);
      } else if (e.target.closest('.rnp')) {
        rPiece(1);
      }
    };

    let sx = 0;
    rd.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
    }, { passive: true });
    rd.addEventListener('touchend', e => {
      const d = e.changedTouches[0].clientX - sx;
      if (Math.abs(d) > 50) rGo(d < 0 ? 1 : -1);
    }, { passive: true });

    addEventListener('resize', () => {
      if (!rd.hidden) rLay(rd._i);
    });
    document.body.append(rd);
    rThL();
  }

  rd._list = list;
  rd._pi = Math.max(0, list.indexOf(+t.dataset.r));
  rd.hidden = false;
  document.body.classList.add('rdo');
  rLoad();
}

function rLoad() {
  const o = REG[rd._list[rd._pi]];
  const tx = o.text
    ? String(o.text).split(/\n\s*\n/).map(x => `<p>${esc(x)}</p>`).join('')
    : '<p class="rdd">The full text of this piece goes here. Add it in Studio or in content.json.</p>';

  $('.rt', rd).innerHTML = `<h1>${esc(o.title)}</h1>${o.desc ? `<p class="rdd">${esc(o.desc)}</p>` : ''}${tx}`;
  const dl = $('.rdl', rd);
  if (rd._u) {
    URL.revokeObjectURL(rd._u);
    rd._u = '';
  }
  if (o.pdf) {
    dl.href = o.pdf;
    dl.setAttribute('download', '');
    dl.textContent = 'Download PDF';
  } else {
    rd._u = URL.createObjectURL(new Blob([o.title + '\n\n' + (o.desc ? o.desc + '\n\n' : '') + (o.text || '')], { type: 'text/plain' }));
    dl.href = rd._u;
    dl.setAttribute('download', slug(o.title) + '.txt');
    dl.textContent = 'Download text';
  }
  $('.rpp', rd).disabled = rd._pi <= 0;
  $('.rnp', rd).disabled = rd._pi >= rd._list.length - 1;
  rd._i = 0;
  requestAnimationFrame(() => rLay(0));
}

function rThL() {
  const b = $('.rth', rd);
  b.textContent = rd.classList.contains('dk') ? 'Light mode' : 'Dark mode';
}

function rLay(i) {
  const v = $('.rv', rd);
  const t = $('.rt', rd);
  const W = v.clientWidth;
  const H = v.clientHeight;
  const c = innerWidth >= 900 ? 2 : 1;
  const G = c > 1 ? 64 : 0;
  const cw = (W - (c - 1) * G) / c;

  t.style.cssText = `height:${H}px;width:${W}px;column-width:${cw}px;column-gap:${G}px;column-fill:auto`;
  rd._W = W + G;
  rd._n = Math.max(1, Math.ceil((t.scrollWidth + G) / (W + G) - 0.01));
  rd._i = Math.max(0, Math.min(i, rd._n - 1));
  rShow();
}

function rShow() {
  const t = $('.rt', rd);
  t.style.transform = `translateX(${-rd._i * rd._W}px)`;
  $('.rn', rd).textContent = `${rd._i + 1} / ${rd._n}`;
  $('.rp', rd).disabled = rd._i <= 0;
  $('.rq', rd).disabled = rd._i >= rd._n - 1;
}

function rGo(d) {
  if (!rd || rd.hidden) return;
  const i = rd._i + d;
  if (i < 0 || i >= rd._n) return;
  rd._i = i;
  rShow();
}

function rPiece(d) {
  const n = rd._pi + d;
  if (n < 0 || n >= rd._list.length) return;
  rd._pi = n;
  rLoad();
}

function rClose() {
  rd.hidden = true;
  document.body.classList.remove('rdo');
}

/* ---- writing: show the first page of each PDF as its cover (pdf.js) ---- */
const PDFJS = window.PDFJS_BASE || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
let pdfP = null;

const pdfLib = () =>
  pdfP ||
  (pdfP = new Promise((ok, no) => {
    if (window.pdfjsLib) return ok(window.pdfjsLib);
    const q = document.createElement('script');
    q.src = PDFJS + 'pdf.min.js';
    q.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
      ok(pdfjsLib);
    };
    q.onerror = no;
    document.head.append(q);
  }));

function pdfCovers() {
  $$('.cvr[data-pdf],.tile[data-pdf]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const u = el.dataset.pdf.split('#')[0];
    pdfLib()
      .then(L => L.getDocument(u).promise)
      .then(d => d.getPage(1))
      .then(pg => {
        const v0 = pg.getViewport({ scale: 1 });
        const v = pg.getViewport({ scale: Math.min(2.5, 560 / v0.width) });
        const c = document.createElement('canvas');
        c.width = v.width;
        c.height = v.height;
        return pg.render({ canvasContext: c.getContext('2d'), viewport: v }).promise.then(() => {
          [...el.children].forEach(x => x.classList.contains('rmo') || x.remove());
          el.prepend(c);
          el.classList.add('ok');
          if (el.classList.contains('tile')) el.style.aspectRatio = v0.width + '/' + v0.height;
        });
      })
      .catch(() => {});
  });
}

document.addEventListener('click', e => {
  const c = e.target.closest('[data-wfilter]');
  if (!c) return;
  const f = c.dataset.wfilter;
  $$('[data-wfilter]').forEach(x => x.classList.toggle('on', x === c));
  const ws = $$('.wk[data-tags]');
  ws.forEach(w => (w.hidden = Boolean(f && !w.dataset.tags.split('|').includes(f))));
  const em = $('.wke');
  if (em) em.hidden = ws.some(w => !w.hidden);
});

function pdfRead(el, u) {
  if (!el || !u) return;
  pdfLib()
    .then(L => L.getDocument(u.split('#')[0]).promise)
    .then(async d => {
      if (!el.isConnected) return;
      el.innerHTML = '';
      const W = Math.min(el.clientWidth || 760, 860);
      const dpr = Math.min(2, devicePixelRatio || 1);
      const pn = $('.pgn', lb);
      if (pn) pn.textContent = d.numPages + ' page' + (d.numPages === 1 ? '' : 's');

      const v1 = (await d.getPage(1)).getViewport({ scale: 1 });
      const cs = [];
      for (let i = 1; i <= d.numPages; i++) {
        const c = document.createElement('canvas');
        c.className = 'pdfp';
        c.width = W;
        c.height = Math.round((W * v1.height) / v1.width);
        el.append(c);
        cs.push(c);
      }

      pdfNav(d, el, cs);

      for (let i = 1; i <= d.numPages; i++) {
        if (!el.isConnected) return;
        const pg = await d.getPage(i);
        const v0 = pg.getViewport({ scale: 1 });
        const v = pg.getViewport({ scale: (W / v0.width) * dpr });
        const c = cs[i - 1];
        c.width = v.width;
        c.height = v.height;
        await pg.render({ canvasContext: c.getContext('2d'), viewport: v }).promise;
      }
    })
    .catch(() => {
      if (el.isConnected) el.innerHTML = `<iframe class="pdf" src="${esc(u)}" title="PDF"></iframe>`;
    });
}

/* headings for an opened PDF: bookmarks or scene headings */
async function pdfHeads(d) {
  const ol = (await d.getOutline().catch(() => null)) || [];
  const hs = [];
  for (const it of ol) {
    try {
      const dest = typeof it.dest === 'string' ? await d.getDestination(it.dest) : it.dest;
      hs.push({ t: it.title.trim(), p: (await d.getPageIndex(dest[0])) + 1, y: 0 });
    } catch (_) {}
  }
  if (!hs.length || hs.filter(h => /^(slide|page)\s*\d+$/i.test(h.t)).length > hs.length / 2) {
    hs.length = 0;
    const sl = [];
    for (let i = 1; i <= d.numPages; i++) {
      const pg = await d.getPage(i);
      const H = pg.getViewport({ scale: 1 }).height;
      const its = (await pg.getTextContent()).items.filter(t => t.str.trim());
      const z = t => Math.hypot(t.transform[2], t.transform[3]);
      const ln = {};
      its.forEach(t => {
        const k = Math.round(t.transform[5]);
        (ln[k] = ln[k] || []).push(t);
      });
      Object.keys(ln)
        .map(Number)
        .sort((a, b) => b - a)
        .forEach(y => {
          const s = ln[y]
            .sort((a, b) => a.transform[4] - b.transform[4])
            .map(t => t.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          if (/^(\d+[.)]?\s*)?(INT|EXT)[.\s\/]/.test(s)) {
            sl.push({ t: s, p: i, y: Math.max(0, 1 - y / H - 0.03) });
          }
        });
      const zs = its.map(z).sort((a, b) => a - b);
      const md = zs[zs.length >> 1] || 0;
      const mx = Math.max(0, ...its.filter(t => /[a-z]{3}/i.test(t.str)).map(z));
      if (mx && mx >= md * 1.2) {
        const t = its
          .filter(t => z(t) >= mx * 0.9)
          .sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4])
          .map(t => t.str.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .replace(/\s0\d$/, '');
        hs.push({ t: t.length > 70 ? t.slice(0, 68) + '…' : t, p: i, y: 0 });
      }
    }
    if (sl.length) return sl;
  }
  const n = {};
  hs.forEach(h => (n[h.t] = (n[h.t] || 0) + 1));
  return hs.filter((h, i) => n[h.t] < 3 && (!i || hs[i - 1].t !== h.t));
}

async function pdfNav(d, el, cs) {
  const nv = $('.pnav', lb);
  if (!nv) return;
  const hs = await pdfHeads(d).catch(() => []);
  if (!el.isConnected || !hs.length) return;
  const st = el.closest('.stage');

  $('ol', nv).innerHTML = hs
    .map((h, i) => `<li><button type="button" data-hp="${i}" title="${esc(h.t)}"><span>${esc(h.t)}</span><small>${h.p}</small></button></li>`)
    .join('');
  nv.hidden = false;

  const top = h => {
    const c = cs[h.p - 1];
    return st.scrollTop + c.getBoundingClientRect().top - st.getBoundingClientRect().top + h.y * c.clientHeight - 8;
  };
  const bs = $$('[data-hp]', nv);

  nv.onclick = e => {
    const b = e.target.closest('[data-hp]');
    if (b) st.scrollTo({ top: top(hs[+b.dataset.hp]), behavior: reduce ? 'auto' : 'smooth' });
  };

  st.onscroll = () => {
    let k = 0;
    hs.forEach((h, i) => {
      if (top(h) <= st.scrollTop + 40) k = i;
    });
    bs.forEach((b, i) => b.classList.toggle('on', i === k));
  };
  st.onscroll();
}

/* poster title fonts come from Google Fonts */
const GF = new Set();
function gfont(f) {
  if (!f || GF.has(f)) return;
  GF.add(f);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f).replace(/%20/g, '+') + '&display=swap';
  document.head.append(l);
}

function poster(o, mini) {
  gfont(o.font);
  let tr = o.tracks;
  if (typeof tr === 'number') tr = Array.from({ length: tr }, (_, i) => 'Track ' + (i + 1));
  tr = tr || [];

  const h = tr.length > 12 ? 12 : Math.ceil(tr.length / 2);
  const ol = (a, n) => (a.length ? `<ol style="counter-reset:t ${n - 1}">${a.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '');
  const pal = (o.palette || []).map(c => `<i style="background:${esc(c)}"></i>`).join('');
  const wm = o.watermark ?? CONTENT.watermark ?? '© Ivan Philips · T&C apply';

  return `
<article class="poster" data-pal="${o.palette ? '' : 'auto'}">
  <div class="pin">
    <div class="pcv">
      <img src="${esc(o.src)}" alt="${esc(o.title)}"${mini ? ' loading="lazy"' : ''} onload="palOf(this.closest('.poster'))">
    </div>
    <div class="pbd">
      <div class="ptk">${ol(tr.slice(0, h), 1)}${ol(tr.slice(h), h + 1)}</div>
      <div class="pmt">
        <div class="psw">${pal}</div>
        ${o.date ? `<p class="prd"><b>Released date:</b> ${esc(o.date)}</p>` : ''}
      </div>
    </div>
    <div class="pft">
      ${o.artist ? `<p class="pa">${esc(o.artist)}</p>` : ''}
      <p class="pt"${o.font ? ` style="font-family:'${esc(o.font)}',Georgia,serif"` : ''}>${esc(o.title)}</p>
    </div>
    <span class="pwm">${esc(wm)}</span>
  </div>
</article>`.trim();
}

function posterFit() {
  const p = $('.lb .poster');
  if (!p) return;
  const st = p.parentElement;
  const wr = st.parentElement;
  const H = wr.clientHeight - 8;
  let W = Math.min(wr.clientWidth, 540);
  st.style.width = W + 'px';
  for (let i = 0; i < 4; i++) {
    const h = p.offsetHeight;
    if (h <= H) break;
    W = Math.max(150, (W * H) / h * 0.99);
    st.style.width = W + 'px';
  }
}

addEventListener('resize', () => {
  if (lb && !lb.hidden && lb.classList.contains('po')) posterFit();
});

function palOf(p) {
  if (!p || p.dataset.pal !== 'auto') return;
  p.dataset.pal = 'done';
  const im = $('.pcv img', p);
  const sw = $('.psw', p);
  const go = () => {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 40;
      const x = c.getContext('2d');
      x.drawImage(im, 0, 0, 40, 40);
      const d = x.getImageData(0, 0, 40, 40).data;
      const m = {};
      for (let i = 0; i < d.length; i += 4) {
        const k = (d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5);
        const e = m[k] || (m[k] = { n: 0, r: 0, g: 0, b: 0 });
        e.n++;
        e.r += d[i];
        e.g += d[i + 1];
        e.b += d[i + 2];
      }
      const out = [];
      for (const e of Object.values(m).sort((a, b) => b.n - a.n)) {
        const q = [(e.r / e.n) | 0, (e.g / e.n) | 0, (e.b / e.n) | 0];
        if (out.every(o => Math.abs(o[0] - q[0]) + Math.abs(o[1] - q[1]) + Math.abs(o[2] - q[2]) > 90)) {
          out.push(q);
        }
        if (out.length === 5) break;
      }
      sw.innerHTML = out.map(q => `<i style="background:rgb(${q})"></i>`).join('');
    } catch (_) {}
  };
  if (im.complete) go();
  else im.addEventListener('load', go);
}

function posterPal() {
  $$('.poster[data-pal=auto]').forEach(palOf);
}

let touchExitState = null;
document.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) {
    touchExitState = null;
    return;
  }
  const t = e.touches[0];
  const pk = document.querySelector('.lb.pk');
  const isLbOpen = lb && !lb.hidden;
  const isFsWall = $('.wallw.fs');
  const isOvOpen = Boolean(ovEl && ovEl.isConnected && !ovEl.classList.contains('out'));

  if (pk) {
    const panel = pk.querySelector('.panel');
    const isAtTop = !panel || panel.scrollTop <= 6;
    touchExitState = {
      type: 'pk',
      el: pk,
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isAtTop
    };
  } else if (isOvOpen && e.target.closest('.vfs, .afs, .cvp')) {
    const isAtTop = !ovEl || ovEl.scrollTop <= 10;
    touchExitState = {
      type: 'ov',
      el: ovEl,
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isAtTop
    };
  } else if (isLbOpen && e.target.closest('.lb')) {
    const isWr = lb.classList.contains('wr');
    const panel = $('.panel', lb);
    const isAtTop = !isWr || (lb.scrollTop <= 10 && (!panel || panel.scrollTop <= 10));
    touchExitState = {
      type: 'lb',
      el: lb,
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isAtTop
    };
  } else if (isFsWall && !e.target.closest('.wi')) {
    touchExitState = {
      type: 'wallfs',
      el: isFsWall,
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isAtTop: true
    };
  } else if (cur === 'other' && sp > 0 && !e.target.closest('input, select, textarea, iframe')) {
    touchExitState = {
      type: 'otherfolder',
      el: BK,
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isAtTop: true
    };
  } else {
    touchExitState = null;
  }
}, { passive: true });

document.addEventListener('touchmove', e => {
  if (!touchExitState || e.touches.length !== 1) return;
  const t = e.touches[0];
  touchExitState.lastX = t.clientX;
  touchExitState.lastY = t.clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!touchExitState) return;
  const state = touchExitState;
  touchExitState = null;

  const endX = state.lastX ?? (e.changedTouches[0] ? e.changedTouches[0].clientX : state.x);
  const endY = state.lastY ?? (e.changedTouches[0] ? e.changedTouches[0].clientY : state.y);
  const dx = endX - state.x;
  const dy = endY - state.y;
  const dt = Date.now() - state.time;
  const winW = window.innerWidth;

  const isSwipeDown = (dy > 48 && dy > Math.abs(dx) * 0.7) || (dy > 30 && dt < 240 && dy > Math.abs(dx));
  const isSwipeRight = (dx > 50 && dx > Math.abs(dy) * 0.7) || (dx > 30 && dt < 240 && dx > Math.abs(dy));
  const isSwipeLeftEdge = (state.x >= winW - 80 && dx < -35) || (dx < -55 && Math.abs(dx) > Math.abs(dy) * 0.75);

  const shouldExit = (isSwipeDown && state.isAtTop) || isSwipeRight || isSwipeLeftEdge;

  if (state.type === 'pk' && shouldExit) {
    const m = state.el;
    if (m && m.parentNode) {
      m.classList.add('closing');
      setTimeout(() => { if (m.parentNode) m.remove(); }, 160);
    }
  } else if (state.type === 'ov' && shouldExit) {
    ovClose(true);
  } else if (state.type === 'lb' && shouldExit) {
    if (state.el && state.el.classList.contains('fs')) fsOn(false);
    else close(true);
  } else if (state.type === 'wallfs' && shouldExit) {
    wallFs(false);
  } else if (state.type === 'otherfolder' && (isSwipeRight || isSwipeLeftEdge)) {
    g = null;
    if (history.state && history.state.fromOtherParent) {
      try { history.back(); } catch (_) { go('other', 0); }
    } else {
      go('other', 0);
    }
  }
}, { passive: true });


// Hover interaction linking left-page album list to right-page folder cards
document.addEventListener('pointerover', e => {
  const item = e.target.closest && e.target.closest('.alb-item[data-album]');
  if (item) {
    const idx = item.dataset.album;
    const fold = document.querySelector(`.folders .fold[data-album="${idx}"]`);
    if (fold) fold.classList.add('fold-hovered');
  }
});
document.addEventListener('pointerout', e => {
  const item = e.target.closest && e.target.closest('.alb-item[data-album]');
  if (item) {
    document.querySelectorAll('.folders .fold.fold-hovered').forEach(f => f.classList.remove('fold-hovered'));
  }
});
