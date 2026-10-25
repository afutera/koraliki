import "dotenv/config"
import Fastify from "fastify"
//nodemonowi sie nie podobaja aliasy, poprawic to pozniej
import db from "@plugins/database.js"
import routes from "@plugins/routes.js"
import cors from '@fastify/cors'
import auth from "@plugins/auth.js"
import formdata from "@fastify/multipart"
import fstatic from "@fastify/static"
import path from "node:path"

const port = parseInt(process.env.PORT ?? "3000")
const host= process.env.HOST ?? "0.0.0.0"
const origin = process.env.FRONT_URL ?? true

const server=Fastify({
    logger: true,
    requestTimeout: 10000
})

server.register(db)
server.register(cors,{origin,methods:"GET,HEAD,POST,PUT,PATCH,DELETE"})
server.register(formdata)
server.register(auth)
server.register(fstatic,{
    root: path.join(import.meta.dirname,"..","public","pictures"),
    prefix: "/pictures/"
})

await server.after()
server.register(routes)

server.listen({port, host},(err, addr)=>{
    if(err){
        server.log.error(`Blad przy uruchamianiu serwera: ${err}`)
        process.exit(1)
    }else{
        server.log.info(`Serwer w pelni uruchomiony`)
    }
})