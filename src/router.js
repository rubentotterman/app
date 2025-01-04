// router.js
export const router = {
    init: () => {
      // Prevent default link behavior
      document.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
          e.preventDefault();
          history.pushState(null, null, e.target.href);
          router.route();
        }
      });
  
      // Handle browser back/forward
      window.addEventListener('popstate', router.route);
      
      // Initial route
      router.route();
    },
  
    route: async () => {
      const path = window.location.pathname;
      let page;
  
      switch (path) {
        case '/':
          page = await import('./pages/home.js');
          break;
        case '/page2':
          page = await import('./pages/page2.js');
          break;
        default:
          page = await import('./pages/home.js');
      }
  
      document.querySelector('#app').innerHTML = page.default();
    }
  };