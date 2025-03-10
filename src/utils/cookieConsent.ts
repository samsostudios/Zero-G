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

    private enableTracking() {
      // console.log('enable tracking');

      // Google Analytics
      const gaScript = document.createElement('script');
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-720WB0BGQ2';
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', 'G-720WB0BGQ2');
      };

      // Microsoft Clarity
      const clarity = document.createElement('script');
      clarity.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/omre5evj7v";
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "omre5evj7v");
      `;
      document.head.appendChild(clarity);

      // HubSpot
      const hubspot = document.createElement('script');
      hubspot.src = '//js.hs-scripts.com/22411224.js';
      hubspot.id = 'hs-script-loader';
      hubspot.async = true;
      hubspot.defer = true;
      document.head.appendChild(hubspot);
    }

    private disableTracking() {
      // console.log('disable tracking');

      document.querySelector('#hs-script-loader')?.remove();
      document.querySelector("script[src*='clarity.ms']")?.remove();
      document.querySelector("script[src*='googletagmanager.com']")?.remove();

      // Clear existing cookies
      document.cookie.split(';').forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
      });
    }

    private revealConsent() {
      const tl = gsap.timeline({ delay: 1 });
      tl.fromTo(
        this.component,
        { opacity: 0, y: '2vh', display: 'none' },
        { duration: 2, y: '0vh', opacity: 1, display: 'block', ease: 'power1.out' }
      );
    }

    private removeConsent() {
      const tl = gsap.timeline();
      tl.to(this.component, { opacity: 0, y: '2vh', display: 'power1.out' });
    }
  }

  new CookieConsent();
};
export default cookieConsent;
