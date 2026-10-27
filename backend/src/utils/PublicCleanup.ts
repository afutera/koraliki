import fs from "fs"
import path from "path"
import { Model} from "mongoose"
import { type PatternTypeInternal } from "@schemas/Pattern.js"

const PICTURE_FOLDER=path.join(import.meta.dirname,"..","..","public","pictures")

export const checkPictures=async (model: Model<PatternTypeInternal>)=>{
    fs.readdir(PICTURE_FOLDER,async (err,files)=>{
        if(err) return
        for(let f of files){
            if(await model.findOne({pictures:{"$elemMatch":{url:"/pictures/"+f}}})==null) fs.rm(path.join(PICTURE_FOLDER,f),()=>{})
        }
    })
}