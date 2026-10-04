import useImage from "use-image"
import {Image} from "react-konva"

const ArrayImage=({url, x, y, scale}:{url: string, x: number, y: number, scale: number})=>{
    const [img]=useImage(url)
    return (<Image x={x} y={y} scaleX={scale} scaleY={scale} image={img}/>)
}
export default ArrayImage
