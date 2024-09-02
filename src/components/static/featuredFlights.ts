import { gsap } from 'gsap';

export const featuredFlights = () => {
  class FeaturedFlights {
    private typeList: HTMLElement[];
    private imgList: HTMLImageElement[];
    private fdList: HTMLElement[];
    private currentImage: HTMLImageElement;
    private currentIndex: number;
    private tabletBreakpoint: string;
    private activeImageAnimation?: gsap.core.Tween;
    private activeDescriptionAnimation?: gsap.core.Tween;

    constructor() {
      this.typeList = [...document.querySelectorAll('.ft_item')].map((item) => item as HTMLElement);
      this.imgList = [...document.querySelectorAll('.fi_item')].map(
        (item) => item as HTMLImageElement
      );
      this.fdList = Array.from(document.querySelectorAll('.fd_item')).map(
        (item) => item as HTMLElement
      );
      this.currentImage = this.imgList[0] as HTMLImageElement;
      this.currentIndex = 0;
      this.tabletBreakpoint = '(max-width: 991px)';

      this.initializeImages();
      this.setFlightTypeDataAttributes();

      this.setupEventListeners();
      window.addEventListener('resize', this.setupEventListeners.bind(this));
    }

    private initializeImages() {
      this.imgList.forEach((img, index) => {
        if (index !== 0) {
          img.style.opacity = '0';
          img.style.transform = 'translateY(100%)';
          img.style.zIndex = '1';
        } else {
          img.style.zIndex = '2';
        }
      });

      this.fdList.forEach((desc, index) => {
        if (index !== 0) {
          desc.style.opacity = '0';
          desc.style.zIndex = '1';
        } else {
          desc.style.zIndex = '2';
        }
      });
    }

    private setFlightTypeDataAttributes() {
      this.typeList.forEach((item, index) => {
        const flightType = item.querySelector('h3')?.textContent?.toLowerCase();
        if (flightType) {
          const slug = this.convertToSlug(flightType);
          this.imgList[index].dataset.flightType = flightType;
          this.fdList[index].dataset.flightType = flightType;

          // Set the link for the button inside the fd_item
          const button = this.fdList[index].querySelector('a') as HTMLAnchorElement;
          if (button) {
            button.href = `/${slug}`;
          }
        }
      });
    }

    private convertToSlug(text: string): string {
      return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    private setupEventListeners() {
      // Remove any existing event listeners
      this.typeList.forEach((item) => {
        item.removeEventListener('mouseenter', this.handleInteraction);
        item.removeEventListener('click', this.handleInteraction);
      });

      if (window.matchMedia(this.tabletBreakpoint).matches) {
        // If on tablet or below, use click event
        this.typeList.forEach((item) => {
          item.addEventListener('click', this.handleInteraction.bind(this));
        });
      } else {
        // If above tablet breakpoint, use hover event
        this.typeList.forEach((item) => {
          item.addEventListener('mouseenter', this.handleInteraction.bind(this));
        });
      }
    }

    private handleInteraction(event: Event) {
      const item = event.currentTarget as HTMLElement;
      const flightType = item.querySelector('h3')?.textContent?.toLowerCase() as string;
      const targetIndex = this.imgList.findIndex((img) => img.dataset.flightType === flightType);
      const targetImage = this.imgList[targetIndex];
      const targetDescription = this.fdList[targetIndex];

      if (targetImage && targetImage !== this.currentImage) {
        this.animateImageChange(targetImage, targetDescription, targetIndex);
      }
    }

    private animateImageChange(
      targetImage: HTMLImageElement,
      targetDescription: HTMLElement,
      targetIndex: number
    ) {
      // Kill any ongoing animations before starting a new one
      if (this.activeImageAnimation) {
        this.activeImageAnimation.kill();
      }
      if (this.activeDescriptionAnimation) {
        this.activeDescriptionAnimation.kill();
      }

      const targetFiImage = targetImage.querySelector('.fi_image') as HTMLImageElement;

      // Animate the current image out of view
      this.activeImageAnimation = gsap.to(this.currentImage, {
        y: '-100%',
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          this.currentImage.style.opacity = '0';
          this.currentImage.style.zIndex = '1';
          this.currentImage.style.transform = 'translateY(100%)';
        },
      });

      // Fade out the current description
      const currentDescription = this.fdList[this.currentIndex];
      this.activeDescriptionAnimation = gsap.to(currentDescription, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          currentDescription.style.zIndex = '1';
        },
      });

      // Animate the target image into view
      this.activeImageAnimation = gsap.fromTo(
        targetImage,
        { y: '100%', opacity: 1, zIndex: '2' },
        {
          duration: 0.7,
          y: '0%',
          opacity: 1,
          scale: 1,
          ease: 'power3.inOut',
          onComplete: () => {
            targetImage.style.zIndex = '2';
          },
        }
      );

      // Fade in the target description
      this.activeDescriptionAnimation = gsap.to(targetDescription, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.inOut',
        onStart: () => {
          targetDescription.style.zIndex = '2';
        },
      });

      // Add scale effect to the .fi_image element if it exists
      if (targetFiImage) {
        gsap.fromTo(
          targetFiImage,
          { scale: 1.4 },
          { scale: 1, duration: 0.7, ease: 'power3.inOut' }
        );
      }

      // Update the current image and index
      this.currentImage = targetImage;
      this.currentIndex = targetIndex;
    }
  }

  new FeaturedFlights();
};
