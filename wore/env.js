const supportsTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isMobileDevice = () => (window.innerWidth <= 768 && window.devicePixelRatio || 1 > 1) || window.innerWidth < 480;

export default (r => {
  r.devu = '/// v260701.01';
  r.wh = { w: 0, h: 0 };
  r.hv = { h: 0, v: 0 };
  r.isMobile = supportsTouch() || isMobileDevice();
  r.resolution = { w: window.screen.width, h: window.screen.height, r: window.devicePixelRatio };

	r.wds = { wh: window.scale || 1, dpr: window.devicePixelRatio, mob: false, tab: false };

	const userAgent = navigator.userAgent.toLowerCase();
	r.wds.mob = /iPhone|Android/i.test(navigator.userAgent);
	r.wds.tab = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);


	const resizeu = v => {
		const { w, h } = v;

		r.wh.w = w || 1280;
    r.wh.h = h || 1280;
    r.isPortrait = window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';

		v.d = document.querySelector('main');

		const resizeObserver = new ResizeObserver(e => {
			const { width, height } = e[0].contentRect;
			r.r = Math.min(width / r.wh.w, height / r.wh.h);
			v.d.style.transform = `scale(${r.r})`;

      r.hv.h = window.innerWidth*0.5 - r.wh.w*r.r*0.5;
      r.hv.v = window.innerHeight*0.5 - r.wh.h*r.r*0.5;

      v.e = v.d.querySelector('.sheet.uis');
			if(v.e){
				v.e.classList.remove('horizontal');
				v.e.classList.remove('vertical');
				v.e.classList.add(window.innerWidth>window.innerHeight ? 'horizontal' : 'vertical');
			};
		});
		resizeObserver.observe(document.body);
	}
  r.resizeu = resizeu;

  return r;
})({});
