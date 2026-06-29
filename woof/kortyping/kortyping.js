import { dx } from '../../wore/hex.js';

export function init() {
	console.log('/// /// Kor Typing');
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
// cx.fillStyle = 'white';
cx.clearRect(0, 0, cs.width, cs.height);

const ky = {};
ky.ph = '무궁화 꽃이 피었습니다.'; /* placeholder */
ky.li = { height: 24, space: 18, Baseline: 'ideographic', c: '#fff' }
ky.txt = [''];
ky.xy = { x: cx.textAlign === 'left' ? 24 : cs.width*0.5, y: 48 };
ky.wh = { w: cs.width - 48, h: cs.height - 48 }
ky.lang = false; /* keyCode : 192 (backtick) or keyCode : 21 (ko/en) */
ky.crt = { xy: { x: 0, y: 0 }, wh: { w: 0, h: 0 }, fdc: { f: 30, d: 60, c: 0 }, c: '#2e5' };
ky.press = false;

ky.sy = '';
ky.eng = 'rRseEfaqQtTdwWczxvgkoiOjpuPhynbml';
ky.kor = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ';
ky.ks = []; /*  Korean Syllable */
ky.ks.push('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'); /* initial consonant of a Korean syllable 19 */
ky.ks.push('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'); /* vowels(Neutral) of a Korean syllable 21 */
ky.ks.push('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'); /* finality consonant of a Korean syllable 28 */
ky.dc = []; /* Double Consonants */
ky.dc.push('ㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ');
ky.dc.push('ㄱㅅㄴㅈㄴㅎㄹㄱㄹㅁㄹㅂㄹㅅㄹㅌㄹㅍㄹㅎㅂㅅ');
ky.dv = []; /* Double Vowels */
ky.dv.push('ㅘㅙㅚㅝㅞㅟㅢ');
ky.dv.push('ㅗㅏㅗㅐㅗㅣㅜㅓㅜㅔㅜㅣㅡㅣ');
ky.cc = [-1, -1, -1]; /* Char Codes*/
ky.char = '';

/* Hangeul */
const hgu = v => {
	const { char, code, ln } = v; /* char, code, line num */
	
	v.cc = [-1, -1, -1];
	v.cn = ky.txt[ln].length - 1; // char num;
	v.arr = [];
	if(v.cn + 1){
		v.uc = ky.txt[ln].charCodeAt(v.cn); /* UniCode */  
		if( v.uc < 0xac00 || v.uc > 0xd7a3){
			v.f = ky.ks[0][ky.cc[0]] === undefined ? '' : ky.ks[0][ky.cc[0]];
			v.n = ky.ks[1][ky.cc[1]] === undefined ? '' : ky.ks[1][ky.cc[1]];
			if(ky.ks[1].indexOf(v.n) !== -1) v.arr = [v.f, v.n];
			else v.arr = [v.f];

		}else{
			v.n = v.uc - 0xac00; /* Array Num */
			v.cc[2] = v.n%28; /* final */
			v.cc[1] = ((v.n - v.cc[2])/28)%21; /* neutral */
			v.cc[0] = ((v.n - v.cc[2])/28 - v.cc[1])/21; /* initial */

			v.arr.push(ky.ks[0][v.cc[0]]);
			v.arr.push(ky.ks[1][v.cc[1]]);
			if (ky.ks[2][v.cc[2] - 1] !== undefined ) v.arr.push(ky.ks[2][v.cc[2] - 1]);
		}
	}
	// console.log(v.arr);
	
	ky.char = '';
	/* final */
	if(ky.ks[2].indexOf(char) !== -1){
		if(v.arr.length === 3){
			v.dc = ky.dc[1].indexOf(v.arr[2] + char); /* Double Consonant */
			v.final = v.dc !== -1 && v.dc%2 !== 1 ? ky.dc[0].charAt(v.dc*0.5) : char;
			if(v.dc === -1 && v.dc%2 !== 1) ky.cc = [-1, -1, -1]; /* New Char */
			
		} else {
			v.final = char;
		}

		if(ky.cc[0] !== -1 && ky.cc[1] !== -1) { 
			ky.cc[0] = v.cc[0];
			ky.cc[1] = v.cc[1];
			ky.cc[2] = ky.ks[2].indexOf(v.final);

			ky.txt[ln] = ky.txt[ln].replace(/.$/, '');
		}
	} else {
		if(ky.ks[0].indexOf(char) !== -1 ) ky.cc = [-1, -1, -1]; /* Only in the initial consonant */
	}
	
	/* initial */
	if(ky.ks[0].indexOf(char) !== -1 ){
		if(ky.cc[0] === -1) ky.cc = [ky.ks[0].indexOf(char), -1, -1];
	}

	/* neutral */
	if(ky.ks[1].indexOf(char) !== -1){
		if(v.arr.length === 2 && v.arr[1].length){
			v.dv = ky.dv[1].indexOf(v.arr[1] + char); /* Double Vowel */
			v.neutral = v.dv !== -1 && v.dv%2 !== 1 ? ky.dv[0].charAt(v.dv*0.5) : char ;
			if(v.dv === -1 && v.dv%2 !== 1) ky.cc = [-1, -1, -1]; /* New Char */

		} else {
			if(v.arr.length === 3) {
				if(ky.dc[0].indexOf(v.arr[2]) !== -1){
					v.dc = ky.dc[0].indexOf(v.arr[2]);
					v.arr[2] = ky.dc[1].charAt(v.dc*2); /* first of final */
					v.cc[2] = ky.ks[2].indexOf(v.arr[2]);
					ky.cc[0] = ky.ks[0].indexOf(ky.dc[1].charAt(v.dc*2 + 1)); /* second of final is next initial */
					
				} else {
					v.cc[2] = -1; 
					ky.cc[0] = ky.ks[0].indexOf(v.arr[2]);
				}

				ky.cc[2] = -1;
				ky.char += String.fromCharCode(0xac00 + (v.cc[0]*21 + v.cc[1])*28 + v.cc[2] + 1);
			}
			
			v.neutral = char;
		}

		if(ky.ks[1].indexOf(v.neutral) !== -1 ) { 
			ky.cc[1] = ky.ks[1].indexOf(v.neutral);
			if((ky.cc[0] !== -1 && ky.cc[1] !== -1) || ky.dv[1].indexOf(v.neutral) === -1 || ky.char.length) ky.txt[ln] = ky.txt[ln].replace(/.$/, '');
		}
	}

	/* Combining the Consonants and Vowels */
	ky.char += ky.cc[0] !== -1 && ky.cc[1] !== -1 ? String.fromCharCode(0xac00 + (ky.cc[0]*21 + ky.cc[1])*28 + ky.cc[2] + 1) : v.neutral;
	
	return ky.cc[1] !== -1 ? ky.char : char ;
};


/* Long words to be able to be broken and wrap onto the next line */
const wrapu = v => {
	const { txt, ln } = v;
	
	v.l = '';
	v.wh = { w: 0, h: ky.li.height + ky.li.space };

	v.ws = txt.split(/\s/); /* Array word */

	v.ws.forEach(e => {
		v.tml = cx.measureText(e + ' '); /* TextMetrics */

		if (v.wh.w +  v.tml.width < ky.wh.w) {
			v.wh.w +=  v.tml.width;
			v.l += e + ' ';
			ky.crt.xy.x = v.wh.w; /* caret pos x */
			
		} else {
			[...e].forEach(e => { /* Array char */
				v.tmc = cx.measureText(e); /* TextMetrics */

				if (v.wh.w + v.tmc.width < ky.wh.w) {
					v.wh.w += v.tmc.width
					v.l += e;
					ky.crt.xy.x = v.wh.w; /* caret pos x */
					
				} else {
					ky.txt[ln] = v.l;
					if(ln + 1 === ky.txt.length) {
						ky.txt.push(e); /* New line */
						++ky.crt.xy.y; /* caret pos y */
						ky.crt.xy.x = v.tmc.width; /* caret pos x */
						
					} else {
						ky.txt[ln + 1] = e + ky.txt[ln + 1]; /* Merge next line */
					} 
				}
			});
		}
	});

	ky.press = false;
}

/* Loaded */
(async (v) => {
	const { x, w } = v;

	await x.importmoduleu({ m: `${dx.basePath}/wore/env.js` });
	x.envm.resizeu({ w: w.wh.w, h: w.wh.h });

	/* Key Event */
	window.addEventListener('keydown', e => kydu({ e: e }));
	window.addEventListener('keypress', e => kypu({ e: e }));

	const backu = v => { /* Back Key */
		const { ln } = v;
		
		if(ky.txt[ln].length > 1) {
			ky.txt[ln] = ky.txt[ln].slice(0, ky.txt[ln].length - 1);
			ky.sy = ky.txt[ln].charAt(ky.txt[ln].length - 1);
			wrapu({ txt: ky.txt[ln], ln: ln });

		} else { 
			if(ln > 0){
				ky.txt.pop();
				ky.sy = ky.txt[ln - 1].charAt(ky.txt[ln - 1].length - 1);
				wrapu({ txt: ky.txt[ln - 1], ln: ln - 1 });
				--ky.crt.xy.y; /* caret pos y */
				
			} else {
				ky.txt[ln] = '';
				ky.sy = ky.ph.charAt(ky.ph.length - 1);
				wrapu({ txt: ky.ph, ln: 0 });
			}
		}
	};
	
	/* Key down */
	const kydu = v => { 
		const { e } = v;

		v.code = parseInt(e.which);
		
		v.kyu = {
			8: () => backu({ ln: ky.txt.length - 1 }), /* Backspace */
			13: () => { 
				ky.txt.push(''); /* Move to new line with enter key */
				ky.crt.xy.x = ky.xy.x;
				++ky.crt.xy.y;
			}, 
			192: () => ky.lang = !ky.lang,
			21: () => ky.lang = !ky.lang, /* English or Korean toggle key in Windows */ 
			46: () => backu({ ln: ky.txt.length - 1 }) /* Delete */
		}

		if (typeof v.kyu[v.code] === 'function') {
			e.preventDefault();
			if(ky.txt[0].length) v.kyu[v.code]();
		}
	};
	
	/* Key press */
	const kypu = v => { 
		const { e } = v;

		if(ky.press) return;

		ky.press = true;
		v.code = parseInt(e.which); /* The correct value is transmitted only in keyless state. */
		v.char = String.fromCharCode(v.code);
		v.ln = ky.txt.length - 1; /* Line Num */
		
		v.char = ky.kor.indexOf(v.char) !== -1 ? ky.eng.charAt(ky.kor.indexOf(v.char)) : v.char;
		
		if (ky.lang && /[a-zA-Z]/.test(v.char)) { /* Hangeul && English alphabet matching */
			v.n = ky.eng.indexOf(v.char) !== -1 ? ky.eng.indexOf(v.char) : ky.eng.indexOf(v.char.toLowerCase()) ;
			ky.sy = hgu({ char: ky.kor.charAt(v.n), code: ky.kor.charCodeAt(v.n), ln: v.ln });
			ky.txt[v.ln] += ky.sy;
			
		}else{
			ky.sy = v.char;
			ky.txt[v.ln] += ky.sy;
			ky.cc = [-1, -1,- 1];
		}
		
		wrapu({ txt: ky.txt[v.ln], ln: v.ln });
	};
	
	wrapu({ txt: ky.ph, ln: 0 }); /* Disappearing placeholder text */

	/* Draw Text */
	const drawtxtu = v => {
		const { l, dxy } = v;

		cx.fillStyle = ky.li.c;
		cx.fillText(l, dxy.x, dxy.y);
	}
	
	/* Draw Caret */
	const drawcaretu = v => {
		const { b } = v;
		
		if(b){
			v.x = ky.crt.xy.x + ky.xy.x - ky.li.space*0.5;
			v.y = ky.crt.xy.y*(ky.li.height + ky.li.space) + ky.xy.y + ky.li.space*0.5;
			v.sy = ky.sy.charAt(ky.sy.length - 1);

			cx.beginPath();
			if(ky.lang) {
				cx.moveTo(v.x - cx.measureText(v.sy).width, v.y + ky.li.height + ky.li.space*0.5);
				cx.lineTo(v.x, v.y + ky.li.height + ky.li.space*0.5);
			} else {
				cx.moveTo(v.x, v.y);
				cx.lineTo(v.x, v.y + ky.li.height + ky.li.space*0.5);
			}
			cx.strokeStyle = ky.crt.c;
			cx.lineWidth = 2;
			cx.stroke();
		} 
	}
	
	/* Frame */
	const frameu = v => {
		const {} = v;
		
		cx.clearRect(0, 0, cs.width, cs.height);
		
		v.wh = { w: 0, h: ky.li.height + ky.li.space };
		if(ky.txt[0].length === 0){ /* Disappearing placeholder text */
			drawtxtu({ l: ky.ph, dxy: { x: ky.xy.x, y: ky.xy.y + v.wh.h} });

		} else {
			ky.txt.forEach((e, i) => drawtxtu({ l: e, dxy: { x: ky.xy.x, y: ky.xy.y + v.wh.h*(i + 1) } }));
		}
		
		ky.crt.fdc.c = ky.crt.fdc.c < 60 ? ++ky.crt.fdc.c : 0;
		drawcaretu({ b: parseInt(ky.crt.fdc.c/ky.crt.fdc.f) });
		
		if (x.btnm) {
			if (Object.keys(x.btnm.evt).length) {
				if (x.btnm.evt.s) {
					if (x.btnm.evt.o === 'btnskortyping') btnskortyping[x.btnm.evt.s]({ e: x.btnm.evt.e });
	
					delete x.btnm.evt.o;
					delete x.btnm.evt.s;
					delete x.btnm.evt.e;
				}
			}
			/// [`${v.s}u`]({e: v.e});
		}

		window.requestAnimationFrame(() => frameu({}));
	};
	frameu({});

	await x.importmoduleu({ m: `${dx.basePath}/wore/btn.js` });

})({ x: dx.hex, w: { r: 1, o: {}, wh: { w: 1280, h: 1280 } }, });

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
