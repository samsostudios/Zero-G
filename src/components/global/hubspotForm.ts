import { gsap } from 'gsap';

declare const grecaptcha: any;

export const hubspotForm = () => {
  // console.log('HS Form - C');
  class HubSpotFormHandler {
    private form: HTMLFormElement;
    private portalID = '22411224';
    private formID: string;
    private honeyCheck: string;
    constructor() {
      // console.log('HS Form');
      this.form = document.querySelector('.hs-form_form') as HTMLFormElement;
      this.formID = '';
      this.honeyCheck = 'false';
      this.bindEvents();
    }

    private bindEvents() {
      if (this.form) {
        this.formID = this.form.getAttribute('data-hs-form') as string;
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
      }
    }

    // Validation
    private validateEmail(): boolean {
      // console.log('VALIDATE');
      const email =
        (document.querySelector("input[name='Email']") as HTMLInputElement)?.value || '';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    private validatePhoneNumber(): boolean {
      const phone =
        (document.querySelector("input[name='Phone']") as HTMLInputElement)?.value || '';
      const phonePattern = /^\d{10,15}$/; // Allow phone numbers with 10 to 15 digits
      console.log('PHONE!!!', phonePattern.test(phone));
      return phonePattern.test(phone);
    }

    private validateHoney(): boolean {
      const emailConf =
        (document.querySelector("input[name='Email-Confirm']") as HTMLInputElement)?.value || '';
      console.log('HONEY!!!', emailConf.trim() === '');
      const check = emailConf.trim() === '';
      this.honeyCheck = String(check);

      return check;
    }

    // Form Parsing
    private collectContactData(match: string): Record<string, string> {
      console.log('COLLECT!!');

      const firstName =
        (document.querySelector("input[name='Firstname']") as HTMLInputElement)?.value || '';
      const lastName =
        (document.querySelector("input[name='Lastname']") as HTMLInputElement)?.value || '';
      const email =
        (document.querySelector("input[name='Email']") as HTMLInputElement)?.value || '';
      const phone =
        (document.querySelector("input[name='Phone']") as HTMLInputElement)?.value || '';

      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='Message']") as HTMLTextAreaElement)?.value || '';

      // const emailConf =
      //   (document.querySelector("input[name='Email-Confirm']") as HTMLInputElement)?.value || '';
      // const recaptchaToken =
      //   (document.querySelector('#g-recaptcha-response') as HTMLInputElement)?.value || '';

      const testData: Record<string, any> = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        how_can_we_help: howCanWeHelp,
      };

      console.log('BASE DATA:', testData);

      if (match === 'General') {
        console.log('General', match);
        testData.interested_in = interestedIn;
      } else if (match === 'Private') {
        console.log('Private', match);
        const location =
          (document.querySelector("select[name='Location']") as HTMLInputElement)?.value || '';
        const check = this.getSelectedCheckboxes('filters_check-icon');

        testData.charter_type = interestedIn;
        testData.flight_locations = location;
        testData.optional_add_ons__charters_ = check;
      } else if (match === 'Research') {
        console.log('Research', match);

        const payload =
          (document.querySelector("select[name='Payload']") as HTMLInputElement)?.value || '';
        const company =
          (document.querySelector("input[name='Company']") as HTMLInputElement)?.value || '';

        testData.research__charter_or_mixed_payload = interestedIn;
        testData.mixed_payload__spring_or_summer_s = payload;
        testData.company = company;
      }

      const hsContext = {
        hutk: '',
        pageUrl: window.location.href,
        pageName: document.title,
      };

      testData.hs_context = JSON.stringify(hsContext);

      console.log('RETURN', testData);

      return testData;
      // return {
      //   firstname: firstName,
      //   lastname: lastName,
      //   email: email,
      //   phone: phone,

      //   interested_in: interestedIn,
      //   how_can_we_help: howCanWeHelp,

      //   // honeypotPassed: this.honeyCheck,
      //   // 'g-recaptcha-response': recaptchaToken,
      //   hs_context: JSON.stringify(hsContext),
      // };
    }

    private collectPrivatetData(): Record<string, string> {
      const firstName =
        (document.querySelector("input[name='Firstname']") as HTMLInputElement)?.value || '';
      const lastName =
        (document.querySelector("input[name='Lastname']") as HTMLInputElement)?.value || '';
      const email =
        (document.querySelector("input[name='Email']") as HTMLInputElement)?.value || '';
      const phone =
        (document.querySelector("input[name='Phone']") as HTMLInputElement)?.value || '';

      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='Message']") as HTMLTextAreaElement)?.value || '';

      const location =
        (document.querySelector("select[name='Location']") as HTMLInputElement)?.value || '';
      const check = this.getSelectedCheckboxes('filters_check-icon');
      // console.log('****', check);
      // const recaptchaToken =
      //   (document.querySelector('#g-recaptcha-response') as HTMLInputElement)?.value || '';

      const hsContext = {
        hutk: '',
        pageUrl: window.location.href,
        pageName: document.title,
      };

      if (!this.validateEmail()) {
        this.showErrorMessage('Please enter a valid email address.');
        return {};
      }
      if (!this.validatePhoneNumber()) {
        this.showErrorMessage('Please enter a valid phone number (10-15 digits).');
        return {};
      }

      return {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,

        research__charter_or_mixed_payload: interestedIn,
        how_can_we_help_: howCanWeHelp,
        flight_locations: location,
        optional_add_ons__charters_: check,
        // 'g-recaptcha-response': recaptchaToken,
        hs_context: JSON.stringify(hsContext),
      };
    }

    private collectResearchtData(): Record<string, string> {
      const firstName =
        (document.querySelector("input[name='Firstname']") as HTMLInputElement)?.value || '';
      const lastName =
        (document.querySelector("input[name='Lastname']") as HTMLInputElement)?.value || '';
      const email =
        (document.querySelector("input[name='Email']") as HTMLInputElement)?.value || '';
      const phone =
        (document.querySelector("input[name='Phone']") as HTMLInputElement)?.value || '';

      const interestedIn =
        (document.querySelector("select[name='Interested-In']") as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector("textarea[name='Message']") as HTMLTextAreaElement)?.value || '';

      const payload =
        (document.querySelector("select[name='Payload']") as HTMLInputElement)?.value || '';
      const company =
        (document.querySelector("input[name='Company']") as HTMLInputElement)?.value || '';
      // const recaptchaToken =
      //   (document.querySelector('#g-recaptcha-response') as HTMLInputElement)?.value || '';

      const hsContext = {
        hutk: '',
        pageUrl: window.location.href,
        pageName: document.title,
      };

      if (!this.validateEmail()) {
        this.showErrorMessage('Please enter a valid email address.');
        return {};
      }
      if (!this.validatePhoneNumber()) {
        this.showErrorMessage('Please enter a valid phone number (10-15 digits).');
        return {};
      }

      return {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,

        research__charter_or_mixed_payload: interestedIn,
        how_can_we_help_: howCanWeHelp,
        mixed_payload__spring_or_summer_s: payload,
        company: company,
        // 'g-recaptcha-response': recaptchaToken,
        hs_context: JSON.stringify(hsContext),
      };
    }

    // Main Form Logic
    private handleSubmit(event: Event) {
      event.preventDefault();
      event.stopPropagation();

      let formData: Record<string, string> = {};

      // Check if reCAPTCHA is completed
      // const recaptchaToken = (document.querySelector('#g-recaptcha-response') as HTMLInputElement)
      //   ?.value;

      // if (!recaptchaToken) {
      //   alert('Please complete the reCAPTCHA.');
      //   return;
      // }

      // Form Validation
      if (!this.validateEmail()) {
        this.showErrorMessage('Please enter a valid email address.');
        return;
      }

      if (!this.validatePhoneNumber()) {
        this.showErrorMessage('Please enter a valid phone number (10-15 digits).');
        return;
      }

      if (!this.validateHoney()) {
        this.showErrorMessage('Something went wrong! Please try again later.');
        //Send spam submission to API
        // this.form.removeEventListener('submit', this.handleSubmit);
        // this.form.submit();
        return;
      }

      // Proceed with form submission after reCAPTCHA validation
      const formAttr = this.form.dataset.name as string;
      const matchForm = formAttr.split(' ')[0];
      console.log('ATTR', formAttr.split(' ')[0]);
      formData = this.collectContactData(matchForm);
      // if (formAttr.includes('Private Charter Bookings')) {
      //   formData = this.collectContactData();
      // } else if (formAttr.includes('Research Charter Bookings')) {
      //   formData = this.collectResearchtData();
      // } else {
      //   formData = this.collectContactData();
      // }

      console.log('Form Data!!!!', formData);

      this.sendDataToHubSpot(formData);
    }

    // Send POST
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

    // UI Handlers
    private showSuccessMessage() {
      const formParent = this.form.parentElement as HTMLElement;
      const success = formParent.querySelector('.hs-form_success');
      const error = formParent.querySelector('.hs-form_error');

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

    // Helpers
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
  }

  new HubSpotFormHandler();
};
export default hubspotForm;
