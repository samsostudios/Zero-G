import { gsap } from 'gsap';

export const imageSlider = () => {
  // console.log('Slider - COMP');
  class ImageSlider {
    private imagesContainer: HTMLElement;
    private images: NodeListOf<HTMLElement>;
    private totalWidth: number;
    private slideDuration: number;
    private tl: gsap.core.Timeline;

    constructor() {
      this.imagesContainer = document.querySelector('.img-slider_track') as HTMLElement;
      this.images = document.querySelectorAll('.img-slider_img-wrap');
      this.totalWidth = 0;
      this.slideDuration = parseInt(this.imagesContainer.dataset.slideSpeed as string);
      this.imagesContainer.classList.remove('is-designer');

      this.tl = gsap.timeline();

      this.setupImages();
      this.initAnimation();
      this.setResize();
    }

    private setupImages() {
      // let maxWidth = window.innerWidth * 0.33;
      // console.log('max', maxWidth);

      if (window.innerWidth > 767) {
        this.images.forEach((image) => {
          image.style.flexShrink = '0';
          image.style.flexGrow = '1';
          image.style.width = '33vw';
          // image.style.maxWidth = `${maxWidth}px`;
          image.style.maxHeight = '50rem';
          image.style.height = 'auto';

          this.totalWidth += image.offsetWidth + 32;
        });
      }
    }

    private initAnimation() {
      this.tl = gsap.timeline({ repeat: -1, yoyo: true });
      this.tl.to(this.imagesContainer, {
        x: `-${this.totalWidth - window.innerWidth}px`,
        ease: 'linear',
        duration: this.slideDuration,
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
