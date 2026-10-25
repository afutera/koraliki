import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import PaletteService from "@services/PaletteService.js";
import PatternService from "@services/PatternService.js";
import { Types } from "mongoose";
import { type SavePatternRequest } from "@services/PatternService.js";
import {BusboyFileStream} from "@fastify/busboy"
import stream from "stream"

async function routes (fastify: Fastify.FastifyInstance, opt: Object) {
  const models=fastify.mongooseModels;

const idSchema = {
  schema:{
    params:{
      properties:{
          id: {type: "string", pattern: "[0-9A-Fa-f]{24}"}
      }
    }
  }
}

  //PALETY
  fastify.get('/palettes', async (req, res) => {
        const palettes=await new PaletteService(models["palettes"]).GetPaletteNames()
        if(palettes.length==0) res.code(400).send({message:"Brak zdefiniowanych palet!"})
        else res.send(palettes)
  })
  fastify.get('/palettes/:id', idSchema, async (req, res) => {
    // @ts-ignore
        const colors=await new PaletteService(models["palettes"]).GetShortColorsFormPalette(req.params.id) //req.params ma schemat, o co mu chodzi???
        
        if(colors.length==0) res.code(400).send({message:"Brak kolorów w palecie!"})
        else res.send(colors)
  })
  //WZORY
  fastify.get("/patterns/all", async (req, res)=>{
    const result = await new PatternService(models["patterns"]).GetGalleryPatterns(1,{});
    res.send(result)
  })
  fastify.get("/patterns/user/me",{preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req, res)=>{
// @ts-ignore
    const result = await new PatternService(models["patterns"]).GetProfilePatterns(req.currentUser!._id,req.currentUser!._id,1,{});
    res.send(result)
  })
  fastify.get("/patterns/user/:id",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtCheckButAllow])}, async (req, res)=>{
// @ts-ignore
    const result = await new PatternService(models["patterns"]).GetProfilePatterns(req.params.id,req.currentUser===undefined ? undefined:req.currentUser!._id,1,{});
    res.send(result)
  })
  fastify.post("/patterns/:id/copy",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    // @ts-ignore
      const _id = new Types.ObjectId(req.params.id)
      const result = await new PatternService(models["patterns"]).CopyPattern(_id, req.currentUser!._id);
      if(typeof result == "number") res.code(result).send({message: result==404 ? "Nie znaleziono obrazu":"Obraz innego użytkownika"})
      else res.code(201).send({_id: result})
  })
  fastify.get("/patterns/:id/foredit",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    // @ts-ignore
      const _id = new Types.ObjectId(req.params.id)
      const user = undefined
      const result = await new PatternService(models["patterns"]).GetPatternForEdit(_id, req.currentUser!._id);
      if(typeof result == "number") res.code(result).send({message: result==404 ? "Nie znaleziono obrazu":"Obraz innego użytkownika"})
      else res.code(200).send(result)
  })
  fastify.get("/patterns/:id",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtCheckButAllow])}, async (req,res)=>{
    // @ts-ignore
      const _id = new Types.ObjectId(req.params.id)
      const result = await new PatternService(models["patterns"]).GetPatternForView(_id, req.currentUser===undefined ? undefined:req.currentUser!._id);
      if(typeof result == "number") res.code(result).send({message: result==404 ? "Nie znaleziono obrazu":"Obraz prywatny innego użytkownika"})
      else res.code(200).send(result)
  })
  fastify.patch("/patterns/:id",{preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    const parts=req.parts()
    const mappedreq: SavePatternRequest = {patternJson:"", files: new Map<string,{stream: stream.Readable, type: string}>()}
    for await (const p of parts){
      if(p.type==="file") {
        if(p.file.truncated) res.code(400).send("Pliki nie mogą być większe niż 1 MB")
        const buffer=await p.toBuffer()
        mappedreq.files.set(p.fieldname, {stream: stream.Readable.from(buffer), type: p.mimetype})} //petla sie nie skonczy jak nie przeczytam strumienia

      else if(p.fieldname==="pattern") mappedreq.patternJson=`${p.value}`
      else res.code(400).send({message:`Niepoprawny klucz ${p.fieldname}`})
    }
    const paletteservice=new PaletteService(models["palettes"])
    // @ts-ignore
    const result=await new PatternService(models["patterns"]).UpdatePattern(req.params.id, req.currentUser?._id!, mappedreq, async (x)=>{return await paletteservice.CheckIfColorExists(x)})
    if(result===true) res.code(205).send()
    else res.code(result.code).send({message:result.err})
    
  })
  fastify.delete("/patterns/:id",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    // @ts-ignore
    const _id = new Types.ObjectId(req.params.id)
      const result = await new PatternService(models["patterns"]).DeletePattern(_id, req.currentUser!._id);
      res.code(result)
      if(result===204) res.send(undefined)
      else if(result==404) res.send({message:"Nie znaleziono obrazu"})
      else res.send({message:"Obraz innego użytkownika"})
  })
}

export default fastifyPlugin(routes)