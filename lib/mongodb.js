import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI

let cached

if (!cached) {
    cached  = {
        conn: null,
        promise: null
    }
}


export const connectMongo = async () => {
    if (cached.conn) return cached.conn
    
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'survey',
        bufferCommands: false,
        connectTimeoutMS: 30000
    })

    cached.conn = await cached.promise;

    return cached.conn
}


export default connectMongo