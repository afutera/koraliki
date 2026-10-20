import Editor from "@components/Editor/Editor"
import { type Pattern } from "@interfaces/pattern"
import { useEffect, useState } from "react"
import EditorPatternService from "../services/EditorPatternService"
import { isBackendError } from "@interfaces/errors"
import { useParams } from "react-router-dom"

const EditPage = ()=>{
    const params=useParams()
    const [pattern,setPattern] = useState<Pattern|null>(null)
    const [error,setError] = useState("");

    const loadPattern= async ()=>{
        if(params.id===undefined){
            setPattern(null)
            setError("brak ID wzoru w adresie URL")
            return
        }
        const result=await EditorPatternService.GetPattern(params.id)
        if(isBackendError(result)){
            setPattern(null)
            setError(result.statusCode+" - "+result.message)
        }else if(result instanceof Error){
            setPattern(null)
            setError(result.message)
        }else{
            setError("")
            setPattern(result)
        }
    }

    useEffect(()=>{
        loadPattern();
    },[])

    return(<>
           <header>Test edytora</header>
           {pattern===null? 
            <div><h2>Błąd przy pobieraniu wzoru</h2>
            <p>Szczegóły: {error}</p>
            <button onClick={loadPattern}>Spróbuj ponownie</button>
            </div>:<div style={{height: innerHeight}}><Editor pattern={pattern}></Editor></div>}
    </>)
}

export default EditPage