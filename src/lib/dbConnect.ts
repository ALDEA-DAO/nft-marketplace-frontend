// import mongoose from "mongoose";
//const MONGODB_URI = process.env.URLDB

import * as Mongoose from "mongoose";

import { toJson } from 'helpers/utils';

let database: Mongoose.Connection;

export const dbConnect = async () => {

  //add your own uri below
  //const uri = process.env.MONGODB_URI

  const uri = process.env.URLDB
  
  console.log ("dbConnect MONGODB_URI: " + uri)

  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  if (database) {
    console.log ("dbConnect exist")

    return;
  }

  const opts = {
          bufferCommands: false,
          useNewUrlParser: true,
          useUnifiedTopology: true 
          //useUnifiedTopology: true,
          //useFindAndModify: false,
          //useCreateIndex: true
        }
      
  try {
    await Mongoose.connect(uri, opts);

    database = Mongoose.connection;

    database.once("open", async () => {
      console.log("Connected to database");
    });

    database.on("error", () => {
      console.log("Error connecting to database");
    });

  } catch (error) {
    console.log ("dbConnect error: " + toJson(error))
  }

};


export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};

// console.log ("dbConnect MONGODB_URI: " + MONGODB_URI)
 
// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   )
// }

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function dbConnect() {

//   console.log ("dbConnect2 MONGODB_URI: " + MONGODB_URI)


//   if (cached.conn) {
//     console.log ("dbConnect2 cached.conn")

//     return cached.conn
//   }

//   if (!cached.promise) {

//     console.log ("dbConnect2 cached.promise")

//     const opts = {
//        bufferCommands: false,
//       useNewUrlParser: true,
//       // useUnifiedTopology: true,
//       // useFindAndModify: false,
//       // useCreateIndex: true
//     }

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log ("dbConnect2: mongoose : " + toJson(mongoose))
      

//       return mongoose
//     })
//   }
//   cached.conn = await cached.promise
//   return cached.conn
// }

// export default dbConnect