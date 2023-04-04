import { SpendingValidator, Assets , TxHash, PaymentKeyHash, MintingPolicy, C, toHex, PlutusData, fromHex, Data} from "lucid-cardano"

//--------------------------------------------------------

export declare type POSIXTime = bigint

export declare type CurrencySymbol = string

export declare type TokenName = string

export type AssetClass = {
  currencySymbol : CurrencySymbol;
  tokenName  : TokenName;
}

//lo uso como class a diferencia del resto, por que a la hora de convertir el datum y el redeemer a plutusData, el campo de Hash aqui no se convierte igual que un string y si no tengo clase no podria diferenciarlo de una string en ese momento.
export class TxOutRef  {
  plutusDataIndex = 0 

  txHash: TxHash;
  outputIndex: number;

  constructor(txHash: TxHash, outputIndex: number) {
    this.txHash = txHash;
    this.outputIndex = outputIndex;
  }
};

//-------------------------------------------------------------


export declare type Seller = PaymentKeyHash

export declare type NFT = AssetClass


//-------------------------------------------------------------

export class Maybe<T> {
  plutusDataIndex = 0 | 1
  val : T
  constructor (val : T) {
    this.val = val;
  }
}

//-------------------------------------------------------------


export class DatumValidator { 
  plutusDataIndex = 0
  subtypo = false 

  dSeller: Seller
  dNFT: NFT
  dPrice: bigint

  constructor(dSeller, dNFT, dPrice ) {
    this.dSeller = dSeller  
    this.dNFT = dNFT  
    this.dPrice = dPrice  

    //TODO: falta hacer oden de pdFundIDs
    // orden:
    //     let 
    //         compareFundID :: FundID -> FundID -> Ordering
    //         compareFundID fundID1 fundID2
    //             | fundID1 < fundID2 = LT
    //             | otherwise = GT
    //         -- need to be in order so it can be used after for cheking equality
    //         fundIDsOrder = sortBy compareFundID fundIDs

  }
  
}

export function mkDatumValidatorFromCbor ( datumCbor : string){

  var dSeller: Seller
  var dNFT: NFT
  var dPrice: bigint

  const lucidDataForDatum : any = Data.from(datumCbor)  
  // index 0 = DatumValidator
  if (lucidDataForDatum.index == 0) {

    const lucidDataForConstr0 = lucidDataForDatum.fields

    //constr para lista de campos Pool Datum
    if (lucidDataForConstr0[0].index == 0) {
      
      //lista de campos de Pool Datum
      const lucidDataForFields= lucidDataForConstr0[0].fields

      if (lucidDataForFields.length == 1) {

        //lista de fundIDs
        const lucidDataForFundIDs = lucidDataForFields[0]
        
        for (var i=0;i< lucidDataForFundIDs.length;i+=1){
          const lucidDataForFundID = lucidDataForFundIDs[i]
          if (lucidDataForFundID.index == 0){
            dSeller = undefined
            dNFT = undefined
            dPrice = undefined
          }else{
            throw "Error: Can't get DatumValidator"	
          }
        }
      }else{
        throw "Error: Can't get DatumValidator"	
      }
      return new DatumValidator (dSeller, dNFT, dPrice)
    }else{
      throw "Error: Can't get DatumValidator"	
    }
  }else{
    throw "Error: Can't get DatumValidator"	
  }
}

//-------------------------------------------------------------

export class RedeemerSellerGetBackNFT  { 
  plutusDataIndex = 0
  subtypo = false //es un subtipo de MintingFundAndUserIDRedeemer, y necesita dos niveles de constr para serializar
 
  constructor() {
  }
} 

export class RedeemerBuyerBuyNFT  { 
  plutusDataIndex = 1
  subtypo = false //es un subtipo de MintingFundAndUserIDRedeemer, y necesita dos niveles de constr para serializar
 
  constructor() {
  }
} 

export type RedeemerValidator = 
    RedeemerSellerGetBackNFT |
    RedeemerBuyerBuyNFT
    
//-------------------------------------------------------------
