

//-----------------------------------
import { useEffect, useState } from 'react';
//-----------------------------------
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
//-----------------------------------
import Layout from 'containers/layout/layout';
import Head from 'next/head';
//-----------------------------------
import { useWallets } from 'contexts/wallets/wallets.provider';
//-----------------------------------
import { getProducts } from 'helpers/db-get-products';
//-----------------------------------
import { addrToPubKeyHash } from 'helpers/cardano-utils';
import { toJson } from "helpers/utils";
import { minLovelace } from 'helpers/cardano';
import { sellNFTEndPoint, splitUTxOsEndPoint } from 'helpers/cardano';
import initalizeLucid from 'helpers/cardano-initialize-lucid';
import { Lucid } from 'lucid-cardano';
import { searchKeyInArray } from 'helpers/utils';
//-----------------------------------
import { useLocalStorage } from 'helpers/use-storage2';
//-----------------------------------
import LoadingSpinner from "components/LoadingSpinner";

//-----------------------------------

export async function getServerSideProps() {
  const products : any = await getProducts();
  return {
    props: {
      products,
    },
  };
}
//-----------------------------------


export default function Sell({ products }) {

  const { walletAPI, walletIsEnabled, walletDataLoaded, balance, networkId, utxos, tokens, collateralUtxos, changeAddress, addresses, publicKeys, getWalletData,  } = useWallets();
 
  const [token, setToken] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  const [tokenMetadataMintTransaction, setTokenMetadataMintTransaction] = useState(undefined);
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenUrl, setTokenUrl] = useState("");
  const [tokenLogo, setTokenLogo] = useState("");

  const [userName, setUserName] = useLocalStorage ("userName", "");
  const [userEmail, setUserEmail] = useLocalStorage ("userEmail", "");

  const [tokenPrecio, setTokenPrecio] = useState("");

  const [sellerAddress, setSellerAddress] = useLocalStorage ("sellerAddress", "");

  const [isLoadingWalletData, setIsLoadingWalletData] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  
  useEffect(() => {
    console.log("SELL useEffect: walletIsEnabled: " + walletIsEnabled )
    setIsLoadingWalletData(walletIsEnabled && !walletDataLoaded)
    
  }, [walletIsEnabled]);

  useEffect(() => {
    console.log("SELL useEffect: walletDataLoaded: " + walletDataLoaded )
    setIsLoadingWalletData(walletIsEnabled && !walletDataLoaded)
  }, [walletDataLoaded]);

  useEffect(() => {
    console.log("SELL useEffect: getChangeAddress: " + changeAddress )
    if (changeAddress && sellerAddress == "") {
      setSellerAddress(changeAddress)
    }
  }, [changeAddress]);


  //-----------------------------------

  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
    console.log("Sell Submit: ")

    // Stop the form from submitting and refreshing the page. 
    event.preventDefault()

    let data

    
    setMessage(undefined)

    if (!token) {
      setMessage("Debe eligir el NFT que desea vender")
      return
    }

    if (sellerAddress == "" || !sellerAddress){
      setMessage("Debe especificar la dirección que recibirá el pago.")
      return
    }

    let sellerPkh
    try {
      sellerPkh = addrToPubKeyHash(sellerAddress)
      
      if (sellerPkh){
        console.log("sellerPkh: " + sellerPkh)  
      }else{
        setMessage("No pude calcular el Payment Key Hash usando la dirección ingresada.")
        return
      }
    }catch(err){
      setMessage("No pude calcular el Payment Key Hash usando la dirección ingresada. Error: " + err)
      console.error("addrToPubKeyHash: ERR: " + err)
      return
    }

    data = {

      tokenStr: token.multiAssetStr,

      assetPolicyIdHex: token.policyIdHex,
      assetNameHex: token.assetNameHex,
      assetNameString: token.assetNameString,
      assetAmountToSend: "1",

      sellerName: userName,
      sellerMail: userEmail,
      sellerPkh:  sellerPkh,
      sellerAddress: sellerAddress,

      price: tokenPrecio,

      tokenName: tokenName,
      tokenDescription: tokenDescription,
      tokenUrl: tokenUrl,
      tokenLogo: tokenLogo,

      lovelaceToSend: minLovelace,

    }

    if (!data.sellerName || !data.sellerMail || !data.price) {
      setMessage("Debe completar los campos obligatorios")
      return
    }


    setIsLoadingTx(true)

    var submittedTxHash

    try {
      submittedTxHash = await sellNFTAction(data)
    } catch (err) {
      console.error("Error Building SellNFT Tx: " + err)
      setMessage(`${err}`)
      setIsLoadingTx(false)
      return
    }

    try {

      data["submittedTxHash"] = submittedTxHash;

      const JSONdata = toJson(data)

      // API endpoint where we send form data.
      const endpoint = '/api/sell'

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)
      const json = await response.json()
      const messageJson = json.data

      switch (response.status) {
        case 200:
          console.log("/api/sell: " + messageJson)
          setMessage(`Oferta de Venta Realizada! Submitted Tx Hash: ${submittedTxHash} - ${messageJson}`)
          setToken(undefined)

          setTokenMetadataMintTransaction(undefined)
          setTokenName("")
          setTokenDescription("")
          setTokenUrl("")
          setTokenLogo("")

          //setUserName("")
          //setUserEmail("")
          setTokenPrecio("")
          
          getWalletData()
          setIsLoadingTx(false)

          return ;
        
        case 400:
        case 201:
        case 500:
        default:
          throw `${messageJson}`;
          // console.error("/api/sell error: " + messageJson)
          // setMessage(`Error: ${messageJson}`)
          // setIsLoadingTx(false)
          // return 
      }
    }  catch (err) {
        console.error("/api/sell error: " + err)
        setMessage(`Error: ${err} - Submitted Tx Hash for claiming NFT: ${submittedTxHash}`)
        setIsLoadingTx(false)
        return
    }

  };
  
  const splitUTxOsHandler = async () => {

    let sellerPkh
    try {
      sellerPkh = addrToPubKeyHash(sellerAddress)
      
      if (sellerPkh){
        console.log("sellerPkh: " + sellerPkh)  
      }else{
        setMessage("No pude calcular el Payment Key Hash usando la dirección ingresada.")
        return
      }
    }catch(err){
      setMessage("No pude calcular el Payment Key Hash usando la dirección ingresada. Error: " + err)
      console.error("addrToPubKeyHash: ERR: " + err)
      return
    }
    
    setIsLoadingTx(true)
    
    var submittedTxHash
    
    try {
      submittedTxHash = await splitUTxOsAction(sellerPkh)
    
      setIsLoadingTx(false)

      setMessage(`SplitUTxOs hecho! Submitted Tx Hash: ${submittedTxHash}`)
      
    } catch (err) {
      console.error("Error Building SplitUTxO Tx: " + err)
      setMessage(`${err}`)
      setIsLoadingTx(false)
      return
    }
  
  }
  
  
  //-----------------------------------
  
  const splitUTxOsAction = async (pkh) => {
  
    console.log("Sell NFT Action")
    
    
    const lucid = await initalizeLucid(walletAPI)
    
    const txHash = await splitUTxOsEndPoint(lucid!,walletAPI, pkh);
    
    //await awaitTx(lucid!, txHash)
    
    return txHash.toString();
    
    //return "aaff"
  
  }
  
  //-----------------------------------

  const sellNFTAction = async (data) => {

		console.log("Sell NFT Action")


		const lucid = await initalizeLucid(walletAPI)

		const txHash = await sellNFTEndPoint(lucid!, data);

		//await awaitTx(lucid!, txHash)

		return txHash.toString();

    //return "aaff"

	}


  //-----------------------------------

  const getTokenMetadataFromMintTransaction = async (token) => {

    console.log("getTokenMetadataFromMintTransaction: " + toJson(token))

    setIsLoadingMetadata(true)

    const endpoint = process.env.NEXT_PUBLIC_BLOCKFROST_URL + '/assets/' + token.policyIdHex + token.assetNameHex

    const options = {
      method: 'GET',
      headers: {
        'project_id': process.env.NEXT_PUBLIC_BLOCKFROST_KEY,
      },
    }

    try{

      const response = await fetch(endpoint, options)

      const result = await response.json()
    
      console.log(`getMetadataFromMintTransaction: ` + toJson(result))

      if (result.onchain_metadata !== null) {
        
        //TODO el keyword debajo del [token.policyIdHex] es el ticker, que en un caso lo hice diferente al name...
        //por eso mejor que usar [token.policyIdHex][token.assetName], voy a usar el primer key que hay
        
        //TODO: ahora onchainmetadata no tiene nada adentro, mas que la info del token... no necesito entrar con policyId y tokenName....

        //TODO falta leer tambien el campo result.metadatos, que me parece que ese viene del cardano fundation... no tengo ni gun token con eso registrado para comprobar...
        // de alli puedo sacar el URL por ejemplo

        const keysOnchain_metadata = Object.keys(result.onchain_metadata)
        var metadata 
        
        if (searchKeyInArray(keysOnchain_metadata,token.policyIdHex)) {

          const keys = Object.keys(result.onchain_metadata[token.policyIdHex])
          metadata = result.onchain_metadata[token.policyIdHex][keys[0]]

        }else{

          metadata = result.onchain_metadata

        }

        setTokenMetadataMintTransaction(metadata)      

        setTokenName(metadata["name"])
        setTokenDescription(metadata["description"])
        setTokenLogo(metadata["image"])  

        setIsLoadingMetadata(false)

      }else{
        setTokenMetadataMintTransaction ("No se encuentran metadatos para este token.")

        setIsLoadingMetadata(false)
      }

    } catch(err){
        console.error(`getMetadataFromMintTransaction API Error: ${err}`)

        setTokenMetadataMintTransaction ("Error")

        setIsLoadingMetadata(false)
    }
  }

  //-----------------------------------

  function estaEnVenta(x: any) {
  
    for (var i = 0; i < products.length; i++) {
      if (products[i]["policyIdHex"] === x.policyIdHex && products[i]["nameHex"] === x.assetNameHex) {
        return true
      }
    }
    return false
  }

  //-----------------------------------

  //select address
  const seleccionarAddress = (address) => {

    console.log("seleccionarAddress: " + address)

    setSellerAddress(address)

  }


  const seleccionarToken = (token) => {

    console.log(`seleccionarToken ${token.txid}, ${token.txindx}, ${token.multiassetAmt}, ${token.policyIdHex}, ${token.assetNameHex} (${token.assetNameString})`)

    if (token.multiassetAmt != 1) {

      setMessage(`Solamente se pueden vender NFTs, la cantidad debe ser 1 y tienes: ${token.multiassetAmt}`)

      setToken(undefined)

      setTokenName("")
      setTokenDescription("")
      setTokenUrl("")
      setTokenLogo("")

      setTokenMetadataMintTransaction(undefined)

    } else {

      setMessage(undefined)

      setToken(token)

      setTokenName(token.assetNameString)

      setTokenDescription("")
      setTokenUrl("")
      setTokenLogo("")

      setTokenMetadataMintTransaction(undefined)

      getTokenMetadataFromMintTransaction(token)
    }

  }

  return (

    <Layout>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="Description" content="Put your description here." />
        <title>Sell NFT</title>
      </Head>

      <div className="py-35px px-4 md:p-35px">
        <h3 className="w-full flex justify-center mb-30px text-24px text-gray-900 text-center font-semibold">
          SELL NFT
        </h3>


        <p><span style={{ fontWeight: "bold" }}>Wallet Ready? </span>{walletIsEnabled? "yes": "no"}</p>


        {isLoadingWalletData ? <><LoadingSpinner /><div >Cargando info desde Wallet, espere por favor...</div></> : walletIsEnabled?

            <><p><span style={{ fontWeight: "bold" }}>Network Id (0 = testnet; 1 = mainnet): </span>{networkId}</p>

            <p ><span style={{ fontWeight: "bold" }}>UTXOs (UTXO txid # txindex = ADA amount + tokenQty tokenPolicy . tokenName): </span>
              {
                utxos?.map(function (x) {
                  return (
                    <li style={{ fontSize: "10px" }} key={`${x.str}${x.multiAssetStr}`}>{`${x.str}${x.multiAssetStr}`}</li>
                  )
                })
              }
            </p>
            <p ><span style={{ fontWeight: "bold" }}>Collateral UTXOs (UTXO txid # txindex = ADA amount + tokenQty tokenPolicy . tokenName): </span>
              {
                collateralUtxos?.map(function (x) {
                  return (
                    <li style={{ fontSize: "10px" }} key={`${x.str}${x.multiAssetStr}`}>{`${x.str}${x.multiAssetStr}`}</li>
                  )
                })
              }
            </p>
            <p><span style={{ fontWeight: "bold" }}>Change Address: </span>{changeAddress}</p>

            <p><span style={{ fontWeight: "bold" }}>Addresses: </span>
              {
                addresses?.map(function (x) {
                  return (
                    <li style={{ fontSize: "10px" }} key={`${x}`}><button className='formButton' onClick={() => seleccionarAddress(x)}>Seleccionar</button>{`${x}`}</li>
                  )
                })
              }
            </p>

            <p><span style={{ fontWeight: "bold" }}>Public Keys: </span>
              {
                publicKeys?.map(function (x) {
                  return (
                    <li style={{ fontSize: "10px" }} key={`${x}`}>{`${x}`}</li>
                  )
                })
              }
            </p>

            <p><span style={{ fontWeight: "bold" }}>Balance: </span>{balance}</p>

            <p ><span style={{ fontWeight: "bold" }}>Tokens (tokenQty tokenPolicy . tokenName): </span>
              {
                tokens?.map(function (x) {
                  if (x.multiassetAmt != 1) {
                    return (
                      <li style={{ fontSize: "10px" }} key={`${x.multiAssetStr}`}>No es un NFT: {`${x.multiAssetStr}`}</li>
                    )
                  } else if (estaEnVenta(x)) {
                    return (
                      <li style={{ fontSize: "10px" }} key={`${x.multiAssetStr}`}>YA ESTA EN VENTA: {`${x.multiAssetStr}`}</li>
                    )
                  } else {
                    return (
                      <li style={{ fontSize: "10px" }} key={`${x.multiAssetStr}`}><button className='formButton' onClick={() => seleccionarToken(x)}>Seleccionar</button>{`${x.multiAssetStr}`}</li>
                    )
                  }
                })
              }
            </p>  <button className='formButton' disabled={!walletIsEnabled || isLoadingWalletData}    onClick={() => {
          console.log ("Actualizar")
          if (walletIsEnabled) {
            setIsLoadingWalletData(true)
            getWalletData()
          }
        }}>Actualizar Wallet Data</button>

              

            </> : <p>Conecte su wallet por favor</p>}

        
       


        <hr style={{ marginTop: "40px", marginBottom: "40px" }} />
        {token ? <>
            <span style={{ fontWeight: "bold" }}>Estas Vendiendo: </span>{token.multiAssetStr}<br />
            <br></br>Metadata:  
            
            {isLoadingMetadata ? <><LoadingSpinner /><div >Cargando metadata desde blockchain, espere por favor...</div></> :  <>{toJson(tokenMetadataMintTransaction)}</>}
            
            <br></br><br></br></>
            :
            <></>
          }

          {isLoadingTx ? <><LoadingSpinner /><div >Relizando la transacción, espere por favor...</div></> : <>

          <form onSubmit={handleSubmit}>
          <label >* Nombre del Vendedor:</label><br />
          <input className='formInput' type="text" id="userName" name="userName" value={userName} onChange={(event)=> {setUserName(event.target.value)}} /><br />

          <label >* Email:</label><br />
          <input className='formInput' type="text" id="userEmail" name="userEmail" value={userEmail} onChange={(event)=> {setUserEmail(event.target.value)}} /><br />

          <label >* Nombre del Token:</label><br />
          <input className='formInput' type="text" id="tokenName" name="tokenName" value={tokenName} onChange={(event)=> {setTokenName(event.target.value)}} /><br />

          <label >Descripcion:</label><br />
          <input style={{width:400}} className='formInput' type="text" id="tokenDescription" name="tokenDescription" value={tokenDescription} onChange={(event)=> {setTokenDescription(event.target.value)}} /><br />
          
          <label >WebSite:</label><br />
          <input style={{width:400}} className='formInput' type="text" id="tokenUrl" name="tokenUrl" value={tokenUrl} onChange={(event)=> {setTokenUrl(event.target.value)}} /><br />

          <label >Logo URL:</label><br />
          <input style={{width:400}} className='formInput' type="text" id="tokenLogo" name="tokenLogo"  value={tokenLogo} onChange={(event)=> {setTokenLogo(event.target.value)}} /><br />

          <label >* Precio (en lovelace, por ej: 4000000, que equivalen a 4 ADA):</label><br />
          <input className='formInput' type="text" id="tokenPrecio" name="tokenPrecio" value={tokenPrecio} onChange={(event)=> {setTokenPrecio(event.target.value)}} /><br />

          <label >* Wallet Address que recibirá el pago:</label><br />
          <input style={{width:400}} className='formInput' type="text" id="sellerAddress" name="sellerAddress" value={sellerAddress} onChange={(event)=> {setSellerAddress(event.target.value)}}  /><br />

          <br />
          {message ? <p><span style={{ fontWeight: "bold", color: "red" }}>Mensaje: </span>{message}</p> : <></>}
          <p>Nota: Los campos marcados con * son obligatorios</p> 

          <button className='formButton' type="submit" disabled={!walletIsEnabled}>Ofrecer a la Venta</button>
          
          </form>
          
          <div>
            <br></br>
            <hr></hr>
            <p>Si desea puede hacer un split de UTxOs. Siempre es adecuado tener más UTxO disponibles. Se necesitan como colateral y que no tengan tokens, solamente ADA</p>
            <button className='formButton' disabled={!walletIsEnabled} onClick={() => splitUTxOsHandler()}>Split UTxOs</button>
          </div>
          
          </>}
        

      </div>
    </Layout>

  );
}
