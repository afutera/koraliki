import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import AuthService, { type AuthUserInfo } from "../services/AuthService.ts";
import auth from "@fastify/auth"
import jwt from "@fastify/jwt"

declare module 'fastify' {
  interface FastifyInstance {
    jwtCheckButAllow: (request: any, reply: any) => void,
    jwtIsLoggedIn: (request: any, reply: any) => void,
    jwtIsAdmin: (request: any, reply: any) => void,
  }
  interface FastifyRequest {
    currentUser? : AuthUserInfo| undefined
  }
}

async function authPlugin (fastify: Fastify.FastifyInstance, opt: Object) {
    if(process.env.JWT_SECRET===undefined){
        fastify.log.error("Brak JWT_SECRET w pliku .env, nie mozna generować kluczy JWT do autoryzacji.")
        process.exit(1)
    }
    fastify.decorateRequest("currentUser",undefined)
    fastify.register(jwt, {secret: process.env.JWT_SECRET!})
    var service=new AuthService(fastify.mongooseModels["users"], fastify.jwt)
    fastify.decorate('jwtCheckButAllow', async function (request, reply) {
        if (!request.raw.headers.auth) return
        var valid=await service.MOCK_GetUserFromToken(request.raw.headers.auth)
        if(Error.isError(valid)) return
        else{
            request.currentUser=valid
        }
    })
    fastify.decorate('jwtIsLoggedIn', async function (request, reply) {
        if (!request.raw.headers.auth) {
            reply.code(401).send({error: 'Brak nagłówka'})
        }
        var valid=await service.MOCK_GetUserFromToken(request.raw.headers.auth)
        if(Error.isError(valid)) reply.code(401).send(valid.message)
        else{
            request.currentUser=valid
        }
    })
    fastify.decorate('jwtIsAdmin', async function (request, reply) {
        if(request.currentUser===undefined){
            if (!request.raw.headers.auth) {
                reply.code(401).send({error: 'Brak nagłówka'})
            }
            var valid=await service.MOCK_GetUserFromToken(request.raw.headers.auth)
            if(Error.isError(valid)) reply.code(401).send({error: valid.message})
            else request.currentUser=valid
        }
        if(!request.currentUser.isAdmin) reply.code(403).send({error: 'Użytkownik nie jest administratorem'})
    })
    fastify.register(auth)
    fastify.log.info("Autentykacja JWT wlaczona")
}

export default fastifyPlugin(authPlugin)