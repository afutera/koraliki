import {Schema, Types} from "mongoose";
import {SharedEditPattern, SharedGalleryPattern, SharedPatternColor, type SharedImage} from "@shared/interfaces/pattern.js"

interface ImageType extends SharedImage<Types.ObjectId> {}

interface PatternColorType extends SharedPatternColor<Types.ObjectId> {
    idInPalettes: Types.ObjectId
}

interface PatternTypeEdit extends SharedEditPattern<Types.ObjectId,string,PatternColorType,ImageType>{}
interface PatternTypeInternal extends PatternTypeEdit{
    ratingsCount: number,
    ratingsSum: number
}
interface ShortPattern extends SharedGalleryPattern<Types.ObjectId,string,PatternColorType> {}


const patternSchema =new Schema<PatternTypeInternal>({
    title: {type: Schema.Types.String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'users'},
    width: {type: Schema.Types.Int32, required: true},
    height: {type: Schema.Types.Int32, required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    updatedAt: {type: Schema.Types.Date, required: true},
    isPublic: {type: Schema.Types.Boolean, required: true},
    ratingsCount: {type: Schema.Types.Int32, required: true, default: 0},
    ratingsSum: {type: Schema.Types.Number, required: true, default: 0},
    colors: [new Schema<PatternColorType>({
        idInPalettes: {type: Schema.Types.ObjectId, required: true},
        name: {type: String, required: true},
        rgb: {type: String, required: true},
        needsBorder: {type: Boolean, required: true},
        index: {type: Schema.Types.Int32, required: true}
    })],
    pictures: [new Schema<ImageType>({
        name: {type: Schema.Types.String, required: true},
        url: {type: Schema.Types.String, required: true},
        x: {type: Schema.Types.Number, required: true},
        y: {type: Schema.Types.Number, required: true},
        scale: {type: Schema.Types.Number, required: true}
    })],
    beads: {type: Schema.Types.Map, of: Schema.Types.Int32}
})

export { patternSchema, type PatternTypeEdit, type PatternTypeInternal, type ImageType, type PatternColorType, type ShortPattern }