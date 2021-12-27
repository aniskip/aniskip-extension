/**
 * Returns the string serialised version of a keybind.
 *
 * @param isControlKeyPressed Is the Ctrl key pressed.
 * @param isAltKeyPressed Is the Alt key pressed.
 * @param isShiftKeyPressed Is the Shift key pressed.
 * @param keyPressed The key pressed.
 */
export const serialiseKeybind = (
  isControlKeyPressed: boolean,
  isAltKeyPressed: boolean,
  isShiftKeyPressed: boolean,
  keyPressed: string
): string => {
  const keys = [];

  if (isControlKeyPressed) {
    keys.push('Ctrl');
  }

  if (isAltKeyPressed) {
    keys.push('Alt');
  }

  if (isShiftKeyPressed) {
    keys.push('Shift');
  }

  if (keyPressed === ' ') {
    keys.push('Space');
  } else if (keyPressed) {
    keys.push(keyPressed);
  }

  return keys.join('+');
};
