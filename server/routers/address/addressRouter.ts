import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import * as addressController from "../../controller/addressController";
import {body,validationResult} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";

const addressRouter:Router=Router();

/**
 * @usage:ceate new address
 * @url:http://localhost:9000/api/addresses/new
 * @params:name,email,mobile,flat,landmark,street,city,state,country,pincode
 * @method:Post
 * @access:private
 */
addressRouter.post("/new",[

    body('mobile').not().isEmpty().withMessage("Mobile number is Required"),
    body('flat').not().isEmpty().withMessage("flatno/dr.no is Required"),
    body('landmark').not().isEmpty().withMessage("Landmark is Required"),
    body('street').not().isEmpty().withMessage("street is Required"),
    body('city').not().isEmpty().withMessage("city is Required"),
    body('state').not().isEmpty().withMessage("state is Required"),
    body('country').not().isEmpty().withMessage("country is Required"),
    body('pinCode').not().isEmpty().withMessage("pincode is Required"),
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
   await addressController.createNewAddress(request,response);
});


/**
 * @usage:update address
 * @url:http://localhost:9000/api/addresses/:addressId
 * @params:name,email,mobile,flat,landmark,street,city,state,country,pincode
 * @method:Put
 * @access:private
 */
addressRouter.put("/:addressId",[
    body('mobile').not().isEmpty().withMessage("Mobile number is Required"),
    body('flat').not().isEmpty().withMessage("flatno/drno is Required"),
    body('landmark').not().isEmpty().withMessage("Landmark is Required"),
    body('street').not().isEmpty().withMessage("street is Required"),
    body('city').not().isEmpty().withMessage("city is Required"),
    body('state').not().isEmpty().withMessage("state is Required"),
    body('country').not().isEmpty().withMessage("country is Required"),
    body('pinCode').not().isEmpty().withMessage("pincode is Required"),
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await addressController.updateAddress(request,response);
});

/**
 * @usage:get address
 * @url:http://localhost:9000/api/addresses/me
 * @params:no-params
 * @method:Get
 * @access:private
 */
addressRouter.get("/me",tokenVerifier,async(request:Request,response:Response)=>{
    await addressController.getAddress(request,response);
});

/**
 * @usage:delete address
 * @url:http://localhost:9000/api/addresses/:addressId
 * @params:no-params
 * @method:Delete
 * @access:private
 */
addressRouter.delete("/:addressId",tokenVerifier,async(request:Request,response:Response)=>{
    await addressController.deleteAddress(request,response);
});

export default addressRouter;