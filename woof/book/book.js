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
fb.count = 26; /// Must be even - 0,1 2,3 4,5 6,7 8,9 10,11 ... 26 /// 26 page, 13 sheet 
fb.skip = 5;
fb.color = [];
fb.img = [];
fb.xy = { x: 0, y: 0 };
fb.wh = { w: 560, h: 720 };
fb.pivot = { x: cvs.wh.w * 0.5, y: (cvs.wh.h - fb.wh.h) * 0.5 + fb.wh.h, pow: 0};
fb.mark = [];
fb.ps = []; /// Array pages

const fbp = function () { /// Flip Book Page
  this.img = [];
  this.xy = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  this.wh = [{ w: 0, h: 0 }, { w: 0, h: 0 }];
  this.c = [0, 0];
  this.r = [0, 0];
  this.str = ['', ''];
};

/// a- animal, h- human, s- story, i- icon
const codes = { /// must even not odd
  alphabet: { code: 0x0041, curr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  hangeul: { code: 0xAC00, curr: [1, 1176, 588, 1176, 588, 588, 1176, 1176, 588, 1176, 588, 588, 588, 588] },
  aland: { code: 0xAC34, curr: [1, 1, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1] },
  amarine: { code: 0xAC55, curr: [1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3] },
  asky: { code: 0xAC73, curr: [1, 2, 1, 3, 2, 1, 1, 1, 1, 3, 5, 1, 5, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3] },
  sarthur: { code: 0xACA2, curr: [1, 1, 1, 1, 1, 1, 4, 2, 1, 3, 1, 1, 1, 1, 1, 1, 3, 4, 1, 1, 2, 1, 2, 1, 1, 2] },
  ichess: { code: 0x0411, curr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  curr: 'aland',
};

const names = { /// must even not odd
  alphabet: { curr: [] },
  hangeul: { curr: [] },
  aland: { curr: ["Armadillo(아르마딜로)", "Bear(베어)", "Camel(카멜)", "Dog(도그)", "Elephant(엘리펀트)", "Ferret(페럿)", 
    "Giraffe(지라프)", "Hamster(햄스터)", "Impala(임팔라)", "Jerboa(저보아)", "Kangaroo(캥거루)", "Lion(라이언)", "Monkey(멍키)", 
    "Nutria(뉴트리아)", "Otter(오터)", "Porcupine(포큐파인)", "Quokka(쿼카)", "Rhinoceros(라이노세로스)", "Sheep(쉽)", "Tiger(타이거)", 
    "Unau(우나우)", "Vervet(버빗)", "Wolf(울프)", "Xerus(저루스)", "Yak(야크)", "Zebra(제브라)"] },
  amarine: { curr: ["Anchovy(앤초비)", "Blowfish(블로우피쉬)", "Cuttlefish(커틀피쉬)", "Dolphin(돌핀)", "Eel(일)", "Flyingfish(플라잉피쉬)", 
    "Great White Shark(그레이트 화이트 샤크)", "Harp Seal(하프 씰)", "Icefish(아이스피쉬)", "Jellyfish(젤리피쉬)", "Kelp(켈프)", "Lobster(랍스터)", 
    "Mermaid(머메이드)", "Nautilus(노틸러스)", "Octopus(옥토퍼스)", "Octopus(옥토퍼스)", "Queensland Mud Crab(퀸즈랜드 머드 크랩)", "Ray(레이)", "Seahorse(시호스)", 
    "Turtle(터틀)", "Urchin(얼친)", "Viperfish(바이퍼피쉬)", "Whale(웨일)", "Xiphosura(자이포수라)", "Yellow Tang(옐로우 탱)", "Ziebell's Handfish(지벨스 핸드피쉬)"] },
  asky: { curr: ["Albatross(알바트로스)", "Buzzard(버저드)", "Crow(크로우)", "Duck(덕)", "Emu(이뮤)", "Flamingo(플라밍고)", "Goose(구스)", "Hummingbird(허밍버드)", 
    "Ibis(아이비스)", "Jay(제이)", "Kiwi(키위)", "Loon(룬)", "Macaw(마코)", "Nuthatch(너해치)", "Owl(아울)", "Pelican(펠리컨)", "Quail(퀘일)", "Rooster(루스터)", 
    "Swan(스완)", "Toucan(투칸)", "Ural owl(우랄 아울)", "Vulture(벌처)", "Woodpecker(우드페커)", "Xolmis(졸미스)", "Yellowlegs(옐로우레그스)", "Zoothera(주세라)"] },
  sarthur: { curr: ["Armor(아머)", "Bow(보우)", "Clover(클로버)", "Diamond(다이아몬드)", "Elf(엘프)", "Fox(폭스)", "Griffon(그리폰)", "Heart(하트)", "Imp(임프)", 
    "Jack(잭)", "King(킹)", "Lance(랜스)", "Man(맨)", "Nurse(너스)", "Owl(아울)", "Palace(팰리스)", "Queen(퀸)", "Rider(라이더)", "Spade(스페이드)", "Torch(토치)", 
    "Uniform(유니폼)", "Vase(베이스)", "Woman(우먼)", "Xiphoid(지포이드)", "Yacht(요트)", "Zombie(좀비)"] },
  ichess: { curr: [] },
};

fb.count = codes[codes.curr].curr.length;

const str = { code: 0x0041 + fb.count - 1, fs: 312, ff: '', align: 'center', xy: { x: 0, y: 0 } }; // Unicode U+0041 = 'A'
const cnt = codes[codes.curr].curr.reduce((n, i) => n + i, 0);
str.code = codes[codes.curr].code + cnt - 1; /// max unicode

const name = names[codes.curr]?.curr; /// naming
const nodes = document.querySelectorAll('.sheet.fgs>div>p');
if (name && name.length, name) {
  if (nodes[1]) nodes[1].innerText = '';
  if (nodes[2] && name[0]) nodes[2].innerText = name[0];
  else nodes[2].innerText = '';
} else {
  if (nodes[1]) nodes[1].innerText = '';
  if (nodes[2]) nodes[2].innerText = '';
}

// const str = { code: 0x0041 + fb.count - 1, fs: 384, ff: '', align: 'center', xy: { x: 0, y: 0 } }; // Unicode U+0041 = 'A'
/// const str = { code: 65 + fb.count - 1, fs: 384, ff: '', align: 'center', xy: { x: 0, y: 0 } }; // ASCII Characters code number 65 = A
str.ff = `${str.fs}px PlayTangram`;
str.xy.x = fb.wh.w * 0.5;
str.xy.y = fb.wh.h * 0.5 + str.fs * 0.25;

const pos = { xy: [{ x: 0, y: 0 }, { x: 0, y: 0 }], on: false, g: 0.8 }; /// Mouse position
const getpow = (dx, dy) => { return dx * dx + dy * dy; };
fb.pivot.pow = getpow(fb.wh.w, 0);

/* Event position */
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

  const name = names[codes.curr]?.curr; /// Naming
  const nodes = document.querySelectorAll('.sheet.fgs>div>p');
  if (name && name.length, name) {
    if (nodes[1] && name[fb.page + 1]) nodes[1].innerText = name[fb.page + 1];
    else nodes[1].innerText = '';
    if (nodes[2] && name[fb.page + 2]) nodes[2].innerText = name[fb.page + 2];
    else nodes[2].innerText = '';
  }
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

/* Draw */
const setfill = c => (ctx.fillStyle = `rgba(${c}, ${c}, ${c}, 0.4)`);
const setrect = (xy, wh) => ctx.fillRect(xy.x, xy.y, wh.w, wh.h);

const setdraw = a => {
  const { c, t, xy, wh } = a;

  ctx.fillStyle = `#${c}`;
  setrect(xy, wh);
  setfill(0);
  ctx.fillText(t, str.xy.x + xy.x, str.xy.y + xy.y);
};

const setimg = a => {
  const { n } = a;

  let i = 0;
  for (i = 0; i < 100; i = i * 10 + Math.random()*4 + 5);
  i -= i % 1; // parseInt
  fb.ps[0].c[0] = i;

  const uni = (n === 0) ? 0 : codes[codes.curr].curr.slice(-n).reduce((acc, curr) => acc + curr, 0);
  const t = String.fromCharCode(str.code - uni); /// max unicode - prev unicode...
  fb.ps[0].str[0] = t;

  setdraw({ c: i, t: t, xy: fb.ps[0].xy[0], wh: fb.ps[0].wh[0] });
};

/* Position of mouse */
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

        if (Math.abs(pos.xy[1].x) < 1 && pos.xy[1].y < 1) {
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
        }

      } else { /// Cancel Flip
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

/* Sheet */
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
     
    /** Current sheet front page: A */
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
    
    /** Current sheet back page: B */
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

/*** Frame */
(async (v) => {
	const { x, w } = v;

	ctx.font = str.ff;
	ctx.textAlign = str.align;
	ctx.save();

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


	await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
	x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

	setframe({});

	await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, });

/*** .btns */
const btnsflipbook = {
	alphabetu: (v) => btnon(v),
  hangeulu: (v) => btnon(v),
  alandu: (v) => btnon(v),
  amarineu: (v) => btnon(v),
  askyu: (v) => btnon(v),
  sarthuru: (v) => btnon(v),
  ichessu: (v) => btnon(v),
};

const btnon = (v) => {
  const { e } = v;

  v.n = e.className.replace(/btn|fpt|on|\s/g, '');
  const siblings = e.parentElement.children;
  [].forEach.call(siblings, e => e.classList.remove('on'));

  e.classList.add('on');

  codes.curr = v.n;
  const cnt = codes[codes.curr].curr.reduce((n, i) => n + i, 0);
  str.code = codes[codes.curr].code + cnt - 1; /// max unicode

  const name = names[codes.curr]?.curr; /// naming
  const nodes = document.querySelectorAll('.sheet.fgs>div>p');
  if (name && name.length, name) {
    if (nodes[1]) nodes[1].innerText = '';
    if (nodes[2] &&  name[0]) nodes[2].innerText = name[0];
    else nodes[2].innerText = '';
  } else {
    if (nodes[1]) nodes[1].innerText = '';
    if (nodes[2]) nodes[2].innerText = '';
  }

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, cvs.wh.w, cvs.wh.h);

  fb.on = false; /// true, false
  fb.off = 0; /// -1, 0 ,1
  fb.page = 0;
  // fb.count = 26; /// Must be even - 0,1 2,3 4,5 6,7 8,9 10,11 ... 26 /// 26 page, 13 sheet 
  // fb.skip = 5;
  fb.color = [];
  fb.img = [];
  fb.xy = { x: 0, y: 0 };
  // fb.wh = { w: 560, h: 720 };
  // fb.pivot = { x: cvs.wh.w * 0.5, y: (cvs.wh.h - fb.wh.h) * 0.5 + fb.wh.h, pow: 0};
  fb.mark = [];
  fb.ps = []; /// Array pages

  fb.count = codes[codes.curr].curr.length;
}
