export type InputProps = {
  className?: string;
  value: string;
  id: string;
  pattern: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onWheel?: React.WheelEventHandler<HTMLInputElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLInputElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLInputElement>;
};
