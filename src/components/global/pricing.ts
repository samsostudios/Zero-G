export const pricing = () => {
  console.log('Pricing - COMP');
  class Pricing {
    private pricingTags: HTMLElement[];

    constructor() {
      this.pricingTags = [...document.querySelectorAll('.pricing_item-tag')].map(
        (item) => item as HTMLElement
      );

      this.setTags();
    }

    private setTags() {
      this.pricingTags.forEach((item) => {
        const itemGlyph = item.querySelector('.glyph_square') as HTMLElement;
        const itemText = item.querySelector('.text-size-small') as HTMLElement;
        const getText = itemText.innerHTML;

        if (getText.includes('Individual') || getText.includes('Section')) {
          itemText.innerHTML = 'Public Flights';
          itemGlyph.style.backgroundColor = '#006cfe';
        } else if (getText.includes('Full')) {
          itemText.innerHTML = 'Private Flights';
          itemGlyph.style.backgroundColor = '#020d24';
        } else if (getText.includes('Mixed')) {
          itemText.innerHTML = 'Research Flights';
          itemGlyph.style.backgroundColor = '#36d146';
        }
      });
    }
  }

  new Pricing();
};

export default pricing;
