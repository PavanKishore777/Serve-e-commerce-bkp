import {Router,Request,Response} from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import {body} from "express-validator";
import { validateForm } from "../../middlewares/validateForm";
import * as userController from "../../controller/userController";



const usersRouter:Router=Router();

/**
 * @usage:Register a User
 * @url:http://localhost:9000/api/users/register
 * @params:username,email,password
 * @method:Post
 * @access:public
 */

usersRouter.post("/register",[
    body('username').not().isEmpty().withMessage("username is Required"),
    body('email').isEmail().withMessage("Email is Required"),
    body('password').isStrongPassword().withMessage("password is Required")
],validateForm,async(request:Request,response:Response)=>{
    await userController.registerUser(request,response);
});

/**
 * @usage:login a User
 * @url:http://localhost:9000/api/users/login
 * @params:email,password
 * @method:Post
 * @access:public
 */

usersRouter.post("/login",[
    body('email').isEmail().withMessage("Email is Required"),
    body('password').isStrongPassword().withMessage("password is Required")
],validateForm,async(request:Request,response:Response)=>{
    await userController.loginUser(request,response);
});

/**
 * @usage:get a User data
 * @url:http://localhost:9000/api/users/me
 * @params:no-params
 * @method:get
 * @access:private
 */

usersRouter.get("/me",tokenVerifier,async(request:Request,response:Response)=>{
    await userController.getUserData(request,response);
});

/**
 * @usage:update a profile picture
 * @url:http://localhost:9000/api/users/profile
 * @params:imageurl
 * @method:Post
 * @access:private
 */
usersRouter.post("/profile",[
    body('imageUrl').not().isEmpty().withMessage("imageUrl is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await userController.updateProfilePicture(request,response);
});


/**
 * @usage:change the password
 * @url:http://localhost:9000/api/users/change-password
 * @params:password
 * @method:Post
 * @access:private
 */

usersRouter.post("/change-password",[
    body('password').isStrongPassword().withMessage("password is Required")
],tokenVerifier,validateForm,async(request:Request,response:Response)=>{
    await userController.changePassword(request,response);
});

export default usersRouter;

