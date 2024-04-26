import {Request,Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {IOrder} from "../models/IOrder";
import OrderCollection from "../schemas/OrderSchema";
import mongoose from "mongoose";
import {APP_STATUS} from "../Constants/constant";



/**
 * @usage:place an order
 * @url:http://localhost:9000/api/orders/place
 * @params:products[{product,count,price}],total,tax,grandTotal,paymentType
 * @method:Post
 * @access:Private
 */

export const placeOrder= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const {products,total,tax,grandTotal,paymentType}=request.body;
            const newOrder:IOrder={
                products:products,
                total:total,
                tax:tax,
                grandTotal:grandTotal,
                orderBy:theUser._id,
                paymentType:paymentType
            };
            const theOrder  =await new OrderCollection(newOrder).save();
            if(!theOrder){
                return ThrowError(response,400,"Order Creation Failed");
            }
            const actualOrder=await OrderCollection.findById(new mongoose.Types.ObjectId(theOrder._id)).populate({
                path:"userObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:actualOrder,
                msg:"Order created is Success"
            })

        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:get all order
 * @url:http://localhost:9000/api/orders/all
 * @params:no-params
 * @method:get
 * @access:Private
 */

export const getAllOrders= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const orders:IOrder[] | any = await OrderCollection.find().populate({
                path:"products.product",
                strictPopulate:false
            }).populate({
                path:"userObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:orders,
                msg:"Fetched All orders successfully"
            })
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:get my order
 * @url:http://localhost:9000/api/orders/me
 * @params:no-params
 * @method:get
 * @access:Private
 */
export const getMyOrders= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const orders:IOrder[] | any = await OrderCollection.find({orderBy:new mongoose.Types.ObjectId(theUser._id)}).populate({
                path:"products.product",
                strictPopulate:false
            }).populate({
                path:"userObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:orders,
                msg:"Fetched All orders of mine  successfully"
            })
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:update orderstatus
 * @url:http://localhost:9000/api/orders/:orderId
 * @params:order-status
 * @method:Post
 * @access:Private
 */

export const updateOrderStatus= async (request:Request,response:Response)=>{
    try{
        const {orderStatus}=request.body;
        const {orderId} =request.params;
        const mongoOrderId=new mongoose.Types.ObjectId(orderId);
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const theOrder:IOrder | any =await OrderCollection.findById(mongoOrderId);
            if(!theOrder){
                return ThrowError(response,401,"No Order Found");
            }
            theOrder.orderStatus=orderStatus;
            await theOrder.save();
            const theActualOrder:IOrder | any =await OrderCollection.findById(mongoOrderId).populate({
                path:"products.product",
                strictPopulate:false
            }).populate({
                path:'orderBy',
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:theActualOrder,
                msg:"Order Status is Updated Successfully"
            });
        }

    }catch(error){
        return ThrowError(response);
    }
};