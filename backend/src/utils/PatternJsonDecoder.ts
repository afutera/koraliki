import { SharedImage, SharedPatternColor } from "@shared/interfaces/pattern.js"
import {Ajv} from "ajv"
import { isParameter } from "typescript"

export interface SavePatternImage extends SharedImage<string>{
    isLocal: boolean
}

export interface SavePattern{
    _id:string,
    title: string,
    isPublic: boolean,
    colors:SharedPatternColor<string>[]
    beads: Map<string,number>
    pictures: SavePatternImage[]
}
const idRegExp="[0-9A-Fa-f]{24}";

const updatePatternSchema={
    type: "object" ,
    additionalProperties: false,
    properties:{
        _id:{type:"string",pattern:idRegExp},
        title:{type:"string",minLength:1,maxLength:30},
        isPublic:{type:"boolean"},
        colors: {
            type: "array",
            items:{type:"object",
                additionalProperties: false,
                properties:{
                    _id: {type:"string"}, //dopuszczone, ignorowane
                    idInPalettes: {type:"string", pattern:idRegExp},
                    name: {type:"string"},
                    rgb:{type:"string",pattern:"#[0-9a-fA-f]{6}"},
                    needsBorder: {type:"boolean"},
                    index: {type:"number"}
                },
                required: ["idInPalettes", "name", "rgb", "needsBorder", "index"]
        }},
        beads:{
            type: "object",
            additionalProperties: true
        },
        pictures: {
            type: "array",
            maxItems: 3,
            items:{ type: "object",
                additionalProperties: false,
                properties:{
                    _id: {type:"string"}, //walidacja zalezy od tego, czy jest lokalny
                    name: {type:"string", minLength:1},
                    url: {type:"string"},
                    x: {type: "number"},
                    y: {type:"number"},
                    scale:{type:"number"},
                    isLocal: {type:"boolean"}
                },
                required: ["name", "url", "x", "y", "scale", "isLocal"]
            }
        }
    },
    required: ["_id", "title", "isPublic", "colors", "beads", "pictures"]
}

export default function decode(jsonPattern: string): SavePattern|Error{
    try{
    const ajv = new Ajv()
    const validate=ajv.compile(updatePatternSchema)
    var objPattern: any
    try{
        objPattern=JSON.parse(jsonPattern)
    }catch(e) {if(Error.isError(e)) return e}
    var valid = validate(objPattern)
    if(valid){
        var res: SavePattern = {_id: objPattern._id, title: objPattern.title, isPublic: objPattern.isPublic,
            colors: [], pictures: [], beads: new Map<string,number>()
        }
        objPattern.colors.forEach(x=>{
            res.colors.push({name: x.name, idInPalettes: x.idInPalettes, rgb: x.rgb, needsBorder: x.needsBorder, index: x.index})
        })
        for(let key in objPattern.beads){
            let nr = parseInt(key)
            if(isNaN(nr)) return new Error(`Współrzędna koralika '${key}' nie jest liczbą całkowitą`)
            if(typeof objPattern.beads[key]!=="number") return new Error(`Indeks koloru koralika na ${key} to '${objPattern.beads[key]}', nie jest liczbą całkowitą`)
            if(res.colors.findIndex(x=>x.index===objPattern.beads[key])==-1) return new Error(`Koralik na ${key} ma nieistniejący kolor`)
            res.beads.set(key,objPattern.beads[key])
        }
        var errstring=""
        var idreg = new RegExp(idRegExp)
        objPattern.pictures.forEach(x=>{
            if(x.isLocal){
                let nr = parseInt(x.url)
                if(isNaN(nr)) errstring+=`Nowy obraz ${x.name} nie wskazuje na żaden plik. \n`
                else res.pictures.push({name: x.name, isLocal: true, x: x.x, y: x.y, scale: x.scale, url: x.url})
            }else{
                if(x._id===undefined||!idreg.test(x._id)) errstring+=`Nieprawidłowy identyfikator obrazu ${x.name}`
                else res.pictures.push({_id: x._id, name: x.name, isLocal: false, x: x.x, y: x.y, scale: x.scale, url: x.url})
            }
        })
        if(errstring.length>0) return new Error(errstring)
        return res
    }else{
        return new Error(ajv.errorsText(validate.errors))
    }
    } catch(e) {return new Error("Błąd podczas walidacji")}
}