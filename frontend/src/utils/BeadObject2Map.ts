export default function BeadObject2Map(beads: any): Map<number,number>|undefined{
    const map=new Map<number,number>();
    for(let key in beads){
        let nr = parseInt(key)
        if(isNaN(nr)) return undefined
        if(typeof beads[key]!=="number") return undefined
        map.set(nr,beads[key])
    }
    return map
}