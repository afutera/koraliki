import mongoose from "mongoose";
import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import { paletteSchema } from "../schemas/Palette.ts";

declare module 'fastify' {
  interface FastifyInstance {
    mongooseModels: mongoose.Models;
  }
}

const database = async (fastify: Fastify.FastifyInstance, opt: Object) =>{
    if(process.env.DB_URL===undefined){
      fastify.log.error("Brak adresu bazy danych w .env!")
      process.exit(1)
    }
    try{
      await mongoose.connect(process.env.DB_URL!)
    }catch{
      fastify.log.error("Nie udalo się polaczyc z baza danych")
      process.exit(1)
    }
    fastify.log.info("Polaczono z baza danych")
    const Palettes= mongoose.model("palettes",paletteSchema)
    fastify.decorate("mongooseModels",mongoose.models)
    fastify.addHook("onClose",async ()=>{
        await mongoose.disconnect()
    })
}

export default fastifyPlugin(database)