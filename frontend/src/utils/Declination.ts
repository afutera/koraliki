//forma rzeczownika do liczebnika: liczba pojedyncza/mnoga, mianownik/dopełniacz
type NounFormForNo= "1M"|"1D"|"2M"|"2D"

function NounForm(amt: number):NounFormForNo{
    if(!Number.isInteger(amt)) return "1D"
    if(amt<0) amt=-amt 
    if(amt==1) return "1M" 
    if(amt>10&&amt<20) return "2D"
    const mod=amt%10
    if(mod==2||mod==3||mod==4) return "2M"
    else return "2D"
}
export function BeadForm4Number(amt:number){
    const form=NounForm(amt)
    switch(form){
        case "1M": return amt+" koralik"
        case "2M": return amt+" koraliki"
        case "1D": return amt+" koralika"
        case "2D": return amt+" koralików"
    }
}
export function BoardForm4Number(amt:number){
    const form=NounForm(amt)
    switch(form){
        case "1M": return amt+" podkładka"
        case "2M": 
        case "1D": return amt+" podkładki"
        case "2D": return amt+" podkładek"
    }
}