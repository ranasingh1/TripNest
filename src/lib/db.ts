import { log } from "console"
import mongoose from "mongoose"

const MONGODB_URI: string = process.env.MONGODB_URI || ""
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
}

let cached = (global as any).mongoose

if (!cached) {
    cached = {
        conn: null,
        promise: null,
    };
    (global as any).mongoose = cached
}

export async function dbConnect() {
    if (cached.conn) {        
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose)
    }
    cached.conn = await cached.promise
    console.log("Connected to MongoDB")
    return cached.conn
}
