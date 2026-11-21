import {useState,type ChangeEvent, type SubmitEvent } from "react"
import {type AddPatternRequest} from "@shared/interfaces/pattern"
import {SizeUnits, GetAllUnits, GetLabel, UnitExists} from "@shared/interfaces/patternsizeunits"
import { isBackendError } from "@interfaces/errors"
import "./Editor.css"
import EditorPatternService from "@services/EditorPatternService"
import { useLoaderData, useNavigate } from "react-router"
import {type PaletteHeaderLoaderData} from "./EditorPaletteLoaders"

//loader: PaletteLoader z ./EditorPaletteLoaders.ts

export const NewImageCreator = ()=>{
    const {palettes, error} = useLoaderData<PaletteHeaderLoaderData>()
    const [pattern, setPattern] = useState<AddPatternRequest>({title:"Nowy",height:1,width:1,unit:SizeUnits.STANDARD_BOARD,palette: palettes.length>0 ? palettes[0]._id??"":""})
    const units = GetAllUnits().map(x=>({key: x, label:GetLabel(x)}))
    const [errors, setErrors] = useState({title:"",dimensions:"",unit:"",palettes:error, general:""})
    const nav=useNavigate()

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
        <form className="NewImageInput container" onSubmit={onSubmit}>
            <h2>Nowy wzór</h2>
            <div className="row" >
            <label htmlFor="title" className="col-2">Tytuł:</label>
            <input id="title" className="col-10" value={pattern.title} onChange={onChange} required/>
            <span className="error col-12">{errors.title}</span></div>
            <div className="row" ><label htmlFor="height" className="col-2">Wysokość:</label><input className="col-4" id="height" type='number' min="1" max="256" value={pattern.height} onChange={onChange} required/>
            <label htmlFor="width" className="col-2">Szerokość:</label><input className="col-4" id="width" type="number" min="1" max="256" value={pattern.width} onChange={onChange} required/>
            <span className="error col-12">{errors.dimensions}</span></div>
            <div className="row"><label htmlFor="unit" className="col-2">w jednostce:</label><select id="unit" className="col-4" value={pattern.unit} onChange={onChange} required>{
                units.map(x=>(<option key={"JEDN_"+x.key} value={x.key}>{x.label}</option>))
            }</select><span className="error col-12">{errors.unit}</span></div>
            <div className="row" ><label htmlFor="palette" className="col-2">Początkowa paleta:</label><select id="palette" className="col-10" value={pattern.palette} onChange={onChange} required>
            {
                palettes.map(x=>(<option key={"PAL_"+x._id} value={x._id}>{x.name}</option>))
            }
            </select><span className="error col-12">{errors.palettes}</span></div>
            <div className="row justify-content-center" ><input type="submit" value="Stwórz" className="col-2 btn btn-primary"/>
            <span className="error col-12">{errors.general}</span></div>
        </form>
    )
}
