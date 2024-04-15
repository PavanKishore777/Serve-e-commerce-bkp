import {Request,Response} from "express";
import mongoose from "mongoose";
import {ThrowError}from "./ErrorUtil"
import UserCollection from "../schemas/UserSchema";

export const getUser=async (request:Request,response:Response)=>{
    try{
        const theUser:any = request.headers["user"]
        const userId=theUser.user.id;
        if(!userId){
           return  ThrowError(response,401,"Invalid user request");
        }
        const mongoUserId=new mongoose.Types.ObjectId(userId);
        let userObj:any = await UserCollection.findById(mongoUserId);
        if(!userObj){
            return  ThrowError(response,401,"User Not found");
        }
        return userObj;
    }
    catch(error){
      return ThrowError(response);

    }
}