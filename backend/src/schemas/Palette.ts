import mongoose, { ObjectId } from "mongoose";

interface PaletteColorType{
    _id: ObjectId,
    name: string,
    rgb: string,
    needsBorder: boolean,
    fromTime?: Date,
    toTime? : Date 
}
interface PaletteType{
    _id: ObjectId,
    name: string,
    colors: PaletteColorType[]
}

const paletteSchema =new mongoose.Schema<PaletteType>({
    name: {type: String, required: true},
    colors: [new mongoose.Schema<PaletteColorType>({
        name: {type: String, required: true, unique: true},
        rgb: {type: String, required: true},
        needsBorder: {type: Boolean, required: true},
        fromTime: {type: Date, required: false},
        toTime: {type: Date, required: false}
    })]
})

export { paletteSchema, type PaletteType, type PaletteColorType }