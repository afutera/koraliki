import {useState} from "react"
import GalleryPatternService, {type GalleryResponse} from "../../services/GalleryPatternsService"
import MyPatternThumbnail from "../GalleryThumbnails/MyPatternThumbnail"
import {isBackendError } from "@interfaces/errors"
import {useLoaderData} from "react-router"

type GalleryState = {isSuccess: boolean,results: GalleryResponse, error: string}

export const LoadProfileGallery=async (): Promise<GalleryState>=>{
        const r=await GalleryPatternService.GetAllMyPatterns()
        if(isBackendError(r)) {
            return {isSuccess: false, results: {pageCount: 0, pageNo: 1, results: []}, error: `Błąd ${r.statusCode} - ${r.message}`}
        }
        else{
            return {isSuccess: true, error: "", results: r}
        }
    }

export const ProfileGallery = ()=>{
    const loaded = useLoaderData<GalleryState>()
    const [error, setError] = useState<string>(loaded.error)
    const [results, setResults] = useState(loaded.results)

    const setState = (x:GalleryState)=>{
        setResults(x.results); setError(x.error)
    }

    const onDelete=(id: string)=>{
        if(!window.confirm("Czy na pewno chcesz nieodwracalnie usunąć wzór?")) return
        GalleryPatternService.DeletePattern(id).then(x=>{
            if(isBackendError(x)) setError(`Błąd usuwania ${x.statusCode} - ${x.message}`)
            else LoadProfileGallery().then(y=>{setState(y)})
        })
    }

    const onCopy=(id: string)=>{
        GalleryPatternService.CopyPattern(id).then(x=>{
            if(isBackendError(x)) setError(`Błąd kopiowania ${x.statusCode} - ${x.message}`)
            else LoadProfileGallery().then(y=>{setState(y)})
        })
    }

    return (<div className="Gallery container-fluid">
        <div className="row justify-content-center"><p className="pageControl">Strona {results.pageNo} z {results.pageCount}</p></div>
        <div className="row justify-content-start mx-3">{
            results.results.map(x=>
                <MyPatternThumbnail key={"pattern_"+x._id} pattern={x} onDelete={onDelete} onCopy={onCopy}/>
            )
        }
        </div>
        <p>{error}</p>
    </div>)
}
