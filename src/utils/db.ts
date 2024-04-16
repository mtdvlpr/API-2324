import {
  type ConnectOptions,
  connection,
  connect,
  model,
  Schema,
} from 'mongoose'

const uri = process.env.MONGODB_URI
const clientOptions: ConnectOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

export const connectDb = async () => {
  try {
    if (!connection.readyState || connection.readyState === 99) {
      await connect(uri, clientOptions)
    }
  } catch (e) {
    console.error('Error while connecting to database', e)
  }
}

export const Message = model(
  'Message',
  new Schema({ name: String, message: String, timestamp: Date })
)

export const Subscription = model(
  'Subscription',
  new Schema({ endpoint: String, keys: Object })
)
