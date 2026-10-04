import {ObjectId} from 'bson'

interface PaletteColor{
    _id?: ObjectId,
    name: string,
    rgb: string,
    needsBorder: boolean,
    fromTime?: Date, 
    toTime?: Date
}

interface PaletteHeader{
    _id: ObjectId,
    name: string
}

interface Palette extends PaletteHeader{
    colors: Array<PaletteColor>
}

export type {Palette, PaletteColor, PaletteHeader}