'use strict'

export const initPWA = async () => {
  if (window.navigator?.serviceWorker) {
    try {
      const worker = await navigator.serviceWorker.register('/sw.js')
      worker.update()
    } catch (e) {
      console.error('Service Worker registration failed', e)
    }
  }
}
