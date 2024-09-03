import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const safetyRecord = () => {
  console.log('Safety - COMP');

  gsap.registerPlugin(ScrollTrigger);

  class SafetyStatsCounter {
    private safetyStats: NodeListOf<HTMLElement>;

    constructor() {
      this.safetyStats = document.querySelectorAll('.safety_stat h3');
      this.init();
    }

    // Initialize Values and Get Target
    private init() {
      this.safetyStats.forEach((stat) => {
        const targetValue = this.extractNumber(stat.textContent || '');

        stat.innerHTML = '0';

        // Add ScrollTrigger to the animation
        ScrollTrigger.create({
          trigger: '.section_safety',
          start: 'top 80%',
          onEnter: () => this.animateCount(stat, targetValue),
          once: true,
          //   markers: true,
        });
      });
    }

    // Clean Text for Target Value
    private extractNumber(text: string): number {
      const cleanedText = text.replace(/[^\d,]/g, '');
      return parseInt(cleanedText.replace(/,/g, ''), 10);
    }

    // Animate number to Target Value
    private animateCount(element: HTMLElement, targetValue: number) {
      gsap.to(element, {
        innerHTML: targetValue,
        duration: 2,
        onUpdate: () => {
          if (element) {
            const roundedNumber = Math.ceil(Number(element.textContent));
            element.innerHTML = this.numberWithCommas(roundedNumber) + '+';
          }
        },
        ease: 'power1.inOut',
        snap: { innerHTML: 1 },
      });
    }

    // Set output value to have commas
    private numberWithCommas(x: number): string {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  new SafetyStatsCounter();
};

export default safetyRecord;
