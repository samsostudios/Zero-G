import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const selectSlider = () => {
  class SelectSlider {
    private typeList: HTMLElement[];
    private mediaList: HTMLElement[];
    // private imgList: HTMLImageElement[];
    private vidList: HTMLVideoElement[];
    private fdList: HTMLElement[];
    private modalList: HTMLElement[];
    private modalLinks: HTMLElement[];

    private currentType: HTMLElement;
    private currentMedia: HTMLElement;
    private currentDescription: HTMLElement;
    private currentVideo: HTMLVideoElement;
    private descriptionHeight: number;
    private currentIndex: number;
    private tabletBreakpoint: string;

    private modal: HTMLElement;

    private activeMediaAnimation?: gsap.core.Tween;
    private activeDescriptionAnimation?: gsap.core.Tween;

    constructor() {
      this.typeList = [...document.querySelectorAll('[data-slide-toggle]')].map(
        (item) => item as HTMLElement
      );
      this.mediaList = [...document.querySelectorAll('[data-slide-media]')].map(
        (item) => item as HTMLElement
      );
      // this.imgList = [...document.querySelectorAll('.fi_item .fi_image')].map(
      //   (item) => item as HTMLImageElement
      // );
      this.vidList = [...document.querySelectorAll('[data-slide-video]')].map(
        (item) => item as HTMLVideoElement
      );
      this.fdList = [...document.querySelectorAll('[data-slide-description]')].map(
        (item) => item as HTMLElement
      );
      this.modalList = [...document.querySelectorAll('[data-slide-modal]')].map(
        (item) => item as HTMLElement
      );
      this.modalLinks = [...document.querySelectorAll('[data-modal-link]')].map(
        (item) => item as HTMLElement
      );

      this.currentType = this.typeList[0] as HTMLElement;
      this.currentMedia = this.mediaList[0] as HTMLElement;
      this.currentDescription = this.fdList[0] as HTMLElement;
      this.currentVideo = this.vidList[0].querySelector('.video-main') as HTMLVideoElement;
      this.currentIndex = 0;
      this.tabletBreakpoint = '(max-width: 991px)';
      this.descriptionHeight = 0;

      this.modal = document.querySelector('.section_modal') as HTMLElement;

      if (this.currentType) this.currentType.classList.add('is-active');

      this.initializeMedia();
      if (this.fdList.length !== 0) this.handleDescriptionSizing();
      this.setMediaDataAttributes();
      this.setupScrollTrigger();
      this.setupEventListeners();
      window.addEventListener('resize', this.setupEventListeners.bind(this));
    }

    private initializeMedia() {
      this.mediaList.forEach((item, index) => {
        if (index !== 0) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(100%)';
          item.style.zIndex = '1';
        } else {
          item.style.zIndex = '2';
        }
      });

      this.fdList.forEach((item, index) => {
        if (index !== 0) {
          item.style.opacity = '0';
          item.style.zIndex = '1';
        } else {
          item.style.zIndex = '2';
        }
      });
    }

    private handleDescriptionSizing() {
      const descriptionList = document.querySelector('.fd_list');

      const setDescriptionHeight = () => {
        const descriptionHeight = this.getDescriptionSize();
        gsap.to(descriptionList, { height: descriptionHeight });
        this.descriptionHeight = descriptionHeight;
      };

      setDescriptionHeight();

      window.addEventListener('resize', () => {
        setDescriptionHeight();
      });
    }

    private getDescriptionSize() {
      let maxHeight = 0;
      this.fdList.forEach((item) => {
        const getHeight = item.clientHeight;
        if (getHeight > maxHeight) {
          maxHeight = getHeight;
        }
      });

      return maxHeight;
    }

    private setMediaDataAttributes() {
      this.typeList.forEach((item, index) => {
        const slideTag = item.querySelector('[data-slide-tag]')?.textContent?.toLowerCase();

        if (slideTag) {
          const slug = this.convertToSlug(slideTag);
          this.mediaList[index].dataset.matchTag = slideTag;

          if (this.fdList.length !== 0) {
            this.fdList[index].dataset.matchTag = slideTag;

            const button = this.fdList[index].querySelector('a') as HTMLAnchorElement;
            if (button) {
              button.href = `/${slug}`;
            }
          }

          // if (this.modalList.length !== 0) {
          //   this.modalList[index].dataset.matchTag = slideTag;
          // }
          // if (this.modalLinks.length !== 0) {
          //   this.modalLinks[index].dataset.matchTag = slideTag;
          // }
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

      // this.modalLinks.forEach((item) => {
      //   item.addEventListener('click', (e) => {
      //     this.showModal();
      //   });
      // });

      // if (this.modal) this.modal.addEventListener('click', this.closeModal.bind(this));

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
      const slideTag = clickedItem
        .querySelector('[data-slide-tag]')
        ?.textContent?.toLowerCase() as string;

      const targetIndex = this.mediaList.findIndex((img) => img.dataset.matchTag === slideTag);
      const targetType = this.typeList[targetIndex];
      const targetMedia = this.mediaList[targetIndex];
      const targetModal = this.modalList[targetIndex];
      const targetDescription = this.fdList[targetIndex];

      if (targetMedia && targetMedia !== this.currentMedia) {
        this.animateChange(targetType, targetMedia, targetDescription, targetIndex);
      }

      if (targetModal) {
        gsap.to(targetModal, { opacity: 1, display: 'block' });
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

      // const targetFiImage = targetMedia.querySelector('.fi_image') as HTMLImageElement;
      const targetFiVideo = targetMedia.querySelector('.video-main') as HTMLVideoElement;

      // console.log('ANIMATE', targetFiVideo);

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
            const playPromise = targetFiVideo.play();
            if (playPromise !== undefined) {
              playPromise
                .then((_) => {
                  // targetFiVideo.pause();
                })
                .catch((error) => {
                  console.log('Play Error:', error);
                });
            }
          },
        }
      );

      // Animate Description Container
      if (targetDescription) {
        // Current - Out
        const curDescription = this.currentDescription;
        this.activeDescriptionAnimation = gsap.to(curDescription, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => {
            curDescription.style.zIndex = '1';
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
      }

      // Add scale effect to the image /video
      // if (targetFiImage) {
      //   gsap.fromTo(
      //     targetFiImage,
      //     { scale: 1.4 },
      //     { scale: 1, duration: 0.7, ease: 'power3.inOut' }
      //   );
      // }
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

    private setupScrollTrigger() {
      const section = document.querySelector('.section_home-flights');
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        // markers: true,
        onEnter: () => {
          if (this.currentVideo) this.currentVideo.play();
        },
        onLeave: () => {
          if (this.currentVideo) this.currentVideo.pause();
        },
        onEnterBack: () => {
          if (this.currentVideo) this.currentVideo.play();
        },
        onLeaveBack: () => {
          if (this.currentVideo) this.currentVideo.pause();
        },
      });
    }

    private showModal() {
      gsap.set(this.modal, { display: 'flex' });
      gsap.fromTo(this.modal, { opacity: 0 }, { opacity: 1, ease: 'power3.out' });
    }

    private closeModal() {
      gsap.to(this.modal, {
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(this.modal, { display: 'none' });
        },
      });
    }
  }

  new SelectSlider();
};
export default selectSlider;
