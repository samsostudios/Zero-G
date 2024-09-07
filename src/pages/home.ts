import { blogSlider } from '$sComponents/blogSlider';
// import { featuredFlights } from '$sComponents/featuredFlights';
import { revealVideo } from '$utils/revealVideos';

export const home = () => {
  console.log('/home');

  // featuredFlights();
  blogSlider();

  // hero
  const hero = document.querySelector('.section_home-hero') as HTMLElement;
  const heroVideo = [...document.querySelectorAll('video')][0] as HTMLVideoElement;
  // heroVideo.play();
  // Overview
  const overview = document.querySelector('.overview_p-grid') as HTMLElement;
  const oMedia = [...overview.querySelectorAll('video')];
  // revealVideo(overview, oMedia);
};
