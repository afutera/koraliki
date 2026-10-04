import type { ShortColor, BgPicture, Pattern } from "@interfaces/pattern"
import type { PaletteHeader } from "@interfaces/palette"
import { type EditorTools, isEditorTool } from "@interfaces/enums"
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react"
import { isBackendError } from "@interfaces/errors"
import MockEditorPaletteService from "../../services/MockEditorPaletteService"

interface EditPanelProps{
    pattern: Pattern,
    activeColor: ShortColor,
    activeTool: EditorTools,
    onColorChange: (color: ShortColor)=>void, 
    onToolChange: (tool: EditorTools)=>void,
    onNewColor: (color: ShortColor) =>void,
    onRename: (name: string)=>void,
    onSetPublic: (isPublic: boolean) => void,
    onAddPicture: (file: File) => void
}

const toolBtns: {tool: EditorTools, txt: string}[] = [{tool: "Drag", txt: "Przesuwanie"},{tool: "ZoomIn", txt: "Przybliż"},{tool: "ZoomOut", txt: "Oddal"},{tool: "Save", txt: "Zapisz"},
        {tool: "Pencil", txt: "Ołówek"},{tool: "Line", txt: "Linia"},{tool: "Fill", txt: "Wypełnienie"},{tool: "Erase", txt: "Gumka"},
        {tool: "ImgDrag", txt: "Przesuń"},{tool: "ImgScale", txt: "Skaluj"},{tool: "ImgDelete", txt: "Usuń"}
]

const EditPanel = ({pattern, activeColor, activeTool, onColorChange, onToolChange, onNewColor, onRename, onSetPublic, onAddPicture}:EditPanelProps) =>{

    const colorIndex = Math.max(pattern.colors.findIndex(x=>x.index==activeColor.index),0)
    const [palettes, setPalettes] = useState<Array<PaletteHeader>>([])
    const [activePalette, setActivePalette] = useState<number>(-1)
    const [paletteColors, setPaletteColors] = useState<Array<ShortColor>>([])
    const [activePaletteColor, setActivePaletteColor] = useState<number>(-1)
    const [error, setError] = useState<string|null>(null)
    const [file, setFile] = useState<File|null>(null)
    const fileinputref=useRef<HTMLInputElement>(null)

    useEffect(()=>{
        var p=MockEditorPaletteService.GetPalettes();
        if(isBackendError(p)){
            setError(p.message)
            setPalettes([])
            setActivePalette(-1)
        }else{
            setError(null)
            setPalettes(p)
            setActivePalette(0)
        }
    },[])
    useEffect(()=>{
        if(activePalette===-1||palettes.length<=activePalette){
            setError("Brak palety")
            setPaletteColors([])
            setActivePaletteColor(-1)
            return
        }
        var p=MockEditorPaletteService.GetColorsFromPalette(palettes[activePalette]._id);
        if(isBackendError(p)){
            setError(p.message)
            setPaletteColors([])
            setActivePaletteColor(-1)
        }else{
            setError(null)
            setPaletteColors(p)
            setActivePaletteColor(0)
        }
    },[activePalette])

    const onColorArrowsClick = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(e.currentTarget.id=="kolorWstecz") onColorChange(pattern.colors[Math.max(0,colorIndex-1)])
        else onColorChange(pattern.colors[Math.min(pattern.colors.length-1,colorIndex+1)])
    }

    const onColorClicked = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        const color = pattern.colors.findIndex(x=>x._id.toString()===e.currentTarget.id)
        if(color!=-1) {
            onColorChange(pattern.colors[color])
        }
    }

    const onToolClicked = (e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(isEditorTool(e.currentTarget.id))
            onToolChange(e.currentTarget.id)
    }
    const onPaletteChanged = (e:ChangeEvent<HTMLSelectElement>) =>{
        e.preventDefault();
        const ind=parseInt(e.currentTarget.value)
        setActivePalette(ind)
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
        if(e.currentTarget.value.trim()!==""){
            onRename(e.currentTarget.value)
        }

    }
    const onPublicChanged=(e:ChangeEvent<HTMLInputElement>)=>{
        //e.preventDefault(); //Problemy z rerenderowaniem po zmianie stanu
        const c=e.currentTarget.checked
        if(e.currentTarget.checked===true){
            if(window.confirm("Czy na pewno chcesz, aby inni użytkownicy widzieli ten wzór?")===false) return
        }
        onSetPublic(c)
    }
    const ReadLoadedFile=(e: ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files===null||e.target.files.length===0) setFile(null)
        else setFile(e.target.files[0])
    }
    const onClickAddFile=()=>{
        console.log("proba dodania pliku, plik: ",file)
        if(file===null) return
        else {
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

    return (<div className="editPanel">
        <p>Tytuł:<input type="text" value={pattern.title} onChange={onNameChanged}/></p>
        <p>Publiczny:<input type="checkbox" checked={pattern.isPublic} onChange={onPublicChanged}/></p>
        <p>Narzędzia:</p>
        {
            toolBtns.slice(0,4).map(x=><button id={x.tool} key={"btn"+x.tool} onClick={onToolClicked} className={activeTool==x.tool?"activeToolBtn":""}>{x.txt}</button>)
        }
        <p>Narzędzia koralików:</p>
        {
            toolBtns.slice(4,8).map(x=><button id={x.tool} key={"btn"+x.tool} onClick={onToolClicked} className={activeTool==x.tool?"activeToolBtn":""}>{x.txt}</button>)
        }
        <p>Narzędzia obrazów:</p>
        <button disabled>Przesuń</button>
        <button disabled>Skaluj</button>
        <button disabled>Usun</button>
        <button disabled>Nowy</button>
        <p>Kolory, wersja tymaczasowa bez palet z bazy:</p>
        <button disabled={colorIndex<=0} onClick={onColorArrowsClick} id="kolorWstecz">&lt;-</button>
        {
            pattern.colors.slice(Math.floor(colorIndex/10)*10,Math.min((Math.floor(colorIndex/10)+1)*10,pattern.colors.length)).map((x)=><button id={x._id.toString()} key={x._id.toString()} style={{backgroundColor:x.rgb, border: x._id==activeColor._id?"2px solid black":"none"}} onClick={onColorClicked}>&nbsp;&nbsp;</button>)
        }
        <button disabled={colorIndex>=pattern.colors.length-1} onClick={onColorArrowsClick}>-&gt;</button><br/>
        Nowy kolor:<select disabled={palettes.length==0} value={activePalette} onChange={onPaletteChanged}>
        {
            palettes.map((p,i)=><option value={i} key={i}>{p.name}</option>)
        }
        </select>
        <select disabled={paletteColors.length==0} value={activePaletteColor} onChange={onPaletteColorChanged}>
        {
            paletteColors.map((p,i)=><option value={i} key={i}>{p.name}</option>)
        }
        </select>
        <span style={{border:"1px solid black", backgroundColor: activePaletteColor==-1 ? "white":paletteColors[activePaletteColor].rgb}}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button disabled={palettes.length==0 || paletteColors.length==0} onClick={onNewColorAdded}>Dodaj</button>
        <p>Obrazy:</p>
        <p>Dodaj nowy: <input type={"file"} onChange={ReadLoadedFile} ref={fileinputref} accept={".png,.jpg,.jpeg,image/jpeg,image.png"}/> <button onClick={onClickAddFile}>Dodaj</button></p>
        <table>
            <tbody>
                {
                pattern.pictures.map((x,i)=><tr key={i}>
                    <td>{x.name}</td><td><button id={"pic"+i}>Usuń</button></td>
                </tr>)
                }
            </tbody>
        </table>
        <p className="error">{error??""}</p>
    </div>)
}

export default EditPanel