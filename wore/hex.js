const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/oddong' : '';
const main = document.querySelector('main');

const loadPage = async (v) => {
	const { p } = v;

	/*** Html 제어 */
	v.res = await fetch(`${basePath}/woof/${p}/${p}.html`);
	v.html = await v.res.text();
	main.innerHTML = v.html;

	/*** 로컬과 서버 이미지 호출 주소 제어 */
	main.querySelectorAll('img').forEach((img) => {
		if (!img.src.includes(basePath) && !img.src.startsWith('http')) {
			v.src = img.getAttribute('src');
			img.src = `${basePath}${v.src.startsWith('/') ? '' : '/'}${v.src}`;
		}
	});

	/*** Javascript 제어 */
	try {
		v.m = await import(`${basePath}/woof/${p}/${p}.js`);
		if (v.m.init) v.m.init(); /// 해당 자바스크립트를 가져와 해당 함수 실행
	} catch (e) {
		console.log(p, '이 페이지는 별도 JS가 필요 없습니다.');
	}
};

/*** Nav a 태그 라우터 제어 */
main.addEventListener('click', (e) => {
	const a = e.target.closest('a');
	if (!a) return;

	e.preventDefault();
	const page = new URL(a.href).searchParams.get('page');
	if (page) { loadPage({ p: page }); }
});

const hex = (e) => {
	const a = e === undefined ? [] : typeof e === 'string' ? document.querySelectorAll(e) : Array.isArray(e) ? e : [e];
	const r = {};

	/*** store user */
	const me = { email: '', key: '', };

	/*** store color values */
	const clra = { r: '#dae', g: '#aed', y: '#eda', };
	[].forEach.call(Object.keys(clra), (k) => (r[k] = clra[k]));

	/*** Add, Remove classes to elements */
	r.addclassu = (v) => [].forEach.call(a, (e) => (e ? e.classList.add(v) : void 0));
	r.removeclassu = (v) => [].forEach.call(a, (e) => (e ? e.classList.remove(v) : void 0));

	/*** Apply styles to elements */
	r.cssu = (v) => [].forEach.call(a, (e) => e ? [].forEach.call(Object.keys(v), (k) => v.hasOwnProperty(k) ? (e.style[k] = v[k]) : void 0, ) : void 0);

	return r;
};

hex.devu = () => '//\\v0.0.240903';

/*** parse json  */
hex.parseattu = (v) => JSON.parse(`{ ${v.e.attributes['js'].value.replace(/'/g, '"')} }`);
hex.parsecssu = (v) => {
	const { e, s } = v;

	v.j = JSON.parse(`{ ${s.replace(/'/g, '"')} }`);
	[].forEach.call(Object.keys(v.j), (k) => (e.style[k] = v.j[k]));
};

/*** create an element with a Element */
hex.crtu = (v) => {
	const { t, c, e, p } = v; /// tag, class, element, parent

	v.p = typeof p === 'object' ? p : p.length ? document.querySelector(p) : document.body; v.e = t.match(/svg|g/) ? document.createElementNS('http://www.w3.org/2000/svg', t) : document.createElement(t);

	c.length ? [].forEach.call(c.split(' '), (e) => v.e.classList.add(e)) : void 0;

	if (e.match(/^<.*>$/)) v.e.innerHTML = e;
	else v.e.textContent = e;

	v.p.appendChild(v.e);

	return v.e;
};

/*** create an element with a Class */
hex.attu = (v) => {
	const { t, c, e, p } = v; /// tag, class, element, parent

	v.p = typeof p === 'object' ? p : p.length ? document.querySelector(p) : document.body;
	if (typeof e === 'object') {
		if (t.match(/svg|g/)) {
			v.c = document.createElementNS('http://www.w3.org/2000/svg', t);

			[].forEach.call(e.children, (ei) => {
				v.ns = document.createElementNS( 'http://www.w3.org/2000/svg', ei.nodeName, );
				[].forEach.call(ei.attributes, (eii) => v.ns.setAttribute(eii.name, eii.value), );
				v.c.appendChild(v.ns.cloneNode(true));
			});
		} else {
			v.c = document.createElement(t);
		}

		c.length ? [].forEach.call(c.split(' '), (ei) => v.c.classList.add(ei)) : void 0;

		v.p.appendChild(v.c);
	} else {
		if (e.match(/^<.*>$/)) v.p.innerHTML = e;
		else v.p.textContent = e;
	}

	return e;
};

/*** import the Module. */
hex.importmoduleu = async (v) => {
	const { m, i } = v; /// module, index

	try {
		const s = i || m.match(/([^\/]+)\.[^\.]+$/)[1];
		if (hex[s]) return;

		v.m = await import(m);
		hex[`${s}m`] = v.m.default;
		console.log('add default module', `${s}m`);
	} catch (e) {
		console.log('There was a problem with the import operation:', e);
	}
};

/*** load FONT */
hex.loadfontu = async (v) => {
	try {
		const s = v.match(/([^\/]+)\.[^\.]+$/)[1];
		const font = new FontFace(s, `url(${v})`);

		const loadedFont = await font.load();
		document.fonts.add(loadedFont);
		document.body.style.fontFamily = `${s}, sans-serif`;
	} catch (e) {
		console.log('Failed to load font:', e);
	}
};

/*** parsing XML */
hex.xml = {};
hex.xml.svgu = (v) => {
	const { e, c, p } = v;

	v.a = e.attributes;
	v.p = v.a.p.value.length ? v.a.p.value : p;

	if (v.a.u.value.length) {
		v.u = `${v.a.u.value}/${v.a.i.value}.${v.a.x.value}`;

		(async () => {
			v.ei = hex.crtu({ t: 'g', c: `${c} ${v.a.i.value}`, e: '', p: v.p });
			await hex.loadFetch({ u: v.u, p: v.ei });
		})();
	} else {
		v.ei = v.a.i.value
			? document.querySelector(`${v.a.x.value}.${v.a.i.value}`)
			: void 0;
		if (!v.ei) {
			v.ei = hex.crtu({ t: 'svg', c: v.a.i.value, e: '', p: v.p });
		}
	}

	hex.parsecssu({ e: v.ei, s: v.a.css.value });
};

hex.xml.divu = (v) => {
	const { e, c, p } = v;

	v.a = e.attributes;
	v.p = v.a.p.value.length ? v.a.p.value : p;

	if (v.a.u.value.length) {
		v.u = `${v.a.u.value}/${v.a.i.value}.${v.a.x.value}`;

		(async () => {
			v.ei = hex.crtu({ t: 'div', c: `${c} ${v.a.i.value}`, e: '', p: v.p });

			await hex.loadFetch({ u: v.u, p: v.ei });
		})();
	} else {
		v.ei = v.a.i.value ? document.querySelector(`${v.a.x.value}.${v.a.i.value}`) : void 0;
		if (!v.ei) { v.ei = hex.crtu({ t: 'div', c: v.a.i.value, e: '', p: v.p }); }
	}

	hex.parsecssu({ e: v.ei, s: v.a.css.value });
};

hex.parsexmlu = (v) => {
	const { e, c, p } = v;

	[].forEach.call(e.querySelectorAll('prop'), (e) => hex.xml[`${e.getAttribute('x')}u`]({ e: e, c: c, p: p }), );
};

/*** asynchronously loads an HTML, XML or SVG file */
hex.htmlu = (v) => (v.p.innerHTML = v.e);
hex.svgu = (v) => (v.p.innerHTML = v.e);
hex.xmlu = (v) => {
	const { e, c, p } = v;

	v.p = new DOMParser();
	v.d = v.p.parseFromString(e, 'application/xml');
	hex.parsexmlu({ e: v.d, c: c, p: p });
};

hex.loadFetch = async (v) => {
	/// url, parent
	const { u, p } = v;

	v.p = typeof p === 'object' ? p : p.length ? document.querySelector(p) : document.body;
	v.c = u.match(/([^\/]+)\.[^\.]+$/)[1]; /// Content location index, tangam..., add class list
	v.e = u.match(/.*\.(\w+)$/)[1];

	await fetch(u)
		.then((e) => { if (!e.ok) { throw new Error('Network response was not ok'); } return e.text(); })
		.then((e) => hex[`${v.e}u`]({ e: e, c: v.c, p: v.p }))
		.catch((e) =>
			console.error('There was a problem with the fetch operation:', e),
		);
};

/*** load a CSS */
hex.loadcssu = (v) => {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = v;

	document.head.appendChild(link);
};

/*** load a Page */
hex.loadpageu = async (v) => {
	const { u } = v;

	try {
		v.r = await fetch(`${u}`); /// /work/tangram
		v.d = await v.r.json();

		/// 받은 데이터를 화면에 표시
		/// document.getElementById('message').innerText = v.d.message;
		console.log(v.d.message);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

/*** location a Page */
hex.location = {
	href: (v) => (location.href = v.u),
	replace: (v) => location.replace(v.u),
	open: (v) => window.open(v.u),
};

export const dx = { hex, loadPage, basePath };
