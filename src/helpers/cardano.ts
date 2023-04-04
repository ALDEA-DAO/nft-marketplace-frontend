//----------------------------------------------------------------------

import { Lucid, Assets, C, SpendingValidator, fromHex, PaymentKeyHash, Redeemer, toHex, UTxO, Data, Constr, TxHash, Script, TxComplete, TxSigned, Address,  } from "lucid-cardano";
import { DatumValidator, TxOutRef, mkDatumValidatorFromCbor, NFT, RedeemerBuyerBuyNFT } from "../types/cardano";
import { marketplaceScript } from "../types/plutus";

//----------------------------------------------------------------------

import { addAssets, findDatumIfMissing, findUTxOWithNFT, intToBBS, isNFTInTxOut, objToPlutusData, pubKeyHashToAddress, saveTxSignedToFile, sha256HexStr, showPtrInHex, strToHex } from "./cardano-utils";
import { toJson } from "./utils";

//----------------------------------------------------------------------

//minLoveLace to add in txOut with no ADA, just Tokens. 
export const minLovelace : Assets = {["lovelace"]: BigInt(2000000)} 
//for creating a valid time range tx
export const ppValidTimeRange = 10 * 60 * 1000


//---------------------------------------------------------------

export function datumIsDatumValidator (uTxO: UTxO)  {
    if (uTxO.datum){
        try {
            const datum : DatumValidator = mkDatumValidatorFromCbor (uTxO.datum)
            return true
        }catch(e){
            return false
        }  
    }else {
        return false
    }  
}

//---------------------------------------------------------------

export async function getUtxosWithValidDatumValidatorInUxtoList (lucid: Lucid, utxos: UTxO[]) : Promise<UTxO [] | undefined>{

    var utxosWithDatum : UTxO[] = []
    for (var i=0;i< utxos.length;i+=1){
        const uTxO : UTxO = await findDatumIfMissing (lucid, utxos[i])
        utxosWithDatum.push (uTxO) 
    }
    //-------------------
    var utxosWithDatumValidator : UTxO[] = []
    for (var i=0;i< utxosWithDatum.length;i+=1){
        if (datumIsDatumValidator (utxosWithDatum[i]))
            utxosWithDatumValidator.push (utxosWithDatum[i]) 
    }
    //-------------------
    var utxosWithDatumValidatorAndNFT : UTxO[] = []
    for (var i=0;i< utxosWithDatumValidator.length;i+=1){
        const datum : DatumValidator = mkDatumValidatorFromCbor (utxosWithDatumValidator[i].datum!)
        if (isNFTInTxOut (utxosWithDatumValidator[i], datum.dNFT)){
            utxosWithDatumValidatorAndNFT.push (utxosWithDatumValidator[i]) 
        }    
    }
    return utxosWithDatumValidatorAndNFT
}

//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------



export async function splitUTxOsEndPoint(lucid: Lucid, api, pkh: PaymentKeyHash) {

    if (!pkh)
        throw 'Error: No key hash for a user, try connecting your wallet again';
    //------------------
    const master = pkh;
    const masterAddr = await lucid!.wallet.address();
    //------------------
    // Valores para los UTxO
    const splitAmount = 10000000n;
    const valueForSplitUTxO: Assets = { ["lovelace"]: splitAmount };
    //------------------

    var txComplete: TxComplete 
    try {
        txComplete =await splitUTxOsTx( lucid!, pkh, masterAddr, valueForSplitUTxO);
    } catch (err) {
        console.error("Error sellNFTTx: " + err)
        throw "Error: sellNFTTx: " + err
    }
    
    console.log("Tx Complete: " + txComplete.txComplete.to_json())
    console.log("Tx Complete: " + txComplete.toString())

    var txCompleteSigned:TxSigned
    try {
        txCompleteSigned = await (txComplete.sign()).complete();
    } catch (err) {
        console.error("Error txCompleteSigned: " + err)
        throw "Error: txCompleteSigned: " + err
    }

    console.log("Tx txCompleteSigned: " + txCompleteSigned.txSigned.to_json())
    console.log("Tx txCompleteSigned: " + txCompleteSigned.toString())

    //await saveTxSignedToFile(txCompleteSigned)

    var txCompleteHash
    try {
        // //txCompleteHash = await lucid.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        // //txCompleteHash = await txCompleteSigned.submit();
        // txCompleteHash = await lucid.provider.submitTx(txCompleteSigned.toString());

        
        //console.log("createPool - Tx Using Provider")
        //txCompleteHash = await lucid!.provider.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        //txCompleteHash = await lucid!.provider.submitTx(txCompleteSigned.txSigned);
        
        //console.log("createPool - Tx Using Wallet")
        //txCompleteHash = await lucid!.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        txCompleteHash = await lucid!.wallet.submitTx(txCompleteSigned.txSigned);

    } catch (err) {
        console.error("Error txCompleteHash: " + err)
        throw "Error: txCompleteHash: " + err
    }

    console.log("Tx txCompleteHash: " + txCompleteHash)

    return txCompleteHash

}
//--------------------------------------


export async function sellNFTEndPoint(lucid: Lucid, data) {

    console.log ("sellNFTEndPoint")

    if (!data.sellerPkh)
        throw 'Error: No key hash for a user, try connecting your wallet again';
    //------------------
    const seller = data.sellerPkh;
    const sellerAddr = await lucid!.wallet.address();
    //------------------
    const uTxOsAtWallet = await lucid!.wallet.getUtxos();
    if (uTxOsAtWallet.length == 0) {
        throw "Error: UTxO list at Wallet is empty";
    }
    //------------------
    const nft : NFT = {currencySymbol:data.assetPolicyIdHex, tokenName: data.assetNameHex}
    //------------------
    const nftUTxO = findUTxOWithNFT(uTxOsAtWallet, nft);

    if (typeof nftUTxO == 'undefined') {
        throw "Error: Can't find UTxO with NFT to Sell";
    }
    //------------------
     // Valores para los UTxO
    const valueWithNFT: Assets = { [nft.currencySymbol + nft.tokenName]: 1n };
    const valueForDatumValidator: Assets = addAssets(minLovelace, valueWithNFT);
    //------------------
    // Creando PoolDatum
    const datumValidator = new DatumValidator (seller, nft, BigInt(data.price));
    //------------------

    var txComplete: TxComplete 
    try {
        txComplete =await sellNFTTx(
            lucid!, sellerAddr, nftUTxO,
            datumValidator, valueForDatumValidator
            );
    } catch (err) {
        console.error("Error sellNFTTx: " + err)
        throw "Error: sellNFTTx: " + err
    }
    
    console.log("Tx Complete: " + txComplete.txComplete.to_json())
    console.log("Tx Complete: " + txComplete.toString())

    var txCompleteSigned:TxSigned
    try {
        txCompleteSigned = await (txComplete.sign()).complete();
    } catch (err) {
        console.error("Error txCompleteSigned: " + err)
        throw "Error: txCompleteSigned: " + err
    }

    console.log("Tx txCompleteSigned: " + txCompleteSigned.txSigned.to_json())
    console.log("Tx txCompleteSigned: " + txCompleteSigned.toString())

    //await saveTxSignedToFile(txCompleteSigned)

    var txCompleteHash
    try {
        // //txCompleteHash = await lucid.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        // //txCompleteHash = await txCompleteSigned.submit();
        // txCompleteHash = await lucid.provider.submitTx(txCompleteSigned.toString());


        //console.log("createPool - Tx Using Provider")
        //txCompleteHash = await lucid!.provider.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        //txCompleteHash = await lucid!.provider.submitTx(txCompleteSigned.txSigned);
        
        //console.log("createPool - Tx Using Wallet")
        //txCompleteHash = await lucid!.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        txCompleteHash = await lucid!.wallet.submitTx(txCompleteSigned.txSigned);

    } catch (err) {
        console.error("Error txCompleteHash: " + err)
        throw "Error: txCompleteHash: " + err
    }

    console.log("Tx txCompleteHash: " + txCompleteHash)

    return txCompleteHash
}

//--------------------------------------


export async function buyNFTEndPoint(lucid: Lucid, data) {

    console.log ("buyNFTEndPoint")

    if (!data.buyerPkh)
        throw 'Error: No key hash for a user, try connecting your wallet again';
    //------------------
    const buyer = data.buyerPkh;
    const buyerAddr = await lucid!.wallet.address();

    //------------------
    const uTxOsAtWallet = await lucid!.wallet.getUtxos();
    if (uTxOsAtWallet.length == 0) {
        throw "Error: UTxO list at Wallet is empty";
    }
    //------------------
    const scriptAddress: Address = marketplaceScript.address
    //------------------
    const utxosAtScript = await lucid!.utxosAt(scriptAddress)
    console.log ("utxosAtScript: " + toJson(utxosAtScript))
    if (utxosAtScript.length == 0) {
        throw "Error: UTxO list at Script is empty";
    }
    //------------------
    //TODO: hacer iteracion de todos los items
    const item = data.items[0]
    //------------------
    const sellerPkh = item.sellerPkh
    const sellerAddr = item.sellerAddress
    console.log ("sellerPkh: " + toJson(sellerPkh))
    console.log ("sellerAddr: " + toJson(sellerAddr))
    //TODO: no pude calcular la address desde la pkh que guarde en la base, pero uso la address que tengo guardada ahi tambien
    // const networkTag = (process.env.NEXT_PUBLIC_CARDANO_NETWORK) === "Mainnet" ? 1 : 0
    // const sellerAddr2 = pubKeyHashToAddress(sellerPkh, networkTag) 
    // console.log ("sellerAddr2: " + toJson(sellerAddr2))
    //------------------
    const nft : NFT = {currencySymbol:item.policyIdHex, tokenName: item.tokenNameHex}
    //------------------
    const nftUTxO = findUTxOWithNFT(utxosAtScript, nft);

    if (typeof nftUTxO == 'undefined') {
        throw "Error: Can't find UTxO with NFT to Buy. NFT: " + toJson (nft);
    }
    //------------------
     // Valores para los UTxO
    const valueWithNFT: Assets = { [nft.currencySymbol + nft.tokenName]: 1n };
    const valueOfNFT: Assets = { ["lovelace"]: BigInt(item.price) };
    // el seller recupera los minLoveLace que puso al comienzo y el valor del NFT
    //const valueForSeller: Assets = addAssets(minLovelace, valueOfNFT); 
    const valueForSeller: Assets = valueOfNFT; 
    // el buyer recive el NFT acompanado de minlovelace
    const valueForBuyer: Assets = addAssets(minLovelace, valueWithNFT);
    //------------------
    // creando redeemers
    const redeemerForConsumingValidatorDatum = new RedeemerBuyerBuyNFT () 
    //------------------

    var txComplete: TxComplete 
    try {
        txComplete =await buyNFTTx(
            lucid!,
            buyerAddr, valueForBuyer,
            sellerAddr, valueForSeller,
            nftUTxO, redeemerForConsumingValidatorDatum
            );
    } catch (err) {
        console.error("Error buyNFTTx: " + err)
        throw "Error: buyNFTTx: " + err
    }
    
    console.log("Tx Complete: " + txComplete.txComplete.to_json())
    console.log("Tx Complete: " + txComplete.toString())

    var txCompleteSigned:TxSigned
    try {
        txCompleteSigned = await (txComplete.sign()).complete();
    } catch (err) {
        console.error("Error txCompleteSigned: " + err)
        throw "Error: txCompleteSigned: " + err
    }

    console.log("Tx txCompleteSigned: " + txCompleteSigned.txSigned.to_json())
    console.log("Tx txCompleteSigned: " + txCompleteSigned.toString())

    //await saveTxSignedToFile(txCompleteSigned)

    var txCompleteHash
    try {
        // //txCompleteHash = await lucid.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        // //txCompleteHash = await txCompleteSigned.submit();
        // txCompleteHash = await lucid.provider.submitTx(txCompleteSigned.toString());


        //console.log("createPool - Tx Using Provider")
        //txCompleteHash = await lucid!.provider.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        //txCompleteHash = await lucid!.provider.submitTx(txCompleteSigned.txSigned);
        
        //console.log("createPool - Tx Using Wallet")
        //txCompleteHash = await lucid!.wallet.submitTx(toHex(txCompleteSigned.txSigned.to_bytes()));
        txCompleteHash = await lucid!.wallet.submitTx(txCompleteSigned.txSigned);


        //txCompleteHash = await txCompleteSigned.submit();

    } catch (err) {
        console.error("Error txCompleteHash: " + err)
        throw "Error: txCompleteHash: " + err
    }

    console.log("Tx txCompleteHash: " + txCompleteHash)

    return txCompleteHash
}

//--------------------------------------
//--------------------------------------
//--------------------------------------
//--------------------------------------

export async function splitUTxOsTx(lucid: Lucid, pkhf: PaymentKeyHash, addressWallet: Address, valueForSplitUTxO: Assets) {
    console.log("splitUTxOsTx")
    console.log("valueForPoolDatum: " + toJson(valueForSplitUTxO))
    var tx: any
    var txComplete: any
    tx = await lucid.newTx()
    txComplete = await tx
        .payToAddress(addressWallet, valueForSplitUTxO)
        .payToAddress(addressWallet, valueForSplitUTxO)
        .complete();
    return txComplete
}

//--------------------------------------

export async function sellNFTTx(
    lucid: Lucid, addressWallet: Address, nftUTxO: UTxO,
    datumValidator: DatumValidator, valueForDatumValidator: Assets,
) {
    console.log("sellNFTTx")
    //------------------
    const scriptAddress: Address = marketplaceScript.address
    //------------------
    console.log("nftUTxO: " + toJson(nftUTxO))
    //---------------------------------------------
    console.log("datumValidator: " + toJson(datumValidator))
    const datumValidatorPlutusData = objToPlutusData(datumValidator)
    const datumValidatorHex = showPtrInHex(datumValidatorPlutusData) //toHex(poolDatumPlutusData.to_bytes())
    const datumValidatorHash = C.hash_plutus_data(datumValidatorPlutusData)
    console.log("datumValidatorHex: " + toJson(datumValidatorHex))
    console.log("datumValidatorHash: " + showPtrInHex(datumValidatorHash))
    //---------------------------------------------
    console.log("valueForDatumValidator: " + toJson(valueForDatumValidator))
    //---------------------------------------------
    const now = Math.floor(Date.now())
    console.log("now: " + now)
    const from = now - (5 * 60 * 1000)
    const until = now + (ppValidTimeRange) - (5 * 60 * 1000) //+ (5 * 60 * 1000) 
    //---------------------------------------------
    var tx: any
    var txComplete: any
    tx = await lucid.newTx()

    txComplete = await tx
        .collectFrom([nftUTxO])        
        .payToContract(scriptAddress, datumValidatorHex, valueForDatumValidator)
        //.payToAddress(addressWallet, valueForDatumValidator)
        .addSigner(addressWallet)
        .validFrom(from)
        .validTo(until)
        .complete();

    return txComplete
}

//--------------------------------------

export async function buyNFTTx(
    lucid: Lucid, 
    buyerAddressWallet: Address, valueForBuyer: Assets,
    sellerAddressWallet: Address, valueForSeller: Assets,
    nftUTxO: UTxO, redeemerForConsumingValidatorDatum: RedeemerBuyerBuyNFT
) {
    console.log("buyNFTTx") 
    //------------------
    const scriptAddress: Address = marketplaceScript.address
    //---------------------------------------------
    console.log("nftUTxO: " + toJson(nftUTxO))
    //---------------------------------------------
    console.log("redeemerForConsumingValidatorDatum: " + toJson(redeemerForConsumingValidatorDatum))
    const redeemerForConsumingValidatorDatumPlutusData = objToPlutusData(redeemerForConsumingValidatorDatum)
    const redeemerForConsumingValidatorDatumHex = showPtrInHex(redeemerForConsumingValidatorDatumPlutusData) //toHex(poolDatumPlutusData.to_bytes())
    const redeemerForConsumingValidatorDatumHash = C.hash_plutus_data(redeemerForConsumingValidatorDatumPlutusData)
    console.log("redeemerForConsumingValidatorDatumHex: " + toJson(redeemerForConsumingValidatorDatumHex))
    console.log("redeemerForConsumingValidatorDatumHash: " + showPtrInHex(redeemerForConsumingValidatorDatumHash))
    //---------------------------------------------
    console.log("buyerAddressWallet: " + toJson(buyerAddressWallet))
    console.log("valueForBuyer: " + toJson(valueForBuyer))
    //---------------------------------------------
    console.log("sellerAddressWallet: " + toJson(sellerAddressWallet))
    console.log("valueForSeller: " + toJson(valueForSeller))
    //---------------------------------------------
    const now = Math.floor(Date.now())
    console.log("now: " + now)
    const from = now - (5 * 60 * 1000)
    const until = now + (ppValidTimeRange) - (5 * 60 * 1000) 
    //---------------------------------------------
    const script : SpendingValidator = {
        type:    ((marketplaceScript.type == "PlutusScriptV1") ? "PlutusV1" : "PlutusV2"),
        script:  marketplaceScript.cborHex
    };
    //---------------------------------------------
    var tx: any
    var txComplete: any
    
    tx = await lucid.newTx()
    txComplete = await tx
        .attachSpendingValidator(script)
        .collectFrom([nftUTxO], redeemerForConsumingValidatorDatumHex) 
        .payToAddress(buyerAddressWallet, valueForBuyer)
        .payToAddress(sellerAddressWallet, valueForSeller)
        .addSigner(buyerAddressWallet)
        .validFrom(from)
        .validTo(until)
        .complete();

    return txComplete
}

//--------------------------------------

