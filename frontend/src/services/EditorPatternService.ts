import type { BackendError } from "@interfaces/errors";
import type { BgPicture, Pattern, ShortColor } from "@interfaces/pattern";
import axios from "axios";
import BeadObject2Map from "../utils/BeadObject2Map";

interface UnmappedEditPattern{
    _id: string,
    author: string,
    title: string,
    height: number,
    width: number,
    isPublic: boolean,
    createdAt: Date,
    updatedAt: Date,
    colors: Array<ShortColor>,
    beads: any
    pictures: Array<BgPicture>
}


export default class EditorPatternService{
    static async GetPattern(id: string) : Promise<Pattern|BackendError|Error>{
        const jwt='aaa'
        try{
            var p= await axios.get<UnmappedEditPattern>(import.meta.env.VITE_API_URL+`/patterns/${id}/foredit`,{headers: {"auth":jwt}})
            if(p.status===200&&p.data){
                const beads=BeadObject2Map(p.data.beads)
                if(beads===undefined) return new Error("Niepoprawna struktura koralików")
                else return {...p.data, beads}
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzoru"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error ?? "Nie udało się pobrać wzorów"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
    static async SavePattern(pattern: Pattern, files: Map<string,File>): Promise<true|BackendError|Error>{
        if(pattern.title.length<=0||pattern.title.length>30) return new Error("Tytuł powinien mieć od 1 do 30 znaków")
        if(pattern.pictures.length>3) return new Error("Obszar roboczy może zawierać do 3 obrazów")
        let sendbeads: {[key:string]:number}={}
        var errstring=""
        const beadarray=[...pattern.beads].forEach(([k,v])=>{
            if(pattern.colors.findIndex(x=>x.index==v)===-1) errstring=`Wzór zawiera koralik w nieistniejącym kolorze na współrzędnych (${k%pattern.width},${Math.floor(k/pattern.width)}). Użyj gumki na tym obszarze.`
            sendbeads[k.toString()]=v
        })
        if(errstring.length>0) return new Error(errstring)
        const filearray=[...files]
        const imgarray=pattern.pictures.map(i=>({...i, url: (i.isLocal ? (filearray.findIndex(x=>x[0]===i.url).toFixed(0)):i.url)}))
        const notfound=imgarray.find(x=>x.url==="-1")
        if(notfound!==undefined) return new Error("Nie znaleziono pliku dla obrazu "+notfound.name+". Spróbuj usunąć obraz i dodać go ponownie.")
                    var formdata: FormData = new FormData(undefined,undefined)
        formdata.append("pattern",JSON.stringify({title: pattern.title, isPublic: pattern.isPublic, colors: pattern.colors, beads: sendbeads, pictures: imgarray}))
        filearray.forEach((x,ind)=>{formdata.append(ind.toFixed(0),x[1])})
        const jwt='aaa'
        try{
            var p= await axios.patch(import.meta.env.VITE_API_URL+`/patterns/${pattern._id}`,formdata,{headers: {"auth":jwt,"Content-Type":"multipart/form-data"}})
            if(p.status===200&&p.data){
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzoru"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error ?? "Nie udało się pobrać wzorów"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
        return true
    }
}