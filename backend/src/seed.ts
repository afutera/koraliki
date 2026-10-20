import "dotenv/config"
import mongoose from "mongoose";
import { paletteSchema } from "@schemas/Palette.js";
import { userSchema } from "@schemas/User.js";
import { patternSchema } from "@schemas/Pattern.js";
import AuthService from "@services/AuthService.js";
import PaletteService from "@services/PaletteService.js";

console.log("Rozpoczynam import")
if(process.env.DB_URL===undefined){
      console.error("Brak adresu bazy danych w .env!")
      process.exit(1)
}
try{
      await mongoose.connect(process.env.DB_URL!)
      console.log("Polaczono z baza "+process.env.DB_URL)
}catch{
      console.error("Nie udalo się polaczyc z baza danych")
      process.exit(1)
}
const Palettes= mongoose.model("palettes",paletteSchema)
const Users = mongoose.model("users",userSchema)
const Patterns = mongoose.model("patterns", patternSchema)
var u = await Users.findOne({isMainAdmin: true})
if(u===null){
    if(process.env.SEED_ADMIN_EMAIL===undefined || process.env.SEED_ADMIN_PASS===undefined){
      console.error("Brak danych do założenia konta administratora w .env!")
      process.exit(1)
    }
    const hash=await AuthService.hashPassword(process.env.SEED_ADMIN_PASS)
    u= await Users.insertOne({
        username: "admin",
        email: process.env.SEED_ADMIN_EMAIL,
        password: hash,
        description: "Główny administrator systemu",
        createdAt: Date.now(),
        isAdmin: true,
        isMainAdmin: true
    })
console.log("Dodano administratora głównego")
}

var paleta1 = await Palettes.findOne({name: "czarno-biała"}), paleta2 = await Palettes.findOne({name: "tęcza"});
if(paleta1===null){
    paleta1 = await Palettes.insertOne({
    name: "czarno-biała",
    colors: [{
        name: "czarny",
        rgb: "#000000",
        needsBorder: false
    },{
        name: "biały",
        rgb: "#ffffff",
        needsBorder: true
    },{
        name: "szary",
        rgb: "#808080",
        needsBorder: false
    },{
        name: "jasnoszary",
        rgb: "#c0c0c0",
        needsBorder: true
    },{
        name: "ciemnoszary",
        rgb: "#3d3c3c",
        needsBorder: false
    }]
})
console.log("Dodano paletę czarno-białą")
}
if(paleta2===null){
    paleta2 = await Palettes.insertOne({
    name: "tęcza",
    colors: [{
        name: 'czerwony',
        rgb: '#ff0000',
        needsBorder: false
    },{
        name: 'pomaranczowy',
        rgb: '#ff5e00',
        needsBorder: false
    },{
        name: 'zolty',
        rgb: '#ffee00',
        needsBorder: false
    },{
        name: 'zielony',
        rgb: '#00ff00',
        needsBorder: false
    },{
        name: 'niebieski',
        rgb: '#00ffdd',
        needsBorder: false
    },{
        name: 'indygo',
        rgb: '#0000ff',
        needsBorder: false
    },{
        name: 'fioletowy',
        rgb: '#8c00ff',
        needsBorder: false
    }]
})
console.log("Dodano paletę kolorową")
}
if(await Patterns.countDocuments()==0){
    console.log("Brak wzorów, dodaję przykładowe na profilu admina")
    var b=new Map<string,number>()
    //generuje dwukolorowy X
    for(var i=0;i<256;i++){
        for(var j=Math.max(0,i-4);j<=i;j++){
            b.set(((i)*256+j).toString(),0)
            b.set(((i)*256+255-j).toString(),1)
        }
    }
    Patterns.insertMany([{
        title: "Serduszko",
        author: u._id,
        isPublic: true,
        height: 10,
        width: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        ratingsSum: 14,
        ratingsCount: 3,
        colors: [PaletteService.Color2ShortColor(paleta2.colors[0], 0), PaletteService.Color2ShortColor(paleta1.colors[2],1)],
        beads: new Map([['1',0],['2',0],['7',0],['8',0],['10',0],['13',0],['16',0],['19',0],['20',0],['24',0],['25',0],['29',0],
            ['30',0],['39',0],['40',0],['49',0],['50',0],['59',0],['61',0],['68',0],['72',0],['77',0],['83',0],['86',0],['94',0],['95',0]
        ]),
        pictures: []
    },{
    title: "Tecza pionowa",
    author: u._id,
    isPublic: true,
    height: 7,
    width: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ratingsSum: 0,
    ratingsCount: 0,
    colors: [PaletteService.Color2ShortColor(paleta2.colors[0],0)!,
        PaletteService.Color2ShortColor(paleta2.colors[1],1)!,
        PaletteService.Color2ShortColor(paleta2.colors[2],2)!,
        PaletteService.Color2ShortColor(paleta2.colors[3],3)!,
        PaletteService.Color2ShortColor(paleta2.colors[4],4)!,
        PaletteService.Color2ShortColor(paleta2.colors[5],5)!,
        PaletteService.Color2ShortColor(paleta2.colors[6],6)!
    ],
    beads: new Map([['0',0],['1',1],['2',2],['3',3],['4',4],['5',5],['6',6]]),
    pictures: []
},{
    title: "Tecza pozioma",
    author: u._id,
    isPublic: true,
    height: 1,
    width: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    ratingsSum: 0,
    ratingsCount: 0,
    colors: [PaletteService.Color2ShortColor(paleta2.colors[0],0)!,
        PaletteService.Color2ShortColor(paleta2.colors[1],1)!,
        PaletteService.Color2ShortColor(paleta2.colors[2],2)!,
        PaletteService.Color2ShortColor(paleta2.colors[3],3)!,
        PaletteService.Color2ShortColor(paleta2.colors[4],4)!,
        PaletteService.Color2ShortColor(paleta2.colors[5],5)!,
        PaletteService.Color2ShortColor(paleta2.colors[6],6)!
    ],
    beads: new Map([['0',0],['1',1],['2',2],['3',3],['4',4],['5',5],['6',6]]),
    pictures: []
},{
    title: "Duży",
    author: u._id,
    isPublic: true,
    height: 256,
    width: 256,
    createdAt: new Date(),
    updatedAt: new Date(),
    ratingsSum: 17.5,
    ratingsCount: 7,
    colors: [PaletteService.Color2ShortColor(paleta1.colors[0],0),
        PaletteService.Color2ShortColor(paleta2.colors[6],1)],
    beads: b,
    pictures: []
}
    ])
}
console.log("Zakonczono.")
await mongoose.disconnect()