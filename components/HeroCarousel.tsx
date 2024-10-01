"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image"

const heroImages = [
  { imgUrl : "/assets/images/hero-1.svg" , alt:"smartwatch"},
  { imgUrl : "/assets/images/hero-2.svg" , alt:"BAG"},
  { imgUrl : "/assets/images/hero-3.svg" , alt:"Lamp"},
  { imgUrl : "/assets/images/hero-4.svg" , alt:"air frier"},
  { imgUrl : "/assets/images/hero-5.svg" , alt:"chair"}




]

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel 
      showThumbs={false} 
      infiniteLoop
      interval={2000}
      showArrows={false}
      showStatus={false}
      autoPlay={true}
      >
        {heroImages.map((img) =>{
          return <Image 
                    src={img.imgUrl}
                    alt={img.alt}
                    width={484}
                    height={484}
                    key={img.alt}
                    className="object-contain"
                    ></Image>
        })}
      </Carousel>

      <Image 
      src={"/assets/icons/hand-drawn-arrow.svg"} 
      alt="arrow"
      width={175}
      height={175}
      className="max-xl:hidden absolute -left-[15%] bottom-0"
      >
      </Image>
    </div>
  )
}

export default HeroCarousel