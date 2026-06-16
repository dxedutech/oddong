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

cx.fillStyle = 'transparent';
cx.fillStyle = '#000';
cx.fillRect(0, 0, cs.width, cs.height);

const loy = {};
// loy.fu = 'loadu';
loy.fu = 'mainu';
loy.lcm = { l: 1, c: 1, m: 45 }; /* least(minimum), current, most(maximum) */
loy.nda = ['24 29 30 31 35 44', '1 14 16 34 41 44', '4 6 13 17 26 28', '8 9 19 25 41 42',
	'9 18 21 27 44 45', '16 18 20 32 33 39', '4 11 17 22 32 41', '6 13 18 28 30 36',
	'2 22 25 28 34 43', '1 2 15 28 39 45', '3 28 31 32 42 45', '8 10 15 20 29 31',
	'10 15 19 27 30 33', '5 11 25 27 36 38', '5 8 25 31 41 44', '23 26 27 35 38 40',
	'1 7 9 17 27 38', '2 17 20 35 37 39', '6 27 30 36 38 42', '10 22 24 27 38 45',
	'1 3 17 26 27 42', '1 4 16 23 31 41', '8 16 28 30 31 44', '3 6 18 29 35 39',
	'5 12 21 33 37 40', '7 9 24 27 35 36', '1 2 4 16 20 32', '16 24 25 30 31 32',
	'26 30 33 38 39 41', '1 5 7 26 28 43', '8 12 15 29 40 45', '3 15 17 33 34 36',
	'3 13 15 24 33 37', '6 9 16 19 24 28', '10 16 23 36 39 40', '1 4 11 12 20 41',
	'7 9 19 23 26 45', '9 19 29 35 37 38', '3 4 12 19 22 27', '5 13 26 29 37 40',
	'2 8 13 16 23 28', '6 17 22 28 29 32', '14 16 23 25 31 37', '4 15 17 23 27 36',
	'1 13 21 25 28 31', '8 10 14 20 33 41', '6 12 18 37 40 41', '3 16 18 24 40 44',
]; /* numbers drawn */
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

loy.c = 20;

loy.mainu = (v) => {
	const {} = v;
	
	if(loy.c) {
		loy.c--;
		loy.playu({ c: loy.c });
	}
	window.requestAnimationFrame(() => loy.mainu({}));
};

loy.playu = (v) => {
	const { c } = v;

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
	loy.nda.forEach((e) => {
		e.split(' ').forEach((e) => {
			loy.balls.push(
				new loy.ball({
					i: e,
					t: { x: 0, y: 0, w: 0, h: 0, r: 0, c: '#000' },
					f: 1.0,
				}),
			);
		});
	});

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

	loy.balls.forEach((e) => {
		const n = loy.setu({ l: 0.0, m: 1.0 }) - 1;
		loy.cnt[n]++;
	});

	loy.wins.forEach((e, i) => {
		const max = Math.max(...loy.cnt);
		const maxIndex = loy.cnt.indexOf(max);
		loy.wins[i] = maxIndex + 1;
		loy.cnt[maxIndex] = 0;
	});
	const ns = loy.wins.sort((a, b) => a - b);

	cx.textAlign = 'left';
	cx.font = '32px Arial';
	cx.textBaseline = 'ideographic';
	cx.fillStyle = '#fff';
	cx.fillText(ns, 50, 100 + (c*50));

};

if (document.readyState === 'complete') loy[loy.fu]({});
else window.addEventListener('load', (e) => loy[loy.fu]({}));


/*** module import env.js, btn.js */
((v) => {
	const { x, w } = v;

	(async () => {

		await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
		x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

		await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

	})();
})({ x: dx.hex, w: { r: 1, wh: { w: 1280, h: 1280 } }, });

