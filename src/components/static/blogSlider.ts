import gsap from 'gsap';

export const blogSlider = () => {
  console.log('Blog - COMP');

  class BlogSlider {
    private blogList: HTMLElement;
    private blogItems: NodeListOf<HTMLElement>;
    private itemWidth: number;
    private currentIndex: number;
    private gapAmount: number;
    private containerWidth: number;

    constructor() {
      this.blogList = document.querySelector('.ft-blog_list') as HTMLElement;
      this.blogItems = document.querySelectorAll('.ft-blog_item') as NodeListOf<HTMLElement>;
      this.currentIndex = 0;

      const firstItem = this.blogItems[0];
      const styles = window.getComputedStyle(firstItem);
      this.itemWidth =
        firstItem.offsetWidth + parseFloat(styles.marginRight) + parseFloat(styles.marginLeft);

      const blogListStyles = window.getComputedStyle(this.blogList);
      this.gapAmount = parseFloat(blogListStyles.gap);

      this.containerWidth = window.innerWidth;

      this.attachEventListeners();
    }

    private attachEventListeners() {
      const nextButton = document.querySelector('#bControlNext') as HTMLElement;
      const prevButton = document.querySelector('#bControlPrev') as HTMLElement;

      if (nextButton) {
        nextButton.addEventListener('click', () => this.moveSlider(1));
      }

      if (prevButton) {
        prevButton.addEventListener('click', () => this.moveSlider(-1));
      }
    }

    private moveSlider(direction: number) {
      const maxIndex = this.blogItems.length - 1;
      this.currentIndex = Math.min(Math.max(this.currentIndex + direction, 0), maxIndex);

      // Calculate the maximum allowable movement to avoid white space
      const totalItemsWidth = (this.itemWidth + this.gapAmount) * this.blogItems.length;
      const maxMoveAmount = totalItemsWidth - this.containerWidth;

      // Calculate the current movement amount
      let moveAmount = this.currentIndex * (this.itemWidth + this.gapAmount);

      // Ensure the movement does not exceed the maximum allowed
      if (moveAmount > maxMoveAmount) {
        moveAmount = maxMoveAmount;
      }

      // Use GSAP to animate the transform
      gsap.to(this.blogList, {
        x: -moveAmount,
        duration: 0.5,
        ease: 'power4.out',
      });
    }
  }

  new BlogSlider();
};
