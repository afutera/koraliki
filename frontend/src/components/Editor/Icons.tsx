import { type EditorTools, type EditorLayers } from "@interfaces/enums";
import beads from "../../assets/icons/beads.svg"
import images from "../../assets/icons/image.svg"
import layers from "../../assets/icons/layers.svg"

type imageParams = {img: string, desc: string}

const ToolIcon=({data}:{data: imageParams})=>{
    return (<img src={data.img} alt={data.desc} title={data.desc} className="editorIcon"/>)
}

const LayerTypeIcon = ({forButton}:{forButton: EditorLayers})=>{
    const i = (forButton=="Images" ? {img:images,desc:"Obrazy pomocnicze"}:{img:beads,desc:"Koraliki"})
    return(
        <><ToolIcon data={i}/>{i.desc}</>
    )
}
const LayerIcon=()=>{
    return(<ToolIcon data={{img:layers,desc:"Warstwy"}}/>)
}

import pencil from "../../assets/icons/pencil.svg"
import eraser from "../../assets/icons/eraser.svg"
import fill from "../../assets/icons/fill.svg"
import line from "../../assets/icons/line.svg"
import drag from "../../assets/icons/move.svg"
import zoomin from "../../assets/icons/zoom-in.svg"
import zoomout from "../../assets/icons/zoom-out.svg"
import save from "../../assets/icons/save.svg"
import imgdrag from "../../assets/icons/image-move.svg"
import imgscale from "../../assets/icons/image-scale.svg"
import imgdelete from "../../assets/icons/image-delete.svg"

const ToolTypeIcon = ({forButton}:{forButton:EditorTools})=>{
    let i:imageParams = {img:"",desc:"Brak"}
    switch(forButton){
        case "Pencil": 
            i={img:pencil,desc:"Ołówek"}; break;
        case "Erase": 
            i={img:eraser,desc:"Gumka"}; break;
        case "Line": 
            i={img:line,desc:"Linia"}; break;
        case "Fill": 
            i={img:fill,desc:"Wypełnianie kolorem"}; break;
        case "Drag": 
            i={img:drag,desc:"Przesuń"}; break;
        case "ZoomIn": 
            i={img:zoomin,desc:"Przybliż"}; break;
        case "ZoomOut": 
            i={img:zoomout,desc:"Oddal"}; break;
        case "Save": 
            i={img:save,desc:"Zapisz"}; break;
        case "ImgDrag": 
            i={img:imgdrag,desc:"Przesuń obraz"}; break;
        case "ImgScale": 
            i={img:imgscale,desc:"Skaluj obraz"}; break;
        case "ImgDelete": 
            i={img:imgdelete,desc:"Usuń obraz"}; break;
    }
    return (<ToolIcon data={i}/>)
}
const BigDeleteImgIcon = ()=>{
    return(<><ToolTypeIcon forButton="ImgDelete"/>Usuń</>)
}

import imgadd from "../../assets/icons/image-add.svg"
const BigAddImgIcon = ()=>{
    return(<><ToolIcon data={{img:imgadd, desc:"Dodaj obraz"}}/>Dodaj</>)
}

import coloradd from "../../assets/icons/color-add.svg"
const BigAddColorIcon = ()=>{
    return(<><ToolIcon data={{img:coloradd, desc:"Dodaj kolor"}}/>Dodaj</>)
}

export {LayerTypeIcon, LayerIcon, ToolTypeIcon, BigDeleteImgIcon, BigAddImgIcon, BigAddColorIcon}