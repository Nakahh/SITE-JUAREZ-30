// Unregister all service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service worker unregistered");
    }
  });
}

// Clear all caches
if ("caches" in window) {
  caches.keys().then(function (names) {
    names.forEach(function (name) {
      caches.delete(name);
      console.log("Cache deleted:", name);
    });
  });
}

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();

console.log("All caches and service workers cleared");
