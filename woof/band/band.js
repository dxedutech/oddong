import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Band');
}


/*** module import env.js, btn.js */
((v) => {
	const { x, w, t } = v;

	window.scale = window.scale || 1;
	const cvs = document.querySelector('canvas');

	let wh = { w: 1280, h: 1280 };
	const dpr = window.devicePixelRatio;

	cvs.style.width = `${wh.w}px`;
	cvs.style.height = `${wh.h}px`;
	cvs.width = wh.w * dpr;
	cvs.height = wh.h * dpr;

	const ctx = cvs.getContext('2d');

	let xy = { x: 35 * dpr, y: 30 * dpr, r: 16 * dpr, o: 16, d: 81 * dpr };
	let dots = [];
	let leng = xy.o * 16;

  // ctx.beginPath();
  let circle = new Path2D();
  for (let i = 0; i < leng; i++) {
    let x = (i % xy.o) * xy.d + xy.x;
    let y = parseInt(i / xy.o) * xy.d + xy.y;
    circle.moveTo(x + xy.r, y);
    circle.arc(x, y, xy.r, 0, 2 * Math.PI, false);
    dots.push({ x: x, y: y, r: xy.r, cc: true });
  }
  ctx.fillStyle = 'green';
  ctx.fill(circle);
  ctx.lineWidth = 4 * dpr;
  ctx.strokeStyle = 'pink';
  ctx.stroke(circle);

  const drawTangents = (p1, p2) => {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= Math.abs(p2.r - p1.r)) return;

    let a1 = Math.atan2(dy, dx);
    let a2 = Math.acos((p1.r - p2.r) / dist);

    let line = new Path2D();
    if (p1.cc) line.moveTo(p1.x + p1.r * Math.cos(a1 + a2), p1.y + p1.r * Math.sin(a1 + a2));
    else line.moveTo(p1.x + p1.r * Math.cos(a1 - a2), p1.y + p1.r * Math.sin(a1 - a2));

    if (p2.cc) line.lineTo(p2.x + p2.r * Math.cos(a1 + a2), p2.y + p2.r * Math.sin(a1 + a2));
    else line.lineTo(p2.x + p2.r * Math.cos(a1 - a2), p2.y + p2.r * Math.sin(a1 - a2));

    ctx.stroke(line);
  };

  const isIn = (p1, p2, p3, p) => {
    /// barycentric coordinates
    let b1 = ((p2.y - p3.y) * (p.x - p3.x) + (p3.x - p2.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
    let b2 = ((p3.y - p1.y) * (p.x - p3.x) + (p1.x - p3.x) * (p.y - p3.y)) / ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
    let b3 = 1.0 - b1 - b2;

    return b1 > 0 && b2 > 0 && b3 > 0;
  };

  const clockwise = (p1, p2, p3) => {
    let r1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    let r2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let r0 = Math.abs(r2 - r1);

    let r = r2 - r1 < 0 ? true : false;
    r = r0 > Math.PI ? !r : r;
    r = r0 == 0 || r0 == Math.PI ? p1.cc : r;

    return r;
  };

  const setTangents = (a) => {
    let l = a.length - 1;
    
    a.forEach((e, i) => {
      let r = false;
      let i1 = (i + 1) % a.length;
      let i2 = (i + 2) % a.length;

      r = clockwise(a[i], a[i1], a[i2]);
      a[i1].cc = r;
    });

    a.forEach((e, i) => {
      let r = false;
      let i1 = (i + 1) % a.length;
      let i2 = (i + 2) % a.length;

      r = clockwise(a[i], a[i1], a[i2]);
      a[i1].cc = r;

      drawTangents(a[i], a[i1]);
    });
  };

  let dotsClick = [];
  cvs.addEventListener('mousedown', (e) => {
    t.r = cvs.getBoundingClientRect();

    // env.js에서 계산된 scale 비율(x.envm.r)을 나누어 줍니다.
    // main이 scale(0.5)로 축소되었다면 마우스 이동 거리도 2배로 늘려 원본(1280x1280) 좌표계로 복원합니다.
    t.s = (x.envm && x.envm.r) ? x.envm.r : 1;

    // 원본 CSS 좌표계 기준에 dpr을 곱해 캔버스 내부 물리 해상도 좌표로 변환
    t.x = ((e.clientX - t.r.left) / t.s) * dpr;
    t.y = ((e.clientY - t.r.top) / t.s) * dpr;

    // 시작 여백(xy.x, xy.y)을 빼고 간격(xy.d)으로 나눈 뒤 반올림(Math.round)
    t.col = Math.round((t.x - xy.x) / xy.d);
    t.row = Math.round((t.y - xy.y) / xy.d);

    // 격자 범위 체크 (가로 xy.o 칸 기준)
    if (t.col >= 0 && t.col < xy.o && t.row >= 0 && t.row < (leng / xy.o)) {
      t.n = t.col + xy.o * t.row;
      t.dot = dots[t.n];

      if (t.dot) {
        // 실제 원 내부 클릭 여부 판정 (반지름 비교)
        v.dx = t.x - t.dot.x;
        v.dy = t.y - t.dot.y;
        v.di = Math.sqrt(v.dx * v.dx + v.dy * v.dy);

        if (v.di <= t.dot.r) {
          console.log(`dot index: ${t.n}, col: ${t.col}, row: ${t.row}`);

          if (dotsClick.indexOf(t.n) < 0) {
            dotsClick.push(t.n);
          } else {
            let d = [];
            dotsClick.forEach((e) => d.push(dots[e]));
            if (d.length > 1) setTangents(d);
            dotsClick = [];
          }
        }
      }
    }
  });



	(async () => {

		await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
		x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

		const frameu = (v) => {
	
			requestAnimationFrame(() => frameu({}));
		};
		frameu({});

		await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });
		
	})();
})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, t: {}});

/*** .so.btns */
const btnstoto = {
	playu: (v) => {
		const { e } = v;

		v.c = e.className.match(/on/) ? 'none' : 'block';
		e.classList.toggle('on');

		loy.mainu({});
	},
};