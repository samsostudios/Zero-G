import { gsap } from 'gsap';

export const testimonialsSlider = () => {
  // console.log('Testimonials - COMP');
  class TestimonialSlider {
    private testimonialsList: HTMLElement;
    private testimonialsItems: NodeListOf<HTMLElement>;
    private uiIndicators: NodeListOf<HTMLElement>;
    private currentIndex: number;
    private intervalTime: number;
    private intervalId: number | undefined;

    constructor() {
      this.testimonialsList = document.querySelector('.testimonials_list') as HTMLElement;
      this.testimonialsItems = document.querySelectorAll('.testimonials_item');
      this.uiIndicators = document.querySelectorAll('.s-ui_item');
      this.currentIndex = 0;
      this.intervalTime = parseInt(this.testimonialsList.dataset.slideSpeed as string) * 1000;

      //   this.intervalTime = 10000; // 10 seconds
      this.init();
    }

    private init() {
      this.showItem(this.currentIndex);
      this.intervalId = window.setInterval(() => this.nextItem(), this.intervalTime);
    }

    private showItem(index: number) {
      // Hide all items
      this.testimonialsItems.forEach((item, i) => {
        gsap.to(item, { opacity: 0, duration: 0.5 });
        item.style.display = 'none';
      });

      // Reset all indicators
      this.uiIndicators.forEach((indicator) => {
        indicator.classList.remove('is-active');
      });

      // Show the selected item
      const selectedItem = this.testimonialsItems[index];
      selectedItem.style.display = 'flex';
      gsap.to(selectedItem, { opacity: 1, duration: 0.5 });

      // Update the corresponding indicator
      this.uiIndicators[index].classList.add('is-active');
    }

    private nextItem() {
      this.currentIndex = (this.currentIndex + 1) % this.testimonialsItems.length;
      this.showItem(this.currentIndex);
    }

    public stopRotation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }

    public startRotation() {
      this.stopRotation();
      this.intervalId = window.setInterval(() => this.nextItem(), this.intervalTime);
    }
  }

  new TestimonialSlider();
};

export default testimonialsSlider;
