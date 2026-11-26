import type { PatternWithBeadCount } from "@interfaces/pattern"
import PatternDetailsService from "@services/PatternDetailsService"
import { useLoaderData, type LoaderFunctionArgs, useNavigate } from "react-router"
import ReadOnlyCanvas from "../ReadOnlyCanvas"
import ErrorScreen from "../ErrorScreen"
import { isBackendError } from "@interfaces/errors"
import "./PatternDetails.css"
import {BeadForm4Number, BoardForm4Number} from "../../utils/Declination"
import { useState } from "react"

type PatternDetailLoaderData = {isSuccess:boolean, error:string, data: PatternWithBeadCount|null}

export const PatternDetailLoader = async({params}:LoaderFunctionArgs):Promise<PatternDetailLoaderData>=>{
    if(params.id===undefined) return {isSuccess:false,error:"Nie podano identyfikatora wzoru",data:null}
    const data = await PatternDetailsService.GetPatternDetails(params.id)
    if(isBackendError(data)) return {isSuccess:false,error:data.message,data:null}
    else return {isSuccess:true,error:"",data}
}

export const PatternDetail = ()=>{
    const loaded=useLoaderData<PatternDetailLoaderData>()
    const [error,setError] = useState(loaded.error)
    const redirect=useNavigate()

    const downloadDoc = (url:string)=>{
        setError("")
        console.log(url)
        const link=document.createElement("a")
        link.href=url
        link.download=loaded.data!.pattern.title+".pdf"
        link.click()
    }

    const onDownloadInstructions = async ()=>{
        const pdf = await PatternDetailsService.GetPatternPdf(loaded.data!.pattern._id!);
        if(isBackendError(pdf)) setError(pdf.message)
        else downloadDoc(pdf)
    }
    const onDownloadBeadList = async ()=>{
        const pdf = await PatternDetailsService.GetBeadcountPdf(loaded.data!.pattern._id!);
        if(isBackendError(pdf)) setError(pdf.message)
        else downloadDoc(pdf)
    }

    if(loaded.isSuccess) return(<div className="d-flex flex-column flex-md-row details">
        <div className="detailPanel container-fluid m-0 col-12 col-md-4">
            <h2>Tytuł: {loaded.data!.pattern.title}</h2>
            <div className="row"><p className="col-9 col-md-12 col-lg-9">Autor: {loaded.data!.pattern.authorName}</p>
            <p className="col-3 col-md-12 col-lg-3 text-end text-md-start text-lg-end">&#9734;{loaded.data!.pattern.rating}</p>
            </div>
            <div className="row"><button className="btn btn-secondary col-3 col-md-10 col-lg-3 m-1 fs-6" onClick={onDownloadInstructions}>Pobierz</button>
            <button className="btn btn-secondary col-4 col-md-10 col-lg-4 m-1" disabled>Dodaj do ulubionych</button>
            <div className="col-4 col-md-10 col-lg-4 m-1 text-end text-md-start text-lg-end"><input type="number" min="0" max="" className="col-6"></input><button className="btn btn-secondary col-6" disabled>Oceń</button></div>
            </div>
            <h2>Dane obrazu</h2>
            <div className="row"><strong className="col-3 col-md-12 col-lg-3">Wysokość: </strong><span className="col-9 col-md-12 col-lg-9">{BeadForm4Number(loaded.data!.pattern.height)} ({BoardForm4Number(loaded.data!.sizeStats.heightBoards)})</span></div>
            <div className="row"><strong className="col-3 col-md-12 col-lg-3">Szerokość: </strong><span className="col-9 col-md-12 col-lg-9">{BeadForm4Number(loaded.data!.pattern.width)} ({BoardForm4Number(loaded.data!.sizeStats.widthBoards)})</span></div>
            <strong>Użyte kolory:</strong>
            <ul>{
                loaded.data!.colorStats.map(c=><li key={"COLOR_"+c.index} className="row">
                    <span className="col-9"><span style={{backgroundColor:c.rgb, border:(c.needsBorder? "2px solid black":"none")}}>&nbsp;&nbsp;</span>&nbsp;{c.desc}</span>
                    <span className="col-3 text-end">{c.count}</span></li>)
            }</ul>
            <div className="row"><button className="btn btn-secondary col-4" onClick={onDownloadBeadList}>Pobierz listę</button></div>
        </div>
        <div className="detailCanvas col-12 col-md-8"><ReadOnlyCanvas pattern={loaded.data!.pattern}/></div>
    </div>)
    return (<ErrorScreen action="pobieraniu wzoru" errorMsg={error} onTryAgain={()=>redirect("")}/>)
}