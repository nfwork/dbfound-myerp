if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.BASE_URL}service-worker.js`)
      .catch(error => {
        console.error("Service worker registration failed:", error);
      });
  });
}
