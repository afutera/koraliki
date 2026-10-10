import "dotenv/config"
import Fastify from "fastify"
//nodemonowi sie nie podobaja aliasy, poprawic to pozniej
import db from "./plugins/database.ts"
import routes from "./plugins/routes.ts"
import cors from '@fastify/cors'

const port = parseInt(process.env.PORT ?? "3000")

const server=Fastify({
    logger: true
})

server.register(db)
server.register(cors)
server.register(routes)

server.listen({port},(err, addr)=>{
    if(err){
        server.log.error(`Blad przy uruchamianiu serwera: ${err}`)
        process.exit(1)
    }else{
        server.log.info(`Serwer uruchomiony na porcie ${port}`)
    }
})