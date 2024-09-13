import { gsap } from 'gsap';

declare const grecaptcha: any;

export const hubspotForm = () => {
  console.log('HS Form - C');

  class HubSpotFormHandler {
    private form: HTMLFormElement;
    private portalID = '22411224';
    // private formID = 'fa0bc0e2-d2af-496e-abde-61d430b0b733';
    private formID: string;
    constructor() {
      this.form = document.querySelector('.hs-form_form') as HTMLFormElement;
      this.formID = '';
      this.bindEvents();
    }

    private bindEvents() {
      if (this.form) {
        this.formID = this.form.getAttribute('data-hs-form') as string;
        console.log('!!!', this.portalID, this.formID);
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
      }
    }

    private validateEmail(email: string): boolean {
      console.log('VALIDATE');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    private validatePhoneNumber(phone: string): boolean {
      const phonePattern = /^\d{10,15}$/; // Allow phone numbers with 10 to 15 digits
      return phonePattern.test(phone);
    }

    private collectFlightData(): Record<string, string> {
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

      // console.log('!!!', interestedIn, email);

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

    private collectPrivatetData(): Record<string, string> {
      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const location =
        (document.querySelector("select[name='location']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='message']") as HTMLTextAreaElement)?.value || '';

      const check = this.getSelectedCheckboxes('filters_check-icon');
      // console.log('****', check);

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
        research__charter_or_mixed_payload: interestedIn,
        flight_locations: location,
        how_can_we_help_: howCanWeHelp,
        optional_add_ons__charters_: check,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        'g-recaptcha-response': recaptchaToken,
        hs_context: JSON.stringify(hsContext),
      };
    }

    private collectResearchtData(): Record<string, string> {
      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const payload =
        (document.querySelector("select[name='payload']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='message']") as HTMLTextAreaElement)?.value || '';
      const company =
        (document.querySelector("input[name='company']") as HTMLInputElement)?.value || '';
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
        research__charter_or_mixed_payload: interestedIn,
        mixed_payload__spring_or_summer_s: payload,
        how_can_we_help_: howCanWeHelp,
        company: company,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        'g-recaptcha-response': recaptchaToken,
        hs_context: JSON.stringify(hsContext),
      };
    }

    private getSelectedCheckboxes(className: string): string {
      // Select all checkboxes with the given class
      const checkboxes = [...document.querySelectorAll(`.${className}`)].map(
        (item) => item as HTMLInputElement
      );

      // console.log('?????', checkboxes);

      // Initialize an array to store the selected values
      const selectedValues: string[] = [];

      // Loop through checkboxes and collect values of checked ones
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        const checkVal = checkbox.nextElementSibling as HTMLInputElement;
        // console.log('>>>>', checkVal);
        if (checkVal.checked) {
          // Assuming the label text is next to the checkbox
          const parent = checkbox.parentElement as HTMLElement;

          const label = parent.querySelector('span')?.textContent?.trim();
          // console.log('here', parent, label);
          if (label) {
            selectedValues.push(label);
          }
        }
      });

      // Join the selected values into a comma-separated string
      return selectedValues.join(',');
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
      const formAttr = this.form.dataset.name as string;
      // console.log('!!!', formAttr, formAttr.includes('Research Flight Bookings'));
      if (formAttr.includes('Private Charter Bookings')) {
        // console.log('Private');
        const formData = this.collectPrivatetData();
        this.sendDataToHubSpot(formData);
        // console.log('Form Data:', formData);
      } else if (formAttr.includes('Research Charter Bookings')) {
        // console.log('research');
        const formData = this.collectResearchtData();
        this.sendDataToHubSpot(formData);
        // console.log('Form Data:', formData);
      } else {
        const formData = this.collectFlightData();
        this.sendDataToHubSpot(formData);
      }

      // console.log('Form Data:', formData);

      // this.sendDataToHubSpot(formData);
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
