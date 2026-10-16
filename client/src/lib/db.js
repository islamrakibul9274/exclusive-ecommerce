import mongoose from "mongoose";
const cached =
  globalThis.exclusiveMongo ||
  (globalThis.exclusiveMongo = { connection: null, promise: null });
export default async function connectToDatabase() {
  if (!process.env.MONGODB_URI) throw new Error("Database is not configured.");
  if (cached.connection) return cached.connection;
  if (!cached.promise)
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 12000,
    });
  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
