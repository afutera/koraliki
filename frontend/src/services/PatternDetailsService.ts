import { type BackendError } from "@interfaces/errors";
import type { PatternWithBeadCount } from "@interfaces/pattern";
import axios from "axios";
import BO2M from "../utils/BeadObject2Map"

//interface 

export default class PatternDetailsService{
    static async GetPatternDetails(id: string): Promise<PatternWithBeadCount|BackendError>{
        const jwt="aaaa"
        try{
            var p= await axios.get<PatternWithBeadCount>(import.meta.env.VITE_API_URL+`/patterns/${id}/withcount`,{headers: {"auth":jwt}})
            if(p.status===200&&p.data) {
                const beads=BO2M(p.data.pattern.beads)
                if(beads===undefined) return {statusCode: -1, message: "Niepoprawna struktura koralików"}
                p.data.pattern.beads = beads
                return p.data
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzoru"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error  ?? "Nie udało się pobrać wzoru"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
    static async GetPatternPdf(id: string): Promise<string|BackendError>{
        const jwt="aaaa"
        try{
            var p= await axios.get(import.meta.env.VITE_API_URL+`/patterns/${id}/pdf`,{headers: {"auth":jwt,"Accept":"application/pdf"},responseType: 'blob'})
            if(p.status===200&&p.headers["content-type"]=="application/pdf") {
                console.log(p.data)
                return URL.createObjectURL(p.data)
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu pliku"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error  ?? "Nie udało się pobrać pliku"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
}