import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import {body} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";
import * as cartController from "../../controller/cartController";

const cartRouter:Router=Router();



/**
 * @usage:create a cart
 * @url:http://localhost:9000/api/carts/
 * @params:products[{product,count,price}],total,tax,grandTotal
 * @method:Post
 * @access:Private
 */

cartRouter.post("/",[
    body('products').not().isEmpty().withMessage("products is Required"),
    body('total').not().isEmpty().withMessage("total is Required"),
    body('tax').not().isEmpty().withMessage("tax is Required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await cartController.createCart(request,response);
});


/**
 * @usage:get cart info
 * @url:http://localhost:9000/api/carts/me
 * @params:no-params
 * @method:get
 * @access:Private
 */

cartRouter.get("/me",tokenVerifier,async(request:Request,response:Response)=>{
    await cartController.getCartInfo(request,response);
});

export default cartRouter;

