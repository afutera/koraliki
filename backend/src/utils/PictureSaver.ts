import path from "path"
import fs from "fs"
import { randomUUID } from "crypto"
import { pipeline } from "stream/promises"
import { Readable } from "stream"

const PUBLIC_PICTURE_DIR=path.join(import.meta.dirname,"..","..","public","pictures")

export function PictureFileExists(url: string){
    console.log(url,path.dirname(url),path.basename(url),path.dirname(url)==="/pictures"||path.dirname(url)==="pictures",path.join(PUBLIC_PICTURE_DIR,path.basename(url)))
    return (path.dirname(url)==="/pictures"||path.dirname(url)==="pictures")&&fs.existsSync(path.join(PUBLIC_PICTURE_DIR,path.basename(url)))       
}
export async function SavePictureFile(stream: Readable, mimetype: string): Promise<string|Error>{
    if(mimetype!=="image/png"&&mimetype!=="image/jpeg") return new Error("Niepoprawny typ pliku");
    const filename = randomUUID().toString()+(mimetype=="image/png" ? ".png":".jpg");
    try{
        await pipeline(stream,fs.createWriteStream(path.join(PUBLIC_PICTURE_DIR,filename)))
    }catch(e){
        return new Error("Błąd przy zapisie pliku")
    }
    return "/pictures/"+filename
}