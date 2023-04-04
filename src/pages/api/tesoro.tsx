import { ProductModel } from 'helpers/db-ProductModel';
//import { RandomModel } from 'helpers/randomDetails';
import { dbConnect}  from "../../lib/dbConnect";

export default async (req, res) => {
  const { method } = req;
  if (method === 'GET') {

    try {

      await dbConnect();

      // EPICOS

      var valorVendidoEpicos = 0;
      var valorNoVendidoEpicos = 0;

      var vendidoEpicos = await ProductModel.find( {$and:[{sold: "TRUE"},{type:"NFT - Animado - Épico"}]} ).exec();
      var noVendidoEpicos = await ProductModel.find( {$and:[{sold: "FALSE"},{type:"NFT - Animado - Épico"}]} ).exec();

      vendidoEpicos.forEach(function(epico) {
        valorVendidoEpicos = valorVendidoEpicos + parseInt(epico.soldPrice,10);
      });

      noVendidoEpicos.forEach(function(epico) {
        valorNoVendidoEpicos = valorNoVendidoEpicos + parseInt(epico.price,10);
      });

      var cantidadVendidoEpicos = await ProductModel.countDocuments({$and:[{sold: "TRUE"},{type:"NFT - Animado - Épico"}]}).exec();
      var cantidadNoVendidoEpicos = await ProductModel.countDocuments({$and:[{sold: "FALSE"},{type:"NFT - Animado - Épico"}]}).exec();

      // RAROS

      var valorVendidoRaros = 0;
      var valorNoVendidoRaros = 0;

      var vendidoRaros = await ProductModel.find( {$and:[{sold: "TRUE"},{type:"NFT - Estático - Raro"}]} ).exec();
      var noVendidoRaros = await ProductModel.find( {$and:[{sold: "FALSE"},{type:"NFT - Estático - Raro"}]} ).exec();

      vendidoRaros.forEach(function(raro) {
        valorVendidoRaros = valorVendidoRaros + parseInt(raro.soldPrice,10);
      });

      noVendidoRaros.forEach(function(raro) {
        valorNoVendidoRaros = valorNoVendidoRaros + parseInt(raro.price,10);
      });

      var cantidadVendidoRaros = await ProductModel.countDocuments({$and:[{sold: "TRUE"},{type:"NFT - Estático - Raro"}]}).exec();
      var cantidadNoVendidoRaros = await ProductModel.countDocuments({$and:[{sold: "FALSE"},{type:"NFT - Estático - Raro"}]}).exec();

      // COMUNES

      // var valorVendidoComunes = 0;
      // var valorNoVendidoComunes = 0;

      // var vendidoComunes = await RandomModel.find({ sold: "TRUE" }).exec();
      // var noVendidoComunes = await RandomModel.find({ sold: "FALSE" }).exec();

      // vendidoComunes.forEach(function(comun) {
      //   valorVendidoComunes = valorVendidoComunes + parseFloat(comun.soldPrice);
      // });

      // noVendidoComunes.forEach(function(comun) {
      //   valorNoVendidoComunes = valorNoVendidoComunes + parseFloat(comun.soldPrice);
      // });

      // var cantidadVendidoComunes = await RandomModel.countDocuments({ sold: "TRUE" }).exec();
      // var cantidadNoVendidoComunes = await RandomModel.countDocuments({ sold: "FALSE" }).exec();

    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).send({
      cantidadVendidoLegendarios: 2,
      valorVendidoLegendarios: 1200,
      cantidadNoVendidoLegendarios: 0,
      valorNoVendidoLegendarios: 0,
      cantidadVendidoEpicos,
      valorVendidoEpicos,
      cantidadNoVendidoEpicos,
      valorNoVendidoEpicos,
      cantidadVendidoRaros,
      valorVendidoRaros, 
      cantidadNoVendidoRaros,
      valorNoVendidoRaros, 
      // cantidadVendidoComunes,
      // valorVendidoComunes, 
      // cantidadNoVendidoComunes,
      // valorNoVendidoComunes
    });

  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
};