import {Request,Response,NextFunction} from 'express';
import jwt from "jsonwebtoken";




export const tokenVerifier=async(request:Request,response:Response,next:NextFunction)=>{
    try{
        let secretKey:string|undefined=process.env.JWT_SECRET_KEY;
        if(secretKey){
            let token =request.headers["x-auth-token"];
            if(!token){
                return response.status(401).json({
                    msg:"No token Provided"
                });
            }
            if(typeof token ==="string" && secretKey){
                let decodeObj:any=  jwt.verify(token,secretKey);
                request.headers['user']=decodeObj;

                next();//passing to actual url
            }else{
                return response.status(401).json({
                    msg:"An Invalid Token"
                });
            }
        }
    }catch(error){
        return response.status(500).json({
            msg:"Unauthorised,its an invalid Token please check"
        });
    }
};