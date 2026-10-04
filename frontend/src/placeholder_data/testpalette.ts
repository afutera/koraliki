import type {Palette} from "@interfaces/palette"
import {ObjectId} from 'bson'

const palettes: Palette[] =[{
    _id: new ObjectId(),
    name: "czarno-biala",
    colors: [{
        _id: new ObjectId(),
        name: "czarny",
        rgb: "#000000",
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: "biały",
        rgb: "#ffffff",
        needsBorder: true
    },{
        _id: new ObjectId(),
        name: "szary",
        rgb: "#808080",
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: "jasnoszary",
        rgb: "#c0c0c0",
        needsBorder: true
    },{
        _id: new ObjectId(),
        name: "ciemnoszary",
        rgb: "#3d3c3c",
        needsBorder: false
    }]
},{
    _id: new ObjectId(),
    name: "tecza",
    colors: [{
        _id: new ObjectId(),
        name: 'czerwony',
        rgb: '#ff0000',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'pomaranczowy',
        rgb: '#ff5e00',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'zolty',
        rgb: '#ffee00',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'zielony',
        rgb: '#00ff00',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'niebieski',
        rgb: '#00ffdd',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'indygo',
        rgb: '#0000ff',
        needsBorder: false
    },{
        _id: new ObjectId(),
        name: 'fioletowy',
        rgb: '#8c00ff',
        needsBorder: false
    }]
}]



export {palettes}
