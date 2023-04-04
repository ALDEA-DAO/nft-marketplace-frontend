import { Schema, model, models } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface Product {
  //id: string;

  tokenName: string;
  tokenNameHex: string;
  policyIdHex: string;
  image: string;
  description: string;
  url: string;

  price: string;
  
  type: string;
  quantity: string;
  author: string;

  sold: string;

  sellerName: string;
  sellerMail: string;
  sellerPkh: string;
  sellerAddress: string;

  buyerName: string;
  buyerMail: string;
  buyerPkh: string;

  sellTxHash: string;
  buyTxHash: string;

  //soldPrice: string;
  //address: string;
  //fromAddress: string;
  //transactionHash: string;

  lastUpdate: string;
}

// 2. Create a Schema corresponding to the document interface.
const schemaProduct = new Schema<Product>({
  //id: { type: String, required: true },

  tokenName: { type: String, required: true },
  tokenNameHex: { type: String, required: true },
  policyIdHex: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: false },
  url: { type: String, required: false },

  price: { type: String, required: true },

  

  type: { type: String, required: false },
  quantity: { type: String, required: false },
  author: { type: String, required: false },
  
  sold: { type: String, required: true },

  sellerName: { type: String, required: true },
  sellerMail: { type: String, required: true },
  sellerPkh:  { type: String, required: true },
  sellerAddress:  { type: String, required: true },

  buyerName: { type: String, required: false },
  buyerMail: { type: String, required: false },
  buyerPkh:  { type: String, required: false },

  sellTxHash:  { type: String, required: true },
  buyTxHash:  { type: String, required: false },

  // soldPrice: { type: String, required: false },
  // address: { type: String, required: false},
  // fromAddress: { type: String, required: false},
  // transactionHash: { type: String, required: false},

  lastUpdate: { type: Date, required: true},
});

// 3. Create a Model.
export const ProductModel = models.Product || model<Product>('Product', schemaProduct);