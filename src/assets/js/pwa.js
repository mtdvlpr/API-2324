'use strict'
import { toast } from './toast'

/**
 * Initializes the PWA
 */
export const initPWA = async () => {
  if (window.navigator?.serviceWorker) {
    try {
      const worker = await navigator.serviceWorker.register('/sw.js')
      worker.update()
    } catch (e) {
      console.error('Service Worker registration failed', e)
      toast('Could not initialize PWA', e.message, 'danger')
    }
  }
}
