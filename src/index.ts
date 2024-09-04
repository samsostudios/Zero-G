// import { safetyRecord } from '$gComponents/safetyRecord';
import { schedule } from '$pages/schedule';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  document.addEventListener('click', (e) => {
    console.log('YO', e.target);
  });

  // Global Components
  // ----------------
  function initComponent(selector: string, importModule: () => Promise<{ default: () => void }>) {
    const element = document.querySelector(selector);
    if (element) {
      importModule().then((module) => {
        module.default(); // Assuming the module has a default export
      });
    }
  }

  initComponent('.nav_component', () => import('$gComponents/nav'));
  initComponent('.section_safety', () => import('$gComponents/safetyRecord'));
  initComponent('.section_seen', () => import('$gComponents/seenOn'));
  initComponent('.section_faq', () => import('$gComponents/faq'));
  initComponent('.section_testimonials', () => import('$gComponents/testimonials'));
  initComponent('.section_img-slider', () => import('$gComponents/imageSlider'));

  // Page Routing
  // ------------
  function loadPageModules() {
    const pathname = window.location.pathname as string;

    if (pathname === '/' || pathname === '/home') {
      import('./pages/home').then((module) => {
        module.home();
      });
    } else if (pathname === '/flight-schedule') {
      schedule();
    }
  }

  loadPageModules();

  //  else if (windowLocation.includes('/about')) {
  //   about();
  // }
});
