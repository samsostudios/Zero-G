import { gsap } from 'gsap';

export const faq = () => {
  console.log('FAQ  - COMP');
  class FAQ {
    // private faqList: HTMLElement;
    private faqList: HTMLElement[];
    // private faqItems: HTMLElement[];

    constructor() {
      // this.faqList = document.querySelector('.faq_list') as HTMLElement;
      this.faqList = [...document.querySelectorAll('.faq_item')].map((item) => item as HTMLElement);
      // this.faqItems = [...this.faqList.querySelectorAll('.faq_item')].map(
      //   (item) => item as HTMLElement
      // );
      this.init();
    }

    private init() {
      this.faqList.forEach((item) => {
        const question = item.querySelector('.faq_item-q') as HTMLElement;
        const answer = item.querySelector('.faq_item-a') as HTMLElement;

        gsap.set(answer, { height: 0, overflow: 'hidden' });

        question.addEventListener('click', () => {
          const isOpen = gsap.getProperty(answer, 'height') !== 0;

          this.closeAllItems();

          if (!isOpen) {
            this.openItem(answer);
          }
        });
      });
    }

    private closeAllItems() {
      this.faqList.forEach((item) => {
        const answer = item.querySelector('.faq_item-a') as HTMLElement;
        gsap.to(answer, { height: 0, duration: 0.5 });
      });
    }

    private openItem(answer: HTMLElement) {
      gsap.to(answer, { display: 'block', height: 'auto', duration: 0.5 });
    }
  }

  new FAQ();
};

export default faq;
