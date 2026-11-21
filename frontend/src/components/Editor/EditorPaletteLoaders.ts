import EditorPaletteService from "@services/EditorPaletteService"
import { isBackendError } from "@interfaces/errors"
import { type PaletteHeader } from "@interfaces/palette"
import type { ShortColor } from "@interfaces/pattern"

export type PaletteHeaderLoaderData = {isSuccess: boolean,palettes: PaletteHeader[], error: string}

export type PaletteShortColorLoaderData = {isSuccess: boolean,colors: ShortColor[], error: string}

export type ColorPickerLoaderData = {isSuccess: boolean,palettes: PaletteHeader[],colors: ShortColor[], error: string}
export interface LoaderDataWithPicker {colorpicker: ColorPickerLoaderData}

export const PaletteLoader = async(): Promise<PaletteHeaderLoaderData>=>{
    const pal = await EditorPaletteService.GetPalettes();
    if(isBackendError(pal)) return {isSuccess: false, palettes: [], error: pal.message}
    return {isSuccess: true, palettes: pal, error:""}
}

export const PaletteColorsLoader = async(paletteId: string): Promise<PaletteShortColorLoaderData>=>{
    var p= await EditorPaletteService.GetColorsFromPalette(paletteId);
    if(isBackendError(p)) return {isSuccess:false, colors: [], error: p.message}
    else return {isSuccess: true, colors: p, error: ""}
}

export const ColorPickerLoader = async(): Promise<ColorPickerLoaderData>=>{
    var p=await PaletteLoader();
    if(p.palettes.length>0&&p.palettes[0]._id!==undefined){
        var c=await PaletteColorsLoader(p.palettes[0]._id)
        return {...c, palettes: p.palettes}
    }
    else return {isSuccess: false, error: p.isSuccess? "Brak zdefiniowanych palet":p.error, palettes: [], colors:[]}
}