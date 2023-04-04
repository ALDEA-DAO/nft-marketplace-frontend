import Head from 'next/head';
import Layout from 'containers/layout/layout';
import Accordion from 'components/accordion';

const accordionData = [
  {
    id: 1,
    title: '¿Cómo puedo comprar un NFT?',
    details:
      `Para comprar un NFT simplemente debes hacer click en el que más te guste y presionar en el botón "Agregar al Carrito". 
      Luego debes pulsar en "Confirmar", ingresar tu nombre y correo electrónico y finalmente hacer click en el botón de "Generar Orden". 
      Aparecerá una pantalla que te solicitará el envío de ADA a la dirección de pago. Puedes escanear el código QR si quieres hacer el pago con tu teléfono celular o bien 
      copiar la dirección con el botón correspondiente. Recuerda realizar un único pago por el TOTAL EXACTO INDICADO en la pantalla.`,
  },
  {
    id: 2,
    title: '¿Desde qué billeteras puedo enviar los ADA?',
    details:
      'Puedes usar Daedalus, Yoroi, Nami, Game Changer o ccwallet. Recuerda NO enviar ADA desde un Exchange.',
  },
  {
    id: 3,
    title: '¿Cuándo recibiré mi NFT?',
    details:
      'Recibirás tu NFT dentro de las 48 hrs. de realizado el pago.',
  },
  {
    id: 4,
    title: '¿Cuál es el policy ID de la colección de ALDEA NFT?',
    details:
      'El policy ID de nuestra colección oficial de NFTs es: d16b6dbad263191df45b9cbf98fc54329cc6deb7a3cfe7dde55436e4',
  },
  {
    id: 5,
    title: '¿Qué puedo hacer si envié el pago pero no apareció la pantalla de éxito?',
    details:
      'ALDEA tiene control total sobre los pagos recibidos siempre que hayan sido generados a las direcciones que aparecen en pantalla. Cualquier pago no exitoso será devuelto a la billetera correspondiente.',
  },
  {
    id: 6,
    title: 'Ya compré, se mostró la pantalla de éxito, pero no recibí ningún NFT.',
    details:
      'El procesamiento puede tardar hasta 48 horas (por más que este caso es bastante raro). Cualquier duda puedes preguntarla directamente en Discord (canal #aldea-nft) o en Telegram en el canal El Fogón de ALDEA.',
  },
  {
    id: 7,
    title: '¿Por qué no puedo comprar 2 o más NFTs?',
    details:
      'Esta versión del Marketplace es una versión inicial con funcionalidades reducidas. Por esta razón, en un primer momento no contamos con la posibilidad de comprar más de un NFT por vez. ¡Esta funcionalidad está pensada como próximos pasos de este producto!',
  },
  {
    id: 8,
    title: 'Recibí un error, ¿entro en pánico?',
    details:
      '¡De ninguna manera! Ponte en contacto con el Core Team de ALDEA en Discord (canal #aldea-nft) o en Telegram en el canal El Fogón de ALDEA (https://t.me/elFogonDeALDEA).',
  },
];

export default function FAQ() {

  return (
    <Layout>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="Description" content="Put your description here." />
        <title>FAQ</title>
      </Head>

      <div className="py-35px px-4 md:p-35px">
        <h3 className="w-full flex justify-center mb-30px text-24px text-gray-900 text-center font-semibold">
          FAQ
        </h3>
        <Accordion items={accordionData} />
      </div>
    </Layout>
  );
}
