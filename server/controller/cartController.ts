import {Request,Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import CartCollection from "../schemas/CartSchema";
import {ICart} from "../models/ICart";
import CartSchema from "../schemas/CartSchema";
import {getHeapCodeStatistics} from "node:v8";
import mongoose from "mongoose";
import {APP_STATUS} from "../Constants/constant";
import CartRouter from "../routers/cart/cartRouter";

/**
 * @usage:create a cart
 * @url:http://localhost:9000/api/carts
 * @params:products[{product,count,price}],total,tax,grandTotal
 * @method:Post
 * @access:Private
 */

export const createCart= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const {products,total,tax,grandTotal}=request.body;
            /**
             * check if user have a cart
             * delete and create a new cart
             * only one cart not old cart and data
             */
            const cart =await CartCollection.findOne({userObj:theUser._id});
            if(cart){
                await CartCollection.findOneAndDelete({userObj:theUser._id});
            }
            const newCart:ICart={
                products:products,
                total:total,
                tax:tax,
                grandTotal:grandTotal,
                userObj:theUser._id
            };
                const theCart =await new CartCollection(newCart).save();
            if(!theCart){
                return ThrowError(response,400,"cart Creation Failed");
            }
            const actualCart=await CartCollection.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
                path:"userObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:actualCart,
                msg:"cart created is Success"
            })
        }

    }
    catch(error){

    }

};

/**
 * @usage:get cart info
 * @url:http://localhost:9000/api/carts/me
 * @params:no-params
 * @method:get
 * @access:Private
 */

export const getCartInfo= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const theCart:any =await CartCollection.find({userObj:new mongoose.Types.ObjectId(theUser._id)}).populate({
                path:"products.product",
                strictPopulate:false
            }).populate({
                path:"userObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                msg:"fetched Cart Info",
                data:theCart
            })
        }

    }
    catch(error){

    }

};


