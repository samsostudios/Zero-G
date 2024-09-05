export const hubspotForm = () => {
  console.log('HS Form - C');
  class HubSpotFormHandler {
    private form: HTMLFormElement;
    private portalID = '22411224';
    private formID = 'fa0bc0e2-d2af-496e-abde-61d430b0b733';

    //     <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
    // <script>
    //   hbspt.forms.create({
    //     region: "na1",
    //     portalId: "22411224",
    //     formId: "fa0bc0e2-d2af-496e-abde-61d430b0b733"
    //   });
    // </script>

    constructor() {
      this.form = document.querySelector('#hs-form') as HTMLFormElement;
      this.bindEvents();
      console.log('FORM', this.form);
    }

    private bindEvents() {
      if (this.form) {
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
      }
    }

    private collectFormData(): Record<string, string> {
      const interestedIn =
        (document.querySelector('.form_dropdown.is-interested') as HTMLInputElement)?.value || '';
      const howCanWeHelp =
        (document.querySelector('is-message') as HTMLTextAreaElement)?.value || '';
      const firstName = (document.querySelector('.is-firstname') as HTMLInputElement)?.value || '';
      const lastName = (document.querySelector('.is-lastname') as HTMLInputElement)?.value || '';
      const email = (document.querySelector('.is-email') as HTMLInputElement)?.value || '';
      const phone = (document.querySelector('.is-phone') as HTMLInputElement)?.value || '';

      return {
        interested_in: interestedIn,
        how_can_we_help: howCanWeHelp,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
      };
    }

    private async sendDataToHubSpot(data: Record<string, string>) {
      const hubSpotEndpoint = `https://forms.hubspot.com/uploads/form/v2/${this.portalID}/${this.formID}`;

      try {
        const response = await fetch(hubSpotEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // This is the correct content type
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log('Form data successfully submitted to HubSpot!');
        } else {
          console.error('Failed to submit data to HubSpot', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error submitting form data:', error);
      }
    }

    private async handleSubmit(event: Event) {
      console.log('Form is being submitted', event); // Log here
      event.preventDefault();
      console.log('Prevented default behavior'); // Log after preventDefault
      const formData = this.collectFormData();

      console.log('FORM', formData);
      await this.sendDataToHubSpot(formData);
    }
  }

  new HubSpotFormHandler();
};

export default hubspotForm;
