import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

/**
 * In Next.js serverless/edge functions a new module instance is created on
 * every cold start. Without caching, each invocation would open a fresh
 * connection and quickly exhaust the MongoDB connection pool.
 *
 * We store the connection promise on the Node.js `global` object so it
 * survives hot-reloads in development and is reused across invocations in
 * production (within the same container lifetime).
 */

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS global type to include our cache key.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt is already in-flight, wait for it.
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,   // Fail fast rather than queue operations when disconnected.
      maxPoolSize: 10,         // Max concurrent connections in the pool.
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((err) => {
        // Reset so the next call retries.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
