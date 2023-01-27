import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI


let client
let clientPromise

if (!process.env.MONGODB_URI) {
    throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri)
    clientPromise = client.connect()
    console.log('Mongo client connect promise formed', uri)
}

export default clientPromise