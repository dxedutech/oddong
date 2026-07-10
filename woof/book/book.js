import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Flip Book');
}

const cvs = {};
cvs.el = document.querySelector('canvas');
cvs.xy = { x: 0, y: 0 };
cvs.wh = { w: 1280, h: 1280 };
cvs.el.width = cvs.wh.w;
cvs.el.height = cvs.wh.h;

const ctx = cvs.el.getContext('2d');

ctx.fillStyle = '#222';
ctx.fillRect(0, 0, cvs.wh.w, cvs.wh.h);

const fb = {}; /// Flip Book
fb.on = false; /// true, false
fb.off = 0; /// -1, 0 ,1
fb.page = 0;
fb.count = 26; /// must even not odd - 26 page, 13 sheet 
fb.skip = 5;
fb.color = [];
fb.img = [];
fb.xy = { x: 0, y: 0 };
fb.wh = { w: 560, h: 720 };
fb.pivot = { x: cvs.wh.w * 0.5, y: (cvs.wh.h - fb.wh.h) * 0.5 + fb.wh.h, pow: 0};
fb.mark = [];
fb.ps = []; /// Array pages
fb.category = '';

const xml = {};
xml.doc = undefined;
xml.categories = []; /// { id , code, title }
xml.items = []; /// num, curr, size, en, ko, hg, res
xml.curr = [];

const str = { code: undefined, fs: 384, ff: '', align: 'center', xy: { x: 0, y: 0 } }; // code: 0x0041 + fb.count - 1
// str.ff = `${str.fs}px PlayTangram`;
// str.xy.x = fb.wh.w * 0.5;
// str.xy.y = fb.wh.h * 0.5 + str.fs * 0.25;

const fbp = function () { /// Flip Book Page
  this.img = [];
  this.xy = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  this.wh = [{ w: 0, h: 0 }, { w: 0, h: 0 }];
  this.c = [0, 0];
  this.r = [0, 0];
  this.str = ['', ''];
};

const pos = { xy: [{ x: 0, y: 0 }, { x: 0, y: 0 }], on: false, g: 0.8 }; /// Mouse position
const getpow = (dx, dy) => { return dx * dx + dy * dy; };
fb.pivot.pow = getpow(fb.wh.w, 0);

/*** Event position */
cvs.el.addEventListener('mousedown', e => setmousedown(e));
const setmousedown = e => {
  if (pos.on) return;
  if (fb.pivot.pow < getpow(fb.pivot.x - e.offsetX, fb.pivot.y - e.offsetY)) return;
  if (fb.page === fb.ps.length - 1 && fb.pivot.x < e.offsetX) return; /// Last Right none pape
  if (fb.page === 0 && fb.pivot.x > e.offsetX) return; /// First left none page
  
  fb.on = true;
  pos.xy[0].x = pos.xy[1].x = e.offsetX;
  pos.xy[0].y = pos.xy[1].y = e.offsetY;

  if (fb.pivot.x < e.offsetX) { fb.page = fb.page ? fb.page + 1 : fb.page; }
  fb.off = fb.ps[fb.page].xy[0].x === fb.pivot.x ? 1 : -1;
};

cvs.el.addEventListener('mouseup', e => setmouseup(e));
const setmouseup = e => {
  if (!fb.on) return;

  pos.on = true; /// Auto position
  if (fb.page%2 && pos.xy[0].x > pos.xy[1].x || !(fb.page%2) && pos.xy[0].x < pos.xy[1].x) { /// Cancel flip
    pos.xy[0].x = 0;
    pos.xy[0].y = 0;
    
  } else { /// Continue flip - Current mouse position
    pos.xy[1].x = fb.pivot.x + fb.ps[fb.page].wh[0].w*fb.off - pos.xy[1].x;
    pos.xy[1].y = e.offsetY > fb.pivot.y ? fb.pivot.y - 0.1 : e.offsetY;
    pos.xy[1].y = fb.pivot.y - pos.xy[1].y;
  }

  fb.on = false; /// Tracking mouse position
};

cvs.el.addEventListener('mousemove', e => {
  if (pos.on) return;

  if (fb.pivot.pow > getpow(fb.pivot.x - e.offsetX, fb.pivot.y - e.offsetY)) {
    if(fb.page%2 && e.offsetX > fb.pivot.x || !(fb.page%2) && e.offsetX < fb.pivot.x || e.offsetY > fb.pivot.y){
      setmouseup(e);
      
    }else{
      pos.xy[1].x = e.offsetX;
      pos.xy[1].y = e.offsetY;
    }
    
  } else {
    setmouseup(e);
  }
});

/*** Draw */
const setfill = c => (ctx.fillStyle = `rgba(${c}, ${c}, ${c}, 0.4)`);
const setrect = (xy, wh) => ctx.fillRect(xy.x, xy.y, wh.w, wh.h);

const setdraw = a => {
  const { c, t, xy, wh } = a;

  ctx.fillStyle = `#${c}`;
  setrect(xy, wh);
  setfill(0);
  ctx.fillText(t, str.xy.x + xy.x, str.xy.y + xy.y);
};

const setimg = v => {
  const { n } = v;

  v.i = 0;
  for (v.i = 0; v.i < 100; v.i = v.i * 10 + Math.random()*4 + 5);
  v.i -= v.i % 1; // parseInt
  fb.ps[0].c[0] = v.i;

  v.u = (n === 0) ? 0 : xml.curr.slice(-n).reduce((acc, curr) => acc + curr, 0);
  v.s = String.fromCharCode(str.code - v.u); /// max unicode - prev unicode...
  fb.ps[0].str[0] = v.s;

  setdraw({ c: v.i, t: v.s, xy: fb.ps[0].xy[0], wh: fb.ps[0].wh[0] });
};

/*** Position of mouse */
const setpos = a => {
  const { e, n } = a;

  if (!fb.off) return;

  /** Tracking mouse position and flipping */
  if (fb.on) {
    const xy = { x: 0, y: 0 };

    if (fb.off > 0) { xy.x = pos.xy[1].x > e.xy[0].x + e.wh[0].w ? e.wh[0].w - 0.1 : pos.xy[1].x - e.xy[0].x; } 
    else { xy.x = pos.xy[1].x > e.xy[0].x ? pos.xy[1].x - e.xy[0].x : 0.1; }
    xy.y = pos.xy[1].y > e.xy[0].y + e.wh[0].h ? e.wh[0].h - 0.1 : pos.xy[1].y - e.xy[0].y;

    e.xy[1].x = e.wh[0].w*((n + 1)%2) - xy.x*fb.off;
    e.xy[1].y = e.wh[0].h - xy.y;

  /** Continue Flip or Cancel Flip position */
  } else {
    if (Math.abs(fb.off)) { /// Continue Flip
      if (pos.xy[0].x * pos.xy[0].y) {
        pos.xy[1].x = pos.xy[1].x*pos.g;
        pos.xy[1].y = pos.xy[1].y*pos.g;

        const xy = { x: 0, y: 0 };
        xy.x = (fb.pivot.x - e.wh[0].w*fb.off + pos.xy[1].x) - e.xy[0].x;
        xy.y = (fb.pivot.y - pos.xy[1].y) - e.xy[0].y;

        e.xy[1].x = e.wh[0].w*((n + 1)%2) - xy.x*fb.off;
        e.xy[1].y = e.wh[0].h - xy.y;

        if (Math.abs(pos.xy[1].x) < 1 && pos.xy[1].y < 1) { /// Flip DOne
          const osp = fb.page; /// Other Side Page
          fb.page = (fb.page + fb.off)%fb.ps.length;

          const odd = fb.page%2; /// Odd : 1, Even : 0
          fb.ps[osp].xy[0].x = fb.pivot.x - fb.ps[osp].wh[0].w*odd;
          fb.ps[fb.page].xy[0].x = fb.pivot.x - fb.ps[fb.page].wh[0].w*odd;

          fb.ps[fb.page].xy[1].x = 0;
          fb.ps[fb.page].xy[1].y = 0;

          fb.page = odd ? fb.page : fb.page ? fb.page - 1 : fb.page; /// Default odd pages, First page zero

          e.xy[1].x = 0;
          e.xy[1].y = 0;
          fb.off = 0;
          pos.on = false;

          settitle({ p: fb.page }); 
        }

      } else { /// Flip cancel 
        e.xy[1].x = e.xy[1].x*pos.g + 1;
        e.xy[1].y = e.xy[1].y*pos.g + 1;

        if (e.xy[1].x < pos.g*10 + 1 && e.xy[1].y < pos.g*10 + 1) {
          fb.page = fb.page%2 ? fb.page : fb.page ? fb.page - 1 : fb.page; /// Default odd pages, First page zero

          e.xy[1].x = 0;
          e.xy[1].y = 0;
          fb.off = 0;
          pos.on = false;
        }
      }
    }
  }
  setsheet({ n: fb.page });
};

/*** Sheet */
const setsheet = a => {
  const { n } = a;

  ctx.save();
  ctx.clearRect(0, 0, cvs.wh.w, cvs.wh.h);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, cvs.wh.w, cvs.wh.h);

  /** Left page :  & Right page : C */
  const l = fb.ps.length;
  const sp = {}; /// Static Page
  if (Math.abs(fb.off)) {
    sp.l = fb.off > 0 ? fb.ps[(l + n - 1) % l] : fb.ps[(l + n - 2) % l];
    sp.r = fb.off > 0 ? fb.ps[(l + n + 2) % l] : fb.ps[(l + n + 1) % l];
  } else {
    sp.l = fb.ps[(l + n + 1) % l];
    sp.r = fb.ps[(l + n) % l];
  }
  setdraw({ c: sp.l.c[0], t: sp.l.str[0], xy: sp.l.xy[0], wh: sp.l.wh[0] });
  if((Math.abs(fb.off) && n === l - 2) || (Math.abs(fb.off) && n === l - 1)) { /* Doesn't draw 0 page at mouse move - A */ } 
  else { setdraw({ c: sp.r.c[0], t: sp.r.str[0], xy: sp.r.xy[0], wh: sp.r.wh[0] }); }

  /** Current page : */
  if (Math.abs(fb.off)) {
    const fp = fb.ps[n]; /// Front Page
  
    const xy = fp.xy[0];
    const wh = fp.wh[0];

    const dxy = fp.xy[1];
    const dx = (dxy.y*dxy.y*0.5) / dxy.x + dxy.x*0.5;
    const dy = (dxy.x*dxy.x*0.5) / dxy.y + dxy.y*0.5;
     
    /*** Current sheet front page: A */
    ctx.beginPath();
    ctx.translate(xy.x, xy.y);
    
    const w1 = wh.w*((fb.page + 1)%2);
    const w2 = wh.w*fb.off*-1 + wh.w*fb.off*-1*((fb.page)%2);
    ctx.moveTo(w1 + dx*fb.off*-1, wh.h);
    ctx.lineTo(w2, wh.h);
    ctx.lineTo(w2, -wh.h);
    ctx.lineTo(w1, -wh.h);
    ctx.lineTo(w1, wh.h - dy);

    ctx.clip();
    setdraw({ c: fp.c[0], t: fp.str[0], xy: { x: 0, y: 0 }, wh: wh });
    
    /*** Current sheet back page: B */
    const dr = Math.atan2(dxy.y*fb.off, dxy.x)*2;
    const dw = dxy.x*fb.off*-1 + Math.sin(dr)*wh.h;
    const dh = wh.h - dxy.y - Math.cos(dr)*wh.h;
    ctx.translate(wh.w*((fb.page + 1)%2) + dw - Math.cos(dr)*wh.w*(fb.page%2), dh - Math.sin(dr)*wh.w*(fb.page%2));
    ctx.rotate(dr);
    const bp = fb.ps[(n + fb.off)%l]; /// Back page
    setdraw({ c: bp.c[0], t: bp.str[0], xy: { x: 0, y: 0 }, wh: bp.wh[0] });
    
    ctx.restore();
  }
};

/*** Contents */
const setcontent = (v) => {
  const { c } = v;

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, cvs.wh.w, cvs.wh.h);

  fb.on = false; /// true, false
  fb.off = 0; /// -1, 0 ,1
  fb.page = 0;
  fb.color = [];
  fb.img = [];
  fb.xy = { x: 0, y: 0 };
  fb.mark = [];
  fb.ps = []; /// Array pages

  // v.i = Array.from(xml.categories).find(e => e.id === c);
  v.i = Array.from(xml.categories).findIndex(e => e.id === c);

  str.fs = xml.categories[v.i].size;
  str.ff = `${str.fs}px PlayTangram`;
  str.xy.x = fb.wh.w * 0.5;
  str.xy.y = fb.wh.h * 0.5 + str.fs * 0.25;

  ctx.font = str.ff;
	ctx.textAlign = str.align;
	ctx.save();

  xml.items = [];
  xml.curr = [];
  v.e = xml.doc.querySelectorAll('category')[v.i];
  [].forEach.call(v.e.querySelectorAll('item'), e => {
    v.curr = parseInt(e.getAttribute('curr'));
    xml.curr.push(v.curr);
    xml.items.push({ 
      num: parseInt(e.getAttribute('num')), 
      curr: v.curr, 
      size: parseInt(e.getAttribute('size')),
      en: e.querySelector('en').textContent,
      ko: e.querySelector('ko').textContent,
      hg: e.querySelector('hg').textContent,
    });
  });
  
  fb.count = xml.curr.length;
  v.cnt = xml.curr.reduce((n, i) => n + i, 0);
  str.code = Number(v.e.getAttribute('code')) + v.cnt - 1; /// max unicode
};

/*** Title */
const settitle = (v) => {
  const { p } = v;

  v.e = document.querySelectorAll('.sheet.fgs>div>p');
  if( p === 0 ) {

    v.e[1].innerText = '';
    v.e[2].innerText = xml.items[p].hg;

    v.e[5].innerText = '';
    v.e[6].innerText = xml.items[p].ko;

    v.e[9].innerText = '';
    v.e[10].innerText = xml.items[p].en;

    return;
  }

  if( p === xml.curr.length - 1 ) {

    v.e[1].innerText = xml.items[p].hg;
    v.e[2].innerText = '';

    v.e[5].innerText = xml.items[p].ko;
    v.e[6].innerText = '';

    v.e[9].innerText = xml.items[p].en;
    v.e[10].innerText = '';

    return;
  }

  v.p = p%2 ? p : p - 1;
  v.e[1].innerText = xml.items[v.p].hg;
  v.e[2].innerText = xml.items[v.p + 1].hg;

  v.e[5].innerText = xml.items[v.p].ko;
  v.e[6].innerText = xml.items[v.p + 1].ko;

  v.e[9].innerText = xml.items[v.p].en ;
  v.e[10].innerText = xml.items[v.p + 1].en;
};

/*** Frame */
(async (v) => {
	const { x, w } = v;

	const setpage = () => {
		--fb.count;
		const page = new fbp();
		page.xy[0].x = fb.pivot.x;
		page.xy[0].y = fb.pivot.y - fb.wh.h;
		page.wh[0].w = fb.wh.w;
		page.wh[0].h = fb.wh.h;

		fb.ps.unshift(page);
		setimg({ n: fb.ps.length - 1 });
	};

	const setframe = (v) => {
		const {} = v;

		if (fb.count) { setpage(); }
		else { setpos({ e: fb.ps[fb.page], n: fb.page }); }

    if (x.btnm) { /// btns
      if (Object.keys(x.btnm.evt).length) {
        if (x.btnm.evt.s) {
          if (x.btnm.evt.o === 'btnsflipbook') btnsflipbook[x.btnm.evt.s]({ e: x.btnm.evt.e });
  
          delete x.btnm.evt.o;
          delete x.btnm.evt.s;
          delete x.btnm.evt.e;
        }
      }
      /// [`${v.s}u`]({e: v.e});
    }

		window.requestAnimationFrame(() => setframe({}));
	};

  /*** Load xml */
  v.f = await x.loadfetchu({ u: `${dx.basePath}/woof/book/rsc/xml/playtangram.xml`, p: '.sheet.fgs' });
  v.e = x[`${v.f.f}u`]({ e: v.f.e, c: v.f.c, p: v.f.p }); /// xmlu, svgu, htmlu...
  xml.doc = v.e.e;
  xml.categories = [];
  v.b = document.querySelector('.sheet.uis .btns.categories');
  [].forEach.call(xml.doc.querySelectorAll('category'), (e, i) => {
    v.i = e.getAttribute('id');
    v.c = e.getAttribute('code');
    v.t = e.getAttribute('title');
    v.z = e.getAttribute('size');
    v.s = String.fromCharCode(parseInt(v.c, 16));
    xml.categories.push({ id: v.i, code: v.c, title: v.t, size: v.z });
    v.o = i === 0 ? `btn ${v.i} fpt on` : `btn ${v.i} fpt`; /// Class
    v.b.insertAdjacentHTML('beforeend', `<button class="${v.o}" js="'obj': 'btnsflipbook', 'fn': 'categoriesu'"><span>${v.t}</span>${v.s}</button>`);
  });
  setcontent({ c: "alphabet" });
  settitle({ p: 0 });

	await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
	x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

	setframe({});

	await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, });

/*** .btns */
const btnsflipbook = {
  menuu: (v) => {
    const { e } = v;

    v.s = e.className.replace(/btn|fpt|on|\s/g, '');
    // console.log(v.s);
  },
  categoriesu: (v) => { 
    const { e } = v;

    v.s = e.className.replace(/btn|fpt|on|\s/g, '');
    const siblings = e.parentElement.children;
    [].forEach.call(siblings, e => e.classList.remove('on'));
    e.classList.add('on');

    setcontent({ c: v.s });
    settitle({ p: 0 }); 
  }
};
