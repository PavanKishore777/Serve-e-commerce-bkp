import mongoose from "mongoose";

// export interface ICartProduct{
//     _id?:string;
//     title:string;
//     description:string;
//     imageUrl:string;
//     brand:string;
//     price:string;
//     quantity:string;
//     count:number;
//     sod:number;
//     categoryObj?:CategoryObj;
//     subCategoryObj?:SubCategoryObj;
//     createdAt?:string;
//     updatedAt?:string;
//     _v?:number;
// }

// export interface CategoryObj{
//     _id:string;
//     name:string;
//     description:string;
//     subCategories?:(string)[]|null;
//     createdAt?:string;
//     updatedAt?:string;
// }
//
// export interface SubCategoryObj{
//     _id:string;
//     name:string;
//     description:string;
//     _v:number;
// }

export interface INewCartProduct{
    product:string;
    count:number;
    price:number;

}
export interface ICart{
    _id?:string;
    products:INewCartProduct[];
    total:string;
    tax:String;
    grandTotal:string;
    userObj:mongoose.Schema.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}