import { gsap } from 'gsap';

declare const grecaptcha: any;

export const hubspotForm = () => {
  console.log('HS Form - C');

  class HubSpotFormHandler {
    private form: HTMLFormElement;
    private portalID = '22411224';
    private formID = 'fa0bc0e2-d2af-496e-abde-61d430b0b733';
    constructor() {
      this.form = document.querySelector('#hs-form') as HTMLFormElement;
      this.bindEvents();
    }

    private bindEvents() {
      if (this.form) {
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
      }
    }

    private validateEmail(email: string): boolean {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    private validatePhoneNumber(phone: string): boolean {
      const phonePattern = /^\d{10,15}$/; // Allow phone numbers with 10 to 15 digits
      return phonePattern.test(phone);
    }

    private collectFormData(): Record<string, string> {
      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='message']") as HTMLTextAreaElement)?.value || '';
      const firstName =
        (document.querySelector("input[name='firstname']") as HTMLInputElement)?.value || '';
      const lastName =
        (document.querySelector("input[name='lastname']") as HTMLInputElement)?.value || '';
      const email =
        (document.querySelector("input[name='email']") as HTMLInputElement)?.value || '';
      const phone =
        (document.querySelector("input[name='phone']") as HTMLInputElement)?.value || '';
      const recaptchaToken =
        (document.querySelector('#g-recaptcha-response') as HTMLInputElement)?.value || '';

      const hsContext = {
        hutk: '',
        pageUrl: window.location.href,
        pageName: document.title,
      };

      if (!this.validateEmail(email)) {
        this.showErrorMessage('Please enter a valid email address.');
        return {};
      }
      if (!this.validatePhoneNumber(phone)) {
        this.showErrorMessage('Please enter a valid phone number (10-15 digits).');
        return {};
      }

      return {
        interested_in: interestedIn,
        how_can_we_help: howCanWeHelp,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        'g-recaptcha-response': recaptchaToken,
        hs_context: JSON.stringify(hsContext),
      };
    }

    private async sendDataToHubSpot(data: Record<string, string>) {
      const hubSpotEndpoint = `https://forms.hubspot.com/uploads/form/v2/${this.portalID}/${this.formID}`;

      const formData = new URLSearchParams();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }

      try {
        const response = await fetch(hubSpotEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (response.ok) {
          console.log('Form data successfully submitted to HubSpot!');
          this.showSuccessMessage();
        } else {
          console.error('Failed to submit data to HubSpot', response.status, await response.text());
          this.showErrorMessage('Failed to submit data to HubSpot');
        }
      } catch (error) {
        console.error('Error submitting form data:', error);
        this.showErrorMessage(`Error submitting form data: ${error}`);
      }
    }

    private handleSubmit(event: Event) {
      event.preventDefault();

      // Check if reCAPTCHA is completed
      const recaptchaToken = (document.querySelector('#g-recaptcha-response') as HTMLInputElement)
        ?.value;

      if (!recaptchaToken) {
        alert('Please complete the reCAPTCHA.');
        return;
      }

      // Proceed with form submission after reCAPTCHA validation
      const formData = this.collectFormData();
      console.log('Form Data:', formData);
      this.sendDataToHubSpot(formData);
    }

    private showSuccessMessage() {
      gsap.to('.hs-form_error', { opacity: 0, duration: 0.5 });

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
        '.hs-form_success',
        { opacity: 0, y: 20, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 1, ease: 'power2.out' }
      );
    }

    private showErrorMessage(text: string) {
      const errorContainer = document.querySelector('.hs-form_error') as HTMLElement;
      const errorText = errorContainer.querySelector('p') as HTMLElement;

      errorText.innerHTML = text;

      gsap.fromTo(
        errorContainer,
        { opacity: 0, y: 20, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 1, ease: 'power2.out' }
      );
    }
  }

  new HubSpotFormHandler();
};

export default hubspotForm;
