/**
 * Returns the string serialised version of a keybind.
 *
 * @param isControlKeyPressed Is the Ctrl key pressed.
 * @param isAltKeyPressed Is the Alt key pressed.
 * @param isShiftKeyPressed Is the Shift key pressed.
 * @param keyPressed The key pressed.
 */
export const serialiseKeybind = (
  keyboardEvent: React.KeyboardEvent | KeyboardEvent
): string => {
  const keys = [];

  if (keyboardEvent.ctrlKey) {
    keys.push('Ctrl');
  }

  if (keyboardEvent.altKey) {
    keys.push('Alt');
  }

  if (keyboardEvent.shiftKey) {
    keys.push('Shift');
  }

  if (keyboardEvent.key === ' ') {
    keys.push('Space');
  } else if (keyboardEvent.key) {
    keys.push(keyboardEvent.key);
  }

  return keys.join('+');
};
