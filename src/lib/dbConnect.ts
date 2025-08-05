import mongoose from 'mongoose'

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('---Database Connection is already estabilished---')
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log('---Database Connection Success---');
  } catch (error) {
    console.log("---Database Connection Faliure---", error)
    process.exit(1);
  }

}

export default dbConnect