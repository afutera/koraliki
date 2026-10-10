import {ObjectId} from "mongodb"
import { Model} from "mongoose"
import { type PaletteType, type PaletteColorType } from "../schemas/Palette.ts"

class PaletteService{
    model: Model<PaletteType>
    constructor(palettes: Model<PaletteType>){
        this.model=palettes
    }
    async GetPaletteNames(){
        return await this.model.find({},{_id: 1, name: 1})
    }
    async GetShortColorsFormPalette(id: ObjectId | string) : Promise<Array<PaletteColorType>>{
        if(typeof id==="string"){
            id=new ObjectId(id)
        }
        var palette= await this.model.findById({_id: id},{"colors.fromTime":0,"colors.toTime":0})
        if(palette===null) return new Array<PaletteColorType>()
        return palette.colors
    }
}


export default PaletteService