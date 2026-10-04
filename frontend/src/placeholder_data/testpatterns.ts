import type {Pattern, ShortColor} from '../interfaces/pattern'
import {palettes} from "./testpalette"
import {ObjectId} from 'bson'

//do spojnosci
function PlaceholderGetShortColor(palettename: string, colorname: string, withindex: number): ShortColor | null
{
    const p= palettes.find(x=>x.name==palettename)
    if(p===undefined) return null
    const c = p.colors.find(x=>x.name==colorname)
    if(c===undefined) return null
    if(c._id===undefined) return null
    return {_id:c._id, index:withindex, rgb:c.rgb, name: c.name, needsBorder: c.needsBorder}
}

var b=new Map<number,number>()
for(let x=0;x<100;x++){
    for(let y=0;y<100;y++){
        b.set(x+100*y,(x<50 && y<50)||(x>=50 && y>=50) ? 0:1)
    }
}
    

const testpatterns: Pattern[] = [{
    title: "Serduszko",
    authorId: new ObjectId(),
    authorName: "FOLA",
    isPublic: true,
    height: 10,
    width: 10,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    ratingSum: 0,
    ratingCount: 0,
    colors: [PlaceholderGetShortColor("tecza","czerwony",0)!, PlaceholderGetShortColor("czarno-biala","szary",1)!],
    beads: new Map([[1,0],[2,0],[7,0],[8,0],[10,0],[13,0],[16,0],[19,0],[20,0],[24,0],[25,0],[29,0],
        [30,0],[39,0],[40,0],[49,0],[50,0],[59,0],[61,0],[68,0],[72,0],[77,0],[83,0],[86,0],[94,0],[95,0]
    ]),
    pictures: []
},{
    title: "Tecza pionowa",
    authorId: new ObjectId(),
    isPublic: true,
    height: 7,
    width: 1,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    ratingSum: 0,
    ratingCount: 0,
    colors: [PlaceholderGetShortColor("tecza","czerwony",0)!,
        PlaceholderGetShortColor("tecza","pomaranczowy",1)!,
        PlaceholderGetShortColor("tecza","zolty",2)!,
        PlaceholderGetShortColor("tecza","zielony",3)!,
        PlaceholderGetShortColor("tecza","niebieski",4)!,
        PlaceholderGetShortColor("tecza","indygo",5)!,
        PlaceholderGetShortColor("tecza","fioletowy",6)!
    ],
    beads: new Map([[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]]),
    pictures: []
},{
    title: "Tecza pozioma",
    authorId: new ObjectId(),
    isPublic: true,
    height: 1,
    width: 7,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    ratingSum: 0,
    ratingCount: 0,
    colors: [PlaceholderGetShortColor("tecza","czerwony",0)!,
        PlaceholderGetShortColor("tecza","pomaranczowy",1)!,
        PlaceholderGetShortColor("tecza","zolty",2)!,
        PlaceholderGetShortColor("tecza","zielony",3)!,
        PlaceholderGetShortColor("tecza","niebieski",4)!,
        PlaceholderGetShortColor("tecza","indygo",5)!,
        PlaceholderGetShortColor("tecza","fioletowy",6)!],
    beads: new Map([[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]]),
    pictures: []
},{
    title: "Duży",
    authorId: new ObjectId(),
    isPublic: true,
    height: 256,
    width: 256,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    ratingSum: 0,
    ratingCount: 0,
    colors: [PlaceholderGetShortColor("czarno-biala","czarny",0)!,
        PlaceholderGetShortColor("tecza","fioletowy",1)!],
    beads: b,
    pictures: []
}]



export default testpatterns