import express,{Application,Request,Response} from "express";
import dotenv from "dotenv";
import {DBUtil} from "./util/DBUtil";
import cors from "cors";
/**
 * router config imports
 */
import categoriesRouter from "./routers/categories/categoriesRouter";
import productRouter from "./routers/products/productsRouter";
import userRouter from "./routers/users/usersRouter";
import addressRouter from "./routers/address/addressRouter";
import cartRouter from "./routers/cart/cartRouter";
import orderRouter from "./routers/orders/ordersRouter";

/**
 * config express js application
 */
const app:Application=express();


/**
 * config cors
 */
app.use(cors());


/**
 *dotenv config
 */
dotenv.config({
    path:"./.env"
});

/**
 * config read data of json through express
 */
app.use(express.json());


/**
 * config the port,db and db name and connectivity status
 */
const port :string| number=process.env.PORT || 9000;
const dbUrl:string|undefined=process.env.MONGO_DB_CLOUD_URL;
const dbName:string|undefined=process.env.MONGO_DB_DATABASE;


/**
 * connectivity status
 */
app.get("/",(request:Request,response:Response)=>{
    response.status(200);
    response.json({
        msg:"Welcome to the node express server"
    });
});



/**
 * config the router
 */

app.use("/api/users",userRouter);
app.use("/api/categories",categoriesRouter);
app.use("/api/products",productRouter);
app.use("/api/addresses",addressRouter);
app.use("/api/carts",cartRouter);
app.use("/api/orders",orderRouter);


/**
 * connectivity status of db through express
 */

if(port){
    app.listen(Number(port),()=>{
        if(dbUrl &&dbName){
            DBUtil.connectToDB(dbUrl,dbName).then((dbResponse)=>{
                console.log(dbResponse)
            }).catch((error)=>{
                console.error(error);
                process.exit(0);//Force stop server
            })
        }
    })
    console.log(`server running on  http://${port}`);
}
