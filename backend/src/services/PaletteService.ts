import {ObjectId} from "mongodb"
import { Model} from "mongoose"
import { type PaletteType, type PaletteColorType } from "@schemas/Palette.js"
import { type PatternColorType } from "@schemas/Pattern.js"

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
        const now=new Date()
        var palette= await this.model.aggregate([{"$match":{_id:id}},{"$project":{colors:1}}]).unwind("colors")
        .match({"$and":[{"$or":[{"colors.fromTime":{"$exists":false}},{"colors.fromTime":{"$lte":now}}]},{"$or":[{"colors.toTime":{"$exists":false}},{"colors.toTime":{"$gte":now}}]}]})
        .project({"colors.fromTime":0,"colors.toTime":0}).exec()
        if(palette===null) return new Array<PaletteColorType>()
        return palette.map(x=>x.colors)
    }
    static Color2ShortColor (c: PaletteColorType, index: number):PatternColorType {
        return {
            idInPalettes: c._id!,
            name: c.name,
            rgb: c.rgb,
            needsBorder: c.needsBorder,
            index
        }
    }
    async CheckIfColorExists(id: ObjectId | string): Promise<boolean>{
        const found = await this.model.findOne({colors:{"$elemMatch":{_id:id}}})
        return !(found===null)
    }
    async getFirstFew(id: ObjectId | string, amt: number): Promise<PatternColorType[]>{
        const now=new Date()
        if(typeof id==="string"){
            id=new ObjectId(id)
        }
        const res = await this.model.aggregate([{"$match":{_id:id}},{"$project":{colors:1}}]).unwind("colors")
        .match({"$and":[{"$or":[{"colors.fromTime":{"$exists":false}},{"colors.fromTime":{"$lte":now}}]},{"$or":[{"colors.toTime":{"$exists":false}},{"colors.toTime":{"$gte":now}}]}]})
        .limit(amt).project({"colors.fromTime":0,"colors.toTime":0}).exec()
        return res.map((x,index)=>{const {_id, ...c} = x.colors; return {...c, idInPalettes: _id, index}})
    }
}


export default PaletteService