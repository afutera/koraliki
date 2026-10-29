import { useEffect, useState,type ChangeEvent, type SubmitEvent } from "react"
import {type AddPatternRequest} from "@shared/interfaces/pattern"
import {SizeUnits, GetAllUnits, GetLabel, UnitExists} from "@shared/interfaces/patternsizeunits"
import { type PaletteHeader } from "@interfaces/palette"
import EditorPaletteService from "@services/EditorPaletteService"
import { isBackendError } from "@interfaces/errors"
import "./Editor.css"
import EditorPatternService from "@services/EditorPatternService"
import { useNavigate } from "react-router-dom"

const NewImageCreator = ()=>{
    const [pattern, setPattern] = useState<AddPatternRequest>({title:"Nowy",height:1,width:1,unit:SizeUnits.STANDARD_BOARD,palette:""})
    const units = GetAllUnits().map(x=>({key: x, label:GetLabel(x)}))
    const [palettes, setPalettes] = useState<PaletteHeader[]>([])
    const [errors, setErrors] = useState({title:"",dimensions:"",unit:"",palettes:"", general:""})
    const nav=useNavigate()

    useEffect(()=>{
        EditorPaletteService.GetPalettes().then(pal=>{
            if(isBackendError(pal)) setErrors({...errors, palettes:pal.message})
            else{
                setErrors({...errors, palettes:""})
                setPalettes(pal)
                if(pal.length>0) setPattern({...pattern,palette:pal[0]._id??""})
            }
        })
    },[])

    const onChange=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        e.preventDefault()
        switch(e.currentTarget.id){
            case "title": pattern.title=e.currentTarget.value; break
            case "height": pattern.height=parseInt(e.currentTarget.value); break
            case "width": pattern.width=parseInt(e.currentTarget.value); break
            case "unit": 
                if(UnitExists(e.currentTarget.value)) pattern.unit=e.currentTarget.value
                else setErrors({...errors, unit: "Niepoprawna jednostka"})
                break
            case "palette": pattern.palette=e.currentTarget.value; break
            default: break
        }
        setPattern({...pattern})
    }
    const onSubmit=async (e: SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()
        let hasErrors=false
        const err={title:"",dimensions:"",unit:"",palettes:"", general:""}
        if(pattern.title.length==0||pattern.title.length>30) {
            hasErrors=true; err.title="Tytuł ma mieć 1-30 znaków"
        }
        if(pattern.height<1||pattern.height>256||pattern.width<1||pattern.width>256){
            hasErrors=true; err.dimensions="Wymiary muszą być w przedziale 1-256"
        }
        if(palettes.find(x=>x._id===pattern.palette)===undefined){
            hasErrors=true; err.palettes="Niepoprawna paleta"
        }
        setErrors(err)
        if(!hasErrors){
            const res=await EditorPatternService.AddPattern(pattern)
            if(isBackendError(res)) setErrors({...err, general: res.message})
            else nav("/edytor/"+res)
        }
    }

    return(
        <form className="NewImageInput" onSubmit={onSubmit}>
            <label htmlFor="title">Tytuł:</label><input id="title" value={pattern.title} onChange={onChange} required/><span className="error">{errors.title}</span><br/>
            <label htmlFor="height">Wysokość:</label><input id="height" type='number' min="1" max="256" value={pattern.height} onChange={onChange} required/>
            <label htmlFor="width">Szerokość:</label><input id="width" type="number" min="1" max="256" value={pattern.width} onChange={onChange} required/><br/>
            <span className="error">{errors.dimensions}</span>
            <label htmlFor="unit">w jednostce:</label><select id="unit" value={pattern.unit} onChange={onChange} required>{
                units.map(x=>(<option key={"JEDN_"+x.key} value={x.key}>{x.label}</option>))
            }</select><span className="error">{errors.unit}</span><br/>
            <label htmlFor="palette">Początkowa paleta:</label><select id="palette" value={pattern.palette} onChange={onChange} required>
            {
                palettes.map(x=>(<option key={"PAL_"+x._id} value={x._id}>{x.name}</option>))
            }
            </select><span className="error">{errors.palettes}</span><br/>
            <input type="submit" value="Stwórz"/><br/>
            <span className="error">{errors.general}</span>
        </form>
    )
}

export default NewImageCreator