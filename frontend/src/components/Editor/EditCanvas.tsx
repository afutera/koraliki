import {Stage, Layer, Circle, Line, Rect, Text} from 'react-konva'
import type {Pattern} from '@interfaces/pattern'
import { useState, useRef, useEffect, type ComponentProps } from 'react'
import type { EditorLayers } from '@interfaces/enums'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import ArrayImage from './ArrayImage'

const EditCanvas = ({pattern, scale, onClickBeadLayer, onMouseUpDown, drag, onScroll}:{pattern:Pattern, scale: {startx: number, starty: number, scale: number, }
    onClickBeadLayer: (coords: number)=>void, onMouseUpDown: (mouseDown:boolean, coords: number)=>void, drag: boolean, onScroll: (x:number,y:number)=>void})=>{

    const rulerwidth=20, scrollwidth= 10, scrollpadding=5
    const  [size,setSize]=useState({beadRadius: 1, width: pattern.width, height: pattern.height, patternw: pattern.height, patternh: pattern.height})
    const containerRef = useRef<HTMLDivElement|null>(null);
    const stageRef: ComponentProps<typeof Stage>["ref"]= useRef(null);
    const [grid, SetGrid] = useState<Array<{axis: string, text: string, coord: number}>>([]) //linie siatki
    const [layer, setLayer] = useState<EditorLayers>("Beads");
    const mouseDown=useRef(false)
    const [lastBead, setLastBead] = useState(-1)
    const [stagePos,setStagePos]=useState({x:0,y:0}) //React nie resetuje pozycji w dragu
    const [scrollbar,setScrollbar] = useState({hpos: scrollpadding, vpos:scrollpadding, hlen:pattern.width, vlen: pattern.height, hvisible: false, vvisible: false})
    const scaleRef = useRef<number>(0)

    const newSize = ()=>{
        scaleRef.current=scale.scale
        if (!containerRef.current) return;
        const width = containerRef.current?.offsetWidth-4, height=containerRef.current?.offsetHeight-4;
        const beadRadius= Math.min((width-rulerwidth)/pattern.width, (height-rulerwidth)/pattern.height)/2*scale.scale;
        const hvisible=pattern.width*2*beadRadius+rulerwidth>width, vvisible=pattern.height*2*beadRadius+rulerwidth>height
        var pw=width-rulerwidth, ph=height-rulerwidth
        if(hvisible) ph-=scrollwidth+scrollpadding
        if(vvisible) pw-=scrollwidth+scrollpadding
        setSize({width, height, beadRadius, patternw :pw, patternh: ph})
        //Linie siatki co 1, 2, 5, 10, 20, 50...
        var spaceBetweenLines=1
        if(spaceBetweenLines*2*beadRadius<24) spaceBetweenLines=5
        while(spaceBetweenLines*2*beadRadius<24){
            if(spaceBetweenLines*beadRadius*4>=24) spaceBetweenLines*=2
            else if(spaceBetweenLines*beadRadius*10>=24) spaceBetweenLines*=5
            else spaceBetweenLines*=10
        }
        var newGrid: Array<{axis: string, text: string, coord: number}> = []
        for(let i=0;i<pattern.width;i+=spaceBetweenLines) newGrid.push({axis: "x", coord: i, text: i.toString()})
        for(let i=0;i<pattern.height;i+=spaceBetweenLines) newGrid.push({axis: "y", coord: i, text: i.toString()})
        SetGrid(newGrid)

        var xwrong=false, ywrong=false
        const maxscrollx=Math.max(pattern.width-(pw)/(2*beadRadius),0)
        const maxscrolly=Math.max(pattern.height-(ph)/(2*beadRadius),0)
        if(scale.startx>maxscrollx) xwrong=true
        if(scale.starty>maxscrolly) ywrong=true
        const hlen=(width-2*scrollpadding-scrollwidth)*(pw)/(pattern.width*2*beadRadius), vlen=(height-2*scrollpadding-scrollwidth)*(ph)/(pattern.height*2*beadRadius)
        var hpos=scale.startx/pattern.width*(width-2*scrollpadding-scrollwidth)+scrollpadding, vpos=scale.starty/pattern.height*(height-2*scrollpadding-scrollwidth)+scrollpadding
        setScrollbar({hvisible,vvisible,hlen, vlen,hpos, vpos})
        if(xwrong || ywrong){
            onScroll(xwrong ? maxscrollx : scale.startx, ywrong ? maxscrolly : scale.starty)
        }
    }
    useEffect(()=>{
        if(scale.scale!==scaleRef.current){
            newSize()
        }else{
            const maxscrollx=Math.max(pattern.width-(size.patternw)/(2*size.beadRadius),0)
            const maxscrolly=Math.max(pattern.height-(size.patternh)/(2*size.beadRadius),0)
            if(scale.startx>maxscrollx){
                if(scale.startx>maxscrolly) onScroll(maxscrollx,maxscrolly)
                else onScroll(maxscrollx,scale.starty)
            }else{
                if(scale.starty>maxscrolly) onScroll(scale.startx,maxscrolly)
                else{
                    setScrollbar({...scrollbar, hpos: scale.startx/pattern.width*(size.width-2*scrollpadding-scrollwidth)+scrollpadding, 
                        vpos:scale.starty/pattern.height*(size.height-2*scrollpadding-scrollwidth)+scrollpadding
                    })
                }
            }
        }
    }, [scale]);

    useEffect(() => {
        newSize();
        window.addEventListener('resize', newSize);
        return () => {window.removeEventListener('resize', newSize);};
    }, []);

    const Point2Bead: (mousePos: {x: number, y:number})=>number = (mousePos: {x: number, y:number}) => {
        if(mousePos.x<rulerwidth||mousePos.y<rulerwidth||mousePos.x>rulerwidth+size.patternw||mousePos.y>=rulerwidth+size.patternh) return -1
        const x=Math.floor((mousePos.x-rulerwidth+scale.startx*2*size.beadRadius)/size.beadRadius/2)
        if(x<pattern.width){
            const y=Math.floor((mousePos.y-rulerwidth+scale.starty*2*size.beadRadius)/size.beadRadius/2)
            if(y<pattern.height)
                return y*pattern.width+x
        }
        return -1
    }

    const onClick = (e: KonvaEventObject<MouseEvent>)=>{
        if(e.target.id()==="hScrollbar"||e.target.id()==="vScrollbar") return
        const mousePos=stageRef.current?.getPointerPosition();
        if(mousePos===undefined || mousePos==null) return
        const bead=Point2Bead(mousePos)
        if(bead>-1) onClickBeadLayer(bead)
    }
    const onMouseDown = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) =>{
        const mousePos=stageRef.current?.getPointerPosition();
        if(mousePos===undefined || mousePos==null) return
        const bead=Point2Bead(mousePos)
        mouseDown.current=true
        setLastBead(bead)
        if(!(e.target.id()==="hScrollbar"||e.target.id()==="vScrollbar")) onMouseUpDown(true, bead)
    }
    const onMouseUp = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) =>{
        const mousePos=stageRef.current?.getPointerPosition();
        if(mousePos===undefined || mousePos==null) return
        const bead=Point2Bead(mousePos)
        mouseDown.current=false
        setLastBead(-1)
        if(!(e.target.id()==="hScrollbar"||e.target.id()==="vScrollbar")) onMouseUpDown(false, bead)
    }
    const onMouseMove = () =>{
        if(mouseDown.current===false) return
        const mousePos=stageRef.current?.getPointerPosition();
        if(mousePos===undefined || mousePos==null) return
        const bead=Point2Bead(mousePos)
        if(bead!=lastBead) setLastBead(bead)
        if(bead!=-1) onClickBeadLayer(bead)
    }
    const onMouseEnter = (e: KonvaEventObject<MouseEvent>)=>{
        const mousedown=e.evt.buttons%2==1
        if(mousedown) onMouseDown(e)
        else onMouseUp(e)
    }
    const StageDrag = (e: KonvaEventObject<DragEvent>)=>{
        if(e.target.id()==="hScrollbar"||e.target.id()==="vScrollbar") return
        const pos=e.currentTarget.absolutePosition()
        const x=Math.max(Math.min((stagePos.x-pos.x)/(2*size.beadRadius)+scale.startx,pattern.width-(size.patternw)/(2*size.beadRadius)),0)
        const y=Math.max(Math.min((stagePos.y-pos.y)/(2*size.beadRadius)+scale.starty,pattern.height-(size.patternh)/(2*size.beadRadius)),0)
        setStagePos(pos)
        e.currentTarget.setAbsolutePosition({x:0,y:0})
        onScroll(x,y)
    }
    const StageDragEnd= ()=>{setStagePos({x: 0, y:0})}
    const OnHScrollbarMove = (e: Konva.KonvaEventObject<DragEvent>)=>{
        var pos=e.currentTarget.position()
        onScroll((pos.x-scrollpadding)/(size.width-2*scrollpadding-scrollwidth)*pattern.width,scale.starty)
    }
    const OnVScrollbarMove = (e: Konva.KonvaEventObject<DragEvent>)=>{
        var pos=e.currentTarget.position()
        onScroll(scale.startx,(pos.y-scrollpadding)/(size.height-2*scrollpadding-scrollwidth)*pattern.height)
    }

    return(
        <div ref={containerRef} className="editCanvas">
        <Stage x={0} y={0} height={size.height} width={size.width} ref={stageRef} draggable={drag} onDragMove={StageDrag} onDragEnd={StageDragEnd}
        onPointerClick={onClick} onMouseDown={onMouseDown} onTouchStart={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onMouseUp} onMouseMove={onMouseMove} onTouchMove={onMouseMove} onMouseEnter={onMouseEnter}>
            <Layer x={rulerwidth-scale.startx*2*size.beadRadius} y={rulerwidth-scale.starty*2*size.beadRadius} scaleX={size.beadRadius} scaleY={size.beadRadius}>
                {pattern.pictures.map((img,i)=><ArrayImage key={img.name+i} x={img.x} y={img.y} scale={img.scale} url={img.url}/>)}
            </Layer>
            <Layer x={rulerwidth-scale.startx*2*size.beadRadius} y={rulerwidth-scale.starty*2*size.beadRadius} listening={false}>
                {
                    size.beadRadius<=2 ? [...pattern.beads].map(([coords,color],k)=>
                    <Rect key={k} y={Math.floor(coords/pattern.width)*size.beadRadius*2+size.beadRadius} x={(coords%pattern.width)*size.beadRadius*2+size.beadRadius} height={size.beadRadius*2} width={size.beadRadius*2}
                  fill={pattern.colors.find(x=>x.index==color)?.rgb}/>)
                  : [...pattern.beads].map(([coords,color],k)=>
                    <Circle key={k} y={Math.floor(coords/pattern.width)*size.beadRadius*2+size.beadRadius} x={(coords%pattern.width)*size.beadRadius*2+size.beadRadius} radius={size.beadRadius} 
                  fill={pattern.colors.find(x=>x.index==color)?.rgb} strokeWidth={pattern.colors.find(x=>x.index==color)?.needsBorder ? 1:0} stroke={"black"}/>)
                }
                <Rect x={(pattern.width)*2*size.beadRadius} y={0} height={size.height} width={size.width-(pattern.width-scale.startx)*2*size.beadRadius-rulerwidth} fill="#a0a0a0"/>
                <Rect y={(pattern.height)*2*size.beadRadius} x={0} width={size.width} height={size.height-(pattern.height-scale.starty)*2*size.beadRadius-rulerwidth} fill="#a0a0a0"/>
            </Layer>
            <Layer listening={false}>
                <Rect x={0} y={0} height={rulerwidth} width={size.width} fill="#a0a0a0"/>
                <Rect x={0} y={0} width={rulerwidth} height={size.height} fill="#a0a0a0"/>
                {scrollbar.vvisible && <Rect x={rulerwidth+size.patternw} y={0} height={size.height} width={scrollwidth+scrollpadding} fill="#a0a0a0"/>}
                {scrollbar.hvisible && <Rect y={rulerwidth+size.patternh} x={0} width={size.width} height={scrollwidth+scrollpadding} fill="#a0a0a0"/>}
                {
                    grid.filter(line=>line.axis==="x" && line.coord>=scale.startx).map((line,key)=><>
                    <Line key={'line'+key} stroke="#a0a0a0" strokeWidth={1} points={[(line.coord-scale.startx)*size.beadRadius*2+rulerwidth, 0, (line.coord-scale.startx)*size.beadRadius*2+rulerwidth, size.height]}/>
                    <Text key={'label'+key} stroke="#000000" fontSize={12} text={line.text} x={(line.coord-scale.startx)*size.beadRadius*2+rulerwidth-4} y={0}/>
                    </>)
                }
                {
                    grid.filter(line=>line.axis==="x" && line.coord>=scale.starty).map((line,key)=><>
                        <Line key={'line'+key} stroke="#a0a0a0" strokeWidth={1} points={[0, (line.coord-scale.starty)*size.beadRadius*2+rulerwidth, size.width, (line.coord-scale.starty)*size.beadRadius*2+rulerwidth]}/>
                        <Text key={'label'+key} stroke="#000000" fontSize={12} text={line.text} x={0} y={(line.coord-scale.starty)*size.beadRadius*2+rulerwidth+4} rotation={-90}/>
                    </>)
                }
            </Layer>
            {!drag && <Layer _useStrictMode> 
                {scrollbar.hvisible && <Rect id={"hScrollbar"} x={scrollbar.hpos} y={size.height-scrollpadding-scrollwidth} height={scrollwidth} width={scrollbar.hlen} fill={"#00000080"} 
                draggable onDragMove={OnHScrollbarMove} dragBoundFunc={(pos)=>({x: Math.max(Math.min(pos.x,size.width-scrollpadding-scrollwidth-scrollbar.hlen),scrollpadding), y:size.height-scrollpadding-scrollwidth})}/>}
                {scrollbar.vvisible && <Rect id={"vScrollbar"} y={scrollbar.vpos} x={size.width-scrollpadding-scrollwidth} height={scrollbar.vlen} width={scrollwidth} fill={"#00000080"} 
                draggable onDragMove={OnVScrollbarMove} dragBoundFunc={(pos)=>({y: Math.max(Math.min(pos.y,size.height-scrollpadding-scrollwidth-scrollbar.vlen),scrollpadding), x:size.width-scrollpadding-scrollwidth})}/>}
            </Layer>}
        </Stage>
        </div>
    )
}

export default EditCanvas
/**/