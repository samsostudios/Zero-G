export const newsletter = () => {
  class Newsletter {
    private form: HTMLFormElement;

    constructor() {
      this.form = document.querySelector('.news-form_form') as HTMLFormElement;

      this.setListeners();
    }

    private setListeners() {
      console.log('NEWSLETTER');
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = this.form.querySelector('input') as HTMLInputElement;
        const value = email.value as string;

        console.log('VAL', this.form, email, value);

        const listId = 'RKV9bY';
        const apiKey = 'Sb5qUW';

        // Send the form data via Ajax (fetch)
        fetch(`https://manage.kmail-lists.com/ajax/subscriptions/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `g=${listId}&email=${email}`,
        })
          .then((response) => {
            if (response.ok) {
              // Show success message without redirecting
              alert('Thank you for subscribing!');
            } else {
              // Handle error response
              alert('There was an error. Please try again.');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('There was a problem submitting the form.');
          });
      });
    }
  }
  new Newsletter();
};
export default newsletter;
