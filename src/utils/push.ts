// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
import webPush from 'web-push'
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

let subscriptions: webPush.PushSubscription[] = []

/**
 * Saves a subscription to the database
 * @param subscription The subscription
 * @returns A promise that resolves to true if the subscription was saved successfully, or a string with the error message if an error occurred
 */
export const saveSubscription = async (
  subscription: webPush.PushSubscription
): Promise<true | string> => {
  try {
    if (subscriptions.some((sub) => sub.endpoint === subscription.endpoint)) {
      return true
    }

    await connectDb()
    await Subscription.create(subscription)
    subscriptions.push(subscription)
    return true
  } catch (e) {
    console.error('Error while saving subscription', e)
    return e.message || 'Error while saving subscription'
  }
}

/**
 * Gets all subscriptions from the database
 * @returns A promise that resolves to an array of subscriptions
 */
export const getSubscriptions = async (): Promise<
  webPush.PushSubscription[]
> => {
  try {
    await connectDb()
    const result = await Subscription.find()
    subscriptions = result.map((doc) => doc.toObject())
    return subscriptions
  } catch (e) {
    console.error('Error while fetching subscriptions', e)
    return []
  }
}

/**
 * Deletes a subscription from the database
 * @param subscription The subscription
 * @returns A promise that resolves to true if the subscription was deleted successfully, or a string with the error message if an error occurred
 */
export const deleteSubscription = async (
  subscription: webPush.PushSubscription
): Promise<true | string> => {
  try {
    if (!subscriptions.some((sub) => sub.endpoint === subscription.endpoint)) {
      return true
    }

    await connectDb()
    await Subscription.deleteOne(subscription)
    subscriptions = subscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    )
    return true
  } catch (e) {
    console.error('Error while deleting subscription', e)
    return e.message || 'Error while deleting subscription'
  }
}

/**
 * Sends a push notification to a subscription
 * @param subscription The subscription to send the notification to
 * @param payload The payload of the notification
 * @param TTL The TTL of the notification
 * @param delay The delay of the notification
 * @returns A promise that resolves to true if the notification was sent successfully, or a string with the error message if an error occurred
 */
export const sendPushNotification = async (
  subscription: webPush.PushSubscription,
  payload: { title: string } & NotificationOptions,
  TTL: number = 0,
  delay: number = 0
): Promise<true | string> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay * 1000))
    await webPush.sendNotification(subscription, JSON.stringify(payload), {
      TTL,
    })
    return true
  } catch (e) {
    console.error('Error sending push notification:', e)
    return e.message || 'Error sending push notification'
  }
}

/**
 * Sends a push notification to all subscriptions
 * @param subscription The subscription that's sending the notification
 * @param payload The payload of the notification
 * @param TTL The TTL of the notification
 * @param delay The delay of the notification
 * @returns A promise that resolves to true if the notifications were sent successfully
 */
export const sendPushNotifications = async (
  subscription: webPush.PushSubscription | null,
  payload: { title: string } & NotificationOptions,
  TTL: number = 5,
  delay: number = 0
): Promise<true | string> => {
  try {
    const promises = subscriptions
      .filter((sub) => !subscription || sub.endpoint !== subscription.endpoint)
      .map((sub) => sendPushNotification(sub, payload, TTL, delay))
    const results = await Promise.allSettled(promises)
    const result = results.every(
      (result) => result.status === 'fulfilled' && result.value === true
    )
    if (result === true) return true
    else {
      const errors = results.map(
        (r) => r.status === 'fulfilled' && r.value !== true && r.value
      )
      throw new Error(errors.join('\n') || 'Error sending push notifications')
    }
  } catch (e) {
    console.error('Error sending push notifications:', e)
    return e.message || 'Error sending push notifications'
  }
}
