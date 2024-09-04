import { gsap } from 'gsap';

export const flightSchedule = () => {
  console.log('Flight Schedule - COMP');

  class FlightSchedule {
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
      }[];
    }[];

    constructor() {
      this.blockTemplate = document.querySelector('.block-template') as HTMLElement;
      this.headTemplate = document.querySelector('.head-template') as HTMLElement;
      this.rowTemplate = document.querySelector('.row-template') as HTMLElement;
      this.flightData = [
        ...(document.querySelectorAll('.sl_data-item') as NodeListOf<HTMLElement>),
      ];
      this.parsedFlightData = [];
      this.sortedFlightData = [];

      this.init();
    }

    // initialize
    private init() {
      // Show loadscreen
      this.showLoadingAnimation();
      // Call parse data on feed
      this.parsedFlightData = this.parseData(this.flightData);
      //   console.log('Data', this.parsedFlightData);

      this.sortedFlightData = this.sortFlights();
      //   console.log('Sorted', this.sortedFlightData);

      //   this.renderUpdates();
      //   this.hideLoadingAnimation();
      setTimeout(() => {
        this.renderUpdates();
        this.hideLoadingAnimation();
      }, 1000);
    }

    // Parse flight data from html feed
    private parseData(data: HTMLElement[]) {
      const flightArray = data.map((item) => {
        const location = item.querySelector('.sl_d-location')?.textContent?.trim() || '';
        const date = item.querySelector('.sl_d-date')?.textContent?.trim() || '';
        const time = item.querySelector('.sl_d-time')?.textContent?.trim() || '';
        const limitedSeatsElement = item.querySelector('.sl_d-limited');
        const soldOutElement = item.querySelector('.sl_d-sold');

        const limitedSeats =
          limitedSeatsElement && !limitedSeatsElement.classList.contains('w-condition-invisible')
            ? true
            : false;

        const soldOut =
          soldOutElement && !soldOutElement.classList.contains('w-condition-invisible')
            ? true
            : false;

        return {
          location,
          date,
          time,
          limitedSeats,
          soldOut,
        };
      });

      return flightArray;
    }

    // Show loading animation
    private showLoadingAnimation() {
      const loadingElement = document.querySelector('.schedule_loader');

      if (loadingElement) {
        // GSAP animation
        gsap.to(loadingElement, {
          duration: 1,
          opacity: 1,
          ease: 'power4.inOut',
        });
      }
    }

    // Hide loading animation
    private hideLoadingAnimation() {
      const loadingElement = document.querySelector('.schedule_loader');
      if (loadingElement) {
        // GSAP fade out and remove element
        gsap.to(loadingElement, {
          duration: 0.5,
          opacity: 0,
          onComplete: () => {
            gsap.set(loadingElement, { display: 'none' });
          },
        });
      }
    }

    // Sort parsed data by month
    private sortFlights() {
      const groupedFlights: {
        month: string;
        year: string;
        flights: {
          location: string;
          date: string;
          time: string;
          limitedSeats: boolean;
          soldOut: boolean;
        }[];
      }[] = [];

      this.parsedFlightData.forEach((flight) => {
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

    // Create new flight head
    private createHead(month: string, year: string) {
      //   console.log('Create Head----------------');
      const head = this.headTemplate.cloneNode(true) as HTMLElement;
      head.classList.remove('head-template');
      const headMonth = head.querySelector('.sl_head-month');
      const headYear = head.querySelector('.sl_head-year');

      if (headMonth) headMonth.textContent = month;
      if (headYear) headYear.textContent = year;

      //   console.log('HEAD', head);

      return head;
    }

    //Create new flight row
    private createRow(flight: {
      location: string;
      date: string;
      time: string;
      limitedSeats: boolean;
      soldOut: boolean;
    }) {
      const row = this.rowTemplate.cloneNode(true) as HTMLElement;
      row.classList.remove('row-template');

      const locationElement = row.querySelector('.sl_row-location');
      const dateElement = row.querySelector('.sl_row-date');
      const timeElement = row.querySelector('.sl_row-time');
      const limitedSeatsElement = row.querySelector('.sl_tag.ls') as HTMLElement;
      const soldOutElement = row.querySelector('.sl_tag.so') as HTMLElement;

      if (locationElement) locationElement.textContent = flight.location;
      if (dateElement) dateElement.textContent = flight.date;
      if (timeElement) timeElement.textContent = flight.time;
      if (limitedSeatsElement)
        limitedSeatsElement.style.display = flight.limitedSeats ? 'block' : 'none';
      if (soldOutElement) soldOutElement.style.display = flight.soldOut ? 'block' : 'none';

      //   console.log('ROW', row);

      return row;
    }

    private calculateRenderHeight(blocks: HTMLElement[]) {
      console.log('calculate', blocks);

      blocks.forEach((item) => {
        console.log('CALC', item);
      });
    }

    // Create new flightBlock
    private createFlightBlock(group: {
      month: string;
      year: string;
      flights: {
        location: string;
        date: string;
        time: string;
        limitedSeats: boolean;
        soldOut: boolean;
      }[];
    }) {
      const block = this.blockTemplate.cloneNode(true) as HTMLElement;
      block.classList.remove('block-template');

      const head = this.createHead(group.month, group.year);
      block.appendChild(head);

      group.flights.forEach((flight) => {
        const row = this.createRow(flight);
        block.appendChild(row);
      });

      return block;
    }

    // Render Updates to DOM
    private renderUpdates() {
      const flightMain = document.querySelector('.schedule_main');
      if (!flightMain) return;

      const blocks = this.sortedFlightData
        .map((group) => this.createFlightBlock(group))
        .filter((block) => block !== null);

      this.calculateRenderHeight(blocks);

      //   const estimatedHeight = blocks.length * 200;
      //   console.log('render', blocks, estimatedHeight, window.innerHeight);

      blocks.forEach((block) => {
        // if (block) flightMain.appendChild(block);
      });
    }
  }

  new FlightSchedule();
};

export default flightSchedule;
