import React from 'react';
import { Line, Circle, ProgressProps } from 'rc-progress';
import { useEffect, useState, useContext } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { CURRENCY } from 'types/constants';

export const tesoroState = {
  donaciones: 0,
  comunes: 0,  
  epicos: 0,
  raros: 0,
  legendarios: 0,
  propuestas: 0,
  costosOperativos: 0,
  incentivosSPO: 0,
  incentivosAC: 0,
  tesoro: 0,
  valorPropuestas: 0,
  valorCostosOperativos: 0,
  valorIncentivosSPO: 0,
  valorIncentivosAC: 0,
  valorTesoro: 0,
  load: true
};

export const datosTesoro = {
  cantidadVendidoLegendarios: 0,
  valorVendidoLegendarios: 0,
  cantidadNoVendidoLegendarios: 0,
  valorNoVendidoLegendarios: 0,
  cantidadVendidoEpicos: 0,
  valorVendidoEpicos: 0,
  cantidadNoVendidoEpicos: 0,
  valorNoVendidoEpicos: 0,
  cantidadVendidoRaros: 0,
  valorVendidoRaros: 0, 
  cantidadNoVendidoRaros: 0,
  valorNoVendidoRaros: 0, 
  cantidadVendidoComunes: 0,
  valorVendidoComunes: 0, 
  cantidadNoVendidoComunes: 0,
  valorNoVendidoComunes: 0,
  totalComunes: 0,
  totalEpicos: 0,
  totalRaros: 0,
  totalLegendarios: 0,
  totalVendidos: 0,
  totalCantidad: 0,
  totalVendidosPrecio: 0,
  load: true
};

export default function ProgressBar () {
  const [ percentData, setPercentData ] = useState(tesoroState);
  const [ useDatos, setUseDatos ] = useState(datosTesoro);
  const { state, dispatch } = useContext(DrawerContext);

  const queryTesoro = async () => {
    console.log("queryTesoro");
    const res = await fetch('/api/tesoro', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (res.status === 200) {
      var guardaDatos = await res.json();
      setUseDatos({
        cantidadVendidoLegendarios: guardaDatos.cantidadVendidoLegendarios,
        valorVendidoLegendarios: guardaDatos.valorVendidoLegendarios,
        cantidadNoVendidoLegendarios: guardaDatos.cantidadNoVendidoLegendarios,
        valorNoVendidoLegendarios: guardaDatos.valorNoVendidoLegendarios,
        cantidadVendidoEpicos: guardaDatos.cantidadVendidoEpicos,
        valorVendidoEpicos: guardaDatos.valorVendidoEpicos,
        cantidadNoVendidoEpicos: guardaDatos.cantidadNoVendidoEpicos,
        valorNoVendidoEpicos: guardaDatos.valorNoVendidoEpicos,
        cantidadVendidoRaros: guardaDatos.cantidadVendidoRaros,
        valorVendidoRaros: guardaDatos.valorVendidoRaros, 
        cantidadNoVendidoRaros: guardaDatos.cantidadNoVendidoRaros,
        valorNoVendidoRaros: guardaDatos.valorNoVendidoRaros, 
        cantidadVendidoComunes: guardaDatos.cantidadVendidoComunes,
        valorVendidoComunes: guardaDatos.valorVendidoComunes, 
        cantidadNoVendidoComunes: guardaDatos.cantidadNoVendidoComunes,
        valorNoVendidoComunes: guardaDatos.valorNoVendidoComunes,
        totalComunes: guardaDatos.cantidadVendidoComunes + guardaDatos.cantidadNoVendidoComunes,
        totalEpicos: guardaDatos.cantidadVendidoEpicos + guardaDatos.cantidadNoVendidoEpicos,
        totalRaros: guardaDatos.cantidadVendidoRaros + guardaDatos.cantidadNoVendidoRaros,
        totalLegendarios: guardaDatos.cantidadVendidoLegendarios + guardaDatos.cantidadNoVendidoLegendarios,
        totalVendidos: guardaDatos.cantidadVendidoComunes + guardaDatos.cantidadVendidoEpicos + guardaDatos.cantidadVendidoRaros + guardaDatos.cantidadVendidoLegendarios,
        totalCantidad: guardaDatos.cantidadVendidoComunes + guardaDatos.cantidadVendidoEpicos + guardaDatos.cantidadVendidoRaros + guardaDatos.cantidadVendidoLegendarios + guardaDatos.cantidadNoVendidoComunes + guardaDatos.cantidadNoVendidoEpicos + guardaDatos.cantidadNoVendidoRaros + guardaDatos.cantidadNoVendidoLegendarios,
        totalVendidosPrecio: guardaDatos.valorVendidoComunes + guardaDatos.valorVendidoEpicos + guardaDatos.valorVendidoRaros + guardaDatos.valorVendidoLegendarios,
        load: false
      })      
    }  
  };



  function setValues() {

    setPercentData({      
      donaciones: 0,
      comunes: (useDatos.cantidadVendidoComunes / useDatos.totalComunes) * 100,  
      epicos: (useDatos.cantidadVendidoEpicos /  useDatos.totalEpicos) * 100,
      raros: (useDatos.cantidadVendidoRaros / useDatos.totalRaros) * 100,
      legendarios: (useDatos.cantidadVendidoLegendarios / useDatos.totalLegendarios) * 100,
      propuestas: (useDatos.totalVendidos / useDatos.totalCantidad) * 80,
      costosOperativos: (useDatos.totalVendidos / useDatos.totalCantidad) * 10,
      incentivosSPO: (useDatos.totalVendidos / useDatos.totalCantidad) * 2.5,
      incentivosAC: (useDatos.totalVendidos / useDatos.totalCantidad) * 2.5,
      tesoro: (useDatos.totalVendidos / useDatos.totalCantidad) * 5,
      valorPropuestas: (useDatos.totalVendidosPrecio * 80) / 100 ,
      valorCostosOperativos: (useDatos.totalVendidosPrecio * 10) / 100,
      valorIncentivosSPO: (useDatos.totalVendidosPrecio * 2.5 ) / 100,
      valorIncentivosAC: (useDatos.totalVendidosPrecio * 2.5 ) / 100,
      valorTesoro: (useDatos.totalVendidosPrecio * 5) / 100,
      load: false
    });
  };

  useEffect(function () {

    if(useDatos.load === true) {
      queryTesoro();
    }

    if (state?.tesoro === true && percentData.load === true) {     
      setTimeout(setValues, 800);      
    }
    
  });

  return (
  <>   

    <div className="w-230px m-auto -mt-30px"> 
      <p className="text-center absolute w-230px mt-110px">
      <span className="font-bold">{useDatos.totalVendidosPrecio}</span> {CURRENCY}</p>       
        <Circle
        className=""
        percent={ [percentData.propuestas, percentData.costosOperativos, percentData.incentivosSPO, percentData.incentivosAC, percentData.tesoro ] }
        strokeWidth={9}
        trailWidth={9}
        strokeLinecap="round"
        strokeColor={[ 
          '#4FA0CA',           
          '#61B9DB',
          '#80C41C',           
          '#FF8001',
          '#F2F201',                                 
        ]}
        />      
    </div>

    <div className="w-320px m-auto mt-40px mb-10px">
      <p className="w-max m-auto px-5px mb-3px bg-celeste-aldea rounded"><span className="font-bold">Propuestas {percentData.valorPropuestas}</span> {CURRENCY}</p>
      <p className="w-max m-auto px-5px mb-3px bg-celeste-focusaldea rounded"><span className="font-bold">Costos OP {percentData.valorCostosOperativos}</span> {CURRENCY}</p>
      <p className="w-max m-auto px-5px mb-3px bg-amarillo-aldea rounded"><span className="font-bold">Tesoro {percentData.valorTesoro}</span> {CURRENCY}</p>
      <p className="w-max m-auto px-5px mb-3px bg-verde-aldea rounded"><span className="font-bold">Incentivos SPO {percentData.valorIncentivosSPO}</span> {CURRENCY}</p>
      <p className="w-max m-auto px-5px mb-3px bg-naranja-aldea rounded"><span className="font-bold">Incentivos AC {percentData.valorIncentivosAC}</span> {CURRENCY}</p>
    </div>

    <div className="w-320px m-auto mt-40px mb-10px">
      <p className="font-bold float-left">NFTs Random Vendidos</p> 
      <p className="float-right"><span className="font-bold">{useDatos.valorVendidoComunes}</span> {CURRENCY}</p> 
    </div>         
    <div className="w-320px m-auto">        
      <Line
        className=""
        percent={ [percentData.comunes] }
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
        percent={ percentData.legendarios }
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
        percent={ percentData.epicos }
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
        percent={ percentData.raros }
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

    {/* <div className="w-320px m-auto mt-20px mb-10px">
      <p className="font-bold float-left"> Donaciones</p> 
      <p className="float-right"><span className="font-bold">0000</span> ADA</p> 
    </div>    
    <div className="w-320px m-auto">         
      <Line
        className=""
        percent={ percentData.donaciones }
        strokeWidth={5}
        trailWidth={5}
        strokeLinecap="round"
        strokeColor={[            
          '#F2F201',                      
        ]}
      />      
    </div> */}

  </>    
  );
};

