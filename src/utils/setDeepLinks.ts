export const setDeepLinks = () => {
  class SetDeepLinks {
    private links: HTMLElement[];

    constructor() {
      this.links = [...document.querySelectorAll('[data-deep-link]')].map(
        (item) => item as HTMLElement
      );

      this.setListeners();
    }
    private setListeners() {
      if (this.links)
        this.links.forEach((item) => {
          item.addEventListener('click', () => {
            const type = item.dataset.deepLink;
            if (type === 'public') {
              this.setCookie('Public Flights');
            } else if (type === 'private') {
              this.setCookie('Private Flights');
            } else if (type === 'research') {
              this.setCookie('Research Flights');
            }
          });
        });
    }

    private setCookie(cookie: string) {
      localStorage.setItem('flightFilter', cookie);
    }
  }
  new SetDeepLinks();
};
export default setDeepLinks;
