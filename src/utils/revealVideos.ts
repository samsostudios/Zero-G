import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const revealVideo = () => {
  class RevealVideo {
    private triggerElement: HTMLElement;
    private videoElements: HTMLVideoElement[];
    private scrollTrigger;

    constructor() {
      this.triggerElement = document.querySelector('[data-overview-trigger]') as HTMLElement;

      this.videoElements = [...this.triggerElement.querySelectorAll('video')].map(
        (item) => item as HTMLVideoElement
      );

      if (this.videoElements.length !== 0) {
        this.scrollTrigger = ScrollTrigger.create({
          trigger: this.triggerElement,
          start: 'top bottom',
          end: 'bottom top',
          markers: true,
          onEnter: () => {
            this.videoElements.forEach((item) => {
              const video = item as HTMLVideoElement;
              if (video) video.play();
            });
          },
          onLeave: () => {
            this.videoElements.forEach((item) => {
              const video = item as HTMLVideoElement;
              if (video) video.pause();
            });
          },
          onEnterBack: () => {
            this.videoElements.forEach((item) => {
              const video = item as HTMLVideoElement;
              if (video) video.play();
            });
          },
          onLeaveBack: () => {
            this.videoElements.forEach((item) => {
              const video = item as HTMLVideoElement;
              if (video) video.pause();
            });
          },
        });
      }

      // console.log('!!!!', this.triggerElement, this.videoElements);
    }
  }

  new RevealVideo();
};

export default revealVideo;
