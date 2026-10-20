import {type SharedPaletteHeader, type SharedPaletteColor, type SharedPalette} from '@shared/interfaces/palette'

interface PaletteColor extends SharedPaletteColor<string> {}

interface PaletteHeader extends SharedPaletteHeader<string> {}

interface Palette extends SharedPalette<string,PaletteColor> {}

export type {Palette, PaletteColor, PaletteHeader}