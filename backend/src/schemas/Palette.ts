import mongoose, { Types } from "mongoose";
import {SharedPalette, type SharedPaletteColor} from "@shared/interfaces/palette.js"

interface PaletteColorType extends SharedPaletteColor<Types.ObjectId>{}
interface PaletteType extends SharedPalette<Types.ObjectId,PaletteColorType>{}

const paletteSchema =new mongoose.Schema<PaletteType>({
    name: {type: String, required: true},
    colors: [new mongoose.Schema<PaletteColorType>({
        name: {type: String, required: true},
        rgb: {type: String, required: true},
        needsBorder: {type: Boolean, required: true},
        fromTime: {type: Date, required: false},
        toTime: {type: Date, required: false}
    })]
})

export { paletteSchema, type PaletteType, type PaletteColorType }