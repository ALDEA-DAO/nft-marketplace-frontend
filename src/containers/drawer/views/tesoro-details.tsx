import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Scrollbar } from 'components/scrollbar';
// import ActiveLink from 'components/menues-active-link';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import CloseIcon from 'assets/icons/close';
import TesoroMenu from 'assets/icons/tesoro-menu';
// import ReactBootstrap from 'react';
import LoadingTesoro from 'assets/icons/loading-tesoro';
import axios from 'axios';
import { CURRENCY } from 'types/constants';
import { Line, Circle, ProgressProps } from 'rc-progress';

export default function TesoroDetails() { 
  const { dispatch } = useContext(DrawerContext);
  const [ useDatos, setUseDatos ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const queryTesoro = async () => {
    try {
      const data = await axios
      .get ('/api/tesoro')
      .then((res) => {
        // console.log(res);
        setUseDatos ({
          cantidadVendidoLegendarios: res.data.cantidadVendidoLegendarios,
          valorVendidoLegendarios: res.data.valorVendidoLegendarios,
          cantidadNoVendidoLegendarios: res.data.cantidadNoVendidoLegendarios,
          valorNoVendidoLegendarios: res.data.valorNoVendidoLegendarios,
          cantidadVendidoEpicos: res.data.cantidadVendidoEpicos,
          valorVendidoEpicos: res.data.valorVendidoEpicos,
          cantidadNoVendidoEpicos: res.data.cantidadNoVendidoEpicos,
          valorNoVendidoEpicos: res.data.valorNoVendidoEpicos,
          cantidadVendidoRaros: res.data.cantidadVendidoRaros,
          valorVendidoRaros: res.data.valorVendidoRaros, 
          cantidadNoVendidoRaros: res.data.cantidadNoVendidoRaros,
          valorNoVendidoRaros: res.data.valorNoVendidoRaros, 
          cantidadVendidoComunes: res.data.cantidadVendidoComunes,
          valorVendidoComunes: res.data.valorVendidoComunes, 
          cantidadNoVendidoComunes: res.data.cantidadNoVendidoComunes,
          valorNoVendidoComunes: res.data.valorNoVendidoComunes,
          totalComunes: res.data.cantidadVendidoComunes + res.data.cantidadNoVendidoComunes,
          totalEpicos: res.data.cantidadVendidoEpicos + res.data.cantidadNoVendidoEpicos,
          totalRaros: res.data.cantidadVendidoRaros + res.data.cantidadNoVendidoRaros,
          totalLegendarios: res.data.cantidadVendidoLegendarios + res.data.cantidadNoVendidoLegendarios,
          totalVendidos: res.data.cantidadVendidoComunes + res.data.cantidadVendidoEpicos + res.data.cantidadVendidoRaros + res.data.cantidadVendidoLegendarios,
          totalCantidad: res.data.cantidadVendidoComunes + res.data.cantidadVendidoEpicos + res.data.cantidadVendidoRaros + res.data.cantidadVendidoLegendarios + res.data.cantidadNoVendidoComunes + res.data.cantidadNoVendidoEpicos + res.data.cantidadNoVendidoRaros + res.data.cantidadNoVendidoLegendarios,
          totalVendidosPrecio: res.data.valorVendidoComunes + res.data.valorVendidoEpicos + res.data.valorVendidoRaros + res.data.valorVendidoLegendarios - 6614,
          totalPrecio: res.data.valorVendidoComunes + res.data.valorVendidoEpicos + res.data.valorVendidoRaros + res.data.valorVendidoLegendarios + res.data.valorNoVendidoComunes + res.data.valorNoVendidoEpicos + res.data.valorNoVendidoRaros + res.data.valorNoVendidoLegendarios,
        }); 
      })   
      setLoading(true); 
    } catch(err) {
      console.log(err);
    }

  };

  const closeStateTesoro = () => {
    dispatch({
      type: 'TOGGLE_TESORO_DETAIL',
      payload: {
        showTesoro: false,
      },
    });  
  };

  const hideTesoro = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    }); 
    setTimeout(closeStateTesoro, 500) ;
  };

  useEffect(() => {

    queryTesoro(); 
    
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-90px flex justify-center items-center relative px-30px flex-shrink-0 border-b border-gray-200">
          <Link href="/">
            <a className="flex" onClick={hideTesoro}>              
              <TesoroMenu />
            </a>
          </Link>

          <button
            className="w-30px h-30px flex items-center justify-center text-gray-500 absolute left-25px focus:outline-none"
            onClick={hideTesoro}
            aria-label="close"
          >
            <CloseIcon />
          </button>
        </div>

        <Scrollbar className="menu-scrollbar flex-grow">
          <div className="flex flex-col py-60px pb-40px lg:pb-60px">
          {loading ? (
            <>   

            <div className="w-230px m-auto -mt-30px"> 
              <p className="text-center absolute w-230px mt-110px">
              <span className="font-bold">{Number((useDatos.totalVendidosPrecio).toFixed(4) )}</span> {CURRENCY}</p>       
                <Circle
                className=""
                percent={ [((useDatos.totalVendidosPrecio * 0.8)*100)/useDatos.totalPrecio, ((useDatos.totalVendidosPrecio * 0.1)*100)/useDatos.totalPrecio, ((useDatos.totalVendidosPrecio * 0.05)*100)/useDatos.totalPrecio, ((useDatos.totalVendidosPrecio * 0.025)*100)/useDatos.totalPrecio, ((useDatos.totalVendidosPrecio * 0.025)*100)/useDatos.totalPrecio ] }
                strokeWidth={9}
                trailWidth={9}
                strokeLinecap="round"
                strokeColor={[ 
                  '#4FA0CA',           
                  '#61B9DB',
                  '#F2F201',                             
                  '#FF8001',
                  '#80C41C'                         
                ]}
                />      
            </div>

            <div className="w-320px m-auto mt-40px mb-10px">
              <p className="w-max m-auto px-5px mb-3px bg-celeste-aldea rounded"><span className="font-bold">Propuestas {Number(((useDatos.totalVendidosPrecio * 80) / 100).toFixed(2))}</span> {CURRENCY}</p>
              <p className="w-max m-auto px-5px mb-3px bg-celeste-focusaldea rounded"><span className="font-bold">Costos OP {Number(((useDatos.totalVendidosPrecio * 10) / 100).toFixed(2))}</span> {CURRENCY}</p>
              <p className="w-max m-auto px-5px mb-3px bg-amarillo-aldea rounded"><span className="font-bold">Tesoro {Number(((useDatos.totalVendidosPrecio * 5) / 100).toFixed(2))}</span> {CURRENCY}</p>
              <p className="w-max m-auto px-5px mb-3px bg-naranja-aldea rounded"><span className="font-bold">Incentivos SPO {Number(((useDatos.totalVendidosPrecio * 2.5) / 100).toFixed(2))}</span> {CURRENCY}</p>
              <p className="w-max m-auto px-5px mb-3px bg-verde-aldea rounded"><span className="font-bold">Incentivos AC {Number(((useDatos.totalVendidosPrecio * 2.5) / 100).toFixed(2))}</span> {CURRENCY}</p>
            </div>
        
            <div className="w-320px m-auto mt-40px mb-10px">
              <p className="font-bold float-left">NFTs Random Vendidos</p> 
              <p className="float-right"><span className="font-bold">{ Number((useDatos.valorVendidoComunes).toFixed(4)) }</span> {CURRENCY}</p> 
            </div>         
            <div className="w-320px m-auto">        
              <Line
                className=""
                percent={ ( useDatos.cantidadVendidoComunes / useDatos.totalComunes ) * 100 }
                strokeWidth={5}
                trailWidth={5}
                strokeLinecap="round"
                strokeColor={[            
                  '#4FA0CA',                     
                ]}
              />      
            </div>
            <div className="w-320px m-auto mt-10px mb-10px">
              <p className="float-left">{useDatos.cantidadVendidoComunes}</p>
              <p className="float-right">Restantes {useDatos.cantidadNoVendidoComunes}</p>
            </div>
            
        
            <div className="w-320px m-auto mt-20px mb-10px">
              <p className="font-bold float-left"> NFTs Legendarios Vendidos</p> 
              <p className="float-right"><span className="font-bold">{useDatos.valorVendidoLegendarios}</span> {CURRENCY}</p> 
            </div>  
            <div className="w-320px m-auto">
              <Line
                className=""
                percent={ (useDatos.cantidadVendidoLegendarios / useDatos.totalLegendarios) * 100 }
                strokeWidth={5}
                trailWidth={5}
                strokeLinecap="round"
                strokeColor={[            
                  '#4FA0CA',                    
                ]}
              />      
            </div>
            <div className="w-320px m-auto mt-10px mb-10px">
              <p className="float-left">{useDatos.cantidadVendidoLegendarios}</p>
              <p className="float-right">Restantes {useDatos.cantidadNoVendidoLegendarios}</p>
            </div>
        
            <div className="w-320px m-auto mt-20px mb-10px">
              <p className="font-bold float-left"> NFTs Épicos Vendidos</p> 
              <p className="float-right"><span className="font-bold">{useDatos.valorVendidoEpicos}</span> {CURRENCY}</p> 
            </div>    
            <div className="w-320px m-auto">         
              <Line
                className=""
                percent={ (useDatos.cantidadVendidoEpicos /  useDatos.totalEpicos) * 100 }
                strokeWidth={5}
                trailWidth={5}
                strokeLinecap="round"
                strokeColor={[            
                  '#4FA0CA',                      
                ]}
              />      
            </div>
            <div className="w-320px m-auto mt-10px mb-10px">
              <p className="float-left">{useDatos.cantidadVendidoEpicos}</p>
              <p className="float-right">Restantes {useDatos.cantidadNoVendidoEpicos}</p>
            </div>
        
            <div className="w-320px m-auto mt-20px mb-10px">
              <p className="font-bold float-left"> NFTs Raros Vendidos</p> 
              <p className="float-right"><span className="font-bold">{useDatos.valorVendidoRaros}</span> {CURRENCY}</p>
            </div>    
            <div className="w-320px m-auto">         
              <Line
                className=""
                percent={ (useDatos.cantidadVendidoRaros / useDatos.totalRaros) * 100 }
                strokeWidth={5}
                trailWidth={5}
                strokeLinecap="round"
                strokeColor={[            
                  '#4FA0CA',                      
                ]}
              />      
            </div>
            <div className="w-320px m-auto mt-10px mb-10px">
              <p className="float-left">{useDatos.cantidadVendidoRaros}</p>
              <p className="float-right">Restantes {useDatos.cantidadNoVendidoRaros}</p>
            </div>
        
          </>
          ) : (
            <div className="w-320px m-auto mt-120px">
            <LoadingTesoro />
            {/* <p className="w-320px m-auto text-center">
              Cargando...
            </p> */}
            </div>
            )} 

          </div>
        </Scrollbar>

        <div className="flex items-center justify-start border-t border-gray-300 bg-gray-100 h-12 px-30px flex-shrink-0 lg:hidden">
        <p>
         <></>
          
          </p>
        </div>
      </div>
    </>
  );
}

