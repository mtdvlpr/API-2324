export const initPWA = () => {
  if (navigator.serviceWorker && window.location.hostname !== 'localhost') {
    navigator.serviceWorker.register('/sw.js')
  }
}
