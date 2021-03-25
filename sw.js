

  self.addEventListener('install', function(event) {
    var CACHE_NAME = 'my-site-cache-v1';
    var urlsToCache = [
      '/css/stylemain.css',
      '/css/stylemenu.css',
      '/css/style.css',
      '/images/jane_street.png',
      '/images/neural_network.png',
      '/all/about.html',
      '/all/contact.html',
      '/all/menu.html',
      '/all/project.html',
      '/all/work.html'
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


self.addEventListener('fetch', function(event) {
  var CACHE_NAME = 'my-site-cache-v1';
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
