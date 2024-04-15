'use strict'

import { formatDate, urlBase64ToUint8Array } from './utils'

// HTML elements
const chatForm = document.getElementById('chat-form')
const chatFormActions = document.querySelector('.chat-form-actions')
const notifyBtn = document.querySelector('.chat-form-actions sl-icon-button')
const list = document.querySelector('[data-events]')
const drawer = document.querySelector('.chat-drawer')
const openBtn = document.querySelector('.chat-btn sl-icon-button')
const notifyBadge = document.querySelector('.new-chats')
const header = document.querySelector('header')

export const initChat = () => {
  if (!chatForm || !list || !drawer || !openBtn) return

  initDrawer(drawer, openBtn)
  initListener(list)
  initForm(chatForm)
  initNotify(chatFormActions, notifyBtn)
}

/**
 * Initializes the chat drawer
 * @param {*} drawer The drawer element
 * @param {HTMLButtonElement} openBtn The button that opens the drawer
 */
const initDrawer = (drawer, openBtn) => {
  header.classList.toggle('no-chat', false)
  header.insertBefore(document.createElement('div'), header.firstChild)

  openBtn.addEventListener('click', () => {
    drawer.show()
    setNrOfReadMessages(list.children.length)
    notifyUser(notifyBadge, 0)
  })
}

/**
 * Initializes the event listener for new messages
 * @param {HTMLUListElement} list The list element
 */
const initListener = (list) => {
  const source = new EventSource('/events')
  source.addEventListener('message', (e) => {
    const messages = JSON.parse(e.data)
    notifyUser(notifyBadge, messages.length - getNrOfReadMessages())
    fillChat(list, messages)
  })
}

/**
 * Fills the list with chat messages
 * @param {HTMLUListElement} list The list element
 * @param {{name: string;timestamp: string;message:string}[]} messages The chat messages
 */
const fillChat = (list, messages) => {
  if (list) {
    list.innerHTML = ''
    messages.forEach((message) => {
      const li = document.createElement('li')
      li.innerHTML = `<b>[${formatDate(message.timestamp)}] ${message.name}</b>
      <p>${message.message}</p>`
      list.appendChild(li)
    })
  }
}

/**
 * Shows the number of unread messages
 * @param {HTMLElement} badge The badge element
 * @param {number} nrOfUnreadMessages The number of unread messages
 */
const notifyUser = (badge, nrOfUnreadMessages) => {
  badge.textContent = nrOfUnreadMessages
  badge.style.display = nrOfUnreadMessages ? 'block' : 'none'

  if (navigator.setAppBadge && nrOfUnreadMessages) {
    navigator.setAppBadge(nrOfUnreadMessages)
  } else if (navigator.clearAppBadge && !nrOfUnreadMessages) {
    navigator.clearAppBadge()
  }

  if (nrOfUnreadMessages && !document.hasFocus()) {
    sendPushNotification()
    /*sendNotification(
      'New message(s)',
      `You have ${nrOfUnreadMessages} unread message(s)`,
      [
        {
          action: 'openChat',
          title: 'Open chat',
        },
      ]
    )*/
  }
}

/**
 * Initializes the form submit event
 * @param {HTMLFormElement} form The form element
 */
const initForm = (form) => {
  form.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(form)
      await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          message: formData.get('message'),
        }),
      })
      form.reset()
    } catch (e) {
      console.error(e)
    }
  })
}

/**
 * Initializes the notification feature
 * @param {HTMLDivElement} actions The actions wrapper
 * @param {HTMLButtonElement} btn The notification button
 */
const initNotify = async (actions, btn) => {
  if (!window.Notification) return
  actions.classList.toggle('no-notify', false)
  btn.addEventListener('click', async () => {
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

        if (window.PushManager) {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.getSubscription()
          if (!subscription) {
            const response = await fetch('./notify/vapidPublicKey')
            const vapidPublicKey = await response.text()
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            })
          }
        }
      }
    }
  })
}

/**
 * Sends a Push notification
 * @param {string} title The title
 * @param {string} msg The message
 * @param {{action:string;title:string}[]} actions The actions
 */
const sendNotification = (title, msg, actions = []) => {
  if (!window.Notification || Notification.permission !== 'granted') return

  const notification = new Notification(title, {
    lang: 'en',
    tag: 'notification',
    icon: `${window.location.origin}/img/logo/android/android-icon-512x512.png`,
    badge: `${window.location.origin}/img/logo/favicon-96x96.png`,
    body: msg,
    actions,
  })

  notification.onclick = (e) => {
    console.log('click', e)
    window.focus()
    openBtn.click()
  }
}

const sendPushNotification = async () => {
  console.log('pushManager', window.PushManager)
  if (
    !window.PushManager ||
    !window.Notification ||
    Notification.permission !== 'granted'
  ) {
    return
  }
  console.log('sendPushNotification')

  const subscription = await navigator.serviceWorker.ready.then(
    (registration) => registration.pushManager.getSubscription()
  )

  if (subscription) {
    fetch('/notify/send', {
      method: 'POST',
      body: JSON.stringify({
        subscription,
        payload: 'Hello from the server!',
        delay: 5,
        ttl: 0,
      }),
    })
  }
}

let nrOfReadMessages = 0

/**
 * Gets the number of read messages
 * @returns {number} The number of read messages
 */
const getNrOfReadMessages = () => {
  if (window.localStorage) {
    nrOfReadMessages =
      parseInt(window.localStorage.getItem('nrOfReadMessages')) || 0
  }

  return nrOfReadMessages
}

/**
 * Sets the number of read messages
 * @param {number} nr The number of read messages
 */
const setNrOfReadMessages = (nr) => {
  nrOfReadMessages = nr
  if (window.localStorage) {
    window.localStorage.setItem('nrOfReadMessages', nr)
  }
}
