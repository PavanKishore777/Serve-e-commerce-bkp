import { Request, Response} from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {ICategory, ISubCategory} from "../models/ICategory";
import {CategoryCollection, subCategoryCollection} from "../schemas/CategorySchema";
import {APP_STATUS} from "../Constants/constant";
import mongoose from "mongoose";



/**
 * @usage:create a category
 * @url:http://localhost:9000/api/categories/create
 * @params:name,description
 * @method:Post
 * @access:Private
 */

export const createCategory= async (request:Request,response:Response)=>{
    try{
        const {name,description} =request.body;
        const theUser=await UserUtil.getUser(request,response);
        if(theUser){
            /**
             * check the category is exists
             */
            const categoryObj :ICategory| undefined|null =await CategoryCollection.findOne({name:name});
            if(categoryObj){
                return ThrowError(response,401,"Category already exists");
            }
            const theCategory:ICategory={
                name:name,
                description:description,
                subCategories:[] as ISubCategory[],
            }
            const savedCategory=await new CategoryCollection(theCategory).save();
            if(savedCategory){
                return response.status(200).json({
                    status:APP_STATUS.SUCCESS,
                    data:savedCategory,
                    msg:"new category created successfully"
                })
            }
        }

    }catch(error){
        return ThrowError(response);
    }
};

/**
 * @usage:create a sub-category
 * @url:http://localhost:9000/api/categories/:categoryId
 * @params:name,description
 * @method:post
 * @access:Private
 */
export const createSubCategory= async (request:Request,response:Response)=>{
    try{
        const {categoryId} = request.params;
        const mongoCategoryId= new mongoose.Types.ObjectId(categoryId);
        const {name,description} =request.body;
        const theUser=await UserUtil.getUser(request,response);
        if(theUser){
            /**
             * check if subcategory exists
             */
            let theCategory:any =await CategoryCollection.findById(mongoCategoryId);
            if(!theCategory){
                return ThrowError(response,401,"Category already exists");
            }

            let theSubCategory:any =await subCategoryCollection.findOne({name:name});
            if(theSubCategory){
                return  ThrowError(response,401,"sub category Exists")
            }

            /**
             * if it is exists through search
             */

            //const isExists:ISubCategory|undefined= theCategory.subCategories && Array.isArray(theCategory.subCategories)&& theCategory.subCategories.find((item:{name:string})=>item.name.toLowerCase().trim()=== name.toLowerCase().trim());
            // const isExists: ISubCategory | undefined = theCategory.subcategories.find(
            //         (item: ISubCategory) => item.name.toLowerCase().trim() === name.toLowerCase().trim()
            //     );
            // if(isExists){
            //     return  ThrowError(response,401,"sub category Exists")
            // }
            let theSub= await new subCategoryCollection({name:name,description:description}).save();

            if(theSub){
                theCategory.subCategories.push(theSub);
                let categoryObj=await theCategory.save();
                if(categoryObj){
                    return response.status(201).json({
                        msg:"Sub Category Created",
                        status:APP_STATUS.SUCCESS,
                        data:categoryObj
                    })
                }
            }
        }
    }catch(error){
        return ThrowError(response);
    }
};


/**
 * @usage:get all categories
 * @url:http://localhost:9000/api/categories/
 * @params:no-params
 * @method:get
 * @access:public
 */
export const getAllCategories= async (request:Request,response:Response)=>{
    try{
        const categories = await CategoryCollection.find().populate({
            path:'subCategories',
            strictPopulate:false
        });
        if (categories) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: categories,
                msg: "All categories fetched successfully"
            });
        } else {
            return ThrowError(response, 404, "No categories found");
        }

    }catch(error){
        return ThrowError(response);
    }
};

