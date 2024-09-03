import { gsap } from 'gsap';

export const seenOn = () => {
  console.log('Seen On - COMP');
  class InfiniteSlider {
    private track: HTMLElement;
    private childWidth: number;
    private trackGap: number;
    private animationDuration: number;
    private animation: GSAPTween | null = null;
    private tabletBreakpoint: string;

    constructor(trackSelector: string, childSelector: string, duration: number) {
      this.track = document.querySelector(trackSelector) as HTMLElement;
      const childElement = this.track.querySelector(childSelector) as HTMLElement;
      this.childWidth = childElement.offsetWidth;
      this.trackGap = parseFloat(getComputedStyle(this.track).gap) || 0;
      this.animationDuration = duration;
      this.tabletBreakpoint = '(max-width: 991px)';

      this.handleResize();
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    private handleResize(): void {
      if (window.matchMedia(this.tabletBreakpoint).matches) {
        this.killAnimation();
      } else {
        this.startAnimation();
      }
    }

    private startAnimation(): void {
      const moveDistance = this.childWidth + this.trackGap;

      if (!this.animation) {
        this.animation = gsap.to(this.track, {
          x: `-${moveDistance}px`,
          duration: this.animationDuration,
          ease: 'none',
          repeat: -1, // Infinite loop
        });
      }
    }

    private killAnimation(): void {
      if (this.animation) {
        this.animation.kill();
        this.animation = null;
        gsap.set(this.track, { x: 0 }); // Reset the position
      }
    }
  }

  new InfiniteSlider('.seen_slider-track', '.seen_wrap', 15);
};

export default seenOn;
