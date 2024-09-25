import { formatFlightLink } from '$utils/formatFlightLink';

export const featuredFlights = () => {
  class FeaturedFlight {
    private flightsSections: HTMLElement[];
    // private flights: HTMLElement[];

    constructor() {
      this.flightsSections = [...document.querySelectorAll('.schedule-list_component')].map(
        (item) => item as HTMLElement
      );
      //   this.flights = [...document.querySelectorAll('.sl_item')].map((item) => item as HTMLElement);

      this.setLinks();
    }

    private setLinks() {
      this.flightsSections.forEach((item) => {
        const label = (item.querySelector('.sl_head h3') as HTMLElement).innerHTML;
        const flights = [...item.querySelectorAll('.sl_item')];
        console.log('info', label, flights);

        if (label === 'Public Flights') {
          flights.forEach((item) => {
            const location = (item.querySelector('h4') as HTMLElement).innerHTML;
            const button = item.querySelector('a') as HTMLAnchorElement;
            const setLink = formatFlightLink(location);

            button.href = setLink;
            // console.log('here', setLink);
          });
        }
      });
    }
  }

  new FeaturedFlight();
};
export default featuredFlights;
