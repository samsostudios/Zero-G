import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const flightSchedule = () => {
  console.log('Flight Schedule - COMP');

  class FlightSchedule {
    private scheduleMain: HTMLElement;
    private flightsWrap: HTMLElement;
    private filters: HTMLElement[];
    private blockTemplate: HTMLElement;
    private headTemplate: HTMLElement;
    private rowTemplate: HTMLElement;
    private flightData: HTMLElement[];
    private parsedFlightData: {
      location: string;
      date: string;
      time: string;
      limitedSeats: boolean;
      soldOut: boolean;
      type: string;
      color: string;
      price: string;
      link: string;
    }[];
    private sortedFlightData: {
      month: string;
      year: string;
      flights: {
        location: string;
        date: string;
        time: string;
        limitedSeats: boolean;
        soldOut: boolean;
        type: string;
        color: string;
        price: string;
        link: string;
      }[];
    }[];
    private renderHeight: number;
    private easeFloat: any;
    private currentFilterKey: string;
    private activeFilters: string[] = [];

    constructor() {
      this.scheduleMain = document.querySelector('.schedule_main') as HTMLElement;
      this.flightsWrap = document.querySelector('.schedule_main') as HTMLElement;
      this.blockTemplate = document.querySelector('.block-template') as HTMLElement;
      this.headTemplate = document.querySelector('.head-template') as HTMLElement;
      this.rowTemplate = document.querySelector('.row-template') as HTMLElement;
      this.filters = [...document.querySelectorAll('.filters_checkbox')].map(
        (item) => item as HTMLElement
      );
      this.flightData = [
        ...(document.querySelectorAll('.sl_data-item') as NodeListOf<HTMLElement>),
      ];
      this.parsedFlightData = [];
      this.sortedFlightData = [];
      this.renderHeight = 0;
      this.easeFloat = CustomEase.create('floatDown', 'M0,0 C0.25,0.1 0.25,1 1,1');
      this.currentFilterKey = localStorage.getItem('flightFilter') || 'All Flights';

      this.init();
    }

    // initialize
    private init() {
      this.showLoadingAnimation();
      this.setActiveFilter(this.currentFilterKey);

      const firstFilter = this.filters[0]; // Select the first filter
      const glyphSquare = firstFilter.querySelector('.glyph_square') as HTMLElement;
      glyphSquare.classList.add('has-stroke');

      this.parsedFlightData = this.parseData(this.flightData);
      // console.log('PARSED DATA', this.parsedFlightData);
      this.sortedFlightData = this.sortFlights(this.currentFilterKey);
      // console.log('SORTED DATA', this.sortedFlightData);

      const templates = document.querySelector('.sl_templates');
      gsap.set(templates, { display: 'none' });

      // this.setupFilterListeners();

      setTimeout(() => {
        this.renderUpdates();
        this.hideLoadingAnimation();
        this.setupFilterListeners();
        // this.addModalCloseEvent();
      }, 2000);
    }

    // Parse flight data from html feed
    private parseData(data: HTMLElement[]) {
      const flightArray = data.map((item) => {
        let location = item.querySelector('.sl_d-location')?.textContent?.trim() || '';
        const locationOverride =
          item.querySelector('.sl_d-location.is-override')?.textContent?.trim() || '';
        const date = item.querySelector('.sl_d-date')?.textContent?.trim() || '';
        const time = item.querySelector('.sl_d-time')?.textContent?.trim() || '';
        const limitedSeatsElement = item.querySelector('.sl_d-limited');
        const soldOutElement = item.querySelector('.sl_d-sold');
        const type = item.querySelector('.sl_d-type')?.textContent?.trim() || '';
        const price = item.querySelector('.sl_d-price')?.textContent?.trim() || '';
        const colorElement = item.querySelector('.sl_d-color') as HTMLElement;

        const dateObj = new Date(date);
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear().toString();
        const link = this.formatRowLink(location);

        if (location === '') {
          if (locationOverride === '') {
            location = 'Location - TBD';
          } else {
            location = locationOverride;
          }
        }

        const limitedSeats =
          limitedSeatsElement && !limitedSeatsElement.classList.contains('w-condition-invisible')
            ? true
            : false;

        const soldOut =
          soldOutElement && !soldOutElement.classList.contains('w-condition-invisible')
            ? true
            : false;

        const color = colorElement.style.backgroundColor as string;

        return {
          month,
          year,
          location,
          date,
          time,
          limitedSeats,
          soldOut,
          type,
          color,
          price,
          link,
        };
      });

      return flightArray;
    }

    // Setup filter listeners
    private setupFilterListeners() {
      this.filters.forEach((filter) => {
        const input = filter.querySelector('input') as HTMLInputElement;
        if (input) {
          input.addEventListener('change', () => {
            const selectedParent = input.parentElement as HTMLElement;
            const selectedFilter = selectedParent.querySelector('span')?.textContent?.trim() || '';

            if (this.currentFilterKey === selectedFilter) {
              this.currentFilterKey = 'All Flights';
              this.resetFilters();
              this.setActiveFilter(this.currentFilterKey);
            } else {
              this.currentFilterKey = selectedFilter;
              this.resetFilters();
              this.setActiveFilter(this.currentFilterKey);
            }

            localStorage.setItem('flightFilter', this.currentFilterKey);

            this.sortedFlightData = this.sortFlights(this.currentFilterKey);
            this.renderUpdates();
          });
        }
      });
    }

    // Sort parsed data by month
    private sortFlights(filter: string) {
      const groupedFlights: {
        month: string;
        year: string;
        flights: {
          location: string;
          date: string;
          time: string;
          limitedSeats: boolean;
          soldOut: boolean;
          type: string;
          color: string;
          price: string;
          link: string;
        }[];
      }[] = [];

      let filteredData = this.parsedFlightData;

      // console.log('!!', filter);

      // Apply filtering based on the filter key
      if (filter !== 'All Flights') {
        filteredData = this.parsedFlightData.filter((flight) => flight.type === filter);
      }

      // Sort flights by date and then by time ("Morning Flight" before "Afternoon Flight")
      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // First, compare by date
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }

        // If the flights are on the same date, compare by "time" field
        if (a.time === 'Morning Flight' && b.time === 'Afternoon Flight') {
          return -1; // Morning comes first
        }
        if (a.time === 'Afternoon Flight' && b.time === 'Morning Flight') {
          return 1; // Afternoon comes second
        }
        return 0;
      });

      // console.log('FILTERED', filteredData);

      filteredData.forEach((flight) => {
        const dateObj = new Date(flight.date);
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear().toString();

        let monthYearGroup = groupedFlights.find(
          (group) => group.month === month && group.year === year
        );

        if (!monthYearGroup) {
          // If there's no group for the current month and year, create a new one
          monthYearGroup = { month, year, flights: [] };
          groupedFlights.push(monthYearGroup);
        }

        // Add the flight to the current month-year group
        monthYearGroup.flights.push(flight);
      });

      return groupedFlights;
    }

    // Render Updates to DOM
    private renderUpdates() {
      this.clearList();
      const blocks = this.sortedFlightData
        .map((group) => this.createFlightBlock(group))
        .filter((block) => block !== null);

      this.calculateRenderHeight(blocks);

      gsap.to(this.scheduleMain, {
        duration: 1,
        height: this.renderHeight,
        ease: 'power3.inOut',
      });

      this.revealBlock(blocks);
    }

    // Create new flight block for the schedule
    private createFlightBlock(group: {
      month: string;
      year: string;
      flights: {
        location: string;
        date: string;
        time: string;
        limitedSeats: boolean;
        soldOut: boolean;
        type: string;
        color: string;
        price: string;
        link: string;
      }[];
    }) {
      const block = this.blockTemplate.cloneNode(true) as HTMLElement;
      block.classList.remove('block-template');

      // Block Head
      const head = this.headTemplate.cloneNode(true) as HTMLElement;
      const headMonth = head.querySelector('.sl_head-month');
      const headYear = head.querySelector('.sl_head-year');

      if (headMonth) headMonth.textContent = group.month;
      if (headYear) headYear.textContent = group.year;

      block.appendChild(head);

      // Block Rows
      group.flights.forEach((flight) => {
        const row = this.rowTemplate.cloneNode(true) as HTMLElement;
        const locationElement = row.querySelector('.sl_row-location');
        const dateElement = row.querySelector('.sl_row-date');
        const timeElement = row.querySelector('.sl_row-time');
        const limitedSeatsElement = row.querySelector('.sl_tag.is-ls') as HTMLElement;
        const soldOutElement = row.querySelector('.sl_tag.is-so') as HTMLElement;
        const typeElement = row.querySelector('.sl_row-type') as HTMLElement;
        const colorElement = row.querySelector('.sl_row-glyph') as HTMLElement;
        const priceElement = row.querySelector('.sl_row-price') as HTMLElement;
        const linkElement = row as HTMLAnchorElement;

        if (locationElement) locationElement.textContent = flight.location;
        if (dateElement) dateElement.textContent = flight.date;
        if (timeElement) timeElement.textContent = flight.time;
        if (limitedSeatsElement)
          limitedSeatsElement.style.display = flight.limitedSeats ? 'block' : 'none';
        if (soldOutElement) soldOutElement.style.display = flight.soldOut ? 'block' : 'none';
        if (typeElement) typeElement.textContent = flight.type;
        if (colorElement) colorElement.style.backgroundColor = flight.color;
        flight.color
          ? (colorElement.style.backgroundColor = flight.color)
          : (colorElement.style.backgroundColor = 'transparent');
        if (priceElement) priceElement.textContent = flight.price;
        // if (linkElement) linkElement.href = flight.link;
        if (linkElement) {
          if (flight.type === 'Public Flights') linkElement.href = flight.link;
          else if (flight.type === 'Private Flights') linkElement.href = '/private-flight-bookings';
          else if (flight.type === 'Research Flights')
            linkElement.href = '/research-flight-bookings';
        }

        block.appendChild(row);
      });

      return block;
    }

    // Clear current UI elements
    private clearList() {
      this.flightsWrap.innerHTML = '';
      this.renderHeight = 0;
    }

    //Calc height of new schedule object
    private calculateRenderHeight(blocks: HTMLElement[]) {
      blocks.forEach((item) => {
        item.style.position = 'aboslute';
        item.style.left = '-9999px';
        document.body.appendChild(item);

        this.renderHeight += item.clientHeight + 32;

        item.remove();
      });
    }

    //Reveal schedule elements
    private revealBlock(blocks: HTMLElement[]) {
      if (!this.scheduleMain) return;
      if (!this.flightsWrap) return;

      blocks.forEach((item) => {
        if (item) {
          this.flightsWrap.appendChild(item);
          gsap.fromTo(
            item,
            { y: '1rem', opacity: 0 },
            { delay: 0.2, y: 0, opacity: 1, ease: this.easeFloat }
          );
        }
      });
    }

    //format link text
    private formatRowLink(text: string) {
      const stateAbbreviations: { [key: string]: string } = {
        AL: 'alabama',
        AK: 'alaska',
        AZ: 'arizona',
        AR: 'arkansas',
        CA: 'california',
        CO: 'colorado',
        CT: 'connecticut',
        DE: 'delaware',
        FL: 'florida',
        GA: 'georgia',
        HI: 'hawaii',
        ID: 'idaho',
        IL: 'illinois',
        IN: 'indiana',
        IA: 'iowa',
        KS: 'kansas',
        KY: 'kentucky',
        LA: 'louisiana',
        ME: 'maine',
        MD: 'maryland',
        MA: 'massachusetts',
        MI: 'michigan',
        MN: 'minnesota',
        MS: 'mississippi',
        MO: 'missouri',
        MT: 'montana',
        NE: 'nebraska',
        NV: 'nevada',
        NH: 'new-hampshire',
        NJ: 'new-jersey',
        NM: 'new-mexico',
        NY: 'new-york',
        NC: 'north-carolina',
        ND: 'north-dakota',
        OH: 'ohio',
        OK: 'oklahoma',
        OR: 'oregon',
        PA: 'pennsylvania',
        RI: 'rhode-island',
        SC: 'south-carolina',
        SD: 'south-dakota',
        TN: 'tennessee',
        TX: 'texas',
        UT: 'utah',
        VT: 'vermont',
        VA: 'virginia',
        WA: 'washington',
        WV: 'west-virginia',
        WI: 'wisconsin',
        WY: 'wyoming',
      };

      let setLink = '';

      if (text !== '') {
        const [city, stateAbbr] = text.split(', ');
        const formattedCity = city.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
        const formattedState =
          stateAbbr && stateAbbreviations[stateAbbr.toUpperCase()]
            ? stateAbbreviations[stateAbbr.toUpperCase()]
            : stateAbbr.toLowerCase();

        // console.log('!!!!', formattedCity, formattedState);

        setLink = `/flight-locations/${formattedCity}-${formattedState}`;
      } else {
        setLink = '#';
      }

      return setLink;
    }

    // Show loading animation
    private showLoadingAnimation() {
      const loadingWrap = document.querySelector('.schedule_loader-wrap');
      const loadingElement = document.querySelector('.schedule_loader');
      if (loadingElement) gsap.set(loadingWrap, { display: 'flex' });
      if (loadingWrap)
        gsap.fromTo(
          loadingElement,
          { y: '1rem', opacity: 0 },
          { y: '0rem', opacity: 1, ease: this.easeFloat }
        );
    }

    // Hide loading animation
    private hideLoadingAnimation() {
      const loadingElement = document.querySelector('.schedule_loader');
      if (loadingElement) {
        gsap.to(loadingElement, {
          y: '-1rem',
          opacity: 0,
          ease: this.easeFloat,
          onComplete: () => {
            gsap.set(loadingElement, { display: 'none' });
          },
        });
      }
    }

    // Set Current Active Filter
    private setActiveFilter(filter: string) {
      let setActive = this.filters[0];

      if (filter === 'Research Flights') setActive = this.filters[1] as HTMLElement;
      else if (filter === 'Public Flights') setActive = this.filters[2] as HTMLElement;
      else if (filter === 'Private Flights') setActive = this.filters[3] as HTMLElement;

      const filterUI = setActive.querySelector('.filters_check-icon') as HTMLElement;
      const filterInput = setActive.querySelector('input') as HTMLInputElement;

      filterInput.checked = true;

      setActive.classList.add('is-checked');
      filterUI.classList.add('is-checked');
    }

    // Reset Filter Checkbox State
    private resetFilters() {
      this.filters.forEach((filter) => {
        const filterUI = filter.querySelector('.filters_check-icon') as HTMLElement;
        const filterInput = filter.querySelector('input') as HTMLInputElement;
        filterInput.checked = false;

        if (filter.classList.contains('is-checked')) filter.classList.remove('is-checked');
        if (filterUI.classList.contains('is-checked')) filterUI.classList.remove('is-checked');
      });
    }
  }

  new FlightSchedule();
};

export default flightSchedule;
