import { Message, connectDb } from './db'

/**
 * Saves a message to the database
 * @param name The name of the user
 * @param message The message
 * @returns A boolean indicating success
 */
export const saveMessage = async (name: string, message: string) => {
  try {
    await connectDb()
    await Message.create({ name, message, timestamp: new Date() })
    return true
  } catch (e) {
    console.error('Error while saving message', e)
    return false
  }
}

/**
 * Gets all messages from the database
 * @returns The messages
 */
export const getMessages = async () => {
  try {
    await connectDb()
    const messages = await Message.find().sort({ timestamp: -1 })
    return messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )
  } catch (e) {
    console.error('Error while fetching messages', e)
    return []
  }
}

/**
 * Listens for new messages in the database
 * @param callback The callback to call when a new message is received
 */
export const listenForMessages = async (
  callback: (messages: any[]) => void
) => {
  try {
    await connectDb()
    const changeStream = Message.watch()
    changeStream.on('change', async () => {
      const messages = await getMessages()
      callback(messages)
    })
  } catch (e) {
    console.error('Error while listening for messages', e)
  }
}
