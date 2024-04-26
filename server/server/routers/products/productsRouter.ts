import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import {body} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";
import * as productController from "../../controller/productController"

const productsRouter:Router=Router();



/**
 * @usage:create a product
 * @url:http://localhost:9000/api/products
 * @params:title,description,imageurl,brand,price,quantity,categoryId,subCategoeryId
 * @method:Post
 * @access:Private
 */
productsRouter.post("/",[
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('description').not().isEmpty().withMessage("Description is Required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is Required"),
    body('brand').not().isEmpty().withMessage("brand is Required"),
    body('price').not().isEmpty().withMessage("price is Required"),
    body('quantity').not().isEmpty().withMessage("quantity is Required"),
    body('categoryId').not().isEmpty().withMessage("categoryId is Required"),
    body('subCategoryId').not().isEmpty().withMessage("subCategoeryId is Required"),
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await productController.createProduct(request,response);
});


/**
 * @usage:Update a product
 * @url:http://localhost:9000/api/products/:ProductId
 * @params:title,description,imageurl,brand,price,quantity,categoryId,subCategoeryId
 * @method:Put
 * @access:Private
 */
productsRouter.put("/:productId",[
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('description').not().isEmpty().withMessage("Description is Required"),
    body('imageUrl').not().isEmpty().withMessage("imageUrl is Required"),
    body('brand').not().isEmpty().withMessage("brand is Required"),
    body('price').not().isEmpty().withMessage("price is Required"),
    body('quantity').not().isEmpty().withMessage("quantity is Required"),
    body('categoryId').not().isEmpty().withMessage("categoryId is Required"),
    body('subCategoryId').not().isEmpty().withMessage("subCategoeryId is Required"),
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await productController.updateProduct(request,response);
});

/**
 * @usage:Get all product
 * @url:http://localhost:9000/api/products/
 * @params:No-params
 * @method:Get
 * @access:Private
 */

productsRouter.get("/",tokenVerifier,async(request:Request,response:Response)=>{
    await productController.getAllProducts(request,response);
});

/**
 * @usage:Get a product
 * @url:http://localhost:9000/api/products/:productId
 * @params:No-params
 * @method:Get
 * @access:Private
 */

productsRouter.get("/:productId",tokenVerifier,async(request:Request,response:Response)=>{
    await productController.getProduct(request,response);
});

/**
 * @usage:delete a product
 * @url:http://localhost:9000/api/products/:productId
 * @params:No-params
 * @method:delete
 * @access:Private
 */
productsRouter.delete("/:productId",tokenVerifier,async(request:Request,response:Response)=>{
    await productController.deleteProduct(request,response);
});

/**
 * @usage:get all product with categoeryId
 * @url:http://localhost:9000/api/products/categories/:categoryId
 * @params:No-params
 * @method:get
 * @access:Private
 */

productsRouter.get("/categories/:categoryId",tokenVerifier,async(request:Request,response:Response)=>{
    await productController.getAllProductswithCategoryId(request,response);
});
export default productsRouter;

