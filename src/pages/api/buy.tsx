import { sendMail } from 'helpers/nodemailer';
import { ProductModel } from 'helpers/db-ProductModel';
// import { RandomModel } from 'helpers/randomDetails';
import { dbConnect} from "../../lib/dbConnect";

export default async (req, res) => {
  const { method } = req;
  if (method === 'POST') {

    const { buyerPkh, items, buyerName, buyerMail, bill_amount, submittedTxHash } = req.body;

    try {

      await dbConnect();

      //TODO: hacer iteracion por todos los items
      let producto = await ProductModel.findOne({ _id: items[0]._id }).exec();
      
      if(producto === null) {
        console.error(`No se ha encontrado un NFT con el id ${items[0]._id}.`);
        return res.status(400).json({ data: `No se ha encontrado un NFT con el id ${items[0]._id}.` });
      }

      console.log(items);
      console.log(producto);

      if(producto.sold === "TRUE") {
        return res.status(202).json({ data: `El NFT seleccionado ya ha sido vendido.` });
      }

      producto.buyerName = buyerName 
      producto.buyerMail = buyerMail 
      producto.buyerPkh = buyerPkh 
      producto.buyTxHash = submittedTxHash

      producto.sold = "TRUE";
      producto.lastUpdate = Date();

      await producto.save();


      var sellerMail = producto.sellerMail
      var sellerName = producto.sellerName

      // await sendMail('ALDEA@aldea-dao.org', sellerMail, 'ALDEA NFT: Alguien ha comprado tu NFT', {
      //   sellerName, 
      //   items,
      //   bill_amount,
      // });

      // await sendMail('ALDEA@aldea-dao.org', buyerMail, 'ALDEA NFT: Haz hecho una compra', {
      //   buyerName, 
      //   items,
      //   bill_amount,
      // });

      return res.status(200).json({ data: `Compra exitosa!` });

    } catch (error) {
      return res.status(error.statusCode || 500).json({ data: error.message });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ data: `Method ${method} Not Allowed` });
  }
};
