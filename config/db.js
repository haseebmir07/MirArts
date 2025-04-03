// // const { mongo } = require("mongoose")

// import mongoose from "mongoose";
// let cached = global.mongoose 
// if(!cached){
//     cached=global.mongoose ={conn:null, promise:null};}
//     async function connectDB() {
//         if (cached.conn){
//             return cached.conn
//         }
//         if (!cached.promise){
//             constopts={
//                 bufferCommands:false
//             }
//             cached.promise=mongoose.connect(`${process.env.MONGODB_URI}/MirArts`,opts).then(mongoose)
//             return mongoose
//         }
//         cached.conn=await cached.promise
//         return mongoose
//     }
//     export default connectDB
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
            cached.conn = m;  // Ensure connection is saved
            return m;
        });
        
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
