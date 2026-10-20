import { type ShortPattern, type ShortColor } from "@interfaces/pattern"
import axios from "axios";
import type { BackendError } from "@interfaces/errors";
import BeadObject2Map from "../utils/BeadObject2Map";

interface UnmappedShortPattern{
    _id: string,
    title: string,
    author: string,
    authorName: string,
    height: number,
    width: number,
    createdAt: Date,
    updatedAt: Date,
    rating: number,
    colors: Array<ShortColor>,
    beads: any,
    isPublic: boolean,
}
export interface GalleryResponse{
    pageNo: number,
    pageCount: number,
    results: Array<ShortPattern>
}


export default class GalleryPatternService{
    //nie bierze tokenu i uzytkownika z ciasteczek

    static ShortPattern2Map(x: UnmappedShortPattern): ShortPattern|undefined{
        const map=BeadObject2Map(x.beads);
        if(map===undefined) return undefined;
        return {...x, beads: map}
    }
    static GalleryResponse2Map(res: {pageNo: number, pageCount: number,results: [UnmappedShortPattern]}): GalleryResponse{
         const {pageNo, pageCount, results} = res;
         const resmapped=results.map((x:UnmappedShortPattern)=>GalleryPatternService.ShortPattern2Map(x)).filter(x=>x!==undefined)
         return {pageNo, pageCount, results: resmapped}
    }

    static async MOCK_GetAllMyPatterns(): Promise<GalleryResponse|BackendError>{
        const jwt="aaaa"
        try{
            var p= await axios.get<{pageNo: number, pageCount: number,results: [UnmappedShortPattern]}>(import.meta.env.VITE_API_URL+`/patterns/user/me`,{headers: {"auth":jwt}})
            if(p.status===200&&p.data){
                return this.GalleryResponse2Map(p.data)
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzorów"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error  ?? "Nie udało się pobrać wzorów"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }

    static async CopyPattern(id: string): Promise<true|BackendError>{
        const jwt="aaaa"
        try{
            var p= await axios.post<{_id: string}>(import.meta.env.VITE_API_URL+`/patterns/${id}/copy`,{},{headers: {"auth":jwt}})
            if(p.status===201&&p.data){
                return true
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzorów"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error  ?? "Nie udało się pobrać wzorów"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
    static async DeletePattern(id: string): Promise<true|BackendError>{
        const jwt="aaaa"
        try{
            var p= await axios.delete<{_id: string}>(import.meta.env.VITE_API_URL+`/patterns/${id}`,{headers: {"auth":jwt}})
            if(p.status===204){
                return true
            }
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu wzorów"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.message ?? e.response.data.error  ?? "Nie udało się pobrać wzorów"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
}

