import useImage from "use-image"
import Konva from "konva"
import {Image as KonvaImage} from "react-konva"
import type { BgPicture } from "@interfaces/pattern"
import type { KonvaEventObject } from 'konva/lib/Node'

//getRef: zwraca swoja referencje
const ArrayImage=({img, draggable, getRef, setXYScale, whenClicked}:{img: BgPicture, draggable: boolean, getRef: (i: Konva.Image| null)=>void, 
    setXYScale: (img: BgPicture, x: number, y: number, scale: number) => void, whenClicked: (img: BgPicture) => void})=>{
    const [loaded]=useImage(img.url)
    const onDrag = (e: KonvaEventObject<MouseEvent>) => {
        const p=e.currentTarget.position()
        setXYScale(img, p.x, p.y, img.scale)
    }
    const onClick = () => {
        whenClicked(img)
    }
    const KeepRatio = (e: KonvaEventObject<Event>) =>{
        const p=e.target
        p.scaleY(p.scaleX())
        setXYScale(img, p.x(), p.y(), p.scaleX())
    }
    const onTransformed = (e: KonvaEventObject<Event>) => {
        const p=e.target
        setXYScale(img, p.x(), p.y(), p.scaleX())
    }

    return (<KonvaImage x={img.x} y={img.y} scaleX={img.scale} scaleY={img.scale} image={loaded} draggable={draggable} ref={x=>{
        if(getRef!==undefined) getRef(x)}} onDragEnd={onDrag} onClick={onClick} onTransformEnd={onTransformed} onTransform={KeepRatio}/>)
}
export default ArrayImage
