import { Message, connectDb } from './db'

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
