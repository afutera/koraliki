import EditCanvas from "./EditCanvas"
import "./Editor.css"
import type {Bead, Pattern, ShortColor} from "@interfaces/pattern"
import EditPanel from "./EditPanel.tsx"
import { useState } from "react"
import { type EditorTools } from "@interfaces/enums.ts"
import {imageDimensionsFromStream} from 'image-dimensions';

const Editor = ({pattern}:{pattern: Pattern})=>{
    const [_pattern, setPattern] = useState(pattern)
    const [currentColor, setCurrentColor] = useState(pattern.colors[0])
    const [currentTool, setCurrentTool] = useState<EditorTools>("Drag")
    const [tempBeads, setTempBeads] = useState<Map<number,number>>(new Map<number,number>)
    const [lineStart, setLineStart] = useState(-1)
    const [scale, setScale] = useState({startx: 0, starty:0, scale: 1})

    const PlaceNewBead = (a: number) =>{
        _pattern.beads.set(a,currentColor.index)
        setPattern({..._pattern}) //odswiez obiekt
    }
    const EraseBead = (a: number) =>{
        _pattern.beads.delete(a)
        setPattern({..._pattern}) //odswiez obiekt
    }
    const DrawLine = (from: number, to: number)=>{
        var beads=new Map(tempBeads)
        if(from>to){
            const temp=from
            from=to
            to=temp
        }
        const fromx=from%_pattern.width, fromy=Math.floor(from/_pattern.width), tox=to%_pattern.width, toy=Math.floor(to/_pattern.width)
        var coords = [from, to]
        if(fromy==toy)
        {
            for(let i=from+1; i<=to-1; i++) coords.push(i)
        }else{
            if(toy-fromy>=(tox>fromx ? tox-fromx:fromx-tox)){
                const a=(fromx-tox)/(fromy-toy)
                let x=fromx
                for(let i=fromy+1; i<=toy-1; i++){
                    x+=a
                    coords.push(i*_pattern.width+Math.round(x))
                }
            }else{
                const a=(fromy-toy)/(fromx-tox)
                let y=fromy, start=fromx, end=tox
                if(fromx>tox){
                    y=toy
                    start=tox
                    end=fromx
                }
                for(let i=start+1; i<=end-1; i++){
                    y+=a
                    coords.push(i+_pattern.width*Math.round(y))
                }
            }
        }
        coords.forEach((c)=>{
            beads.set(c,currentColor.index)
        })
        setPattern({..._pattern, beads})
    }
    const Fill = (a: number) =>{
        var current= _pattern.beads.get(a)
        if(current===undefined) current=-1
        FillRecursive(a,_pattern.beads, current,a,a)
        setPattern({..._pattern})
    }   
    const FillRecursive = (a: number, beads: Map<number,number>, bgcolor: number, prevstart: number, prevend: number) =>{
        const firstinrow=a-a%_pattern.width
        var start=a, end=a
        if(bgcolor===-1)
        {
            if(beads.has(a)) return a+1
           while(start-1>=firstinrow && !beads.has(start-1)) start--;
           while(end+1<firstinrow+_pattern.width && !beads.has(end+1)) end++;
        }else{
            if(beads.get(a)!=bgcolor) return a+1
            while(start-1>=firstinrow && beads.get(start-1)===bgcolor) start--;
           while(end+1<firstinrow+_pattern.width && beads.get(end+1)===bgcolor) end++;
        }
        for(var i=start; i<=end;i++) beads.set(i,currentColor.index);
        if(a>=_pattern.width){
            for(var i= prevstart===start-_pattern.width ? prevend+1:start-_pattern.width; i<=end-_pattern.width;) {
                i=FillRecursive(i, beads, bgcolor,start,end)
                if(i>=prevstart&&i<=prevend) {
                    i=prevend+1
                }
            }
        }
        if(a<_pattern.width*(_pattern.height-1)){
            for(var i=prevstart===start+_pattern.width ? prevend+1:start+_pattern.width; i<=end+_pattern.width;) {
                i=FillRecursive(i, beads, bgcolor,start,end)
                if(i>=prevstart&&i<=prevend) {
                    i=prevend+1
                }
            }
        }
        return end+1
    }
    const Rescale = (multiplier: number, centerBead: number) =>{
        var newscale=scale.scale*multiplier
        if(newscale>_pattern.height&&newscale>_pattern.width) return
        if(newscale<1){
            setScale({scale: 1, startx: 0, starty:0})
            return
        }
        var y=Math.floor(centerBead/_pattern.width)+0.5, x=centerBead%_pattern.width+0.5
        const startx=scale.startx + (x-scale.startx)*(1-1/multiplier), starty=scale.starty + (y-scale.starty)*(1-1/multiplier)
        setScale({scale: newscale, startx: Math.max(Math.min(startx,_pattern.width-_pattern.width/newscale), 0), starty: Math.max(Math.min(starty,_pattern.height-_pattern.height/newscale), 0)})
    }
    const SetNewStartPoint = (x: number, y: number)=>{
        setScale({...scale, startx: x, starty:y})
    }
    const AddPicture = async (f: File)=>{
        var dims= await imageDimensionsFromStream(f.stream())
        if(dims===undefined) return
        _pattern.pictures.push({
            x: 0,
            y: 0,
            isLocal: true,
            name: f.name,
            scale: Math.min(pattern.height/dims.height,pattern.width/dims.width),
            url: URL.createObjectURL(f)
        })
        setPattern({..._pattern})
    }

    const onClickBead = (a: number)=>{
        switch(currentTool){
            case "Pencil":
                PlaceNewBead(a)
                break;
            case "Erase":
                EraseBead(a)
                break;
            case "Line":
                DrawLine(lineStart,a)
                break;
            case "Fill":
                Fill(a)
                break;
            case "ZoomIn":
                Rescale(2,a);
                break;
            case "ZoomOut":
                Rescale(0.5,a);
                break;
        }
    }
    const onColorChange = (c:ShortColor)=>{setCurrentColor(c)}
    const onToolChange = (c:EditorTools)=>{setCurrentTool(c)}

    const onColorAdded = (c: ShortColor)=>{
        let found=_pattern.colors.find(x=>x._id==c._id)
        if(found===undefined){
            c.index=_pattern.colors.reduce((prev,x)=>Math.max(prev,x.index),-1)+1
            _pattern.colors.push(c)
            setPattern({..._pattern})
            found=c
        }
        setCurrentColor(found)
    }

    const onRename = (c:string)=>{
        setPattern({..._pattern, title: c})
    }

    const onPublic = (c:boolean)=>{
        setPattern({..._pattern, isPublic: c})
    }

    const onMouseUpDown = (down: boolean, bead: number)=>{
        if(down){
            switch(currentTool){
                case "Pencil":
                    PlaceNewBead(bead); break;
                case "Erase":
                    EraseBead(bead); break;
                case "Line":
                    setLineStart(bead)
                    setTempBeads(_pattern.beads)
                    PlaceNewBead(bead)
                    break;
            }

        }else{
            if(currentTool==="Line"){
                setLineStart(-1)
                setTempBeads(new Map<number,number>)
            }
        }
    }

    return(
        <div className="editor">
            <EditPanel pattern={_pattern} activeColor={currentColor} activeTool={currentTool} onAddPicture={AddPicture}
            onColorChange={onColorChange} onToolChange={onToolChange} onNewColor={onColorAdded} onRename={onRename} onSetPublic={onPublic}/>
            <EditCanvas pattern={_pattern} onClickBeadLayer={onClickBead} onMouseUpDown={onMouseUpDown} scale={scale} drag={currentTool=="Drag"} onScroll={SetNewStartPoint}/>
        </div>
    )
}

export default Editor