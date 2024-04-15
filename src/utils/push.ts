// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
import { Request, Response } from '@tinyhttp/app'
import webPush from 'web-push'

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
    'https://api-2324.onrender.com/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export const sendNotification = async (req: Request, res: Response) => {
  const subscription = req.body.subscription
  const payload = req.body.payload
  const options = {
    TTL: req.body.ttl,
  }

  setTimeout(() => {
    webPush
      .sendNotification(subscription, payload, options)
      .then(() => {
        res.sendStatus(201)
      })
      .catch((e) => {
        console.log(e)
        res.sendStatus(500)
      })
  }, req.body.delay * 1000)
}
