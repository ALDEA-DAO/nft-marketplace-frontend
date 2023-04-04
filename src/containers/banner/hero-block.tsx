import React from 'react';
import Carousel from 'components/hero-carousel';
import SliderComponent from './slider-component';
import SliderComponent2 from './slider-component2';
import SliderComponent3 from './slider-component3';

// import BannerImageOne from 'assets/image/slider_09.jpg';
// import BannerImageTwo from 'assets/image/slider_08.jpg';
// import BannerImageTree from 'assets/image/slider_10.jpg';

// const data = [
//   { id: 1, background: BannerImageTree, children: <SliderComponent3 /> },
// /*   { id: 2, background: BannerImageTwo, children: <SliderComponent2 /> }, */
//   { id: 2, background: BannerImageOne, children: <SliderComponent /> }
// ];

const data = [
  { id: 1, background: 'image/slider_10.jpg', children: <SliderComponent3 /> },
/*   { id: 2, background: BannerImageTwo, children: <SliderComponent2 /> }, */
  { id: 2, background: 'image/slider_09.jpg', children: <SliderComponent /> }
];


export default function HeroBlock() {
  return (
    <div className="w-full relative">
      <Carousel data={data} />
    </div>
  );
}
