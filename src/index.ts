// import { safetyRecord } from '$gComponents/safetyRecord';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

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

  initComponent('.section_safety', () => import('$gComponents/safetyRecord'));
  initComponent('.section_seen', () => import('$gComponents/seenOn'));

  // Page Routing
  // ------------
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
