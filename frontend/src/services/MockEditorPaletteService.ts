import {palettes} from "../placeholder_data/testpalette"
import type {ShortColor} from "@interfaces/pattern"
import type {PaletteHeader} from "@interfaces/palette"
import {ObjectId} from 'bson'
import type { BackendError } from "@interfaces/errors"

export default class MockEditorPaletteService{
    //w przyszlosci to bedzie robil backend

    static GetPalettes(): PaletteHeader[]|BackendError{
        return palettes.filter(x=>x._id!==undefined).map(x=>({_id: x._id, name: x.name}))
    }

    static GetColorsFromPalette(id: ObjectId): ShortColor[]|BackendError{
        const p= palettes.find(x=>x._id==id)
        if(p===undefined) return []
        //realnie to nie powinno byc undefined
        return p.colors.map(x=>({_id:(x._id===undefined? new ObjectId():x._id), index:0, rgb:x.rgb, name: x.name, needsBorder: x.needsBorder}))
    }
}
