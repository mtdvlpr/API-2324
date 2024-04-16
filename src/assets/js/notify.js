import { toast } from './toast'
import { subscribePush } from './push'

const notifyBtn = document.querySelector('.chat-form-actions sl-icon-button')

/**
 * Initializes the notification feature
 */
export const initNotificationAPI = async () => {
  if (!window.Notification) return
  notifyBtn.closest('.no-notify').classList.toggle('no-notify', false)
  notifyBtn.addEventListener('click', requestNotificationPermission)
}

/**
 * Requests permission to send notifications
 */
const requestNotificationPermission = async () => {
  if (!window.Notification) return
  try {
    if (Notification.permission === 'granted') {
      await subscribePush()
      sendNotification(
        'Notifications enabled',
        'You will now receive notifications'
      )
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        await subscribePush()
        sendNotification(
          'Notifications enabled',
          'You will now receive notifications'
        )
      }
    }
  } catch (e) {
    console.error('Error requesting notification permission', e)
    toast('Could not enable notifications', e.message, 'danger')
  }
}

/**
 * Sends a native notification
 * @param {string} title The title
 * @param {string} msg The message
 * @param {{action:string;title:string;onclick: () => void}} action The action
 */
export const sendNotification = async (title, msg, action = null) => {
  if (!window.Notification || Notification.permission !== 'granted') return

  try {
    const options = {
      lang: 'en',
      tag: 'new-messages',
      icon: `${window.location.origin}/img/logo/android/android-icon-512x512.png`,
      badge: `${window.location.origin}/img/logo/monochrome-512x512.png`,
      body: msg,
    }

    if (action && 'actions' in window.Notification.prototype) {
      options.actions = [action]
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      registration.showNotification(title, options)
    } else {
      const notification = new Notification(title, options)
      notification.onclick = action.onclick
    }
  } catch (e) {
    if (document.hasFocus()) {
      toast(title, msg)
    } else {
      console.error('Error sending notification', e)
      toast('Could not send notification', e.message, 'danger')
    }
  }
}
