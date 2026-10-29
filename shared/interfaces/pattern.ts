import { SizeUnits } from "./patternsizeunits.js"

export interface SharedPatternColor<IdType>{
    _id?: IdType,
    idInPalettes: IdType
    name: string,
    rgb: string,
    needsBorder: boolean,
    index: number
}
export interface SharedImage<IdType>{
    _id?: IdType,
    x: number,
    y: number,
    name: string,
    scale: number,
    url: string,
}
interface GenericSharedPattern<IdType, BeadKeyType,
ColorType extends SharedPatternColor<IdType>> {
    _id?: IdType,
    author: IdType,
    title: string,
    height: number,
    width: number,
    isPublic: boolean,
    createdAt: Date,
    updatedAt: Date,
    //ratingSum: number,
    //ratingCount: number,
    colors: Array<ColorType>,
    beads: Map<BeadKeyType,number>
}
//Reprezentuje pełen wzór z informacjami potrzebnymi przy edycji
export interface SharedEditPattern<IdType, BeadKeyType,
ColorType extends SharedPatternColor<IdType>,
ImgType extends SharedImage<IdType>> extends GenericSharedPattern<IdType,BeadKeyType,ColorType>{
    pictures: Array<ImgType>
}
//reprezentuje wzor tylko do galerii, bez obrazow, ale z nazwa uzytkownika i srednia ocena
export interface SharedGalleryPattern<IdType, BeadKeyType,
ColorType extends SharedPatternColor<IdType>> extends GenericSharedPattern<IdType,BeadKeyType,ColorType>{
    authorName: string,
    rating: number,
}

export interface AddPatternRequest{
    title: string,
    height: number,
    width: number,
    unit: SizeUnits,
    palette: string
}
