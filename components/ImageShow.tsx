import { useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
// @ts-ignore
import imgNotFound from "@/assets/images/no-image-icon.png";
// @ts-ignore
import clothes1 from "@/assets/images/clothes-1.jpg";
// @ts-ignore
import clothes2 from "@/assets/images/clothes-2.jpg";


export type ImageShowMainProps = {
    src: string | 'Clothes1' | 'Clothes2' | 'Clothes3' | ImageSourcePropType | undefined | null;
    alt?: string;
    width?: number;
    height?: number;
}

export function ImageShowMain(props: ImageShowMainProps) {

  const [err, setErr] = useState(false);

  let finalSrc: ImageSourcePropType | undefined = undefined;

  switch (props.src) {
    case 'Clothes1':
      finalSrc = clothes1;
      break;
    case 'Clothes2':
      finalSrc = clothes2;
      break;
    default:
      if (typeof props.src === 'string') {
        finalSrc = { uri: props.src };
      }else if (props.src instanceof Object) {
        finalSrc = props.src;
      }
      else {
        finalSrc = imgNotFound;
      }
      break;
  }  

  return (
    <Image 
      source={err ? imgNotFound : finalSrc} 
      alt={props.alt ?? "img" } 
      onError={()=>setErr(true)}  
      resizeMode="center"
      style={{borderRadius: 20, width: props.width ?? 500 , height: props.height ?? 500}}  
      
    />
  );
}


