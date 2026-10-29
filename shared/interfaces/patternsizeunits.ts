export enum SizeUnits {
    BEAD="BEAD", STANDARD_BOARD="STANDARD_BOARD"
}
export function UnitExists(unit: string): unit is SizeUnits {
       return unit==="BEAD" || unit==="STANDARD_BOARD"
    }
export function GetAllUnits(): SizeUnits[]{
        return [SizeUnits.BEAD, SizeUnits.STANDARD_BOARD]
    }