import {SizeUnits, UnitExists} from "@shared/interfaces/patternsizeunits.js"

export class SizeUnitConversion{
    //przelicza na koraliki
    static readonly converter = {"BEAD": 1, "STANDARD_BOARD": 29}
    static Convert2Beads(unit: SizeUnits, amt: number): number {
        if(SizeUnitConversion.converter[unit]==undefined) return 0
        return amt*SizeUnitConversion.converter[unit]
    }
    static ConvertFromBeads(amt: number, toUnit: SizeUnits): number{
        if(SizeUnitConversion.converter[toUnit]==undefined) return 0
        return Math.ceil(amt/SizeUnitConversion.converter[toUnit])
    }
    static UnitExists(unit: string): unit is SizeUnits{
        return UnitExists(unit)
    }
    
}