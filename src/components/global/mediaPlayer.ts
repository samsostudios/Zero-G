import { gsap } from 'gsap';

export const mediaPlayer = () => {
  console.log('Media Player - COMP');

  class MediaPlayer {
    private mediaItems: HTMLElement[];
    private modal: HTMLElement;
    private modalVideo: HTMLVideoElement;

    constructor() {
      this.mediaItems = [...document.querySelectorAll('.ft-media_item')].map(
        (item) => item as HTMLElement
      );
      this.modal = document.querySelector('.section_modal') as HTMLElement;
      this.modalVideo = this.modal.querySelector('.video-main') as HTMLVideoElement;

      this.initializeEvents();
    }

    private initializeEvents() {
      this.mediaItems.forEach((item: HTMLElement) => {
        const video = item.querySelector('.video-main') as HTMLVideoElement;
        const stroke = item.querySelector('.clip-img_stroke') as HTMLElement;

        video.pause();

        if (video) {
          item.addEventListener('mouseenter', () => this.animateIn(video, stroke));
          item.addEventListener('mouseleave', () => this.animateOut(video, stroke));
        }

        // item.addEventListener('click', (item) => {
        //   const clicked = item.target as HTMLVideoElement;
        //   const clickedSrc = clicked.src;

        //   video.pause();
        //   if (clickedSrc) if (this.modal) this.modalVideo.src = clickedSrc;

        //   this.showModal();
        // });

        this.modal.addEventListener('click', () => {
          this.modalVideo.src = '';
          this.closeModal();
        });
      });
    }

    private animateIn(video: HTMLVideoElement, stroke: HTMLElement) {
      video.play();

      gsap.to(stroke, { backgroundColor: '#F9FBFC' });
    }
    private animateOut(video: HTMLVideoElement, stroke: HTMLElement) {
      video.pause();

      gsap.to(stroke, { backgroundColor: '#000510' });
    }

    private showModal() {
      gsap.set(this.modal, { display: 'flex' });
      gsap.fromTo(this.modal, { opacity: 0 }, { opacity: 1, ease: 'power3.out' });
    }

    private closeModal() {
      gsap.to(this.modal, {
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(this.modal, { display: 'none' });
        },
      });
    }
  }

  new MediaPlayer();
};
export default mediaPlayer;
