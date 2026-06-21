import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Toto');
}

const cs = document.querySelector('canvas');
const cx = cs.getContext('2d');
cs.width = 1280;
cs.height = 1280;

cx.textAlign = 'left';
cx.font = '32px Arial';
cx.textBaseline = 'ideographic';
cx.maxWidth = cs.width;
cx.height = cs.height;

// cx.fillStyle = 'transparent';
// cx.fillRect(0, 0, cs.width, cs.height);
cx.clearRect(0, 0, cs.width, cs.height);

const loy = {};
loy.lcm = { l: 1, c: 1, m: 45 }; /* least(minimum), current, most(maximum) */
loy.now = { d: '', r: 0, s: 0, n: '' }; /// day, recent, start, numbers
loy.weeks = 24; /// 4*2, 4*3, 4*4, 4*5, 4*6 다섯번의 범위 변경 
loy.run = [];
loy.nda = [];
// loy.nda = [
// 	'24 29 30 31 35 44', '1 14 16 34 41 44', '4 6 13 17 26 28', '8 9 19 25 41 42',
// 	'9 18 21 27 44 45', '16 18 20 32 33 39', '4 11 17 22 32 41', '6 13 18 28 30 36',
// 	'2 22 25 28 34 43', '1 2 15 28 39 45', '3 28 31 32 42 45', '8 10 15 20 29 31',
// 	'10 15 19 27 30 33', '5 11 25 27 36 38', '5 8 25 31 41 44', '23 26 27 35 38 40',
// 	'1 7 9 17 27 38', '2 17 20 35 37 39', '6 27 30 36 38 42', '10 22 24 27 38 45',
// 	'1 3 17 26 27 42', '1 4 16 23 31 41', '8 16 28 30 31 44', '3 6 18 29 35 39',
// 	'5 12 21 33 37 40', '7 9 24 27 35 36', '1 2 4 16 20 32', '16 24 25 30 31 32'
// ]; /* numbers drawn */

loy.cnt = [];
loy.wins = [];

loy.balls = [];
loy.ball = class {
	constructor(v) {
		const { i, t, f } = v;

		this.i = i; /// idex
		this.t = t; /// trans
		this.f = f; /// frequency
	}
};

const container = document.querySelector('.sheet.fgs>div'); // 클래스 사이 공백은 '.'으로 연결
if (container) {
	for (let i = 0; i < loy.lcm.m; i++) {
		container.insertAdjacentHTML('beforeend', `<div><p>${i + 1}</p></div>`);
	}
}

loy.mainu = (v) => {
	const {} = v;
	
	loy.shuffleu({});
};

loy.shuffleu = (v) => {
	const { } = v;

	/// Basic Balls
	loy.cnt = [];
	loy.wins = [0, 0, 0, 0, 0, 0];

	for (let i = 0; i < loy.lcm.m; i++) {
		loy.cnt.push(0);
		loy.balls.push(
			new loy.ball({
				i: `${i + 1}`,
				t: { x: 0, y: 0, w: 0, h: 0, r: 0, c: '#000' },
				f: 1.0,
			}),
		);
	}

	/// numbers drawn
	Array.from(loy.run).forEach((e) => {
		Array.from(e.split(' ')).forEach((e) => {
			loy.balls.push(
				new loy.ball({
					i: e,
					t: { x: 0, y: 0, w: 0, h: 0, r: 0, c: '#000' },
					f: 1.0,
				}),
			);
		});
	});
	loy.run.splice(loy.weeks);

	loy.setu = (v) => {
		const { l, m } = v; /// least, most

		v.f = Math.random() * (m - l) + l;
		v.dr = v.f * 100.0; /// 0.0 ~ 100.0

		v.rate = 0.0;
		for (let i = 0; i < loy.balls.length; i++) {
			v.rate += (loy.balls[i].f * 100) / loy.balls.length;
			v.num = loy.balls.length - 1 - i;
			if (v.dr <= v.rate) return parseInt(loy.balls[v.num].i);
		}
	};

	Array.from(loy.balls).forEach((e) => {
		const n = loy.setu({ l: 0.0, m: 1.0 }) - 1;
		loy.cnt[n]++;
	});

	Array.from(loy.wins).forEach((e, i) => {
		const max = Math.max(...loy.cnt);
		const maxIndex = loy.cnt.indexOf(max);
		loy.wins[i] = maxIndex + 1;
		loy.cnt[maxIndex] = 0;
	});
	const ns = loy.wins.sort((a, b) => a - b);

	const checknums = document.querySelector('.sheet.fgs>div').children;
	Array.from(checknums).forEach((e, i) => {
		if (ns.includes(i + 1)) e.classList.add('on');
		else e.classList.remove('on');
	});

	cx.clearRect(0, 0, cs.width, cs.height);

	cx.textAlign = 'left';
	cx.font = '32px';
	cx.textBaseline = 'ideographic';
	cx.fillStyle = '#fff';
	cx.fillText(`${ns} weeks: ${loy.weeks}`, 50, 100);

	loy.weeks = loy.weeks - 4; // 24, 20, 16, 12, 8
	if (loy.weeks < 8) {
		loy.weeks = 24;
		loy.run = [...loy.nda];
	}
};

/*** module import env.js, btn.js */
((v) => {
	const { x, w } = v;

	(async (v) => {
		const {} = v;
		v.url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do`;
		
		try {
			v.res = await fetch(v.url);
			v.j = await v.res.json();
			v.d = v.j.data.list[0];

			loy.now.d = v.d.ltRflYmd;
			loy.now.r = parseInt(v.d.ltEpsd);
			loy.now.s = loy.now.r - loy.weeks;
			// loy.now.n = `${v.d.tm1WnNo} ${v.d.tm2WnNo} ${v.d.tm3WnNo} ${v.d.tm4WnNo} ${v.d.tm5WnNo} ${v.d.tm6WnNo}`;

			// if (loy.nda[0].replace(/\s/g, '') !== loy.now.n.replace(/\s/g, '')) loy.nda.unshift(loy.now.n);
			// if (loy.nda.length > loy.weeks) loy.run = loy.nda.splice(loy.weeks); 

		} catch (err) {
			console.error("API 요청 오류:", err);
			return;
		}

		try {
			v.res = await fetch(`${v.url}?srchStrLtEpsd=${loy.now.s}&srchEndLtEpsd=${loy.now.r}`);
			v.j = await v.res.json();
			// v.d = v.j.data.list;

			loy.nda = v.j.data.list.map(e => `${e.tm1WnNo} ${e.tm2WnNo} ${e.tm3WnNo} ${e.tm4WnNo} ${e.tm5WnNo} ${e.tm6WnNo}`);
			loy.run = [...loy.nda]; 
			loy.mainu({});
		} catch (err) {
			console.error("API 요청 오류:", err);
		}

	})({});


	(async () => {

		await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
		x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

		const frameu = (v) => {
			const {} = v;

			if (x.btnm) {
				if (Object.keys(x.btnm.evt).length) {
					if (x.btnm.evt.s) {
						if (x.btnm.evt.o === 'btnstoto') btnstoto[x.btnm.evt.s]({ e: x.btnm.evt.e });
		
						delete x.btnm.evt.o;
						delete x.btnm.evt.s;
						delete x.btnm.evt.e;
					}
				}
				/// [`${v.s}u`]({e: v.e});
			}

			requestAnimationFrame(() => frameu({}));
		};
		frameu({});

		await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });
		
	})();
})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, });

/*** .so.btns */
const btnstoto = {
	playu: (v) => {
		const { e } = v;

		v.c = e.className.match(/on/) ? 'none' : 'block';
		e.classList.toggle('on');

		loy.mainu({});
	},
};