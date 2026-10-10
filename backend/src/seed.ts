import mongoose from "mongoose";
import { paletteSchema } from "./schemas/Palette.ts";

if(process.env.DB_URL===undefined){
      console.error("Brak adresu bazy danych w .env!")
      process.exit(1)
}
try{
      await mongoose.connect(process.env.DB_URL!)
}catch{
      console.error("Nie udalo się polaczyc z baza danych")
      process.exit(1)
}
const Palettes= mongoose.model("palettes",paletteSchema)
Palettes.insertMany([{
    name: "czarno-biala",
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
},{
    name: "tecza",
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
}])