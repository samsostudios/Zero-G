import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

export const nav = () => {
  console.log('Nav - COMP');
  class Nav {
    private navComponent: HTMLElement;
    private navBg: HTMLElement;
    private heroElement: HTMLElement;
    private easeFloat: any;

    constructor() {
      this.navComponent = document.querySelector('.nav_component') as HTMLElement;
      this.navBg = this.navComponent.querySelector('.nav_bg') as HTMLElement;
      this.heroElement = document.querySelector('.main-wrap > *:first-child') as HTMLElement;
      this.easeFloat = CustomEase.create('floatDown', 'M0,0 C0.25,0.1 0.25,1 1,1');

      this.initScrollTrigger();
    }

    private initScrollTrigger(): void {
      gsap.set(this.navBg, { y: '-100%', transformOrigin: 'top center' });

      ScrollTrigger.create({
        trigger: this.heroElement,
        start: 'top+=10% top ',
        end: 'top top',
        scrub: true,
        onEnter: () => this.animateNavBgIn(),
        onLeaveBack: () => this.animateNavBgOut(),
        // onUpdate: (self) => this.handleScroll(self.progress),
        // markers: true,
      });
    }

    private animateNavBgIn(): void {
      gsap.to(this.navBg, { y: '0%', opacity: 1, duration: 1, ease: 'power3.out' });
    }

    private animateNavBgOut(): void {
      gsap.to(this.navBg, { y: '-100%', opacity: 0, duration: 1, ease: 'power3.in' });
    }
  }

  new Nav();
};

export default nav;
