import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const flightSchedule = () => {
  console.log('Flight Schedule - COMP');

  class FlightSchedule {
    private scheduleMain: HTMLElement;
    private flightsWrap: HTMLElement;
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
    private renderHeight: number;
    private easeFloat: any;

    constructor() {
      this.scheduleMain = document.querySelector('.schedule_main') as HTMLElement;
      this.flightsWrap = document.querySelector('.schedule_main') as HTMLElement;
      this.blockTemplate = document.querySelector('.block-template') as HTMLElement;
      this.headTemplate = document.querySelector('.head-template') as HTMLElement;
      this.rowTemplate = document.querySelector('.row-template') as HTMLElement;
      this.flightData = [
        ...(document.querySelectorAll('.sl_data-item') as NodeListOf<HTMLElement>),
      ];
      this.parsedFlightData = [];
      this.sortedFlightData = [];
      this.renderHeight = 0;
      this.easeFloat = CustomEase.create('floatDown', 'M0,0 C0.25,0.1 0.25,1 1,1');

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

      const templates = document.querySelector('.sl_templates');
      gsap.set(templates, { display: 'none' });

      //   this.renderUpdates();
      //   this.hideLoadingAnimation();
      setTimeout(() => {
        this.renderUpdates();
        this.hideLoadingAnimation();
        this.addModalCloseEvent();
      }, 2000);
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

    //Calc height of new schedule object
    private calculateRenderHeight(blocks: HTMLElement[]) {
      console.log('calculate', blocks);

      this.renderHeight = 0;

      blocks.forEach((item) => {
        item.style.position = 'aboslute';
        item.style.left = '-9999px';
        document.body.appendChild(item);

        this.renderHeight += item.clientHeight;

        item.remove();

        // console.log('ADDED', item.clientHeight);
        // console.log('CALC', calcHeight);
      });
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

      row.addEventListener('click', () => this.openModal());

      return row;
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

    // Add event listener to close modal
    private addModalCloseEvent() {
      const modal = document.querySelector('.section_rez');
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            // Only close if clicking outside the content
            this.closeModal();
          }
        });
      }
    }

    // Render Updates to DOM
    private renderUpdates() {
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

    // Open modal function triggered by row click
    private openModal() {
      const modal = document.querySelector('.section_rez');
      if (modal) {
        gsap.set(modal, { display: 'flex' });
        gsap.fromTo(modal, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 });
      }
    }

    // Close modal function triggered by clicking on modal
    private closeModal() {
      const modal = document.querySelector('.section_rez');
      if (modal) {
        gsap.to(modal, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          onComplete: () => {
            gsap.set(modal, { display: 'none' });
          },
        });
      }
    }
  }

  new FlightSchedule();
};

export default flightSchedule;
