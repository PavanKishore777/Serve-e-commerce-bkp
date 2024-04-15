import mongoose from "mongoose";
export class DBUtil{
    public static connectToDB(dbUrl:string,dbName:string){
        return new Promise((resolve,reject)=>{
            mongoose.connect(dbUrl,{
                dbName:dbName
            }).then(()=>{
                resolve("Successfully Connected to the Mongo DB");
            }).catch((error)=>{
                reject("error"+error)
            });
        });
    }
}