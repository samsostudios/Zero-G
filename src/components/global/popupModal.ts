import { gsap } from 'gsap';

export const popupModal = () => {
  class FlashSalePopup {
    private flashSaleBanner: HTMLElement;
    private popup: HTMLElement;
    private isOpen: boolean;

    constructor() {
      this.flashSaleBanner = document.querySelector('.section_flash-sale') as HTMLElement;
      this.popup = document.querySelector('.section_popup') as HTMLElement;
      this.isOpen = false;

      this.init();
    }

    private init() {
      // Open the popup when the flash sale banner is clicked
      this.flashSaleBanner.addEventListener('click', () => {
        this.openPopup();
      });

      // Close the popup when clicking outside of it
      this.popup.addEventListener('click', (event: MouseEvent) => {
        this.closePopup();
      });
    }

    private openPopup() {
      console.log('open');
      if (!this.isOpen) {
        gsap.set(this.popup, { display: 'flex', opacity: 0 });
        gsap.to(this.popup, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        this.isOpen = true;
      }
    }

    private closePopup() {
      console.log('clopse');
      if (this.isOpen) {
        gsap.to(this.popup, { opacity: 0, y: -50, duration: 0.5, ease: 'power3.in' });
        gsap.set(this.popup, { display: 'none' });
        this.isOpen = false;
      }
    }
  }
  new FlashSalePopup();
};
export default popupModal;
