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
}