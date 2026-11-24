import type { ShortColor, BgPicture, Pattern } from "@interfaces/pattern"
import { type EditorTools, isEditorTool, type EditorLayers } from "@interfaces/enums"
import { useRef, useState, type ChangeEvent, type MouseEvent,  } from "react"
import { useLoaderData } from "react-router"
import {LayerTypeIcon, LayerIcon, ToolTypeIcon, BigDeleteImgIcon, BigAddImgIcon, BigAddColorIcon } from "@components/Editor/Icons"
import { type LoaderDataWithPicker,PaletteColorsLoader} from "./EditorPaletteLoaders"

interface EditPanelProps{
    pattern: Pattern,
    activeColor: ShortColor,
    activeTool: EditorTools,
    activeLayer: EditorLayers,
    saveStatus: string
    onColorChange: (color: ShortColor)=>void, 
    onToolChange: (tool: EditorTools)=>void,
    onNewColor: (color: ShortColor) =>void,
    onRename: (name: string)=>Error|undefined,
    onSetPublic: (isPublic: boolean) => void,
    onAddPicture: (file: File) => void,
    onDeletePicture: (file: BgPicture) => void,
    onChangeLayer : (layer: EditorLayers) => void,
    onSaveBtnClicked: ()=>Promise<Error|undefined>
}

const toolBtns: EditorTools[] = ["Drag","ZoomIn","ZoomOut","Save","Pencil","Line","Fill","Erase","ImgDrag","ImgScale","ImgDelete"]

const EditPanel = ({pattern, activeColor, activeTool, activeLayer, onColorChange, onToolChange, onNewColor, onRename, onSetPublic, onAddPicture, onDeletePicture, onChangeLayer, onSaveBtnClicked, saveStatus}:EditPanelProps) =>{

    const {colorpicker} = useLoaderData<LoaderDataWithPicker>()

    const colorIndex = Math.max(pattern.colors.findIndex(x=>x.index==activeColor.index),0)
    const [activePalette, setActivePalette] = useState(colorpicker.palettes.length>0? 0:-1)
    const [paletteColors, setPaletteColors] = useState(colorpicker.colors)
    const [activePaletteColor, setActivePaletteColor] = useState(colorpicker.isSuccess? 0:-1)
    const [error, setError] = useState(colorpicker.error)
    const [file, setFile] = useState<File|null>(null)
    const fileinputref=useRef<HTMLInputElement>(null)

    const onColorArrowsClick = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(e.currentTarget.id=="kolorWstecz") onColorChange(pattern.colors[Math.max(0,colorIndex-1)])
        else onColorChange(pattern.colors[Math.min(pattern.colors.length-1,colorIndex+1)])
    }

    const onColorClicked = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        const color = pattern.colors.findIndex(x=>x.idInPalettes!.toString()===e.currentTarget.id)
        if(color!=-1) {
            onColorChange(pattern.colors[color])
        }
    }

    const onToolClicked = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(e.currentTarget.id==="Save") onToolClickedSave()
        else if(isEditorTool(e.currentTarget.id)){
            onToolChange(e.currentTarget.id)
            if(e.currentTarget.id=="ImgDrag"||e.currentTarget.id=="ImgScale"||e.currentTarget.id=="ImgDelete") onChangeLayer("Images")
            else if(e.currentTarget.id=="Pencil"||e.currentTarget.id=="Drag"||e.currentTarget.id=="Fill"||e.currentTarget.id=="Erase") onChangeLayer("Beads")
        }
    }
    const onToolClickedSave= async()=>{
        const res=await onSaveBtnClicked()
        if(res===undefined) setError("")
        else setError(res.message)
    }
    const onPaletteChanged = async (e:ChangeEvent<HTMLSelectElement>) =>{
        e.preventDefault();
        const ind=parseInt(e.currentTarget.value)
        setActivePalette(ind)
        if(ind===-1||colorpicker.palettes.length<=ind){
            setError("Brak palety")
            setPaletteColors([])
            setActivePaletteColor(-1)
        }else{
            const p = await PaletteColorsLoader(colorpicker.palettes[ind]._id!);
            setError(p.error)
            setPaletteColors(p.colors)
            setActivePaletteColor(p.colors.length>0? 0:-1)
        }
    }
    const onPaletteColorChanged = (e:ChangeEvent<HTMLSelectElement>) =>{
        e.preventDefault();
        const ind=parseInt(e.currentTarget.value)
        setActivePaletteColor(ind)
    }
    const onNewColorAdded=(e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(paletteColors.length>activePaletteColor){
            onNewColor(paletteColors[activePaletteColor]);
        }
    }
    const onNameChanged=(e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();
        const res=onRename(e.currentTarget.value)
        if(res===undefined) setError("")
        else setError(res.message)
    }
    const onPublicChanged=(e:ChangeEvent<HTMLInputElement>)=>{
        //e.preventDefault(); //Problemy z rerenderowaniem po zmianie stanu
        const c=e.currentTarget.checked
        onSetPublic(c)
    }
    const ReadLoadedFile=(e: ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files===null||e.target.files.length===0) setFile(null)
        else setFile(e.target.files[0])
    }
    const onClickAddFile=()=>{
        if(file===null) return
        else {
            if(pattern.pictures.length>=3){
                setError("Maksymalnie 3 obrazy.")
                return
            }
            if(file.type!=".png"&&file.type!=".jpg"&&file.type!=".jpeg"&&file.type!="image/png"&&file.type!="image/jpeg"){
                setError("Nieprawidłowy typ (dozwolone: PNG i JPG)!")
                return;
            }
            setError("");
            onAddPicture(file)
            setFile(null)
            fileinputref.current!.value=""
        }
    }
    const OnClickDeleteFile = (e: MouseEvent<HTMLButtonElement>) =>{
        if(e.currentTarget.id.substring(0,3)==="pic"){
            const nr=Number.parseInt(e.currentTarget.id.substring(3))
            if(pattern.pictures.length>nr) onDeletePicture(pattern.pictures[nr])
        }
    }
    const onClickLayerChange = (e: MouseEvent<HTMLButtonElement>) =>{
        onChangeLayer(e.currentTarget.id=="imgLayerBtn" ? "Images":"Beads")
    }

    return (<div className="editPanel container">
        <p><LayerIcon/> Warstwy: <button id="imgLayerBtn" className={"btn "+(activeLayer=="Images"?"activeToolBtn":"btn-secondary")} onClick={onClickLayerChange}><LayerTypeIcon forButton="Images"/></button>
        <button id="beadLayerBtn" className={"btn "+(activeLayer=="Beads"?"activeToolBtn":"btn-secondary")} onClick={onClickLayerChange}><LayerTypeIcon forButton="Beads"/></button></p>
        <div className="row"><label className="col-12 col-md-3" htmlFor="title">Tytuł:</label><input type="text" value={pattern.title} onChange={onNameChanged} id="title" className="col-11 col-md-8 form-input"/></div>
        <div className="row"><label className="col-9 col-md-3" htmlFor="isPublic">Publiczny:</label><div className="form-check form-switch col-3" style={{paddingLeft:0}}>
        <input type="checkbox" checked={pattern.isPublic} onChange={onPublicChanged} className="form-check-input" id="isPublic" style={{marginLeft:"2px"}}/></div></div>
        <div className="row"><label className="col-12 col-md-3">Stan:</label><div className="col-11 col-md-8">{saveStatus}</div></div>
        <h3>Narzędzia:</h3>
        <div className="row">
        <div>{
            toolBtns.slice(0,4).map(x=><button id={x} key={"btn"+x} onClick={onToolClicked} className={"btn "+(activeTool==x?"activeToolBtn":"btn-secondary")}><ToolTypeIcon forButton={x}/></button>)
        }</div>
        <div>{
            toolBtns.slice(4,8).map(x=><button id={x} key={"btn"+x} onClick={onToolClicked} className={"btn "+(activeTool==x?"activeToolBtn":"btn-secondary")}><ToolTypeIcon forButton={x}/></button>)
        }</div>
        <div>{
            toolBtns.slice(8,11).map(x=><button id={x} key={"btn"+x} onClick={onToolClicked} className={"btn "+(activeTool==x?"activeToolBtn":"btn-secondary")}><ToolTypeIcon forButton={x}/></button>)
        }</div></div>
        <h3>Kolory:</h3>
        <div><button disabled={colorIndex<=0} onClick={onColorArrowsClick} id="kolorWstecz" className="btn btn-secondary">&larr;</button>
        {
            pattern.colors.slice(Math.floor(colorIndex/10)*10,Math.min((Math.floor(colorIndex/10)+1)*10,pattern.colors.length)).map((x)=><button id={x.idInPalettes.toString()} className="btn" key={x.idInPalettes!.toString()} style={{backgroundColor:x.rgb, border: x.idInPalettes==activeColor.idInPalettes?"2px solid black":"none"}} onClick={onColorClicked}>&nbsp;&nbsp;</button>)
        }
        <button className="btn btn-secondary" disabled={colorIndex>=pattern.colors.length-1} onClick={onColorArrowsClick}>&rarr;</button></div>
        <div className="row"><label htmlFor="colorPicker" className="col-12 col-lg-3">Nowy:</label>
        <select disabled={colorpicker.palettes.length==0} value={activePalette} onChange={onPaletteChanged} title="wybór palety nowego koloru" className="col-12 col-sm-5 col-lg-4">
        {
            colorpicker.palettes.map((p,i)=><option value={i} key={i}>{p.name}</option>)
        }
        </select><select disabled={paletteColors.length==0} value={activePaletteColor} onChange={onPaletteColorChanged} id="colorPicker" className="col-12 col-sm-5 col-lg-3" title="wybór nowego koloru" >
        {
            paletteColors.map((p,i)=><option value={i} key={i}>{p.name}</option>)
        }
        </select>
        <div style={{border:"1px solid black", backgroundColor: activePaletteColor==-1 ? "white":paletteColors[activePaletteColor].rgb}} className="col-12 col-sm-1">&nbsp;</div>
        <button disabled={colorpicker.palettes.length==0 || paletteColors.length==0} onClick={onNewColorAdded} className="btn btn-secondary col-12 col-lg-4"><BigAddColorIcon/></button>
        </div>
        <h3>Obrazy:</h3>
        <div className="row"><input type={"file"} onChange={ReadLoadedFile} ref={fileinputref} accept={".png,.jpg,.jpeg,image/jpeg,image/png"} className="form-input col-lg-9"/> 
        <button onClick={onClickAddFile} disabled={pattern.pictures.length>=3} className="btn btn-primary col-lg-2 "><BigAddImgIcon/></button></div>
        {
            pattern.pictures.map((x,i)=><div className="row">
                <span key={i+"name"} className="col-lg-9 col-md-7">{x.name}</span><button id={"pic"+i} onClick={OnClickDeleteFile} className="btn btn-secondary col-lg-2 col-md-4"><BigDeleteImgIcon/></button>
            </div>)
        }
        <p className="error">{error}</p>
    </div>)
}

export default EditPanel