export const brandsSelector = () => {
  console.log('Brands - COMP');

  class BrandsSelector {
    private brandsList: HTMLElement[];
    private brandsMedia: HTMLElement[];

    constructor() {
      this.brandsList = [...document.querySelectorAll('.brands_grid-item')].map(
        (item) => item as HTMLElement
      );
      this.brandsMedia = [...document.querySelectorAll('.brands_img-item')].map(
        (item) => item as HTMLElement
      );
      this.init();
      this.initializeEvents();
    }

    private init() {
      this.brandsMedia.forEach((item, index) => {
        // console.log('here', item);
        if (index !== 0) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(100%)';
          item.style.zIndex = '1';
        } else {
          item.style.zIndex = '2';
        }
      });
    }

    private initializeEvents() {
      this.brandsList.forEach((item) => {
        item.removeEventListener('click', this.handleInteraction);
      });

      this.brandsList.forEach((item) => {
        item.addEventListener('click', this.handleInteraction.bind(this));
      });
    }

    private handleInteraction(event: Event) {
      const clicked = event.target as HTMLElement;
    }

    private setMediaDataAttributes() {
      this.brandsList.forEach((item, index) => {
        const dataTag = item.querySelector('.brands_tag')?.textContent?.toLowerCase();
        if (dataTag) {
          //   const slug = dataTag.convertToSlug(dataTag);
          this.brandsList[index].dataset.flightType = dataTag;
          this.brandsMedia[index].dataset.flightType = dataTag;

          const button = this.brandsMedia[index].querySelector('a') as HTMLAnchorElement;
          if (button) {
            // button.href = `/${slug}`;
          }
        }
      });
    }
  }
  new BrandsSelector();
};
export default brandsSelector;
