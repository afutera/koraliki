import {type SharedPatternColor, type SharedImage, type SharedEditPattern, type SharedGalleryPattern} 
from '@shared/interfaces/pattern'

interface ShortColor extends SharedPatternColor<string> {}

interface BgPicture extends SharedImage<string>{
    isLocal: boolean
}
//Reprezentuje pełen wzór z informacjami potrzebnymi przy edycji
interface Pattern extends SharedEditPattern<string,number,ShortColor,BgPicture> {}

//reprezentuje wzor tylko do galerii, bez obrazow, ale z nazwa uzytkownika i srednia ocena
interface ShortPattern extends SharedGalleryPattern<string, number, ShortColor> {}

export type {Pattern, ShortColor, BgPicture, ShortPattern};