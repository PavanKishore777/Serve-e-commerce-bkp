import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import {body} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";
import * as categoryController from "../../controller/categoryController"

const categoriesRouter:Router=Router();

/**
 * @usage:create a category
 * @url:http://localhost:9000/api/categories
 * @params:name,description
 * @method:Post
 * @access:Private
 */
categoriesRouter.post("/",[
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('description').not().isEmpty().withMessage("Description is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await categoryController.createCategory(request,response);
});


/**
 * @usage:create a sub-category
 * @url:http://localhost:9000/api/categories/:categoryId
 * @params:name,description
 * @method:Post
 * @access:Private
 */
categoriesRouter.post("/:categoryId",[
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('description').not().isEmpty().withMessage("Description is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await categoryController.createSubCategory(request,response);
});

/**
 * @usage:Get all categories
 * @url:http://localhost:9000/api/categories
 * @params:n0-param
 * @method:Get
 * @access:public
 */

categoriesRouter.get("/",async(request:Request,response:Response)=>{
    await categoryController.getAllCategories(request,response);
});

export default categoriesRouter;

