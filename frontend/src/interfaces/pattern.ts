import {ObjectId} from 'bson'

interface ShortColor {
    _id: ObjectId,
    index: number
    name: string,
    rgb: string,
    needsBorder: boolean
}
interface Bead {
    coords: number,
    color: number //index z ShortColor
}
interface BgPicture {
    x: number,
    y: number,
    name: string,
    isLocal: boolean
    scale: number
    url: string,
}
//Reprezentuje tylko info do edycji
//Reprezentuje pełen wzór z informacjami potrzebnymi przy edycji
interface Pattern {
    _id?: ObjectId,
    authorId: ObjectId,
    authorName?: string,
    title: string,
    height: number,
    width: number,
    isPublic: boolean,
    createdAt: Date,
    lastUpdatedAt: Date,
    ratingSum: number,
    ratingCount: number,
    colors: Array<ShortColor>,
    beads: Map<number,number>,
    pictures: Array<BgPicture>
}

export type {Pattern, ShortColor, Bead, BgPicture};