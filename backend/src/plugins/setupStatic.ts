import {FastifyInstance, FastifyError} from "fastify";
import fastifyPlugin from "fastify-plugin";
import fs from "fs"
import path from "path";
import fstatic from "@fastify/static"
import fastifySchedule from "@fastify/schedule";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import { checkPictures } from "@utils/PublicCleanup.js";

const PUBLIC_FOLDER=path.join(import.meta.dirname,"..","..","public")

const afterFolderExists = (fastify: FastifyInstance, done: (error?: FastifyError) => void)=>{
    fastify.register(fstatic,{
        root: path.join(PUBLIC_FOLDER,"pictures"),
        prefix: "/pictures/"
    })
    fastify.register(fastifySchedule)
    done()
}

const setupPublic = (fastify: FastifyInstance, opt: Object, done: (error?: FastifyError) => void) =>{
    const pictures = path.join(PUBLIC_FOLDER,"pictures")
    if(!fs.existsSync(pictures)){
        fastify.log.info('Folder na obrazy pomocnicze nie istnieje, tworzę...')
        fs.mkdir(pictures,{recursive:true, mode:744},(err)=>{
            if(err) {
                fastify.log.error("Nie udało się utworzyć folderu na obrazy pomocnicze")
                process.exit(1)
            }
            else{
                afterFolderExists(fastify,done)
            }
        })
    }else afterFolderExists(fastify,done)
}
export function setupDeleteJob(fastify: FastifyInstance){
    let interval = process.env.CLEANUP_INTERVAL === undefined ? 60 : parseInt(process.env.CLEANUP_INTERVAL)
    if(isNaN(interval)) interval=60
    const model=fastify.mongooseModels["patterns"]
    const task = new AsyncTask("rm_patterns",()=>{
        fastify.log.info("Usuwanie nieuzywanych plikow z katalogu publicznego")
        return checkPictures(model)
    },(err)=>{fastify.log.error("Błąd przy czyszczeniu katalogu publicznego:"+err.message)})
    const job = new SimpleIntervalJob({minutes: interval, runImmediately: true},task)
    fastify.scheduler.addSimpleIntervalJob(job)
}

export default fastifyPlugin(setupPublic)