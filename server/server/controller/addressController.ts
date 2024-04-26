import {Request,Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import AddressCollection from "../schemas/AddressSchema";
import userSchema from "../schemas/UserSchema";
import mongoose, {mongo} from "mongoose";
import {IAddress} from "../models/IAddress";
import {APP_STATUS} from "../Constants/constant";
import AddressSchema from "../schemas/AddressSchema";




/**
 * @usage:ceate new address
 * @url:http://localhost:9000/api/addresses/new
 * @params:,mobile,flat,landmark,street,city,state,country,pincode
 * @method:Post
 * @access:private
 */
export const createNewAddress= async (request:Request,response:Response)=>{
    try{
        const {mobile,flat,landmark,street,city,state,country,pinCode}=request.body;
        const theUser:any= await UserUtil.getUser(request,response);
        if(theUser){
            /**
             * check if address exists
             */
            const addressObj:any=await AddressCollection.findOne({userObj:new mongoose.Types.ObjectId(theUser._id)});
            if(addressObj){
                await AddressCollection.findOneAndDelete(new mongoose.Types.ObjectId(addressObj._id));
            }else{
                const theAddress:IAddress| any | undefined| null={
                    name:theUser.username,
                    email:theUser.email,
                    mobile:mobile,
                    flat:flat,
                    landmark:landmark,
                    street:street,
                    state:state,
                    city:city,
                    country:country,
                    pinCode:pinCode,
                    userObj:theUser._id
                }
                const newAddress=await new AddressCollection(theAddress).save();
                if(newAddress){
                    return response.status(200).json({
                        status:APP_STATUS.SUCCESS,
                        data:newAddress,
                        msg:"New shipping address added"
                    });
                }
            }
        }
    }catch(error){
        return ThrowError(response);
    }
}

/**
 * @usage: update address
 * @url: http://localhost:9000/api/addresses/:addressId
 * @params: mobile,flat,landmark,street,city,state,country,pincode
 * @method: Put
 * @access: private
 */

export const updateAddress=async(request:Request,response:Response)=>{
    try{
        const  {addressId} = request.params;
        const mongoAddressId=new mongoose.Types.ObjectId(addressId);
        const {mobile,flat,landmark,street,city,state,country,pinCode}=request.body;
        const theUser:any= await UserUtil.getUser(request,response);
        if(theUser){

            const theAddress:IAddress | undefined | null =await AddressCollection.findById(mongoAddressId);
            if(!theAddress){
                return ThrowError(response,404,"No address Found");

            }
            const addressObj=await AddressCollection.findByIdAndUpdate(mongoAddressId,{
                $set:{
                    name:theUser.username,
                    email:theUser.email,
                    mobile:mobile,
                    flat:flat,
                    landmark:landmark,
                    street:street,
                    state:state,
                    city:city,
                    country:country,
                    pinCode:pinCode,
                    userObj:theUser._id
                }
            },{new:true});
            if(addressObj){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    data:addressObj,
                    msg:"Shipping address updated"
                })
            }
        }



    }catch(error){
        return ThrowError(response);
    }
}

/**
 * @usage:get address
 * @url:http://localhost:9000/api/addresses/me
 * @params:no-params
 * @method:Get
 * @access:private
 */
export const getAddress=async (request:Request,response:Response)=>{
    try{
        const theUser:any= await UserUtil.getUser(request,response);
        if(theUser){
            const addressObj:IAddress | undefined | null =await AddressCollection.findOne({userObj:new mongoose.Types.ObjectId(theUser._id)});
            if(!addressObj){
                return ThrowError(response,404,"addressNot found");
            }
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:addressObj,
                msg:"address found successfully"
            });
        }


    }catch(error){
        return ThrowError(response);
    }
}

/**
 * @usage:delete address
 * @url:http://localhost:9000/api/addresses/:addressId
 * @params:no-params
 * @method:Delete
 * @access: private
 */
export const deleteAddress=async (request:Request,response:Response)=>{
    try{
        const {addressId}=request.params;
      const theUser=await UserUtil.getUser(request,response);
      if(theUser){
          const addressObj:IAddress | undefined | null =await AddressCollection.findById(new mongoose.Types.ObjectId(addressId));

          if(!addressObj){
              return ThrowError(response,404,"NO address Found");
          }

          const theAddress =await AddressCollection.findByIdAndDelete(new mongoose.Types.ObjectId(addressId));
          if(theAddress){
              return response.status(200).json({
                  status:APP_STATUS.SUCCESS,
                  data:theAddress,
                  msg:"Shipping Address Deleted successfully"
              });
          }
      }

    }catch(error){
        return ThrowError(response);
    }
}