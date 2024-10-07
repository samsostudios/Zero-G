import { gsap } from 'gsap';

export const popupModal = () => {
  class FlashSalePopup {
    private flashSaleBanner: HTMLElement;
    private popup: HTMLElement;
    private isOpen: boolean;
    private flashTrack: HTMLElement;
    private flashItems: HTMLElement[];

    constructor() {
      this.flashSaleBanner = document.querySelector('.section_flash-sale') as HTMLElement;
      this.popup = document.querySelector('.section_popup') as HTMLElement;
      this.flashTrack = document.querySelector('.flash_track') as HTMLElement;
      this.flashItems = [...document.querySelectorAll('.flash_wrap')].map(
        (item) => item as HTMLElement
      );
      this.isOpen = false;

      this.setupListeners();
      this.animateBanner();
    }

    private setupListeners() {
      this.flashSaleBanner.addEventListener('click', () => {
        this.openPopup();
      });

      this.popup.addEventListener('click', () => {
        this.closePopup();
      });
    }

    private openPopup() {
      if (!this.isOpen) {
        gsap.set(this.popup, { display: 'flex', opacity: 0 });
        gsap.to(this.popup, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        this.isOpen = true;
      }
    }

    private closePopup() {
      if (this.isOpen) {
        gsap.to(this.popup, { opacity: 0, y: -50, duration: 0.5, ease: 'power3.in' });
        gsap.set(this.popup, { display: 'none' });
        this.isOpen = false;
      }
    }

    private animateBanner() {
      const calcWidth = this.calculateRenderWidth();
      const setWidth = calcWidth - window.innerWidth;

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(this.flashTrack, { duration: 10, x: -setWidth, ease: 'linear' });

      //   console.log('here!!!', calcWidth);
    }

    private calculateRenderWidth() {
      let renderWidth = 0;
      this.flashItems.forEach((item) => {
        this.flashTrack.style.position = 'aboslute';
        this.flashTrack.style.left = '-9999px';
        this.flashTrack.appendChild(item);

        renderWidth += item.clientWidth;

        // item.remove();
        this.flashTrack.style.position = 'relative';
        this.flashTrack.style.left = 'auto';
      });

      return renderWidth;
    }
  }
  new FlashSalePopup();
};
export default popupModal;
