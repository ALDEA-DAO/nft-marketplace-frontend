import Mailgen, { Content } from 'mailgen';
import nodemailer from 'nodemailer';
import {mailVariables} from 'types/constants';

// Configure mailgen by setting a theme and your product info

const mailGenerator = new Mailgen({
  theme: 'salted',
  product: {
    // Appears in header & footer of e-mails
    name: mailVariables.linkName,
    link: mailVariables.linkWeb,
    logo: mailVariables.linkImages,
    logoHeight: '60px'
  },
});
export async function sendMail(from, to, subject, data) {
  const formattedData: any[] = data.items.map(({ name, quantity, price }) => ({
    Nombre: name,
    Cantidad: quantity,
    //Precio: price * quantity,
    Precio: data.bill_amount
  }));
  const email: Content = {
    body: {
      greeting: 'Tenemos buenas noticias',
      name: '',
      intro: subject,
      table: {
        data: formattedData,
        columns: [{
          // Optionally, customize the column widths
          customWidth: {
            quantity: '15%',
            price: '20%',
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: 'right',
          },
        }],
      },
      // action:  {
      //   instructions:
      //     'La misma se encuentra pendiente de pago.',
      //   button: {
      //     color: '#3869D4',
      //     text: 'Ir a ' + mailVariables.linkName,
      //     link: mailVariables.linkWeb,
      //   },
      // },
      action: [
        {
            instructions: 'Vuelve a visitarnos',
            button: {
                color: '#80C41C',
                text: mailVariables.linkName,
                link: mailVariables.linkWeb,
            }
        },
        {
            instructions: 'Tienes Consultas?',
            button: {
                color: '#3869D4',
                text: 'FAQs',
                link: mailVariables.linkFaq
            }        
        }
      ],
      outro: 'Muchas gracias.',
    },
  };
  // Generate an HTML email with the provided contents
  const emailBody = await mailGenerator.generate(email);
  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = await mailGenerator.generatePlaintext(email);

  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const mailOptions = {
    from,
    to,
    subject,
    html: emailBody,
    text: emailText,
  };
  // send mail with defined transport object
  //return await transporter.sendMail(mailOptions);
  return await transporter.sendMail(mailOptions);
}
