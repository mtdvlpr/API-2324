import { toast } from './toast'

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
      sendNotification(
        'Notifications enabled',
        'You will now receive notifications'
      )
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
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
export const sendNotification = (title, msg, action = null) => {
  if (!window.Notification || Notification.permission !== 'granted') return

  try {
    const notification = new Notification(title, {
      lang: 'en',
      tag: 'new-messages',
      icon: `${window.location.origin}/img/logo/android/android-icon-512x512.png`,
      badge: `${window.location.origin}/img/logo/favicon-96x96.png`,
      body: msg,
      actions: action ? [action] : undefined,
    })

    notification.onclick = action.onclick
  } catch (e) {
    console.error('Error sending notification', e)
    toast('Could not send notification', e.message, 'danger')
  }
}
