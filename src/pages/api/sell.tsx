import { dbConnect}  from "../../lib/dbConnect";
import { ProductModel } from 'helpers/db-ProductModel';
//import {ObjectID} from 'mongodb'

export default async function handler(req, res) {
  // Get data submitted in request's body.

  const { sellerPkh, sellerAddress, sellerName, sellerMail, price, tokenStr, assetPolicyIdHex, assetNameHex, assetNameString, assetAmountToSend, lovelaceToSend , tokenName, tokenDescription, tokenLogo, tokenUrl, submittedTxHash } = req.body;


  // Optional logging to see the responses
  // in the command line where next.js app is running.
  console.log('body: ', req.body)

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!sellerPkh || !sellerAddress || !sellerName || !sellerMail || !price || !tokenStr || !assetPolicyIdHex || !assetNameHex || !assetNameString || !assetAmountToSend || !lovelaceToSend || !tokenName || !submittedTxHash ) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'Campos Incompletos' })
  }

  

  const producto = new ProductModel({
    //id: new ObjectID(),
    tokenName: `${tokenName}`, //TODO: uso el tokenname, que viene de los metadatos y que el usuario pudo cambiar a gusto, para elegir como mostrar. Antes usaba: assetNameString
    tokenNameHex: `${assetNameHex}`,
    policyIdHex: `${assetPolicyIdHex}`,
    image: tokenLogo,
    description: tokenDescription,
    url: tokenUrl,

    price: price,

    type: 'NFT',
    quantity: 1,
    author: sellerName,

    sold: 'FALSE',

    sellerName: sellerName,
    sellerMail: sellerMail,
    sellerPkh: sellerPkh,
    sellerAddress: sellerAddress,

    buyerName: undefined,
    buyerMail: undefined,
    buyerPkh: undefined,

    sellTxHash: submittedTxHash,
    buyTxHash: undefined,
  
    lastUpdate:  Date()

  });

  await dbConnect()
  
  await producto.save();

  // Found the name.
  // Sends a HTTP success code
  res.status(200).json({ data: `${sellerName} vendió ${tokenStr}` })
}