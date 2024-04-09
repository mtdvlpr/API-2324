export const initPWA = async () => {
  if (navigator.serviceWorker && window.location.hostname !== 'localhost') {
    try {
      const worker = await navigator.serviceWorker.register('/sw.js')
      worker.update()
    } catch (e) {
      console.error('Service Worker registration failed', e)
    }
  }
}
