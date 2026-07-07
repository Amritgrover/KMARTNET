if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise(i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()}).then(()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e}));self.define=(s,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const t=e=>n(e,r),d={module:{uri:r},exports:o,require:t};i[r]=Promise.all(s.map(e=>d[e]||t(e))).then(e=>(c(...e),o))}}define(["./workbox-9c191d2f"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"index.html",revision:"install_prompt_v3"},{url:"icon-512.png",revision:"logo_v6"},{url:"icon-192.png",revision:"logo_v6"},{url:"assets/index-DYXXu0wA.js",revision:"salesman_batches_v15_customer_ui_zindex_fix_brand_mgmt_v4_fifo_gps_v8_admin_collapsible_delivery_portal_v23_realtime_v51"},{url:"assets/index-BiACt3m9.css",revision:"responsive_v5"},{url:"assets/logo.png",revision:"v6"},{url:"manifest.webmanifest",revision:"6d7902c9426d458115ea9baf174da77c"},{url:"manifest-admin.webmanifest",revision:"logo_v6"},{url:"manifest-salesman.webmanifest",revision:"logo_v6"},{url:"manifest-delivery.webmanifest",revision:"logo_v6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))});


// PWA Push Notification Listeners
self.addEventListener('push', function(event) {
  let payload = { title: 'KMART Alert', body: 'New notification!' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = { title: 'KMART Alert', body: event.data.text() };
    }
  }
  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/'
    }
  };
  if (payload.image) {
    options.image = payload.image;
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
