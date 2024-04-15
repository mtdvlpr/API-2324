// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
import webPush from 'web-push'
import { PRODUCTION_URL } from './general'

/**
 * Initializes the web-push library with the VAPID keys
 */
export const initWebPush = () => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
        'environment variables. You can use the following ones:'
    )
    console.log(webPush.generateVAPIDKeys())
    return
  }

  // Set the keys used for encrypting the push messages.
  webPush.setVapidDetails(
    PRODUCTION_URL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

/**
 * Sends a push notification to a subscription
 * @param subscription The subscription to send the notification to
 * @param payload The payload of the notification
 * @param TTL The TTL of the notification
 * @param delay The delay of the notification
 * @returns A promise that resolves to true if the notification was sent successfully
 */
export const sendNotification = async (
  subscription: webPush.PushSubscription,
  payload: { title: string } & NotificationOptions,
  TTL: number = 0,
  delay: number = 0
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay * 1000))
    await webPush.sendNotification(subscription, JSON.stringify(payload), {
      TTL,
    })
    return true
  } catch (e) {
    console.error('Error sending push notification:', e)
    return false
  }
}
