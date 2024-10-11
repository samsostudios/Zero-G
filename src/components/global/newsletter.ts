import { gsap } from 'gsap';

export const newsletter = () => {
  class Newsletter {
    private form: HTMLFormElement;

    constructor() {
      this.form = document.querySelector('.news-form_form') as HTMLFormElement;

      this.setListeners();
    }

    private setListeners() {
      // console.log('NEWSLETTER');
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = this.form.querySelector('input[name="Email"]') as HTMLInputElement;
        const value = input.value as string;
        const listId = 'RKV9bY';

        fetch(`https://manage.kmail-lists.com/ajax/subscriptions/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `g=${listId}&email=${value}`,
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log('DATA', data);
            if (data.success) {
              this.showSuccessMessage();
            } else {
              console.log(
                'Error: ' + (data.errors.length ? data.errors[0].message : 'Unknown error')
              );
              this.showErrorMessage(data.errors.length ? data.errors[0].message : 'Unknown error');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            this.showErrorMessage(error);
          });
      });
    }

    // UI Handlers
    private showSuccessMessage() {
      const formParent = this.form.parentElement as HTMLElement;
      const success = formParent.querySelector('.news-form_success');
      const error = formParent.querySelector('.news-form_error');

      // reset error
      gsap.to(error, { opacity: 0, duration: 0.5 });

      gsap.to(this.form, {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(this.form, { display: 'none' });
        },
      });

      gsap.fromTo(
        success,
        { opacity: 0, y: 20, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 1, ease: 'power2.out' }
      );
    }

    private showErrorMessage(text: string) {
      const formParent = this.form.parentElement as HTMLElement;
      const errorContainer = formParent.querySelector('.hs-form_error') as HTMLElement;
      const errorText = errorContainer.querySelector('p') as HTMLElement;

      errorText.innerHTML = text;

      gsap.fromTo(
        errorContainer,
        { opacity: 0, y: 20, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 1, ease: 'power2.out' }
      );
    }
  }
  new Newsletter();
};
export default newsletter;
