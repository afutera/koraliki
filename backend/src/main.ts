import "dotenv/config"
import Fastify from "fastify"
//nodemonowi sie nie podobaja aliasy, poprawic to pozniej
import db from "@plugins/database.js"
import routes from "@plugins/routes.js"
import cors from '@fastify/cors'
import auth from "@plugins/auth.js"
import formdata from "@fastify/multipart"
import setupstatic, {setupDeleteJob} from "@plugins/setupStatic.js"

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

await server.after()
server.register(setupstatic)
server.register(routes)

await server.ready().then(()=>setupDeleteJob(server))

server.listen({port, host},(err, addr)=>{
    if(err){
        server.log.error(`Blad przy uruchamianiu serwera: ${err}`)
        process.exit(1)
    }else{
        server.log.info(`Serwer w pelni uruchomiony`)
    }
})