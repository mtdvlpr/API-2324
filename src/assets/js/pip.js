const pipBtn = document.querySelector('.pip')
const chatBox = document.querySelector('body > .chat-box')

export const initDocumentPictureInPicture = () => {
  if (!window.documentPictureInPicture) return
  pipBtn.classList.toggle('no-pip', false)
  pipBtn.addEventListener('click', toggleDocumentPictureInPicture)
}

const toggleDocumentPictureInPicture = async () => {
  if (!window.documentPictureInPicture) return
  if (window.documentPictureInPicture.window) {
    document.querySelector('.chat-drawer')?.show()
    await window.documentPictureInPicture.window.close()
  } else {
    /**
     * @type {Window} The Picture-in-Picture window
     */
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: chatBox.clientWidth,
      height: chatBox.clientHeight,
    })

    pipWindow.addEventListener('pagehide', () => {
      document.querySelector('.chat-drawer')?.show()
    })
    ;[...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join('')
        const style = document.createElement('style')

        style.textContent = cssRules
        pipWindow.document.head.appendChild(style)
      } catch (e) {
        const link = document.createElement('link')

        link.rel = 'stylesheet'
        link.type = styleSheet.type
        link.media = styleSheet.media
        link.href = styleSheet.href
        pipWindow.document.head.appendChild(link)
      }
    })

    // TODO: Fix scripts not working in Picture-in-Picture mode
    ;[...document.scripts].forEach((script) => {
      pipWindow.document.head.appendChild(script.cloneNode(true))
    })

    const main = document.createElement('main')
    main.appendChild(chatBox)
    pipWindow.document.body.append(main)
    document.querySelector('.chat-drawer')?.hide()

    await new Promise((resolve) => setTimeout(resolve, 100))
    const ul = pipWindow.document.querySelector('ul')
    ul.scrollTo(0, ul.scrollHeight)
  }
}
