import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Eng Tracing');
}


/*** Canvas */
document.body.style['overscroll-behavior'] = 'contain';
document.body.style.overflow = 'hidden';

const canvas = function(v) {
  const { w, h, c } = v;
  
  document.body.style.width = w;
  document.body.style.width = h;
  // document.body.style['background-color'] = c;

  this.el = document.querySelector('canvas');
  this.el.style.position = 'absolute';
  this.el.style.left = '50%';
  this.el.style.top = '50%';
  this.el.style.transform = 'translate(-50%,-50%)';
  this.el.style.width = `${w}px`;
  this.el.style.height = `${h}px`;
  this.el.style['background-color'] = c;
  

  this.el.width = w;
  this.el.height = h;
  
  this.wh = {w: w, h: h};
};
const cv = new canvas({ w: 1280, h: 1280, c: '#ddd' });
const cx = cv.el.getContext('2d');

/*** Content */
const content = function() {
  this.tps = { ss: [], len: 0, dis: 16, thick: 64, sdr: 0 }; /// Tracing PositionS
  this.ss = { s: { x: 0, y: 0 }, len: 0, cnt: 0 } /// strke Start, LENgth, CouNT
  this.as = { str: [], len: 0, cnt: 0 }; /// Alphabet STRing: ['a', 'l', 'p', ...], LENgth, CouNT
  this.tas = {}; /// array Tracing AlphabetS - svg data
  
  this.setclear = v => {
    const { c } = v;
    
    cx.clearRect(0, 0, cv.wh.w, cv.wh.h)
    cx.fillStyle = c; // '#999';
    cx.rect(0, 0, cv.wh.w, cv.wh.h);
    cx.fill();
  };
}
const ct = new content();


/*** Mouse or Touch Position */
const getpos = v => {
  const { x, y, wds } = v;
  
  return { 
    x: (x - cv.el.getBoundingClientRect().left)*wds, 
    y: (y - cv.el.getBoundingClientRect().top)*wds
  }
};

const pos = {x: 0, y: 0, on: 0, off: 0, evt: { start: '', move: '', end: '' }};







/*** Style to Json */
const getjson = v => {
  const { type, str } = v;
  
  if(type === 'style'){ /*/ style - 'fill:#fff;stroke-width:0' /*/
    v.r = str.replace(/\s/g, '');
    v.r = `"${v.r}"`;
    v.r = v.r.replace(/:/g, '":"');
    v.r = v.r.replace(/;/g, '","');
    
    const arr = v.r.match(/(?<=\")(.*?)(?=")/g, '$1');
    v.r = '{';
    arr.forEach(e => {
      if (!isNaN(e) || e === ':' || e === ',' || e === 'true' || e === 'false') { v.r += e; }
      else { v.r += `"${e}"`; }
    });
    v.r += '}';
 
  }else{ /*/ text - '{"result":true, "count":42}' /*/
    v.r = str;
  };
  
  return JSON.parse(v.r);
};

const getptp = v => { const { str } = v; }; /// SVG Path to Point

/*** Frame */
((v) => {
	const { x, w, t } = v;

	const setinit = v => {
		const {} = v;
		
		v.el = document.querySelector('.textarea');
		v.xml = v.el.innerHTML;
		
		v.parser = new DOMParser();
		v.svg = v.parser.parseFromString(v.xml, "image/svg+xml");
		
		const ta = {}; /// Tracing Alphabets
		const g = v.svg.querySelectorAll('g');
		g.forEach(e => { 
			const g = e.getAttribute('id'); 
			ta[g] = {};
			ct.as.str.push(g); /// Alphabet Key ['A', 'a',..] - First Path id[0] })
		});

		const arr = v.svg.querySelectorAll('path');
		arr.forEach((e, i) => {
			const k = e.getAttribute('id');
			const s = e.getAttribute('style');
			const r  = getjson({ type:'style', str: s });
			const d = e.getAttribute('d');
			const p = new Path2D(d);
			const a = k.split('|');
			const t = e; /// svg path Tracing
			
			ta[a[0]][a[1]] = { ...ta[a[0]][a[1]], [a[2]]: { p: p, s: r, t: t } };
		});
	
		ct.as.str.forEach(e => { ct.tas[e] = ta[e]; }); /// add Tracing AlphabetS 
		
		ct.as.cnt = 0; /// first AlphabetS
		ct.as.len = ct.as.str.length;
		
		ct.ss.cnt = 1; /// first StrokeS
		ct.ss.len = Object.keys(ct.tas[ct.as.str[ct.as.cnt]]).length;
		
		setmain({});
	};

	const setmain = v => {
		const {} = v;
		
		ct.setclear({ c: '#ccc' }); /// 글자 배경색
		
		cx.save();
		cx.beginPath();
		ct.as.str.forEach(e => { /// 'A', 'B', ...
			const obj = ct.tas[e];
			// cx.lineCap = 'butt'
			Object.keys(obj).forEach((k, i) => {
				if(i){ /// 0: Alphabet, 1~: Stroke
					const t = obj[k].t; /// Tracing shape - path2d
					if(t.s['stroke-width']*10){ /// Tracing Style
						cx.lineWidth = t.s['stroke-width'];
						if (t.s.fill === '#fff') { cx.setLineDash([5, 15]); } else { cx.setLineDash([]); }
						cx.strokeStyle = t.s.stroke;
						cx.stroke(t.p); /// Tracing Path
						
						// console.log(t.p);
					}
					cx.fillStyle = t.s.fill;
					cx.fill(t.p);
				}
			});
		});
		cx.restore();

		const k = ct.as.str[ct.as.cnt];
		const p = ct.tas[k]['l'+ ct.ss.cnt].p; /// Tracing stroke - path2d
		cx.lineWidth = p.s['stroke-width'];
		cx.setLineDash([5, 15]);
		cx.strokeStyle = p.s.stroke;
		cx.stroke(p.p); /// Tracing Path

		const len = ct.tps.ss.length;
		if (pos.on === 1) {
			if(!len){ /// start tracing
				++pos.on;
				const x = p.t.getPointAtLength(0).x;
				const y = p.t.getPointAtLength(0).y;
				ct.tps.ss.push({ x: x, y: y });
				ct.tps.len = parseInt(p.t.getTotalLength()/ct.tps.dis);
				ct.sdr = p.t.getTotalLength()/ct.tps.len; /// Shifting Distance Rate
				
			} else { /// continue tracing
				const x = ct.tps.ss[len - 1].x;
				const y = ct.tps.ss[len - 1].y;
				const d = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
				if (d < ct.tps.dis*3) { ++pos.on; } 
				else { pos.on = 0; }
			}
		}
		
		if (pos.on > 1 && len && len < ct.tps.len) {
			const t = ct.tas[k]['l'+ ct.ss.cnt].t; /// Tracing shape - path2d
			if(pos.on && cx.isPointInPath(t.p, pos.x, pos.y)) {
				const x = ct.tps.ss[len - 1].x;
				const y = ct.tps.ss[len - 1].y;
				const d = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
				if (d > ct.tps.dis) {
					const x = p.t.getPointAtLength(ct.sdr*len).x; /// Shifting Distance x
					const y = p.t.getPointAtLength(ct.sdr*len).y; /// Shifting Distance y
					const dx = p.t.getPointAtLength(ct.sdr*(len + 1)).x;
					const dy = p.t.getPointAtLength(ct.sdr*(len + 1)).y;
					const dd = Math.sqrt(Math.pow(dx - pos.x, 2) + Math.pow(dy - pos.y, 2));
					if(d > dd) {
						ct.tps.ss.push({ x: x, y: y });
					}
				}
			} else {
				
				pos.on = 0;
			}
		}
		
		if (len) {
			cx.save();
			const t = ct.tas[k]['l'+ ct.ss.cnt].t;
			cx.clip(t.p);
		
			if(len > 1){ /// at least two
				cx.setLineDash([]);
				cx.lineWidth = ct.tps.thick;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				cx.strokeStyle = 'red';
				
				cx.beginPath();
				ct.tps.ss.forEach((e, i) => {
					if (i) {
						cx.lineTo(e.x, e.y);
					} else {
						cx.moveTo(e.x, e.y);
					}
				});
				cx.stroke();
			}
			cx.restore();
			
			if (pos.on > 1 && len === ct.tps.len) {
				ct.tas[k]['l'+ ct.ss.cnt].t.s.fill = '#dae';
				ct.ss.cnt = (ct.ss.cnt + 1)%ct.ss.len; /// count strokes - 1 ~
				
				if(!ct.ss.cnt){ /// each alphabets done
					ct.as.cnt = (ct.as.cnt + 1)%ct.as.len; /// count alphabet - 0 ~

					ct.ss.cnt = 1;
					ct.ss.len = Object.keys(ct.tas[ct.as.str[ct.as.cnt]]).length;

					if (!ct.as.cnt) { /// all alphabets done
						ct.as.str.forEach(e => { /// 'A', 'B', ...
							const obj = ct.tas[e];
							Object.keys(obj).forEach(k => { obj[k].t.s.fill = '#fff' });
						});
					}
				}
				
				pos.on = 0;
				ct.tps.ss = [];
			}
		}
		
		if(pos.off){ }
		
		t.s = (x.envm && x.envm.r) ? x.envm.r : 1;

		window.requestAnimationFrame(() =>setmain({}));
	};

	(async () => {

		await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
		x.envm.resizeu({ w: w.wh.w, h: w.wh.h });
	
		pos.evt.start = x.envm.isMobile ? 'touchstart' : 'mousedown';
		pos.evt.move = x.envm.isMobile ? 'touchmove' : 'mousemove';
		pos.evt.end = x.envm.isMobile ? 'touchend' : 'mouseup';

		setinit({});

		cv.el.addEventListener(pos.evt.start, e => {
			e.preventDefault();

			const xy = getpos({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY, wds: x.envm.wds });
			pos.x = xy.x / t.s;
			pos.y = xy.y / t.s;
			pos.on = 1;
			pos.off = 0;
		});

		cv.el.addEventListener(pos.evt.end, e => { pos.off = 1; });

		cv.el.addEventListener(pos.evt.move, e => {
			e.preventDefault();

			const xy = getpos({ x: e.clientX ?? e.touches[0]?.clientX, y: e.clientY ?? e.touches[0]?.clientY, wds: x.envm.wds });
			pos.x = xy.x / t.s;
			pos.y = xy.y / t.s;
		}, { passive: false });

		await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

	})();
	

})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, t: {} });

/*** .btns */
const btnskortyping = {
	copyu: (v) => {
		const { e } = v;

		// v.t = 'sdfdsf';
		navigator.clipboard.writeText(ky.txt)
		.then(() => console.log('텍스트가 클립보드에 복사되었습니다!'))
		.catch(err => console.error('복사 실패: ', err));
	},
};
