import React from 'react';
import Button from 'components/button';
import ArrowRight from 'assets/icons/arrow-right';

const SliderComponent3 = () => {
  return (
    <div className="w-full text-left ml-20px mt-120px">
      <h3 className="text-30px text-gray-900 font-normal mb-4">
        Envíanos tu <span className="font-bold">NFT.</span><br></br> Ya minteado o para mintear.
      </h3>
      <h4>
        <span className="font-bold">Ecología, Naturaleza y Animales de América Latina</span><br></br><br></br>
      </h4>
      <Button variant="elevation">
        <a href="https://forms.gle/VLDw1VaoHmNmNxL18" target="_blank">Participar!</a><span className="mr-2"></span>
      </Button>
    </div>
  );
};

export default SliderComponent3;
