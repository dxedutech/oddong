import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Tangram');
}

const romannuma = [ 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx', ];

const pathparseu = (v) => {
	/* path parser */
	const { d } = v;

	v.m = d.match(/[a-zA-Z](-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g);
	// v.pa = v.m ? v.m.map(e => e.match(/-?\d+(\.\d+)?/g).map(Number) * 1000) : [];
	v.pa = v.m ? v.m.map((e) => e .match(/-?\d+(\.\d+)?/g) .map((num) => Math.round(parseFloat(num) * 100) / 100), ) : [];

	return { pa: v.pa };
};

const pathdu = (v) => {
	/* path d */
	const { pa } = v;

	v.d = pa .map((e, i) => { 
		v.e = [Math.round(e[0] * 100) / 100, Math.round(e[1] * 100) / 100]; return (i === 0 ? 'M' : 'L') + v.e.join(','); 
	}).join(' ') + ' Z';

	return { d: v.d };
};

const distanceu = (v) => {
	const { xy } = v;

	v.dx = xy.cx - xy.sx;
	v.dy = xy.cy - xy.sy;
	return { dx: v.dx, dy: v.dy, d: Math.sqrt(v.dx * v.dx + v.dy * v.dy) };
};

const rotateu = (v) => {
	const { ox, oy, x, y, a } = v;

	v.r = (Math.PI / 180) * a;
	v.c = Math.cos(v.r);
	v.s = Math.sin(v.r);
	v.x = v.c * (x - ox) + v.s * (y - oy) + ox;
	v.y = v.c * (y - oy) - v.s * (x - ox) + oy;

	return [v.x, v.y];
};

const closepointu = (v) => {
	const { a, b } = v;

	v.o = { x: 0, y: 0, d: void 0 }; ///offset
	for (v.a of a) {
		for (v.b of b) {
			v.x = v.a[0] - v.b[0];
			v.y = v.a[1] - v.b[1];
			v.d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
			if (v.d < 11) {
				v.o.x = v.x;
				v.o.y = v.y;
				v.o.d = v.d;
				break;
			}
		}
	}

	return v.o;
};

const parsexmlu = (v) => {
	const { s, t } = v;

	v.p = new DOMParser();
	v.d = v.p.parseFromString(s, 'application/xml');
	v.e = v.d.getElementsByTagName(`${t}`); // 실제 XML 태그명 ul, li ...

	return t ? v.e : v.d;
};

/*** .so.txtctrls */
const txtctrl = {
	addu: (v) => {
		const { e, o, w } = v;

		v.v = document.querySelector('#txtcontent').value;
		if (!v.v.length) return;

		// v.n = Array.prototype.indexOf.call(e.parentNode.children, e);
		// v.b = e.className;

		v.a = document.querySelectorAll('.btn.fixtxt');
		v.b = true;
		v.n = 0;
		[].forEach.call(v.a, (e) => {
			if (e.className.match(/on/)) {
				e.classList.remove('on');
				e.classList.add('off');
			}
			if (v.b && !e.className.match(/off/)) {
				v.b = false;
				e.classList.add('on');
			}
			if (e.className.match(/off/)) ++v.n;
			if (v.n === v.a.length) e.classList.add('on');
		});
		if (v.n > v.a.length - 1) return;

		v.p = document.querySelector('.sheet.fgs .so.tangram svg .tans.txt');
		v.a = v.p.querySelectorAll('text');
		[].forEach.call(v.a, (e) => e.setAttribute('stroke', 'none'));

		v.e = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		v.e.textContent = v.v;
		v.e.setAttribute('x', document.querySelector('#txtx').value);
		v.e.setAttribute('y', document.querySelector('#txty').value);
		v.e.setAttribute('font-size', document.querySelector('#txtsize').value);
		v.e.setAttribute('font-family', document.querySelector('#txtname').value);
		v.e.setAttribute('fill', '#ddd');
		v.e.setAttribute('stroke', '#dae');

		v.p.appendChild(v.e);
		v.e.style.board = '1px solid #dae';
	},
	removeu: (v) => {
		const { e, o, w } = v;

		v.e = document.querySelector('.btn.fixtxt.on');
		if (!v.e) return;

		v.n = Array.prototype.indexOf.call(v.e.parentNode.children, v.e);

		v.a = document.querySelectorAll('.btn.fixtxt');
		v.l = v.a.length - 1;

		v.b = true;
		[].forEach.call(v.a, (e, i) => {
			if (v.a[v.l - i].className.match(/on/)) {
				v.a[v.l - i].classList.remove('on');
				v.a[v.l - i].classList.add('off');
			}

			if (v.b && v.a[v.l - i].className.match(/off/)) {
				v.b = false;
				v.a[v.l - i].classList.remove('off');
			}
		});

		v.a = document.querySelectorAll(
			'.sheet.fgs .so.tangram svg .tans.txt text',
		);
		v.a[v.n].remove();
	},
	editu: (v) => {
		const { e, o, w } = v;

		v.e = document.querySelector('.btn.fixtxt.on');
		if (!v.e) return;

		v.v = document.querySelector('#txtcontent').value;
		if (!v.v.length) return;

		v.n = Array.prototype.indexOf.call(v.e.parentNode.children, v.e);

		v.p = document.querySelector('.sheet.fgs .so.tangram svg .tans.txt');
		v.a = v.p.querySelectorAll('text');
		[].forEach.call(v.a, (e) => e.setAttribute('stroke', 'none'));

		v.e = v.a[v.n];
		v.e.textContent = v.v;
		v.e.setAttribute('x', document.querySelector('#txtx').value);
		v.e.setAttribute('y', document.querySelector('#txty').value);
		v.e.setAttribute('font-size', document.querySelector('#txtsize').value);
		v.e.setAttribute('font-family', document.querySelector('#txtname').value);
		v.e.setAttribute('fill', '#ddd');
		v.e.setAttribute('stroke', '#dae');
		v.e.style.board = '1px solid #dae';
	},
	fixtxtu: (v) => {
		const { e, o, w } = v;

		v.n = Array.prototype.indexOf.call(e.parentNode.children, e);

		v.a = document.querySelectorAll('.btn.fixtxt');
		v.b = e.className;
		[].forEach.call(v.a, (e) => {
			if (e.className.match(/on/)) {
				e.classList.remove('on');
				e.classList.add('off');
			}
		});

		v.a = document.querySelectorAll(
			'.sheet.fgs .so.tangram svg .tans.txt text',
		);
		[].forEach.call(v.a, (e) => e.setAttribute('stroke', 'none'));

		if (v.b.match(/off/)) {
			e.classList.remove('off');
			e.classList.add('on');
			v.a[v.n].setAttribute('stroke', '#dae');

			document.querySelector('#txtcontent').value = v.a[v.n].textContent;
			document.querySelector('#txtx').value = v.a[v.n].getAttribute('x');
			document.querySelector('#txty').value = v.a[v.n].getAttribute('y');
			document.querySelector('#txtsize').value = v.a[v.n].getAttribute('font-size');
			document.querySelector('#txtname').value = v.a[v.n].getAttribute('font-family');
		}
	},
};

/*** .so.btns */
const btnstangram = {
	textu: (v) => {
		const { e, o, w } = v;

		e.classList.toggle('on');
		document.querySelector('.sheet.fgs .so.txtctrls').classList.toggle('on');

		if (e.className.match(/on/)) {
			v.b = document.querySelectorAll(
				'.sheet.fgs .so.txtctrls .btns .btn.fixtxt',
			);
			[].forEach.call(v.b, (e) => {
				e.classList.remove('off');
				e.classList.remove('on');
			});
			v.a = document.querySelectorAll('.sheet.fgs .so.tangram svg .tans.txt text');
			[].forEach.call(v.a, (e, i) => v.b[i].classList.add('off'));
		}
	},
	coloru: (v) => {
		const { e, o, w } = v;

		v.c = e.className.match(/on/) ? '#000' : void 0;
		[].forEach.call(Object.keys(o), (k) =>
			o[k].e.setAttribute('fill', v.c || o[k].fill),
		);
		e.classList.toggle('on');
	},
	pluseu: (v) => {
		const { e, o, w } = v;

		v.c = e.className.match(/on/) ? 'none' : 'block';
		v.e = document.querySelector('.sheet.fgs .so.tangram .tans.xi');
		v.e.style.display = v.c;
		e.classList.toggle('on');
	},
	resetu: (v) => {
		const { e, o, w } = v;

		[].forEach.call(Object.keys(o), (k) => o[k].e.setAttribute('d', o[k].d));
	},
	magneticu: (v) => {
		const { e, o, w } = v;

		v.n = []; /// gride point [[0,0], [128,0]... [1280,1280]]
		for (let i = 0; i < 121; i++) {
			v.x = i % 11;
			v.y = parseInt(i / 11);

			if ((v.x % 10) * (v.y % 10)) {
				v.n.push([v.x * 128, v.y * 128 - 2]);
			}
		}

		v.a = [[], []];
		[].forEach.call(Object.keys(o), (k) => {
			/// gride alignment
			v.d = o[k].e.getAttribute('d');
			if (v.d !== o[k].d) {
				/// o[k].d is init position
				v.o = closepointu({ a: v.n, b: o[k].pa });

				if (v.o.d) {
					if (v.o.d !== 0) {
						v.pa = o[k].pa.map((e) => [e[0] + v.o.x, e[1] + v.o.y]);
						v.r = pathdu({ pa: v.pa });
						o[k].pa = v.pa;
						o[k].e.setAttribute('d', v.r.d);
					}
					if (v.a[0].indexOf(k) < 0) v.a[0].push(k);
				} else {
					if (v.o.d === 0) {
						if (v.a[0].indexOf(k) < 0) v.a[0].push(k);
					} else {
						if (v.a[1].indexOf(k) < 0) v.a[1].unshift(k);
					}
				}
			}
		});

		v.l = document.querySelector('.sheet.fgs .so.tangram .tans.xi').style .display === 'none' ? 7 : 14;
		for (let i = 0; i < v.l; i++) {
			v.a.push([]);
			[].forEach.call(v.a[i + 1], (k) => {
				[].forEach.call(v.a[0], (s) => {
					/// tan-by-tan alignment
					if (k !== s) {
						v.o = closepointu({ a: o[s].pa, b: o[k].pa });

						if (v.o.d) {
							if (v.o.d !== 0) {
								v.pa = o[k].pa.map((e) => [e[0] + v.o.x, e[1] + v.o.y]);
								v.r = pathdu({ pa: v.pa });
								o[k].pa = v.pa;
								o[k].e.setAttribute('d', v.r.d);
							}
							if (v.a[0].indexOf(k) < 0) v.a[0].push(k);
						} else {
							if (v.o.d === 0) {
								if (v.a[0].indexOf(k) < 0) v.a[0].push(k);
							} else {
								if (v.a[i + 2].indexOf(k) < 0) v.a[i + 2].unshift(k);
							}
						}
					}
				});
			});

			if (v.a[0].length === v.l) break;
		}
	},
	gridu: (v) => {
		const { e, o, w } = v;

		v.c = e.className.match(/on/) ? 'none' : 'block';
		v.e = document.querySelector('.sheet.uis .so.gride');
		v.e.style.display = v.c;
		// v.e = document.querySelector('.sheet.bgs .bg-title');
		// v.e.style.display = v.c;

		e.classList.toggle('on');
	},
	printdownloadu: (v) => {
		const { e, o, w } = v;

		v.e = document.querySelector('.sheet.uis .so.modal');
		if (v.e.className.match(/on/)) {
			v.e.classList.remove('on');
			v.e.querySelector('.msgs').innerHTML = '';
		} else {
			v.e.classList.add('on');
			v.s = '<svg width="1280" height="1280" viewbox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg" version="1.1">';
			// [].forEach.call(Object.keys(o), e => {
			//   if(o[e].e.parentNode.style.display !== 'none') v.s += o[e].e.outerHTML;
			// });
			v.s += document.querySelector('.sheet.fgs .so.tangram svg').innerHTML;
			v.s += '</svg>';
			v.e.querySelector('.msgs').innerHTML = v.s;
			[].forEach.call(v.e.querySelectorAll('text'), (e) =>
				e.setAttribute('fill', '#444'),
			);
		}
		e.classList.toggle('on');
	},
	printu: (v) => {
		const { e, o, w } = v;

		const setprintu = (v) => {
			const { e } = v;

			const closeprintu = () => document.body.removeChild(e);

			v.e = e.contentWindow.document;
			v.e.open();
			v.e.write('<html><head><title>ODDGRAM</title>');
			v.e.write('<style>');
			// v.e.write(`
      //   @page { size: A4; margin: 0; @bottom-center { content: "Footer for first page"; } }
      //   @font-face { font-family: "PlayTangram"; src: url("/www/with/fonts/PlayTangram.woff"); }
      //   @font-face { font-family: "baby_bb33"; src: url("/www/with/fonts/baby_bb33.woff"); }
      //   body { margin: 0; padding: 0; }
      //   svg { display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; flex-wrap: wrap; }
      // `);
				v.e.write(`
        @page { size: A4; margin: 0; @bottom-center { content: "Footer for first page"; } }
        body { margin: 0; padding: 0; }
        svg { display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; flex-wrap: wrap; }
      `);
			v.e.write('</style>');
			v.e.write('</head><body>');
			v.e.write(document.querySelector('.so.modal .msgs').innerHTML); // Copy content from the specific element
			v.e.write('</body></html>');
			v.e.close();

			e.contentWindow.onbeforeunload = closeprintu;
			e.contentWindow.onafterprint = closeprintu;
			e.contentWindow.print();
		};

		v.i = document.createElement('iframe');
		v.i.style.position = 'absolute';
		v.i.style.width = '0px';
		v.i.style.height = '0px';
		v.i.style.border = 'none';

		document.body.appendChild(v.i);
		v.i.onload = setprintu({ e: v.i });
	},
	downloadu: (v) => {
		const { e, o, w } = v;

		v.n = e.parentNode.querySelector('textarea').value;
		v.n = v.n.length ? `${v.n}.svg` : '';

		v.s = o['.tan.xi'].e.parentNode.parentNode;
		v.d = new XMLSerializer().serializeToString(v.s);
		v.b = new Blob([v.d], { type: 'image/svg+xml' });

		v.l = document.createElement('a');
		v.l.href = URL.createObjectURL(v.b);
		v.l.download = v.n || 'oddgram.svg';
		v.l.click();

		URL.revokeObjectURL(v.l.href);
	},
};

/*** .so.cards */
const thumbscard = { time: 0, thumb: [] };
const cardu = (v) => {
	const { x, t, b, w } = v;

	const scrollu = (v) => {
		const { e } = v;

		w.r = x.envm.r;
		w.hv = x.envm.hv;

		v.f = t.getBoundingClientRect();
		v.r = e.getBoundingClientRect();

		if (w.hv.h) {
			/// vertical
			if (v.r.top < v.f.top) {
				t.scrollTop -= (v.f.top + 8 - v.r.top) / w.r; /// margin: 8px;
			} else if (v.r.bottom > v.f.bottom) {
				t.scrollTop += (v.r.bottom + 8 - v.f.bottom) / w.r;
			}
		} else {
			if (v.r.left < v.f.left) {
				t.scrollLeft -= (v.f.left + 8 - v.r.left) / w.r; /// margin: 8px;
			} else if (v.r.right > v.f.right) {
				t.scrollLeft += (v.r.right + 8 - v.f.right) / w.r;
			}
		}
	};

	const skiaoramau = (v) => {
		const { e, n } = v;

		v.a = e.parentNode.children;
		v.e = document.querySelector('.sheet.fgs .so.skiaorama');

		if (!document.querySelector('.so.btns .btn.color.on')) {
			v.e.classList.add('invert');
		} else {
			v.e.classList.remove('invert');
		}

		thumbscard.time = n;
		thumbscard.tick = 0;
		thumbscard.thumb = [];
		thumbscard.current = 0;

		if (n > 0) {
			v.e.classList.add('on');
			[].forEach.call(v.a, (e, i) => {
				v.c = e.children[1];
				v.n = ['¼', '½', '¾', '1', '3'].indexOf(e.children[0].innerText);
				v.q = [15, 30, 45, 60, 180][v.n];
				if (v.c.innerText !== 'THUMB' && v.c.innerText !== 'NEW')
					thumbscard.thumb.push([i, v.q]);
			});
			if (!thumbscard.thumb.length) thumbscard.time = 0;
		} else {
			v.e.innerHTML = '';
			v.e.classList.remove('on');
		}
	};

	const btnscard = {
		moveprevu: (v) => {
			const { e } = v;

			if (e && e.previousElementSibling) {
				t.querySelector('ul').insertBefore(e, e.previousElementSibling);
				scrollu({ e: e });
			}
		},
		movenextu: (v) => {
			const { e } = v;

			if (e && e.nextElementSibling) {
				t.querySelector('ul').insertBefore(e.nextElementSibling, e);
				scrollu({ e: e });
			}
		},
		addprevu: (v) => {
			const { e } = v;

			if (e) {
				e.classList.remove('on');

				v.e = document.createElement('li');
				v.e.classList.add('on');
				v.e.innerHTML = '<div class="sec">½</div><div class="thumb">NEW</div>';
				t.querySelector('ul').insertBefore(v.e, e);

				v.e.addEventListener('click', (e) => {
					[].forEach.call(t.querySelectorAll('li'), (e) =>
						e.classList.remove('on'),
					);
					e.target.classList.add('on');
				});

				scrollu({ e: v.e });
			}
		},
		addnextu: (v) => {
			const { e } = v;

			if (e) {
				e.classList.remove('on');

				v.e = document.createElement('li');
				v.e.classList.add('on');
				v.e.innerHTML = '<div class="sec">½</div><div class="thumb">NEW</div>';
				t.querySelector('ul').insertBefore(v.e, e.nextElementSibling);

				v.e.addEventListener('click', (e) => {
					[].forEach.call(t.querySelectorAll('li'), (e) => e.classList.remove('on'), );
					e.target.classList.add('on');
				});

				scrollu({ e: v.e });
			}
		},
		removeu: (v) => {
			const { e } = v;

			if (e) {
				v.e = e.nextElementSibling ? e.nextElementSibling : e.previousElementSibling ? e.previousElementSibling : void 0;
				if (v.e) {
					t.querySelector('ul').removeChild(e);
					v.e.classList.add('on');
					scrollu({ e: v.e });
				}
			}
		},
		drawu: (v) => {
			const { e } = v;

			if (e) {
				v.a = ['¼', '½', '¾', '1', '3'];
				v.e = e.children[1];
				v.s = v.e.innerText;

				if (v.s === 'THUMB' || v.s === 'NEW') {
					v.h = document.querySelector('.sheet.fgs .so.tangram').innerHTML;
					v.e.innerHTML = v.h;
					v.e.querySelector('svg').setAttribute('viewBox', '0 0 1280 1280');
				} else {
					v.r = e.querySelector('.sec').innerText;
					v.n = v.a.indexOf(v.r);
					v.i = (v.n + 1) % v.a.length;
					e.querySelector('.sec').innerText = v.a[v.i];
				}
			}
		},
		laydownu: (v) => {
			const { e } = v;

			if (e) {
				v.e = e.children[1];
				v.a = v.e.querySelectorAll('path');
				[].forEach.call(v.a, (e) => {
					v.s = e.className.baseVal.replace(/\s+/g, '.');
					v.d = e.getAttribute('d');
					document.querySelector(`.${v.s}`).setAttribute('d', v.d);
				});
			}

			v.t = v.e.querySelector('.tans.txt');
			document.querySelector('.sheet.fgs .so.tangram .tans.txt').innerHTML = v.t ? v.t.innerHTML : '';

			v.b = document.querySelector('.sheet.uis .so.btns .btn.text.on');
			if (v.b) btnstangram.textu({ e: v.b });
		},
		playonceu: (v) => skiaoramau({ e: v.e, n: 1 }),
		playstopu: (v) => skiaoramau({ e: v.e, n: 0 }),
		playloopu: (v) => skiaoramau({ e: v.e, n: 99 }),
		importu: (v) => { const { e } = v; document.querySelector('.so.cards .fileimport').click(); },
		exportu: (v) => {
			const { e } = v;

			v.p = e.parentNode.parentNode.parentNode;
			v.n = v.p.querySelector('textarea').value;
			v.n = v.n.length ? `${v.n}.xml` : '';

			v.s = document.querySelector('.so.cards .thumbs');
			v.d = new XMLSerializer().serializeToString(v.s);
			v.b = new Blob([v.d], { type: 'application/xml' });

			v.l = document.createElement('a');
			v.l.href = URL.createObjectURL(v.b);
			v.l.download = v.n || 'oddgram.xml';
			v.l.click();

			URL.revokeObjectURL(v.l.href);
		},
	};

	[].forEach.call(t.querySelectorAll('li'), (e) => {
		e.addEventListener('click', (e) => {
			[].forEach.call(t.querySelectorAll('li'), (e) =>
				e.classList.remove('on'),
			);
			e.target.classList.add('on');
		});
	});

	document.addEventListener('change', (e) => {
		if (e.target && e.target.matches('.so.cards .fileimport')) {
			v.f = e.target.files[0];
			if (!file) return;

			v.r = new FileReader();
			v.r.onload = function (e) {
				v.s = e.target.result;
				v.t = parsexmlu({ s: v.s, t: 'li' });

				[].forEach.call(v.t, (e) => {
					v.h = e.querySelector('.thumb').innerHTML;
					if (v.h.match(/<svg/)) {
						btnscard.addnextu({
							e: document.querySelector('.so.cards .thumbs .on'),
						});
						v.e = document.querySelector('.so.cards .thumbs .on');
						v.h = e.querySelector('.thumb').innerHTML;
						v.e.querySelector('.thumb').innerHTML =
							e.querySelector('.thumb').innerHTML;
					}
				});
			};

			v.r.readAsText(v.f);
			
			e.target.value = ''; /// 동일한 파일을 다시 선택할 수 있도록 값 초기화
		}
	});
	
	return btnscard;
};

/*** .so.tangram, .so.gride, .so.btns */
((v) => {
	const { x, a, o, i, w } = v;

	(async () => {
		// await x.loadfontu('/www/with/fonts/baby_bb33.woff');
		// await x.loadfontu('/www/with/fonts/PlayTangram.woff');

		await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
		// x.envm.resizeu({ w: w.wh.w, h: w.wh.h });
		x.envm.resizeu({ w: x.envm.wh.w, h: x.envm.wh.h });
		// await x.loadFetch({ u: '/www/work/tangram/tangram.xml', p: '.sheet.bgs' });

		// w.r = x.envm.r;
		// w.hv = x.envm.hv;

		const drag = {
			startu: (e) => {
				e.preventDefault();

				w.r = x.envm.r;
				w.hv = x.envm.hv;

				i.c = `.${e.target.classList.value.replace(/\s/, '.')}`;
				[].forEach.call(Object.keys(o[i.c]), (k) => (i[k] = o[i.c][k]));

				i.t.s = Date.now(); /* Time.Start */
				i.is.d = true; /* IS.Drag */
				i.xy.sx = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
				i.xy.sy = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
				i.xy.cx = i.xy.sx;
				i.xy.cy = i.xy.sy;
				i.xy.dx = i.xy.cx - i.xy.sx;
				i.xy.dy = i.xy.cy - i.xy.sy;

				v.r = pathparseu({ d: i.e.getAttribute('d') });
				i.pa = v.r.pa; /* PathArray */
				i.xy.ox = Math.round( (i.pa.reduce((sum, p) => sum + p[0], 0) / i.pa.length) * 100, ) / 100;
				i.xy.oy = Math.round( (i.pa.reduce((sum, p) => sum + p[1], 0) / i.pa.length) * 100, ) / 100;

				i.e.parentNode.appendChild(i.e);
			},

			moveu: (e) => {
				if (!Object.keys(i).length) return;

				i.xy.cx = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
				i.xy.cy = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
			},

			endu: (e) => {
				if (!Object.keys(i).length) return;

				i.xy.ox += i.xy.dx;
				i.xy.oy += i.xy.dy;
				i.is.d = false;
				i.is.m = false; /* IS.Move */
				i.is.r = false; /* IS.Rotate */
				i.e.removeAttribute('stroke');
				i.e.removeAttribute('stroke-width');

				[].forEach.call(Object.keys(i), (k) => delete i[k]);
			},
		};

		const patho = {
			moveu: (v) => {
				const {} = v;
				if (!i.is.m) return;

				v.pa = i.pa.map((e) => [e[0] + i.xy.dx / w.r, e[1] + i.xy.dy / w.r]);
				v.r = pathdu({ pa: v.pa });
				o[i.c].pa = v.pa;

				i.e.setAttribute('d', v.r.d);
			},
			rotateu: (v) => {
				const {} = v;
				if (!i.is.r) return;

				v.d = Math.max(Math.abs(i.xy.dx), Math.abs(i.xy.dy));
				v.d = v.d === Math.abs(i.xy.dx) ? i.xy.dx : i.xy.dy;

				v.a = (Math.round(v.d / w.r / 16) * i.r) % 360;
				v.pa = i.pa.map((e) =>
					rotateu({ ox: i.xy.ox, oy: i.xy.oy, x: e[0], y: e[1], a: v.a }),
				);
				v.r = pathdu({ pa: v.pa });
				o[i.c].pa = v.pa;

				i.e.setAttribute('d', v.r.d);
			},
		};

		/*** .so.cards */
		const btnscard = cardu({
			x: x,
			t: document.querySelector('.sheet.uis .so.cards .thumbs'),
			b: document.querySelector('.sheet.uis .so.cards .btns'),
			w: w,
		});

		const frameu = (v) => {
			const {} = v;

			if (Object.keys(i).length) {
				if (!i.is.d) return;

				v.r = distanceu({ xy: i.xy });
				i.xy.dx = v.r.dx;
				i.xy.dy = v.r.dy;

				v.x = i.xy.ox * w.r + w.hv.h;
				v.y = i.xy.oy * w.r + w.hv.v;
				i.r = v.y - i.xy.sy < 0 ? 15 : -15;

				if (!i.is.m && !i.is.r) {
					v.r = distanceu({
						xy: { sx: v.x, sy: v.y, cx: i.xy.sx, cy: i.xy.sy },
					});
					v.d = i.wh.w > i.wh.h ? i.wh.w : i.wh.h;

					if (v.r.d < v.d * w.r * 0.25) {
						i.is.m = true;

						i.e.setAttribute('stroke', '#dae');
						i.e.setAttribute('stroke-width', 2);
					} else {
						i.is.r = true;

						i.e.setAttribute('stroke', '#eda');
						i.e.setAttribute('stroke-width', 2);
					}
				} else {
					patho.moveu({});
					patho.rotateu({});
				}
			}

			if (x.btnm) {
				if (Object.keys(x.btnm.evt).length) {
					if (x.btnm.evt.s) {
						if (x.btnm.evt.o === 'txtctrl')
							txtctrl[x.btnm.evt.s]({ e: x.btnm.evt.e, o: o, w: w });
						if (x.btnm.evt.o === 'btnstangram')
							btnstangram[x.btnm.evt.s]({ e: x.btnm.evt.e, o: o, w: w });
						if (x.btnm.evt.o === 'btnscard') {
							v.t = document.querySelector('.sheet.uis .so.cards .thumbs');
							btnscard[x.btnm.evt.s]({ e: v.t.querySelector('li.on') });
						}

						delete x.btnm.evt.o;
						delete x.btnm.evt.s;
						delete x.btnm.evt.e;
					}
				}
				/// [`${v.s}u`]({e: v.e});
			}

			if (thumbscard.time > 0) {
				/// stop or loop, play
				v.l = thumbscard.thumb.length;
				if (v.l) {
					v.c = thumbscard.thumb[thumbscard.current];

					if (thumbscard.tick < v.c[1]) {
						if (!thumbscard.tick) {
							v.a = document.querySelectorAll('.thumbs li');
							v.h = v.a[v.c[0]].querySelector('.thumb').innerHTML;
							document.querySelector('.sheet.fgs .so.skiaorama').innerHTML = v.h;
						}
						++thumbscard.tick;
					} else {
						thumbscard.tick = 0;
						if (thumbscard.current < v.l - 1) {
							++thumbscard.current;
						} else {
							--thumbscard.time;
							if (thumbscard.time > 0) {
								thumbscard.current = 0;
							} else {
								thumbscard.thumb = [];
								thumbscard.current = 0;
							}
						}
					}
				}
			}

			requestAnimationFrame(() => frameu({}));
		};
		frameu({});

		const btnsvgu = (v) => {
			const {} = v;

			v.s = document.querySelector('svg');
			v.x = new XMLSerializer();
			v.t = v.x.serializeToString(v.s);
			v.b = new Blob([v.t], { type: 'image/svg+xml;charset=utf-8' });
			v.url = URL.createObjectURL(v.b);
			v.a = document.createElement('a');

			v.n = new Date();
			v.ymd = v.n.getFullYear() + String(v.n.getMonth() + 1).padStart(2, '0') + String(v.n.getDate()).padStart(2, '0');
			v.hms = String(v.n.getHours()).padStart(2, '0') + String(v.n.getMinutes()).padStart(2, '0') + String(v.n.getSeconds()).padStart(2, '0');
			v.f = `tans-${v.ymd}-${v.hms}.svg`;

			v.a.href = v.url;
			v.a.download = v.f;
			document.body.appendChild(v.a);
			v.a.click();
			document.body.removeChild(v.a);
			URL.revokeObjectURL(v.url);
		};

		[].forEach.call(a, (e) => {
			e.addEventListener('mousedown', drag.startu);
			e.addEventListener('touchstart', drag.startu);

			v.d = e.getAttribute('d');
			v.f = e.getAttribute('fill');

			v.xy = { sx: 0, sy: 0, cx: 0, cy: 0, dx: 0, dy: 0, }; /// position: start, current, delta
			v.t = { s: 0, c: 0 }; /// time: start, current
			v.is = { d: false, m: false, r: false, }; /// is: Dragging, Moving, Rotating
			v.i = `.${e.classList.value.replace(/\s/, '.')}`;
			v.r = pathparseu({ d: v.d });

			v.b = e.getBBox();
			v.wh = { w: v.b.width, h: v.b.height };

			o[`${v.i}`] = { e: e, xy: v.xy, wh: v.wh, t: v.t, is: v.is, pa: v.r.pa, r: 15, d: v.d, fill: v.f, };
		});

		document.addEventListener('mousemove', drag.moveu);
		document.addEventListener('touchmove', drag.moveu);

		document.addEventListener('mouseup', drag.endu);
		document.addEventListener('touchend', drag.endu);

		await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

		v.e = document.querySelector('.sheet.fgs .so.tangram .tans.xi');
		v.e.style.display = 'none';

		v.e = document.querySelector('.sheet.uis .so.cards .thumbs');
		v.e.addEventListener('wheel', (e) => {
			e.preventDefault();

			if (x.envm.hv.h) v.e.scrollTop += e.deltaY;
			else v.e.scrollLeft += e.deltaY;
		});
	})();
})({ x: dx.hex, a: document.querySelectorAll('.tan'), o: {}, i: {}, w: { r: 1, wh: { w: 1280, h: 1280 } }, });
