import React, { Fragment } from "react";
import { useAlert } from "react-alert";
import Button from 'components/button';

const Alert = () => {
  const alert = useAlert();
  return (     
    <Button
      className="big mt-20px"
      onClick={() => {
        alert.show("Oh look, an alert!");
      }}
    >
      Confirmar
    </Button>      
  );
};

// const Home = () => {
//   const alert = useAlert();

//   return (
//     <Fragment>
//       <button
//         onClick={() => {
//           alert.show("Oh look, an alert!");
//         }}
//       >
//         Show Alert
//       </button>
//       <button
//         onClick={() => {
//           alert.error("You just broke something!");
//         }}
//       >
//         Oops, an error
//       </button>
//       <button
//         onClick={() => {
//           alert.success("It's ok now!");
//         }}
//       >
//         Success!
//       </button>
//     </Fragment>
//   );
// };

export default Alert;