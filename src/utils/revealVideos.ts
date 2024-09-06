import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const revealVideo = (trigger: HTMLElement, videos: HTMLElement[]) => {
  class RevealVideo {
    private triggerElement: HTMLElement;
    private videoElements: HTMLElement[];
    private scrollTrigger;

    constructor(tE: HTMLElement, vE: HTMLElement[]) {
      this.triggerElement = tE;
      this.videoElements = vE;
      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.triggerElement,
        start: '-10% bottom',
        end: 'bottom top',
        // markers: true,
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

      console.log('!!!!', this.triggerElement, this.videoElements);
    }
  }

  new RevealVideo(trigger, videos);
};
