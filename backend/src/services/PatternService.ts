import { Model, Types } from "mongoose"
import { type PatternType, type PatternColorType, type ShortPattern } from "../schemas/Pattern.ts"


interface PatternsList{
    pageNo: number
    pageCount: number,
    results: Array<ShortPattern>
}


class PatternService{
    static readonly PATTERNS_PER_PAGE=20
    model: Model<PatternType>
    constructor(model: Model<PatternType>){
        this.model=model
    }

    async GetGalleryPatterns(page: number, searchOptions: any): Promise<PatternsList>{
        if(page<1) page=1
        var findOptions: any = {isPublic: true}
        const order = searchOptions.sort===undefined ? -1:1
        const sortBy = searchOptions.sort==='updatedAt' ? {updatedAt: order} : (searchOptions.sort==="popular" ? {ratingsCount: order}:{createdAt: order})
        const pageCount= Math.ceil((await this.model.countDocuments(findOptions))/PatternService.PATTERNS_PER_PAGE)
        if(page>pageCount) page=pageCount
        /*console.log(await this.model.find())
        return await this.model.find()*/
        const results= await this.model.find(findOptions,null,{sort: sortBy,skip: PatternService.PATTERNS_PER_PAGE*(page-1), limit:PatternService.PATTERNS_PER_PAGE})
        .populate([{path:'author',select:'username'}]).lean()
        .transform(x=>({pageNo: page, pageCount, results: [...x].map(el=>{
            var { images, ratingsCount, ratingsSum, author, ...el2}={...el};
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
            var { images, ratingsCount, ratingsSum, author, ...el2}={...el};
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
    async GetPatternForEdit(pattern: Types.ObjectId|string, user: Types.ObjectId|string):Promise<PatternType|404|403>{
        if(typeof pattern ==="string") pattern=new Types.ObjectId(pattern)
        if(typeof user ==="string") user=new Types.ObjectId(user)
        let p = await this.model.findById(pattern);
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
            copy.title = copy.title + " - kopia"
            copy.isPublic=false
            copy.isNew=true
            copy._id=new Types.ObjectId()
            copy = await copy.save()
            this.model
            return copy._id
        }else return 403
    }
    async AddPattern(title: string, author: Types.ObjectId|string, height: number, width: number) : Promise<Types.ObjectId|undefined>{
        return undefined
    }
    async UpdatePattern(){

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