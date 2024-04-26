import {Request,Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import UserCollection from "../schemas/UserSchema";
import { APP_STATUS } from "../Constants/constant";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import { IUser } from "../models/IUser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as UserUtil from "../util/UserUtil";



/**
 * @usage:Register a User
 * @url:http://localhost:9000/api/users/register
 * @params:username,email,password
 * @method:Post
 * @access:public
 */

export const registerUser= async (request:Request,response:Response)=>{
    try{
        let {username,email,password}=request.body;
        /**
         * check the emails exists bcoz of validateform  we made unique true
         */
        let userObj=await UserCollection.findOne({email:email});
        if(userObj){
            return response.status(400).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"User Already Exists"
            });
        }
        let imageUrl:string=gravatar.url(email,{
            size:'200',
            rating:'pg',
            default:'mm'
        })

        /*
        Hash Password
         */
        const salt=await bcryptjs.genSalt(10);
        const hashPassword=await bcryptjs.hash(password,salt);

        /**
         * create a user
         */

        const newUser:IUser={
            username:username,
            email:email,
            password:hashPassword,
            imageUrl:imageUrl,
            isAdmin:false
        }
        let user= await new UserCollection(newUser).save();
        if(user){
            return response.status(201).json({
                msg:"Registration is Success"
            })
        }
    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:login a User
 * @url:http://localhost:9000/api/users/login
 * @params:email,password
 * @method:Post
 * @access:public
 */

export const loginUser= async (request:Request,response:Response)=>{
    try{
        /**
         * check email,password, from the form data and create token send response
         */
        let{email,password}=request.body;
        const userObj: IUser | undefined | null = await UserCollection.findOne({ email: email });

        if(!userObj){
            return response.status(500).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"invalid Email Address"
            })
        }
        let ismatch:boolean=await bcryptjs.compare(password,userObj.password)
        if(!ismatch){
            return response.status(500).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"Invalid Password"
            });
        }
        //create token

        const secretkey:string|undefined =process.env.JWT_SECRET_KEY;
        const payload:any={
            user:{
                id:userObj._id,
                email:userObj.email
            }
        }
        if(payload && secretkey){
            // jwt.sign(payload,secretkey,{
            //     expiresIn:100000000000
            // },(error:any,encoded:any)=>{
            //     if(error) throw error;
            //     if(encoded){                                         THIS IS LSO  WORKS
            //         return response.status(200).json({
            //             status:APP_STATUS.SUCCESS,
            //             data:userObj,
            //             token:encoded,
            //             msg:"Login Success"
            //         })
            //     }
            // })

            let token=jwt.sign(payload,secretkey,{
                expiresIn:1000000
            });
            return response.status(200).json({
                msg:"login success",
                token:token,
                user:userObj
            });
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:get a User data
 * @url:http://localhost:9000/api/users/me
 * @params:no-params
 * @method:get
 * @access:private
 */
export const getUserData= async (request:Request,response:Response)=>{
    try{
        /**
         * check if user exists
         */
        const theUser= await UserUtil.getUser(request,response);
        if(theUser){
            response.status(200).json({
                data:theUser,
                status:APP_STATUS.SUCCESS,
                msg:"Successfully fetched the data",
            });
        }
        ThrowError(response,404,"user is not Found");

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:update a profile picture
 * @url:http://localhost:9000/api/users/profile
 * @params:imageurl
 * @method:Post
 * @access:private
 */
export const updateProfilePicture= async (request:Request,response:Response)=>{
    try{
        const {imageUrl} =request.body;
        const theUser:any= await UserUtil.getUser(request,response);
        if(theUser){
            theUser.imageUrl=imageUrl;
            const userObj=await theUser.save();


            // const userObj=await UserCollection.findByIdAndUpdate(new mongoose.Types.ObjectId(theUser._id),{
            //     $set:{
            //         ...theUser,
            //         imageUrl:imageUrl
            //     }
            // },{new:true});


            if(userObj){
                response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    msg:"Profile Picture updated",
                    data:userObj
                });
            }
        }
    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:change the password
 * @url:http://localhost:9000/api/users/change-password
 * @params:password
 * @method:Post
 * @access:private
 */
export const changePassword= async (request:Request,response:Response)=>{
    try{
        const {password} =request.body;
        const salt =await bcryptjs.genSalt(10);
        const hashPassword=await  bcryptjs.hash(password,salt);

        const theUser:any= await UserUtil.getUser(request,response);
        if(theUser){
            theUser.password= hashPassword;
            const userObj=await theUser.save();
            if(userObj){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    msg:"Password changed successfully",
                    data:userObj
                })
            }
        }

    }catch(error){
        return ThrowError(response,400,"Password not able to changed");
    }
};
