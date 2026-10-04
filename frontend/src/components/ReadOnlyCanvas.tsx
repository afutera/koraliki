import {Stage, Layer, Circle, Rect} from 'react-konva'
import type {Pattern} from '@interfaces/pattern'
import { useState, useRef, useEffect } from 'react'

const ReadOnlyCanvas = ({pattern}:{pattern:Pattern})=>{

    const  [size,setSize]=useState({beadRadius: 1, width: pattern.width, startx: 0, starty: 0})
    const containerRef = useRef<HTMLDivElement|null>(null);

    const newSize = ()=>{
        if (!containerRef.current) return;
        const width = containerRef.current?.offsetWidth;
        const beadRadius= width/Math.max(pattern.width, pattern.height)/2;
        setSize({width, beadRadius, startx: (width-2*beadRadius*pattern.width)/2+beadRadius, starty:(width-2*beadRadius*pattern.height)/2+beadRadius})
    }

    useEffect(() => {
        newSize();
        window.addEventListener('resize', newSize);
        return () => {window.removeEventListener('resize', newSize);};
    }, []);
    useEffect(() => {
        newSize();
    }, [pattern]);

    return(
        <div ref={containerRef}>
        <Stage height={size.width} width={size.width}>
            <Layer>
                {
                    size.beadRadius<=2 ? 
                    [...pattern.beads].map(([coords,color],k)=>
                    <Rect key={k} y={Math.floor(coords/pattern.width)*size.beadRadius*2+size.starty} x={(coords%pattern.width)*size.beadRadius*2+size.startx} width={size.beadRadius*2} height={size.beadRadius*2} fill={pattern.colors[color].rgb}/>)
                  :[...pattern.beads].map(([coords,color],k)=>
                    <Circle key={k} y={Math.floor(coords/pattern.width)*size.beadRadius*2+size.starty} x={(coords%pattern.width)*size.beadRadius*2+size.startx} radius={size.beadRadius} fill={pattern.colors[color].rgb}
                    strokeEnabled={pattern.colors[color].needsBorder} stroke={"black"}/>)
                }
            </Layer>
        </Stage>
        </div>
    )
}

export default ReadOnlyCanvas