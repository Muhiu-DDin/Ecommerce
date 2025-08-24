import mongoose from "mongoose";

let cache = global.mongoose;

if(!cache){
   cache =  global.mongoose = {conn : null  , promise : null}
}

export async function dbconnect(){

    const url = process.env.MONGODB_URI

    if(!url){
        throw new Error("URL is not define yet")
    }

    if(cache.conn){
         console.log("Using cached , MongoDB is Connected");
        return cache.conn
    }
    if(!cache.promise){
        console.log("🔌 Connecting to MongoDB...");
        cache.promise =  mongoose.connect(url).then(()=>{
        console.log("✅ MongoDB connection established");
        return mongoose.connection
        } )
    }
    try{
        // now .then(() => mongoose.connection) will run.
       cache.conn = await cache.promise
    }catch(error){
        console.error("❌ Error connecting to MongoDB:", error.message);
        cache.promise = null;
        throw new Error("Error in connecting DB");
    }
   

}
