import { Model, Types } from "mongoose"
import { type PatternTypeEdit, type PatternTypeInternal, type PatternColorType, type ShortPattern } from "@schemas/Pattern.js"
import DecodePattern, { type SavePattern, type SavePatternImage} from "@utils/PatternJsonDecoder.js"
import {PictureFileExists, SavePictureFile} from "@utils/PictureSaver.js"
import {Readable} from "node:stream"


export interface PatternsList{
    pageNo: number
    pageCount: number,
    results: Array<ShortPattern>
}

export interface SavePatternRequest{
    patternJson: string,
    files: Map<string,{stream: Readable, type: string}>
    decoded?:SavePattern
}

class PatternService{
    static readonly PATTERNS_PER_PAGE=20
    model: Model<PatternTypeInternal>
    constructor(model: Model<PatternTypeInternal>){
        this.model=model
    }

    async GetGalleryPatterns(page: number, searchOptions: any): Promise<PatternsList>{
        if(page<1) page=1
        var findOptions: any = {isPublic: true}
        const order = searchOptions.sort===undefined ? -1:1
        const sortBy = searchOptions.sort==='updatedAt' ? {updatedAt: order} : (searchOptions.sort==="popular" ? {ratingsCount: order}:{createdAt: order})
        const pageCount= Math.ceil((await this.model.countDocuments(findOptions))/PatternService.PATTERNS_PER_PAGE)
        if(page>pageCount) page=pageCount
        const results= await this.model.find(findOptions,null,{sort: sortBy,skip: PatternService.PATTERNS_PER_PAGE*(page-1), limit:PatternService.PATTERNS_PER_PAGE}).lean()
        .populate([{path:'author',select:'username'}])
        .transform(x=>({pageNo: page, pageCount, results: [...x].map(el=>{
            var { pictures, ratingsCount, ratingsSum, author, ...el2}={...el};
            if(ratingsSum==undefined) ratingsSum=0;
            if(ratingsCount==undefined) ratingsCount=0;
             return {...el2, rating: ratingsCount==0 ? 0:+(ratingsSum/ratingsCount).toFixed(1), author: author._id, authorName: author.username ?? "nieznany"}})}));
        return results
    }

    async GetProfilePatterns(profileUser: Types.ObjectId | string, loggedInUser: Types.ObjectId|string|undefined, page: number, searchOptions: any, ): Promise<PatternsList>{
        if(typeof profileUser==="string") profileUser=new Types.ObjectId(profileUser)
        if(typeof loggedInUser==="string") loggedInUser=new Types.ObjectId(loggedInUser)
        if(page<1) page=1
        var findOptions: any = {author: profileUser}
        if(loggedInUser!==undefined && loggedInUser.equals(profileUser)){
            if(searchOptions.isPublic!==undefined && typeof searchOptions.isPublic == "boolean") findOptions.isPublic=searchOptions.isPublic
        }
        else findOptions.isPublic=true
        if(searchOptions.title!==undefined) findOptions.title={"$regex":/searchOptions.title/i}
        const order = searchOptions.sort===undefined ? -1:1
        const sortBy = searchOptions.sort==='updatedAt' ? {updatedAt: order} : (searchOptions.sort==="popular" ? {ratingsCount: order}:{createdAt: order})
        const pageCount= Math.ceil((await this.model.countDocuments(findOptions))/PatternService.PATTERNS_PER_PAGE)
        if(page>pageCount) page=pageCount
        const results= await this.model.find(findOptions,null,{sort: sortBy,skip: PatternService.PATTERNS_PER_PAGE*(page-1), limit:PatternService.PATTERNS_PER_PAGE})
        .populate([{path:'author',select:'username'}]).lean()
        .transform(x=>({pageNo: page, pageCount, results: [...x].map(el=>{
            var { pictures, ratingsCount, ratingsSum, author, ...el2}={...el};
            if(ratingsSum==undefined) ratingsSum=0;
            if(ratingsCount==undefined) ratingsCount=0;
             return {...el2, rating: ratingsCount==0 ? 0:+(ratingsSum/ratingsCount).toFixed(1), author: author._id, authorName: author.username ?? "nieznany"}})}));
        return results
    }

    async GetPatternForView(pattern: Types.ObjectId|string, user: Types.ObjectId|string|undefined):Promise<ShortPattern|404|403>{
        if(typeof pattern ==="string") pattern=new Types.ObjectId(pattern)
        if(typeof user ==="string") user=new Types.ObjectId(user)
        let p = await this.model.findById(pattern);
        if(p===null) return 404
        if(p.isPublic || p.author.equals(user)){
            p=await p.populate([{path:'author',select:'username'}]);
            //@ts-ignore
            let{ images, ratingsCount, ratingsSum, author, ...el}={...p._doc}
            if(ratingsSum==undefined) ratingsSum=0;
            if(ratingsCount==undefined) ratingsCount=0;
            return {...el, rating: ratingsCount==0 ? 0:+(ratingsSum/ratingsCount).toFixed(1), author: author._id, authorName: author.username}
        }else return 403
    }
    async GetPatternForEdit(pattern: Types.ObjectId|string, user: Types.ObjectId|string):Promise<PatternTypeEdit|404|403>{
        if(typeof pattern ==="string") pattern=new Types.ObjectId(pattern)
        if(typeof user ==="string") user=new Types.ObjectId(user)
        let p = await this.model.findById(pattern,{ratingsCount:0,ratingsSum:0});
        if(p===null) return 404
        if(p.author.equals(user)){
            return p
        }else return 403
    }
    async CopyPattern(pattern: Types.ObjectId|string, user: Types.ObjectId|string): Promise<Types.ObjectId|404|403>{
        if(typeof pattern ==="string") pattern=new Types.ObjectId(pattern)
        if(typeof user ==="string") user=new Types.ObjectId(user)
        let p = await this.model.findById(pattern);
        if(p===null) return 404
        if(p.author.equals(user)){
            var copy=p.$clone()
            copy.title = (copy.title.length>22 ? (copy.title.substring(0,19)+"..."):copy.title) + " - kopia"
            copy.isPublic=false
            copy.ratingsCount=0
            copy.ratingsSum=0
            copy.createdAt = copy.updatedAt = new Date()
            copy.isNew=true
            copy._id=new Types.ObjectId()
            copy = await copy.save()
            return copy._id
        }else return 403
    }
    async AddPattern(title: string, author: Types.ObjectId|string, height: number, width: number) : Promise<Types.ObjectId|undefined>{
        return undefined
    }
    async UpdatePattern(id: Types.ObjectId|string, user: Types.ObjectId|string, req: SavePatternRequest, colorcheck: (id:Types.ObjectId|string)=>Promise<boolean>): Promise<true|{code:number,err:string}>{
        for (let f of req.files.entries()) {
            if(f[1].type!=="image/png"&&f[1].type!="image/jpeg") return {code:400,err:`Plik ${f[0]} musi być .png lub .jpg`}
        }
        const reqpattern=DecodePattern(req.patternJson)
        if(Error.isError(reqpattern)) return {code:400,err:reqpattern.message}
        req.decoded=reqpattern
        var found=await this.model.findById(id)
        if(found===null) return {code:404,err:"Nie znaleziono obrazu"}
        if(!found.author.equals(user)) return {code:403,err:"Użytkownik nie jest autorem"}
        //usunac nieistniejace indeksy i kolory z palety
        const beadmapforfilter=[...reqpattern.beads]
        const remove: number[]=[]
        for(const x of reqpattern.colors){
            if(!beadmapforfilter.some(y=>y[1]===x.index)) remove.push(x.index)
            else if(!(await colorcheck(x.idInPalettes))) return {code:400,err:`Brak koloru ${x.name} w paletach`}
        }
        reqpattern.colors=reqpattern.colors.filter(x=>!remove.includes(x.index))
        const translate=reqpattern.colors.map(x=>x.index)
        reqpattern.beads.forEach((v,k)=>reqpattern.beads.set(k,translate.indexOf(v)))
        reqpattern.colors=reqpattern.colors.map(x=>({...x, index:translate.indexOf(x.index)}))
        //ogarnac pliki
        for(let x of reqpattern.pictures){
            if(x.isLocal){
                const number=x.url;
                const tosave=req.files.get(number)
                if(tosave===undefined){
                    return{code:400, err:`Nie dołączono pliku dla obrazu ${x.name}`}
                }
                else {
                    const saved=await SavePictureFile(tosave.stream, tosave.type)
                    if(Error.isError(saved)) {
                        return {err:`Plik ${x.name}: ${saved.message}`, code:500}
                    }
                    else reqpattern.pictures=reqpattern.pictures.map(y=>(y.url===number ? {...y,isLocal:false,url:saved}:y))
                }
            }else{
                if(!PictureFileExists(x.url)) {
                    return {err:`Wcześniej zapisany plik ${x.name} nie istnieje na serwerze`, code:400}
                }
            }
        }
        found.title=reqpattern.title
        found.isPublic=reqpattern.isPublic
        found.beads=reqpattern.beads
        found.colors=reqpattern.colors.map(x=>({...x, _id: x._id===undefined?undefined:new Types.ObjectId(x._id), idInPalettes: new Types.ObjectId(x.idInPalettes)}))
        found.pictures=reqpattern.pictures.map(x=>({...x, _id: x._id===undefined?undefined:new Types.ObjectId(x._id)}))
        await found.save()
        return true
    }
    async DeletePattern(pattern: Types.ObjectId|string, user: Types.ObjectId|string): Promise<404|403|204>{
        if(typeof pattern ==="string") pattern=new Types.ObjectId(pattern)
        let p = await this.model.findById(pattern);
        if(p===null) return 404
        if(p.author.equals(user)){
            await p.deleteOne()
            return 204
        }else return 403
    }
}


export default PatternService