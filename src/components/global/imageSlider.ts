import { gsap } from 'gsap';

export const imageSlider = () => {
  console.log('Slider - COMP');
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
      this.slideDuration = parseInt(this.imagesContainer.dataset.slideSpeed as string) * 10;
      console.log('yo', this.slideDuration);

      this.tl = gsap.timeline({ repeat: -1, yoyo: true });

      this.setupImages();
      this.initAnimation();
    }

    private setupImages() {
      this.imagesContainer.style.display = 'flex';
      this.imagesContainer.style.flexWrap = 'nowrap';

      let maxWidth = window.innerWidth * 0.3;

      // Webflow Mobile Portrait breakpoint (767px)
      if (window.innerWidth <= 767) {
        console.log('MOB');
        maxWidth = window.innerWidth * 0.8;
      }

      this.images.forEach((image) => {
        // image.style.flexShrink = '0';
        image.style.width = `${maxWidth}px`;
        image.style.height = 'auto';
        this.totalWidth += image.offsetWidth;
      });

      // Set the container's width to ensure all images are in a single row
      this.imagesContainer.style.width = `${this.totalWidth}px`;
    }

    private initAnimation() {
      const duration = this.totalWidth / 100; // Adjust the speed of the animation
      console.log('HER', duration);

      this.tl.to(this.imagesContainer, {
        x: `-${this.totalWidth - window.innerWidth}px`, // Move left until the last image is at the edge
        ease: 'linear',
        duration: duration,
      });
    }
  }

  new ImageSlider();
};

export default imageSlider;
