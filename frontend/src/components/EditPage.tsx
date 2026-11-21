import Editor from "@components/Editor/Editor"
import { type Pattern } from "@interfaces/pattern"
import { useState } from "react"
import EditorPatternService from "../services/EditorPatternService"
import { isBackendError } from "@interfaces/errors"
import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router"
import { ColorPickerLoader, type LoaderDataWithPicker } from "./Editor/EditorPaletteLoaders"

type PatternLoaderData={isSuccess:boolean, error:string, pattern:Pattern|null}
const extLoadPattern=async(id:string|undefined):Promise<PatternLoaderData>=>{
    if(id===undefined) return {isSuccess:false, pattern: null, error: "brak ID wzoru w adresie URL"}
    const result=await EditorPatternService.GetPattern(id)
    if(isBackendError(result)) return {isSuccess:false, pattern: null, error:result.statusCode+" - "+result.message}
    if(result instanceof Error) return {isSuccess:false, pattern: null, error:result.message}
    return {isSuccess: true, pattern: result, error:""}
}
interface JoinedLoaderData extends LoaderDataWithPicker {pattern: PatternLoaderData}

export const EditPageLoader = async({params}:LoaderFunctionArgs):Promise<JoinedLoaderData>=>{
    const pattern=await extLoadPattern(params.id)
    if(pattern.isSuccess){
        const colorpicker=await ColorPickerLoader()
        return {pattern,colorpicker}
    }
    return {pattern, colorpicker:{isSuccess:false, error:"Nie ma potrzeby pobierać", palettes:[], colors:[]}}
}

export const EditPage = ()=>{
    const params = useParams()
    const {pattern:lPattern} = useLoaderData<JoinedLoaderData>()
    const [pattern,setPattern] = useState<Pattern|null>(lPattern.pattern)
    const [error,setError] = useState(lPattern.error);

    const loadPattern= async ()=>{
        const loaded=await extLoadPattern(params.id)
        setPattern(loaded.pattern)
        setError(loaded.error)
    }

    return(<>
        {pattern===null? 
        <div className="errorBox"><h2>Błąd przy pobieraniu wzoru</h2>
        <p>Szczegóły: {error}</p>
        <button onClick={loadPattern} className="btn btn-primary">Spróbuj ponownie</button>
        </div>:<Editor pattern={pattern} reload={loadPattern}/>}
    </>)
}
