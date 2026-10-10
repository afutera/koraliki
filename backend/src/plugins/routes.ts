import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import PaletteService from "../services/PaletteService.ts";

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

  //sciezki dla wszystkich
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

  //sciezki dla zalogowanych

  //sciezki dla adminow
}

export default fastifyPlugin(routes)