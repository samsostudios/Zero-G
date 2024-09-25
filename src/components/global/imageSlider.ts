import { gsap } from 'gsap';

export const imageSlider = () => {
  // console.log('Slider - COMP');
  class ImageSlider {
    private imagesContainer: HTMLElement;
    private images: NodeListOf<HTMLElement>;
    private totalWidth: number;
    private slideDuration: number;
    private tl: gsap.core.Timeline;
    private isDev: boolean;

    constructor() {
      this.imagesContainer = document.querySelector('.img-slider_track') as HTMLElement;
      this.images = document.querySelectorAll('.img-slider_img-wrap');
      this.totalWidth = 0;
      this.slideDuration = parseInt(this.imagesContainer.dataset.slideSpeed as string);
      this.imagesContainer.classList.remove('is-designer');

      this.isDev = window.location.href.includes('?dev');

      this.tl = gsap.timeline();

      this.setupImages();
      // this.initAnimation();
      this.setResize();
    }

    private setupImages() {
      if (window.innerWidth > 767) {
        this.images.forEach((image) => {
          image.style.flexShrink = '0';
          image.style.flexGrow = '1';
          image.style.width = '33vw';
          image.style.maxHeight = '50rem';
          image.style.height = 'auto';

          requestAnimationFrame(() => {
            console.log('img width', image.clientWidth);

            this.totalWidth += image.clientWidth + 32;
            this.initAnimation();
          });
        });
      }
    }

    private initAnimation() {
      console.log('here', this.totalWidth, window.innerWidth);
      let dur = 0;
      this.isDev ? (dur = 5) : (dur = this.slideDuration);

      console.log(dur);
      this.tl = gsap.timeline({ repeat: -1, yoyo: true });
      this.tl.to(this.imagesContainer, {
        x: `-${this.totalWidth - window.innerWidth}px`,
        ease: 'linear',
        duration: dur,
      });
    }

    private setResize() {
      const debouncedResize = this.debounce(() => {
        this.tl.kill();
        gsap.set(this.imagesContainer, {
          x: 0,
        });
        this.totalWidth = 0;
        this.setupImages();
        this.initAnimation();
      }, 300);

      window.addEventListener('resize', debouncedResize);
    }

    private debounce(func: () => void, wait: number) {
      let timeout: number | undefined;

      return () => {
        const later = () => {
          timeout = undefined;
          func();
        };

        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
      };
    }
  }

  new ImageSlider();
};

export default imageSlider;
