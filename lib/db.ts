import mongoose from "mongoose";

//Storing the database connection
const MONGODB_URI = process.env.MONGODB_URI! // ! is for confirmation purposes that it is guranteed mongodb URI is there;

// Checking if MongoDB URI is provided. If not, throw an error.
if(!MONGODB_URI){
    throw new Error("MongoDB URI is required");
}

// Creating a new connection and setting up connection pooling.
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDatabase() {
    // Checking if connection is already established. If so, return the existing connection.
    if(cached.conn){
        return cached.conn;
    }

    // Checking if there is a pending connection. If so, wait for the connection to be established.
    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };
        cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then(() => mongoose.connection);
    };

    // Returning the connection.
    try{
        cached.conn = await cached.promise;
    } catch(error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}