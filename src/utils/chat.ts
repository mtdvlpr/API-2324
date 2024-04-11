import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

const Message = mongoose.model(
  'Message',
  new mongoose.Schema({ name: String, message: String, timestamp: Date })
)

const connect = async () => {
  try {
    if (
      !mongoose.connection.readyState ||
      mongoose.connection.readyState === 99
    ) {
      await mongoose.connect(uri, clientOptions)
    }
  } catch (e) {
    console.error('Error while connecting to database', e)
  }
}

export const saveMessage = async (name: string, message: string) => {
  try {
    await connect()
    await Message.create({ name, message, timestamp: new Date() })
  } catch (e) {
    console.error('Error while saving message', e)
  }
}

export const getMessages = async () => {
  try {
    await connect()
    const messages = await Message.find().sort({ timestamp: -1 }).limit(10)
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
    await connect()
    const changeStream = Message.watch()
    changeStream.on('change', async () => {
      console.log('change detected')
      const messages = await getMessages()
      callback(messages)
    })
  } catch (e) {
    console.error('Error while listening for messages', e)
  }
}
