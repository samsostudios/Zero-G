import { home } from './pages/home';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  // Page Routing
  function loadPageModules() {
    const pathname = window.location.pathname as string;

    if (pathname === '/' || pathname === '/home') {
      import('./pages/home').then((module) => {
        module.home();
      });
    }
  }

  loadPageModules();

  //  else if (windowLocation.includes('/about')) {
  //   about();
  // }
});
