import { gsap } from 'gsap';

export const crowdfundBanner = () => {
  class CSBAnner {
    private banner: HTMLElement;
    private inTimeline: gsap.core.Timeline;
    private outTimeline: gsap.core.Timeline;

    constructor() {
      this.banner = document.querySelector('.banner_component') as HTMLElement;
      this.inTimeline = gsap.timeline();
      this.outTimeline = gsap.timeline();

      this.initializeEvents();
    }

    private initializeEvents() {
      this.banner.addEventListener('mouseenter', this.animateIn.bind(this));
      this.banner.addEventListener('mouseleave', this.animateOut.bind(this));
    }

    private animateIn() {
      const mask = this.banner.querySelector('.banner_reveal-mask') as HTMLElement;
      const main = this.banner.querySelector('.banner_main') as HTMLElement;
      const reveal = this.banner.querySelector('.banner_reveal') as HTMLElement;

      const computedStyle = window.getComputedStyle(main);
      const paddingTop = parseFloat(computedStyle.padding);

      this.inTimeline.to(mask, {
        height: reveal.clientHeight + paddingTop,
        ease: 'power4.out',
      });
    }

    private animateOut() {
      const mask = this.banner.querySelector('.banner_reveal-mask') as HTMLElement;

      this.inTimeline.to(mask, {
        height: 0,
        ease: 'power4.out',
      });
    }
  }

  new CSBAnner();
};
export default crowdfundBanner;
