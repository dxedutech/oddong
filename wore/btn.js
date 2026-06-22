import { dx } from './hex.js';

export default (v => {
  const { x, b } = v;

  const evt = {};

  const clicku = v => {
    const { e } = v;

		
    // x.loadpageu({ u: '/work/tangent' }); 
    v.j = x.parseattu({ e: e.target }); /* to json */

    if (v.j.hasOwnProperty('url')) {
			v.p = window.location.pathname;
      console.log('#', v.j.url, v.p);
			if(v.p.includes('page')) location.replace(window.location.origin);
			else location.replace(`./${v.j.url}`);
    }

    if (v.j.hasOwnProperty('fn')) {
			console.log(v.j.obj, v.j.fn);
      evt.o = v.j.obj;
      evt.s = v.j.fn;
      evt.e = e.target;
    }
  };

  [].forEach.call(b, e => {
    e.addEventListener('click', e => {
      e.preventDefault();

      clicku({ e: e });
      return false;
    });
  });
  v.evt = evt;

  const devu = () => 'v0.0.260621';
  v.devu = devu;

  return v;
})({ x: dx.hex, b: document.querySelectorAll('.so.btns') });