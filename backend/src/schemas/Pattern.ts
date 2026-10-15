import {Schema, Types} from "mongoose";

interface ImageType{
    name: string,
    url: string,
    x: number,
    y:number,
    scale: number
}

interface PatternColorType{
    idInPalettes: Types.ObjectId,
    name: string,
    rgb: string,
    needsBorder: boolean,
    index: number
}

interface PatternType{
    _id: Types.ObjectId,
    title: string,
    author: Types.ObjectId,
    height: number,
    width: number,
    createdAt: Date,
    updatedAt: Date,
    isPublic: boolean,
    ratingsCount: number,
    ratingsSum: number,
    colors: Array<PatternColorType>,
    images: Array<ImageType>,
    beads: Map<string,number>
}
interface ShortPattern{
    _id: Types.ObjectId,
    title: string,
    author: Types.ObjectId,
    authorName: string,
    height: number,
    width: number,
    createdAt: Date,
    updatedAt: Date,
    rating: number,
    colors: Array<PatternColorType>,
    beads: Map<string,number>,
    isPublic: boolean,
}


const patternSchema =new Schema<PatternType>({
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
    images: [new Schema<ImageType>({
        name: {type: Schema.Types.String, required: true},
        url: {type: Schema.Types.String, required: true},
        x: {type: Schema.Types.Number, required: true},
        y: {type: Schema.Types.Number, required: true},
        scale: {type: Schema.Types.Number, required: true}
    })],
    beads: {type: Schema.Types.Map, of: Schema.Types.Int32}
})

export { patternSchema, type PatternType, type ImageType, type PatternColorType, type ShortPattern }