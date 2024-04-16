import { urlBase64ToUint8Array } from './utils'

/**
 * Initializes the push notification feature
 */
export const initPushAPI = async () => {
  if (window.Notification && Notification.permission === 'granted') {
    subscribePush()
  }
}

/**
 * Gets the Push subscription
 * @returns {Promise<PushSubscription | null>} The Push subscription
 */
export const getPushSubscription = async () => {
  try {
    const registration = await navigator.serviceWorker.ready
    return await registration.pushManager.getSubscription()
  } catch (e) {
    console.error('Error getting subscription', e)
    return null
  }
}

/**
 * Enables Push notifications
 */
export const subscribePush = async () => {
  if (!window.PushManager) return
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      const response = await fetch('/push/key')
      const key = await response.text()
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      })
    }
  } catch (e) {
    console.error('Error subscribing to push', e)
  }
}

/**
 * Disables Push notifications
 */
export const unsubscribePush = async () => {
  if (!window.PushManager) return
  try {
    const subscription = await getPushSubscription()
    if (subscription) await subscription.unsubscribe()
  } catch (e) {
    console.error('Error unsubscribing from push', e)
  }
}

/**
 * Sends a Push notification
 * @param {string} title The title
 * @param {string} msg The message
 */
export const sendPushNotification = async (title, msg) => {
  if (
    !window.PushManager ||
    !window.Notification ||
    Notification.permission !== 'granted'
  ) {
    return
  }

  try {
    const subscription = await getPushSubscription()
    if (subscription) {
      fetch('/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          payload: {
            lang: 'en',
            tag: 'notification',
            icon: `${window.location.origin}/img/logo/android/android-icon-512x512.png`,
            badge: `${window.location.origin}/img/logo/favicon-96x96.png`,
            title,
            body: msg,
          },
          delay: 5,
          ttl: 0,
        }),
      })
    }
  } catch (e) {
    console.error('Error sending push notification', e)
  }
}