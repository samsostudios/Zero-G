import { blogSlider } from '$sComponents/blogSlider';
import { featuredFlights } from '$sComponents/featuredFlights';

export const home = () => {
  console.log('/home');

  featuredFlights();
  blogSlider();
};
