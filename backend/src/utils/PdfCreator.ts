import PDFDocument from "pdfkit"
import { ShortPattern, PatternWithBeadCount } from "@schemas/Pattern.js"
import {join} from "path"
import {SizeUnitConversion} from "@utils/SizeUnitConversion.js"
import { SizeUnits } from "@shared/interfaces/patternsizeunits.js"

const PAGE_HEIGHT_BEADS=55, PAGE_WIDTH_BEADS=40, BEAD_SIZE=14.17
const FONT = join(import.meta.dirname,"..","resource","Tinos-Regular.ttf")

const hasBeadCount = (pattern: any): pattern is PatternWithBeadCount=>{
    return !(pattern["colorStats"]===undefined || pattern["sizeStats"]===undefined)
}

export default class PdfCreator{
    readonly pattern: ShortPattern
    readonly colorCounts: {index:number, count: number, rgb:string, needsBorder:boolean, desc:string}[]
    readonly noOfBoards?: number

    constructor(pattern: ShortPattern|PatternWithBeadCount){
        if(hasBeadCount(pattern)){
            this.pattern=pattern.pattern
            this.colorCounts = pattern.colorStats
            this.noOfBoards = pattern.sizeStats.heightBoards*pattern.sizeStats.widthBoards
        }else{
            this.pattern=pattern
            this.colorCounts=[]
        }
    }

    async Pattern2TemplatePdf():Promise<Uint8Array|string>{
        const widthPages = Math.ceil(this.pattern.width/PAGE_WIDTH_BEADS), heightPages=Math.ceil(this.pattern.height/PAGE_HEIGHT_BEADS)
        const pages: Array<Array<Array<[number,number,number]>>> =[]
        for(let y=0;y<heightPages;y++){
            const row:Array<Array<[number,number,number]>>=[]
            for(let x=0;x<widthPages;x++) row.push([])
                pages.push(row)
        }
        for(const bead of this.pattern.beads){
            const coord = parseInt(bead[0])
            const y=Math.floor(coord/this.pattern.width), x=coord%this.pattern.width
            if(y<this.pattern.height&&x<this.pattern.width){
                pages[Math.floor(y/PAGE_HEIGHT_BEADS)][Math.floor(x/PAGE_WIDTH_BEADS)].push([x%PAGE_WIDTH_BEADS,y%PAGE_HEIGHT_BEADS,bead[1]])
            }
        }
        const doc=new PDFDocument({autoFirstPage: false, info:{Title:"Szablon wzoru "+this.pattern.title}})
        const getContent=this.toBuffer(doc)
        this.registerFont(doc)
        pages.forEach((row,i)=>{row.forEach((map,j)=>{this.WritePage(doc,map,i+1,j+1,widthPages,heightPages)})})
        doc.save()
        doc.end()
        try{
            return await getContent
        }catch(e){console.log("blad",e);return "Błąd przy konwersji do PDF"}
    }
    async Pattern2IngredientsPdf(){
        if(this.noOfBoards===undefined) return "Nie pobrano danych opisowych"
        const doc=new PDFDocument({info:{Title:"Lista składników wzoru "+this.pattern.title},size:"A4"})
        const getContent=this.toBuffer(doc)
        this.registerFont(doc)
        const PAGESIZE = doc.page.height-doc.page.margins.bottom
        const FONTSIZE= doc._fontSize;
        doc.fontSize(FONTSIZE*1.5).text(`Lista elementów wzoru "${this.pattern.title}"`).fontSize(FONTSIZE)
        doc.text(`Autor: ${this.pattern.authorName}`)
        doc.fontSize(FONTSIZE*1.5).text("Składniki:").fontSize(FONTSIZE)
        const BEADS_IN_BOARD = SizeUnitConversion.Convert2Beads(SizeUnits.STANDARD_BOARD,1)
        const boards = `${this.noOfBoards} x standardowa podkładka ${BEADS_IN_BOARD}x${BEADS_IN_BOARD}`
        let liststart = doc.y
        const x =doc.page.width-doc.page.margins.right-1.5*FONTSIZE
        let y=doc.y+doc.heightOfString(boards,{width:x})
        const listitems=[boards]
        //const boxes:{y:number,fill:string,stroke:boolean}[] = []
        for(let color of this.colorCounts){
            const li = `${color.count} x ${color.desc}`
            listitems.push(li)
            doc.fillColor(color.rgb).strokeColor(color.needsBorder? "black":color.rgb).rect(x,y,FONTSIZE,FONTSIZE).fillAndStroke()
            y+=doc.heightOfString(li,{width:x})
            if(y>PAGESIZE){
                doc.addPage({size:"A4"})
                y=y-doc.page.height
            }
        }
        doc.switchToPage(0)
        doc.fillColor("black").list(listitems,doc.page.margins.left,liststart,{listType:"bullet", width:x-doc.page.margins.left})
        doc.save()
        doc.end()
        try{
            return await getContent
        }catch(e){console.log("blad",e);return "Błąd przy konwersji do PDF"}
    }
    //problemy z polskimi znakami, trzeba dostarczyc obslugujaca je czcionke
    private registerFont(doc: PDFKit.PDFDocument){
        console.log(FONT)
        doc.registerFont("FontPL",FONT,)
        doc.font("FontPL")
    }
    //import eksperymentalny nie lubi sie z typescriptem
    private async toBuffer(doc: PDFKit.PDFDocument){
        const getFromEvents = ()=>new Promise<{chunks:Uint8Array[],length:number}>((resolve,reject)=>{
            const buffer: Uint8Array[] =[]
            let length=0
            const addToBuffer = (c:Uint8Array)=>{
                buffer.push(c)
                length+=c.byteLength
            }
            const end = ()=>{removeListeners();resolve({chunks:buffer,length})}
            const error = (err:any)=>{removeListeners();reject(err)}
            const removeListeners=()=>{
                doc.on("data",addToBuffer)
                doc.off("end",end)
                doc.off("error",error)
            }
            doc.on("data",addToBuffer)
            doc.on("end",end)
            doc.on("error",error)
        })
        const {chunks,length} = await getFromEvents()
        const array = new Uint8Array(length)
        let ptr=0
        chunks.forEach(c=>{array.set(c,ptr); ptr+=c.byteLength})
        return array
    }
    private WritePage(doc: PDFKit.PDFDocument, page: Array<[number,number,number]>, rowNo: number, colNo: number, rowSum:number, colSum:number){
        doc.addPage({size:"A4", margin: 0})
        doc.text(`szablon wzoru: ${this.pattern.title}, wiersz ${rowNo}/${rowSum} kolumna ${colNo}/${colSum}`)
        const start=doc.y
        doc.strokeColor("#808080").fillColor("#808080")
        for(let i=0;i<=PAGE_HEIGHT_BEADS+1;i++){
            doc.moveTo(BEAD_SIZE,start+BEAD_SIZE*(i+1)).lineTo(BEAD_SIZE*(PAGE_WIDTH_BEADS+1),start+BEAD_SIZE*(i+1)).stroke()
        }
        for(let i=0;i<=PAGE_WIDTH_BEADS+1;i++){
            doc.moveTo(BEAD_SIZE*(i+1),start+BEAD_SIZE).lineTo(BEAD_SIZE*(i+1),start+BEAD_SIZE*(PAGE_HEIGHT_BEADS+2)).stroke()
        }
        const startX = (rowNo-1)*PAGE_HEIGHT_BEADS, startY = (colNo-1)*PAGE_WIDTH_BEADS
        doc.text((startX).toString(),0,start+BEAD_SIZE*1.5,{rotation:90})
        for(let i=10-startX%10;i<PAGE_HEIGHT_BEADS+1;i+=10) doc.text((i+startX).toString(),0,start+BEAD_SIZE*(i+1.5),{rotation:90})
        doc.text((startY).toString(),BEAD_SIZE,start)
        for(let i=10-startY%10;i<PAGE_WIDTH_BEADS+1;i+=10) doc.text((i+startY).toString(),BEAD_SIZE*(i+0.5),start)
        const RADIUS=BEAD_SIZE/2
        page.forEach(bead=>{
            const color = this.pattern.colors.find(x=>x.index===bead[2])
            doc.fillColor(color?.rgb ?? "black").strokeColor(color?.needsBorder ? "black":(color?.rgb ?? "black")).circle((1.5+bead[0])*BEAD_SIZE,start+(1.5+bead[1])*BEAD_SIZE,RADIUS).fillAndStroke()
        })
    }
}