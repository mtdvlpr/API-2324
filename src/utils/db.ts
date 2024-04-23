import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

/**
 * Connects to the database
 */
export const connectDb = async () => {
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

export const Message = mongoose.model(
  'Message',
  new mongoose.Schema({ name: String, message: String, timestamp: Date })
)

export const Subscription = mongoose.model(
  'Subscription',
  new mongoose.Schema({ endpoint: String, keys: Object })
)
