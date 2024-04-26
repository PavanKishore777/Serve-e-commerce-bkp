import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import {body} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";
import * as orderController from "../../controller/orderController";
import cartRouter from "../cart/cartRouter";

const ordersRouter:Router=Router();



/**
 * @usage:place an order
 * @url:http://localhost:9000/api/orders/place
 * @params:products[{product,count,price}],total,tax,grandTotal,paymenttype
 * @method:Post
 * @access:Private
 */
ordersRouter.post("/place",[
    body('products').not().isEmpty().withMessage("products is Required"),
    body('total').not().isEmpty().withMessage("total is Required"),
    body('tax').not().isEmpty().withMessage("tax is Required"),
    body('grandTotal').not().isEmpty().withMessage("grandTotal is Required"),
    body('paymentType').not().isEmpty().withMessage("paymentType is Required"),
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await orderController.placeOrder(request,response);
});

/**
 * @usage:get all order
 * @url:http://localhost:9000/api/orders/all
 * @params:no-params
 * @method:get
 * @access:Private
 */

ordersRouter.get("/all",tokenVerifier,async(request:Request,response:Response)=>{
    await orderController.getAllOrders(request,response);
});

/**
 * @usage:get my order
 * @url:http://localhost:9000/api/orders/me
 * @params:no-params
 * @method:get
 * @access:Private
 */
ordersRouter.get("/me",tokenVerifier,async(request:Request,response:Response)=>{
    await orderController.getMyOrders(request,response);
});

/**
 * @usage:update orderstatus
 * @url:http://localhost:9000/api/orders/:orderId
 * @params:order-status
 * @method:post
 * @access:Private
 */
ordersRouter.post("/:orderId",[
    body('orderStatus').not().isEmpty().withMessage("orderStatus is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await orderController.updateOrderStatus(request,response);
});

export default ordersRouter;

