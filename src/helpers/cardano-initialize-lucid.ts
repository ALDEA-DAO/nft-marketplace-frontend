//--------------------------------------
import { Blockfrost, Lucid, WalletApi } from 'lucid-cardano'
//--------------------------------------
import { toJson } from './utils';
//--------------------------------------

const initalizeLucid = async (walletApi: WalletApi | undefined) => {
    console.log ("initalizeLucid")
    try {
        const lucid = await Lucid.new(
            new Blockfrost(process.env.NEXT_PUBLIC_BLOCKFROST_URL, process.env.NEXT_PUBLIC_BLOCKFROST_KEY),
            'Preview'
        )
        
        if(walletApi !== undefined) {
            await lucid.selectWallet(walletApi)
        }
    
        console.log ("walletApi: " + toJson(walletApi))
    
        return lucid
    }catch (e){

        console.error("initalizeLucid Error: " + e)
    }
}

export default initalizeLucid

//--------------------------------------
