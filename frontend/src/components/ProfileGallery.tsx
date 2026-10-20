import { useState, useEffect } from "react"
import GalleryPatternService, {type GalleryResponse} from "../services/GalleryPatternsService"
import MyPatternThumbnail from "./GalleryThumbnails/MyPatternThumbnail"
import { isBackendError } from "@interfaces/errors"


const ProfileGallery = ()=>{

    const [results, setResults] = useState<GalleryResponse>({pageCount: 0, pageNo: 1, results: []})
    const [error, setError] = useState<string>("")

    const load=async ()=>{
        const r=await GalleryPatternService.MOCK_GetAllMyPatterns()
        if(isBackendError(r)) {
            setError(`Błąd ${r.statusCode} - ${r.message}`)
            setResults({pageCount: 0, pageNo: 1, results: []})
        }
        else{
            setError("")
            setResults(r)
        }
    }

    useEffect(()=>{
        load()
    },[])

    const onDelete=(id: string)=>{
        if(!window.confirm("Czy na pewno chcesz nieodwracalnie usunąć wzór?")) return
        GalleryPatternService.DeletePattern(id).then(x=>{
            if(isBackendError(x)) setError(`Błąd kopiowania ${x.statusCode} - ${x.message}`)
            else load()
        })
    }

    const onCopy=(id: string)=>{
        GalleryPatternService.CopyPattern(id).then(x=>{
            if(isBackendError(x)) setError(`Błąd kopiowania ${x.statusCode} - ${x.message}`)
            else load()
        })
    }

    return (<div className="Gallery">
        <p>Strona {results.pageNo} z {results.pageCount}</p>
        {
            results.results.map(x=>
                <MyPatternThumbnail key={"pattern_"+x._id} pattern={x} onDelete={onDelete} onCopy={onCopy}/>
            )
        }
        <p>{error}</p>
    </div>)
}

export default ProfileGallery