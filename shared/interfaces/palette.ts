export interface SharedPaletteColor<IdType>{
    _id?: IdType,
    name: string,
    rgb: string,
    needsBorder: boolean,
    fromTime?: Date,
    toTime? : Date 
}
export interface SharedPaletteHeader<IdType>{
    _id?: IdType,
    name: string,
}
export interface SharedPalette<IdType, ColorType extends SharedPaletteColor<IdType>> extends SharedPaletteHeader<IdType>{
    colors: Array<ColorType>
}