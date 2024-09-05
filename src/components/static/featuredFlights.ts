import { gsap } from 'gsap';

export const featuredFlights = () => {
  class FeaturedFlights {
    private typeList: HTMLElement[];
    private mediaList: HTMLElement[];
    private imgList: HTMLImageElement[];
    private vidList: HTMLVideoElement[];
    private fdList: HTMLElement[];
    private currentType: HTMLElement;
    private currentMedia: HTMLElement;
    private currentDescription: HTMLElement;
    private currentVideo: HTMLVideoElement;
    private currentIndex: number;
    private tabletBreakpoint: string;
    private activeMediaAnimation?: gsap.core.Tween;
    private activeDescriptionAnimation?: gsap.core.Tween;

    constructor() {
      this.typeList = [...document.querySelectorAll('.ft_item')].map((item) => item as HTMLElement);
      this.mediaList = [...document.querySelectorAll('.fi_item')].map(
        (item) => item as HTMLElement
      );
      this.imgList = [...document.querySelectorAll('.fi_item .fi_image')].map(
        (item) => item as HTMLImageElement
      );
      this.vidList = [...document.querySelectorAll('.fi_item .fi_video')].map(
        (item) => item as HTMLVideoElement
      );
      this.fdList = Array.from(document.querySelectorAll('.fd_item')).map(
        (item) => item as HTMLElement
      );
      this.currentType = this.typeList[0] as HTMLElement;
      this.currentMedia = this.mediaList[0] as HTMLElement;
      this.currentDescription = this.fdList[0] as HTMLElement;
      this.currentVideo = this.vidList[0].querySelector('video') as HTMLVideoElement;
      this.currentIndex = 0;
      this.tabletBreakpoint = '(max-width: 991px)';

      if (this.currentType) this.currentType.classList.add('is-active');
      if (this.currentVideo) this.currentVideo.play();

      this.initializeImages();
      this.setFlightTypeDataAttributes();

      this.setupEventListeners();
      window.addEventListener('resize', this.setupEventListeners.bind(this));
    }

    private initializeImages() {
      this.mediaList.forEach((img, index) => {
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
          this.mediaList[index].dataset.flightType = flightType;
          this.fdList[index].dataset.flightType = flightType;

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
      this.typeList.forEach((item) => {
        item.removeEventListener('click', this.handleInteraction);
      });

      this.typeList.forEach((item) => {
        item.addEventListener('click', this.handleInteraction.bind(this));
      });

      // if (window.matchMedia(this.tabletBreakpoint).matches) {
      //   // If on tablet or below, use click event
      //   this.typeList.forEach((item) => {
      //     item.addEventListener('click', this.handleInteraction.bind(this));
      //   });
      // } else {
      //   // If above tablet breakpoint, use hover event
      //   this.typeList.forEach((item) => {
      //     item.addEventListener('mouseenter', this.handleInteraction.bind(this));
      //   });
      // }
    }

    private handleInteraction(event: Event) {
      const clickedItem = event.currentTarget as HTMLElement;
      const flightType = clickedItem.querySelector('h3')?.textContent?.toLowerCase() as string;
      const targetIndex = this.mediaList.findIndex((img) => img.dataset.flightType === flightType);
      const targetType = this.typeList[targetIndex];
      const targetMedia = this.mediaList[targetIndex];
      const targetDescription = this.fdList[targetIndex];

      if (targetMedia && targetMedia !== this.currentMedia) {
        this.animateChange(targetType, targetMedia, targetDescription, targetIndex);
      }
    }

    private animateChange(
      targetType: HTMLElement,
      targetMedia: HTMLElement,
      targetDescription: HTMLElement,
      targetIndex: number
    ) {
      // Kill any ongoing animations before starting a new one
      if (this.activeMediaAnimation) {
        this.activeMediaAnimation.kill();
      }
      if (this.activeDescriptionAnimation) {
        this.activeDescriptionAnimation.kill();
      }

      const targetFiImage = targetMedia.querySelector('.fi_image') as HTMLImageElement;
      const targetFiVideo = targetMedia.querySelector('video') as HTMLVideoElement;

      // Animate Type List Container
      this.currentType.classList.remove('is-active');
      targetType.classList.add('is-active');

      // Animate Media Container
      // Current - Out
      this.activeMediaAnimation = gsap.to(this.currentMedia, {
        y: '-100%',
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          this.currentVideo.pause();
          this.currentMedia.style.opacity = '0';
          this.currentMedia.style.zIndex = '1';
          this.currentMedia.style.transform = 'translateY(100%)';
        },
      });
      // Next - In
      this.activeMediaAnimation = gsap.fromTo(
        targetMedia,
        { y: '100%', opacity: 1, zIndex: '2' },
        {
          duration: 0.7,
          y: '0%',
          opacity: 1,
          scale: 1,
          ease: 'power3.inOut',
          onComplete: () => {
            targetMedia.style.zIndex = '2';
            targetFiVideo.play();
          },
        }
      );

      // Animate Description Container
      // Current - Out
      this.activeDescriptionAnimation = gsap.to(this.currentDescription, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          this.currentDescription.style.zIndex = '1';
        },
      });
      // Next - In
      this.activeDescriptionAnimation = gsap.to(targetDescription, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.inOut',
        onStart: () => {
          targetDescription.style.zIndex = '2';
        },
      });

      // Add scale effect to the image
      if (targetFiImage) {
        gsap.fromTo(
          targetFiImage,
          { scale: 1.4 },
          { scale: 1, duration: 0.7, ease: 'power3.inOut' }
        );
      }
      if (targetFiVideo) {
        gsap.fromTo(
          targetFiVideo,
          { scale: 1.4 },
          { scale: 1, duration: 0.7, ease: 'power3.inOut' }
        );
      }

      // Update the current image and index
      this.currentType = targetType;
      this.currentMedia = targetMedia;
      this.currentDescription = targetDescription;
      this.currentIndex = targetIndex;
    }
  }

  new FeaturedFlights();
};
