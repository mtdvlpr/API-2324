export const initChat = () => {
  /**
   * @type {HTMLFormElement}
   */
  const chatForm = document.getElementById('chat-form')
  const list = document.querySelector('[data-events]')

  if (!chatForm || !list) return

  const drawer = document.querySelector('sl-drawer[label="Chatroom"]')
  const openBtn = document.querySelector('sl-icon-button[name="chat"]')

  if (!drawer || !openBtn) return
  openBtn.parentElement.classList.toggle('no-chat', false)
  openBtn.parentElement.insertBefore(
    document.createElement('div'),
    openBtn.parentElement.firstChild
  )
  openBtn.addEventListener('click', () => {
    drawer.show()
  })

  const source = new EventSource('/events')
  source.addEventListener('message', (e) => {
    const messages = JSON.parse(e.data)
    if (list) {
      list.innerHTML = ''
      messages.forEach((message) => {
        const li = document.createElement('li')
        li.textContent = `[${message.timestamp}] ${message.name}: ${message.message}`
        list.appendChild(li)
      })
    }
  })

  chatForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(chatForm)
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
      chatForm.reset()
    } catch (e) {
      console.error(e)
    }
  })
}
