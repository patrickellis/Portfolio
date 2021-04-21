

  self.addEventListener('install', function(event) {
    var CACHE_NAME = 'my-site-cache-v1';
    var urlsToCache = [
      '/css/stylemenu.css',
      '/css/stylemain.css',
      '/css/style.css',
      '/js/project_click_events.js',
      '/images/jane_street_webp.webp',
      '/images/neural_network_webp.webp',
      '../images/ant_photo_webp.webp',
      '/all/menu.html',
      '/all/about.html',
      '/all/contact.html',
      '/all/work.html',
      '/all/cpp/1.html',
      '/all/cpp/2.html',
      '/all/cpp/3.html',
      '/all/cpp/4.html',
      '/all/python/1.html',
      '/all/python/2.html',
      '/all/python/3.html',
      '/all/python/4.html',
      '/all/work/1.html',
      '/all/work/2.html',
      '/all/work/3.html',
      '/all/work/4.html',
      '/all/misc/1.html',
      '/all/misc/2.html',
      '/all/misc/3.html',
      '/all/misc/4.html',
      '/all/frontend/1.html',
      '/all/frontend/2.html',
      '/all/frontend/3.html',
      '/all/frontend/4.html',
      '/all/projects/nlp.html',
      '/all/projects/janestreet-puzzles.html',
      '/all/projects/project.html'
    ];

    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });


self.addEventListener('fetch', event => {
  var CACHE_NAME = 'my-site-cache-v1';
  if (event.request.mode === 'navigate') {
    // See /web/fundamentals/getting-started/primers/async-functions
    // for an async/await primer.
    event.respondWith(async function() {
      // Optional: Normalize the incoming URL by removing query parameters.
      // Instead of https://example.com/page?key=value,
      // use https://example.com/page when reading and writing to the cache.
      // For static HTML documents, it's unlikely your query parameters will
      // affect the HTML returned. But if you do use query parameters that
      // uniquely determine your HTML, modify this code to retain them.
      const normalizedUrl = new URL(event.request.url);
      normalizedUrl.search = '';

      // Create promises for both the network response,
      // and a copy of the response that can be used in the cache.
      const fetchResponseP = fetch(normalizedUrl);
      const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

      // event.waitUntil() ensures that the service worker is kept alive
      // long enough to complete the cache update.
      event.waitUntil(async function() {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(normalizedUrl, await fetchResponseCloneP);
      }());

      // Prefer the cached response, falling back to the fetch response.
      return (await caches.match(normalizedUrl)) || fetchResponseP;
    }());
  }
});
