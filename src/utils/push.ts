// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
import {
  setVapidDetails,
  generateVAPIDKeys,
  type PushSubscription,
  sendNotification,
} from 'web-push'
import { PRODUCTION_URL } from './general'
import { Subscription, connectDb } from './db'

/**
 * Initializes the web-push library with the VAPID keys
 */
export const initWebPush = () => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
        'environment variables. You can use the following ones:'
    )
    console.log(generateVAPIDKeys())
    return
  }

  // Set the keys used for encrypting the push messages.
  setVapidDetails(
    PRODUCTION_URL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

let subscriptions: PushSubscription[] = []

export const saveSubscription = async (subscription: PushSubscription) => {
  try {
    await connectDb()
    await Subscription.create(subscription)
    subscriptions.push(subscription)
    return true
  } catch (e) {
    console.error('Error while saving subscription', e)
    return false
  }
}

export const getSubscriptions = async () => {
  try {
    await connectDb()
    const result = await Subscription.find()
    subscriptions = result.map((doc) => doc.toObject())
    return result
  } catch (e) {
    console.error('Error while fetching subscriptions', e)
    return []
  }
}

export const deleteSubscription = async (subscription: PushSubscription) => {
  try {
    await connectDb()
    await Subscription.deleteOne(subscription)
    subscriptions = subscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    )
    return true
  } catch (e) {
    console.error('Error while deleting subscription', e)
    return false
  }
}

/**
 * Sends a push notification to a subscription
 * @param subscription The subscription to send the notification to
 * @param payload The payload of the notification
 * @param TTL The TTL of the notification
 * @param delay The delay of the notification
 * @returns A promise that resolves to true if the notification was sent successfully
 */
export const sendPushNotification = async (
  subscription: PushSubscription,
  payload: { title: string } & NotificationOptions,
  TTL: number = 0,
  delay: number = 0
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay * 1000))
    await sendNotification(subscription, JSON.stringify(payload), {
      TTL,
    })
    return true
  } catch (e) {
    console.error('Error sending push notification:', e)
    return false
  }
}

/**
 * Sends a push notification to all subscriptions
 * @param payload The payload of the notification
 * @param TTL The TTL of the notification
 * @param delay The delay of the notification
 * @returns A promise that resolves to true if the notifications were sent successfully
 */
export const sendPushNotifications = async (
  payload: { title: string } & NotificationOptions,
  TTL: number = 0,
  delay: number = 0
) => {
  try {
    const promises = subscriptions.map((subscription) =>
      sendPushNotification(subscription, payload, TTL, delay)
    )
    const results = await Promise.allSettled(promises)
    return results.every(
      (result) => result.status === 'fulfilled' && result.value === true
    )
  } catch (e) {
    console.error('Error sending push notifications:', e)
    return false
  }
}
