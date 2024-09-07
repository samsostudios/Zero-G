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

      this.tl = gsap.timeline({ repeat: -1, yoyo: true });

      console.log('before', this.imagesContainer);
      console.log('before', this.imagesContainer.clientWidth);
      // this.imagesContainer.style.width = '150vw';
      // gsap.to(this.imagesContainer, { width: '150vw' });
      console.log('afyer', this.imagesContainer.clientWidth);

      this.imagesContainer.style.width = '150vw';
      this.imagesContainer.style.display = 'flex';
      gsap.to(this.imagesContainer, { width: '150vw' });

      this.setupImages();
      this.initAnimation();
    }

    private setupImages() {
      let maxWidth = window.innerWidth * 0.2;
      console.log('max', maxWidth);

      // Webflow Mobile Portrait breakpoint (767px)
      if (window.innerWidth <= 767) {
        console.log('MOB');
        maxWidth = window.innerWidth * 0.5;
      }

      this.images.forEach((image) => {
        image.style.flexShrink = '0';
        image.style.flexGrow = '1';
        image.style.width = `${maxWidth}px`;
        image.style.height = 'auto';
        console.log('offset', image.offsetWidth);
        this.totalWidth += image.offsetWidth;
      });

      // Set the container's width to ensure all images are in a single row
      this.imagesContainer.style.width = `${this.totalWidth}px`;
    }

    private initAnimation() {
      const duration = this.totalWidth / 100; // Adjust the speed of the animation

      console.log('here', this.totalWidth, window.innerWidth, this.totalWidth - window.innerWidth);

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
