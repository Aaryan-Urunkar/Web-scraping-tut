//import React from 'react';

import Image from "next/image";
interface Props {
    name: string;
    iconSrc: string;
    value:string;
    borderColor: string;
}

const PriceInfoCard = ({name , iconSrc , value, borderColor} : Props) => {
  return (
    <div className={`price-info_card border-l-[${borderColor}]`} >
        <p className="text-base text-black-100">{name}</p>

        <div className="flex gap-1">
            <Image src={iconSrc} alt={name} width={24} height={24}></Image>
        
            <p className="text-2xl font-bold text-secondary">{value}</p>
        </div>
    </div>
  )
}

export default PriceInfoCard