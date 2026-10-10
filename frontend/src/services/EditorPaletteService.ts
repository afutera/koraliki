import type {ShortColor} from "@interfaces/pattern"
import type {PaletteHeader} from "@interfaces/palette"
import {ObjectId} from 'bson'
import type { BackendError } from "@interfaces/errors"
import axios from "axios"

export default class MockEditorPaletteService{
    //w przyszlosci to bedzie robil backend

    static async GetPalettes(): Promise<PaletteHeader[]|BackendError>{
        console.log("Szukam palety")
        try{
            var p= await axios.get<PaletteHeader[]>(import.meta.env.VITE_API_URL+"/palettes")
            if(p.status===200&&p.data) return p.data
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu palet"}
        }catch(e){
            console.log(`blad:`, e)
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.error ?? "Nie udało się pobrać palet"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }

    static async GetColorsFromPalette(id: ObjectId): Promise<ShortColor[]|BackendError>{
        try{
            var p= await axios.get<ShortColor[]>(import.meta.env.VITE_API_URL+`/palettes/${id}`)
            if(p.status===200&&p.data) return p.data
            else return {statusCode: p.status, message: "Nieprzewidziany błąd przy pobieraniu kolorów"}
        }catch(e){
            if(axios.isAxiosError(e) && e.response) return {statusCode: e.response.status, message: e.response.data.error ?? "Nie udało się pobrać palet"}
            else return {statusCode: 500, message: "Nieznany błąd"}
        }
    }
}