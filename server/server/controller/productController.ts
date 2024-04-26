import {Request,Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {IProduct} from "../models/IProduct";
import ProductCollection from "../schemas/ProductSchema";
import {APP_STATUS} from "../Constants/constant";
import mongoose from "mongoose";



/**
 * @usage:create a product
 * @url:http://localhost:9000/api/products
 * @params:title,description,imageUrl,brand,price,quantity,categoryId,subCategoeryId
 * @method:Post
 * @access:Private
 */

export const createProduct= async (request:Request,response:Response)=>{
    try{
        const {title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId} =request.body;


        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            /**
             * unique title so check first
             */
            const theProduct:IProduct|undefined|null =await ProductCollection.findOne({title:title});
            if(theProduct){
                return ThrowError(response,401,"product is already exists");
            }
            const newProduct:IProduct={
                title:title,
                description:description,
                imageUrl:imageUrl,
                brand:brand,
                price:price,
                quantity:quantity,
                categoryObj:categoryId,
                subCategoryObj:subCategoryId,
                userObj:theUser._id
            };
            const createdProduct=await new ProductCollection(newProduct).save();
            if(createdProduct){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    data:createdProduct,
                    msg:"product is created successfully"
                });
            }
        }
    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:Update a product
 * @url:http://localhost:9000/api/products/:ProductId
 * @params:title,description,imageurl,brand,price,quantity,categoryId,subCategoeryId
 * @method:Put
 * @access:Private
 */
export const updateProduct= async (request:Request,response:Response)=>{
    try{

        const {title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId} =request.body;
        const {productId}=request.params;
        const mongoProductId=new mongoose.Types.ObjectId(productId);


        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            /**
             * unique title so check first
             */
            const theProduct:IProduct|undefined|null =await ProductCollection.findById(mongoProductId);
            if(!theProduct){
                return ThrowError(response,404,"product is not exists");
            }
            const newProduct:IProduct={
                title:title,
                description:description,
                imageUrl:imageUrl,
                brand:brand,
                price:price,
                quantity:quantity,
                categoryObj:categoryId,
                subCategoryObj:subCategoryId,
                userObj:theUser._id
            };
            const updatedProduct=await  ProductCollection.findByIdAndUpdate(mongoProductId,{
                $set:newProduct
            },{new:true})

            if(updatedProduct){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    data:updatedProduct,
                    msg:"product is updated successfully"
                });
            }
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:Get all product
 * @url:http://localhost:9000/api/products
 * @params:No-params
 * @method:Get
 * @access:Private
 */

export const getAllProducts= async (request:Request,response:Response)=>{
    try{
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const theProducts:IProduct[] | any =await ProductCollection.find().populate({
                path:"userObj",
                strictPopulate:false
            }).populate({
                path:"categoryObj",
                strictPopulate:false
            }).populate({
                path:"subCategoryObj",
                strictPopulate:false
            });
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                msg:"fetched Products successfully",
                data:theProducts
            })
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:Get a product
 * @url:http://localhost:9000/api/products/:productId
 * @params:No-params
 * @method:Get
 * @access:Private
 */
export const getProduct= async (request:Request,response:Response)=>{
    try{
        const {productId} =request.params;
       // console.log("productid:" + productId);
        const mongoProductId=new mongoose.Types.ObjectId(productId);
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const theProduct:IProduct | any =await ProductCollection.findById(mongoProductId).populate({
                path:"userObj",
                strictPopulate:false
            }).populate({
                path:"categoryObj",
                strictPopulate:false
            }).populate({
                path:"subCategoryObj",
                strictPopulate:false
            });
           if(!theProduct){
               return ThrowError(response,404,"Product Not Found");
           }
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                msg:"fetched Product successfully",
                data:theProduct
            })
        }


    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:delete a product
 * @url:http://localhost:9000/api/products/:productId
 * @params:No-params
 * @method:delete
 * @access:Private
 */
export const deleteProduct= async (request:Request,response:Response)=>{
    try{
        const {productId} =request.params;
        // console.log("productid:" + productId);
        const mongoProductId=new mongoose.Types.ObjectId(productId);
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const theProduct:IProduct | any =await ProductCollection.findById(mongoProductId).populate({
                path:"userObj",
                strictPopulate:false
            }).populate({
                path:"categoryObj",
                strictPopulate:false
            }).populate({
                path:"subCategoryObj",
                strictPopulate:false
            });
            if(!theProduct){
                return ThrowError(response,404,"Product Not Found");
            }
            const deletedProduct =await ProductCollection.findByIdAndDelete(mongoProductId);
            if(deletedProduct){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    msg:" Product deleted successfully",
                    data:deletedProduct
                })
            }

        }


    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:get all product with categoeryId
 * @url:http://localhost:9000/api/products/categories/:categoriesId
 * @params:No-params
 * @method:get
 * @access:Private
 */
export const getAllProductswithCategoryId= async (request:Request,response:Response)=>{

    try{
        const {categoryId}=request.params;
       // console.log("categoryId:", categoryId);
        const theUser:any =await UserUtil.getUser(request,response);
        if(theUser){
            const products:IProduct[] | any = await ProductCollection.find({categoryObj:categoryId});
            return response.status(200).json({
                status:APP_STATUS.SUCCESS,
                data:products,
                msg:"fetched products by id of category"
            });
        }
    }catch(error){
        return ThrowError(response);
    }
};