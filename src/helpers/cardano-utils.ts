//----------------------------------------------------------------------
import { Lucid, Assets, C, fromHex, PaymentKeyHash, Redeemer, toHex, UTxO, Data, Constr, TxHash, Script, TxComplete, TxSigned,  } from "lucid-cardano";
import { DatumValidator, TxOutRef, mkDatumValidatorFromCbor, NFT } from "../types/cardano";
//----------------------------------------------------------------------
import { createHash } from 'crypto';
import { toJson } from "./utils";

//----------------------------------------------------------------------

// export function string2Bin (str: string) {
//     var result = [];
//     for (var i = 0; i < str.length; i++) {
//       result.push(str.charCodeAt(i).toString(2));
//     }
//     return result;
//   }

//----------------------------------------------------------------------

//for converting String into Hex representation. It is used for converting the TokenName into Hex
export function strToHex (str: string) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
}

//for converting Hex into String
export function hexToStr(hexStr: string){
    const bytes = new Uint8Array(hexStr.length / 2);
    for (let i = 0; i !== bytes.length; i++) {
        bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
    }
    return new TextDecoder().decode( bytes);
}

//----------------------------------------------------------------------

//for converting Hex String to byte array. It is used in sha256 calculation.
export function hexToBytes (hexStr: string) {
    for (var bytes = [], c = 0; c < hexStr.length; c += 2)
        bytes.push(parseInt(hexStr.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
export function bytesToHex (bytes: any[]) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}


//----------------------------------------------------------------------

// 48 is ASCII code for '0'
export function intToBBS (number : number) {
    const rest = (number+48).toString(16);
    return rest
}


//----------------------------------------------------------------------

//for calculating sha256S hash from hex string 
export function sha256HexStr (hexStr: string) {
    //console.log ("sha256Str 1: " + hexStr)
    //const bytesStr = hexToBytes (hexStr)
    //console.log ("sha256Str 2: " + bytesStr)
    //const res = createHash('sha256').update(bytesStr).digest('hex');
    const res = createHash('sha256').update(hexStr,'hex').digest('hex');

    //console.log ("sha256Str 3: " + res)
    return res
}


//----------------------------------------------------------------------

//for showing content of pointers
export function showPtrInHex (ptr: any) : string {
    return Buffer.from(ptr.to_bytes(), "utf8").toString("hex")
}


//----------------------------------------------------------------------

function itemToData (item : any){

    if (typeof item === 'bigint' || typeof item === 'number' || typeof item === 'string' && !isNaN(parseInt(item)) && item.slice(-1) === 'n') {
        return (item)
    } else if (item instanceof TxOutRef) {
         
        var list2 : any [] = []
        list2.push(new Constr (0, [item.txHash]))
        list2.push(item.outputIndex)
        const res2 = new Constr (0, list2)
        return (res2)

    } else if (typeof item === 'string') {
        return (item)
    } else if (item instanceof Constr) {
        return (item)
    } else if (item instanceof Array) {

        var list2 : any [] = []
        item.forEach((subItem: any) => {
            list2.push(itemToData(subItem)) 
        })
        return (list2)  

    } else if (item instanceof Map) { 
        // TODO: falta convertir map, pero no uso map, asi que por ahora no lo hago
        return (item)
    } else {
        return (subObjToData(item))
    }
}

//for creating a PlutusData structure from any Object
function subObjToData (data: any) {

    const keys = Object.keys(data);
    var list : any [] = []
    keys.forEach(key => {
        const item = data[key]
        if (key == "plutusDataIndex" || key == "subtypo" ) return //no quiero user esa info en el construct
        list.push(itemToData(item)) 
    });

    var plutusDataIndex = 0
    if ("plutusDataIndex" in data){
        //si existe ese campo en la clase o el tipo lo uso para crear el construct superior
        plutusDataIndex = data.plutusDataIndex
    }
    
    if ("subtypo" in data && data["subtypo"]){
        
        const constrSubtypo = new Constr (0, list)

        const constrTypo = new Constr (plutusDataIndex, [constrSubtypo])

        return constrTypo

    }else{

        const constrTypo = new Constr (plutusDataIndex, list)
        
        return constrTypo    
    }
    
}

//for creating a PlutusData structure from any Object
//it used firts the lucidData format, and then Data.to, for serialize and then PlutusData.from_bytes(fromHex()) to get the final PlutusData
 export function objToPlutusData (data: any) {

    const lucidData = subObjToData(data) //new Constr (plutusDataIndex, [constrObject])

    console.log("LucidData: " + toJson(lucidData))

    const dataHex = Data.to(lucidData)
    const plutusData = C.PlutusData.from_bytes(fromHex(dataHex))
    
    return plutusData

}


//---------------------------------------------------------------

export const saveTxCompleteToFile = async (txComplete: TxComplete) => {

    const cbor =  Buffer.from(
        txComplete.txComplete.to_bytes()
    ).toString('hex')

    const myData = {
            "type": "Tx BabbageEra",
            "description": "",
            "cborHex": cbor
    }

    const fileName = "tx";
    const json = JSON.stringify(myData);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".signed";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const saveTxSignedToFile = async (txSigned: TxSigned) => {

    const cbor =  Buffer.from(
        txSigned.txSigned.to_bytes()
    ).toString('hex')

    const myData = {
            "type": "Tx BabbageEra",
            "description": "",
            "cborHex": cbor
    }

    const fileName = "tx";
    const json = JSON.stringify(myData);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".signed";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//---------------------------------------------------------------

export const bytesToStringHex = (bytes)=> {
    return Buffer.from(bytes).toString("hex");
}

export const addrToPubKeyHash = (bech32Addr) => {
    const baseAddress = C.BaseAddress.from_address(
        C.Address.from_bech32(bech32Addr)
    )

    if (baseAddress){
      const pkh = baseAddress.payment_cred().to_keyhash();
      return bytesToStringHex(pkh.to_bytes());
    }else{
      return undefined
    }

    
}
//---------------------------------------------------------------

export function pubKeyHashToAddress (pkh, network){
    //TODO no estoy pudiendo ir para atras...

    var rootPk
    try{
        // You can also use from_bip39_entropy if you want a create it from a recovery phrase instead
        rootPk = C.Bip32PublicKey.from_bytes(pkh);
    }catch(e){
        console.error (e)
    }
    try{
        // You can also use from_bip39_entropy if you want a create it from a recovery phrase instead
        rootPk = C.Bip32PublicKey.from_bytes(fromHex(pkh));
    }catch(e){
        console.error (e)
    }
    try{
        // You can also use from_bip39_entropy if you want a create it from a recovery phrase instead
        rootPk = C.Bip32PublicKey.from_bytes(Buffer.from(pkh, "hex"));
    }catch(e){
        console.error (e)
    }
   
    // this is assuming the store wants its wallet to be compatible with Yoroi / Daedalus / etc

    // generate an address pk
    const addressPk = rootPk
        .derive(1852 + 0x80000000) // Cardano uses 1852 for Shelley purpose paths
        .derive(1815 + 0x80000000) // Cardano coin type
        .derive(0 + 0x80000000) // account #0
        .derive(0) // external chain (see bip44)
        .derive(0); // 0th account

    // get the address public key hash
    const keyHash = addressPk 
        .to_raw_key() // strips the chain code
        .hash();

    // generate the address
    const enterpriseAddr = C.EnterpriseAddress.new(
        network, // mainnet = 1  Tesnet = 0
        C.StakeCredential.from_keyhash(keyHash)
    );

    // get bech32 for address
    const bech32 = enterpriseAddr.to_address().to_bech32(undefined);

    console.log(bech32);

    return bech32

}

export function privKeyHashToAddress (prikh, network){

    //TODO no estoy pudiendo ir para atras...
    
    // You can also use from_bip39_entropy if you want a create it from a recovery phrase instead
    const rootPk = C.Bip32PrivateKey.from_bytes(prikh);

    // this is assuming the store wants its wallet to be compatible with Yoroi / Daedalus / etc

    // generate an address pk
    const addressPk = rootPk
        .derive(1852 + 0x80000000) // Cardano uses 1852 for Shelley purpose paths
        .derive(1815 + 0x80000000) // Cardano coin type
        .derive(0 + 0x80000000) // account #0
        .derive(0) // external chain (see bip44)
        .derive(0); // 0th account

    // get the address public key hash
    const keyHash = addressPk 
        .to_raw_key() // strips the chain code
        .to_public()
        .hash();

    // generate the address
    const enterpriseAddr = C.EnterpriseAddress.new(
        network, // mainnet = 1  Tesnet = 0
        C.StakeCredential.from_keyhash(keyHash)
    );

    // get bech32 for address
    const bech32 = enterpriseAddr.to_address().to_bech32(undefined);

    console.log(bech32);

    return bech32

}

//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

//for adding two Assets into one
export function addAssets (as1: Assets, as2: Assets){

    var units1 = Object.keys(as1);
    var units2 = Object.keys(as2);

    for (var i=0; i<units2.length; i++) {
        if (units2[i] in units1 ){
            as1[units2[i]] = as2[units2[i]] + as1[units2[i]] 
        }else{
            as1[units2[i]] = as2[units2[i]]
        }
    }

    return as1
}

//---------------------------------------------------------------

// Get new value from utxos substracting a value
export function subAssetsFromUtxos(utxos: UTxO[], value: Assets) : Assets {
    let utxoVal: Assets = {};
    let valKs = Object.keys(value)
    utxos.forEach((u) => {
        let assets: Assets = u.assets;
        let ks = Object.keys(assets)
        ks.forEach((k) => {
            let kVal = assets[k]
            kVal = kVal != undefined ? kVal : 0n;
            let uVal = utxoVal[k];
            uVal = uVal != undefined ? uVal : 0n;
            utxoVal[k] = BigInt(kVal.toString()) + BigInt(uVal.toString())
        });
    });
    valKs.forEach((k) => {
        let kVal = value[k]
        kVal = kVal != undefined ? kVal : 0n;
        let uVal = utxoVal[k]
        uVal = uVal != undefined ? uVal : 0n;
        if (kVal > uVal) {
            throw 'Subtraction Failed.';
        }
        utxoVal[k] = BigInt(uVal.toString()) - BigInt(kVal.toString())
    })
    return utxoVal;
}

//----------------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

export function getTokenNameFromTxOutRef (txOutRef : TxOutRef) {
    const idTxOut = txOutRef.txHash;
    const indexTxOut = txOutRef.outputIndex;
    const tokenName = sha256HexStr(idTxOut + intToBBS(indexTxOut));
    return tokenName;
}

//---------------------------------------------------------------

//for finding UTxO for Mint NFT
export function findUTxOForMintNFTInUTxOs (UTxOs: UTxO[]) {

    if (UTxOs.length>0) return UTxOs[0]

    return undefined
}

//---------------------------------------------------------------

//for finding UTxO that is different to txOutRef
export function findUTxOExcludingTxOutInUTxOs (uTxO: UTxO, UTxOs: UTxO[]) {

    for (var i=0; i<UTxOs.length; i++) {
        if (UTxOs[i] != uTxO) return UTxOs[i]
    }

    return undefined
}

//---------------------------------------------------------------

//for finding UTxO that is different to txOutRef
export function findUTxOExcludingTxOutRefInUTxOs (txOutRef: TxOutRef, UTxOs: UTxO[]) {

    for (var i=0; i<UTxOs.length; i++) {
        if (UTxOs[i].txHash != txOutRef.txHash || UTxOs[i].outputIndex != txOutRef.outputIndex ){
            return UTxOs[i] 
        }
    }
    return undefined
}

//---------------------------------------------------------------

//for finding UTxO that match the txOutRef. Is just the same txOutRef with more data.
export function findUTxOMatchingTxOutRefInUTxOs (txOutRef: TxOutRef, UTxOs: UTxO[]) {

    for (var i=0; i<UTxOs.length; i++) {
        if (UTxOs[i].txHash == txOutRef.txHash && UTxOs[i].outputIndex == txOutRef.outputIndex ){
            return UTxOs[i] 
        }
    }
    
    return undefined
}

//------------------------------------------------------

export async function findDatumIfMissing (lucid: Lucid, uTxO: UTxO) : Promise <UTxO> {

    console.log ("findDatumIfMissing")

    if (uTxO.datumHash && !uTxO.datum){
        console.log ("searching datumHash: " + uTxO.datumHash)

        const datum = await lucid.provider.getDatum(uTxO.datumHash)

        console.log ("found datum: " + toJson(datum))

        uTxO.datum = datum

        return uTxO
    }

    return uTxO
    
}


//---------------------------------------------------------------

export function isNFTInTxOut (uTxO: UTxO, nft: NFT)  {
    const asset = nft.currencySymbol + nft.tokenName
    if (asset in uTxO.assets){
        if (uTxO.assets[asset] == 1n){
            return true
        }else {
            return false
        }  
    }else {
        return false
    }  
}

//---------------------------------------------------------------

export function findUTxOWithNFT (uTxOs: UTxO [], nft: NFT)  {
    const asset = nft.currencySymbol + nft.tokenName

    for (var i = 0; i < uTxOs.length; i++) {
        const uTxO = uTxOs[i]
        if (asset in uTxO.assets){
            if (uTxO.assets[asset] == 1n){
                return uTxO
            }  
        }  
    }

    return undefined
}




//---------------------------------------------------------------
