import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import PaletteService from "../services/PaletteService.ts";
import PatternService from "../services/PatternService.ts";
import { Types } from "mongoose";

async function routes (fastify: Fastify.FastifyInstance, opt: Object) {
  const models=fastify.mongooseModels;

const idSchema = {
  schema:{
    params:{
      properties:{
          id: {type: "string"}
      }
    }
  }
}

  //PALETY
  fastify.get('/palettes', async (req, res) => {
        const palettes=await new PaletteService(models["palettes"]).GetPaletteNames()
        if(palettes.length==0) res.code(400).send({error:"Brak zdefiniowanych palet!"})
        else res.send(palettes)
  })
  fastify.get('/palettes/:id', idSchema, async (req, res) => {
    // @ts-ignore
        const colors=await new PaletteService(models["palettes"]).GetShortColorsFormPalette(req.params.id) //req.params ma schemat, o co mu chodzi???
        
        if(colors.length==0) res.code(400).send({error:"Brak kolorów w palecie!"})
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
      if(typeof result == "number") res.code(result).send({error: result==404 ? "Nie znaleziono obrazu":"Obraz innego użytkownika"})
      else res.code(201).send({_id: result})
  })
  fastify.get("/patterns/:id/foredit",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    // @ts-ignore
      const _id = new Types.ObjectId(req.params.id)
      const user = undefined
      const result = await new PatternService(models["patterns"]).GetPatternForEdit(_id, req.currentUser!._id);
      if(typeof result == "number") res.code(result).send({error: result==404 ? "Nie znaleziono obrazu":"Obraz innego użytkownika"})
      else res.code(200).send(result)
  })
  fastify.get("/patterns/:id",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtCheckButAllow])}, async (req,res)=>{
    // @ts-ignore
      const _id = new Types.ObjectId(req.params.id)
      const result = await new PatternService(models["patterns"]).GetPatternForView(_id, req.currentUser===undefined ? undefined:req.currentUser!._id);
      if(typeof result == "number") res.code(result).send({error: result==404 ? "Nie znaleziono obrazu":"Obraz prywatny innego użytkownika"})
      else res.code(200).send(result)
  })
  fastify.delete("/patterns/:id",{schema: idSchema.schema, preHandler: fastify.auth([fastify.jwtIsLoggedIn])}, async (req,res)=>{
    // @ts-ignore
    const _id = new Types.ObjectId(req.params.id)
      const result = await new PatternService(models["patterns"]).DeletePattern(_id, req.currentUser!._id);
      res.code(result)
      if(result===204) res.send(undefined)
      else if(result==404) res.send({error:"Nie znaleziono obrazu"})
      else res.send({error:"Obraz innego użytkownika"})
  })


  //sciezki dla zalogowanych
  //sciezki dla adminow
}

export default fastifyPlugin(routes)