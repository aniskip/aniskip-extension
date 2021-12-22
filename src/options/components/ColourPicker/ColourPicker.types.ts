import { Color, ColorChangeHandler } from 'react-color';
import colours from 'tailwindcss/colors';

export type ColourPickerProps = {
  colour: Color;
  colours?: string[];
  onChangeComplete?: ColorChangeHandler;
};

export const DEFAULT_COLOUR_PICKER_COLOURS = [
  colours.amber[700],
  colours.amber[500],
  colours.emerald[500],
  colours.emerald[700],
  colours.blue[500],
  colours.blue[700],
  colours.gray[700],
  colours.rose[700],
  colours.rose[500],
  colours.fuchsia[700],
] as const;
