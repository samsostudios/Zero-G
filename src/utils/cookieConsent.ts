import { gsap } from 'gsap';

export const cookieConsent = () => {
  class CookieConsent {
    private component: HTMLElement;
    private accept: HTMLButtonElement;
    private decline: HTMLButtonElement;
    private readonly consentKey = 'cookieConsent';

    constructor() {
      this.component = document.querySelector('.cookies_component') as HTMLElement;
      this.accept = document.querySelector('#cookieAccept') as HTMLButtonElement;
      this.decline = document.querySelector('#cookieDecline') as HTMLButtonElement;

      this.init();
    }

    private init() {
      if (!this.component) return;

      //check contsent status
      if (!localStorage.getItem(this.consentKey)) {
        this.revealConsent();
      }

      //Event listeners
      this.accept.addEventListener('click', () => this.setConsent('accepted'));
      this.decline.addEventListener('click', () => this.setConsent('declined'));
    }

    private setConsent(status: 'accepted' | 'declined') {
      localStorage.setItem(this.consentKey, status);
      this.removeConsent();

      if (status === 'accepted') {
        this.enableTracking();
      } else {
        this.disableTracking();
      }
    }

    private enableTracking() {}

    private disableTracking() {}

    private revealConsent() {
      const tl = gsap.timeline({ delay: 2 });
      tl.fromTo(
        this.component,
        { opacity: 0, y: '2vh', display: 'none' },
        { duratation: 2, y: '0vh', opacity: 1, display: 'block', ease: 'power1.out' }
      );
    }

    private removeConsent() {
      const tl = gsap.timeline({ delay: 2 });
      tl.to(this.component, { opacity: 0, y: '2vh', display: 'power1.out' });
    }
  }

  new CookieConsent();
};
export default cookieConsent;
