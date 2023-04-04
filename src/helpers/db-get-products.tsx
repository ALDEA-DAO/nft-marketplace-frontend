import { ProductModel } from 'helpers/db-ProductModel';
import { dbConnect } from "../lib/dbConnect";
import { toJson } from './utils';

export async function getProducts() {
  try{
    console.log ("getProducts")

    await dbConnect();
    
    var  productos: any = await ProductModel.find({sold: "FALSE"}, {}, {sort: {_id: 1}})
    //var productos = [] 

    console.log ("getProducts length: "+ productos.length)

    //return productos

    return JSON.parse(toJson(productos));

  }catch(err){
    console.error("getProducts: ERR: " + err)
  }

  
}
