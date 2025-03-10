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
      const consent = localStorage.getItem(this.consentKey);
      if (!consent) {
        console.log('consent not found');
      } else if (consent === 'accepted') {
        console.log('consent found');
      }

      //Event listeners
      this.accept.addEventListener('click', () => {});
      this.decline.addEventListener('click', () => {});
    }

    private setConsent() {}

    private enableTracking() {}

    private disableTracking() {}
  }

  new CookieConsent();
};
export default cookieConsent;
