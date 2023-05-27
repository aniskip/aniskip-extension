import React, { useEffect, useReducer } from 'react';
import {
  activeOptionIdUpdated,
  changeHandlerUpdated,
  initialSearchboxState,
  nextOptionActivated,
  optionAdded,
  optionRemoved,
  previousOptionActivated,
  reducer,
  selectActiveOption,
  selectOnChange,
  selectOptionByValue,
  selectOptions,
  selectValue,
  valueUpdated,
} from './Searchbox.data';
import {
  DEFAULT_OPTIONS_TAG,
  DEFAULT_OPTION_TAG,
  DEFAULT_SEARCHBOX_TAG,
  InputProps,
  OptionProps,
  OptionsProps,
  SearchboxProps,
} from './Searchbox.types';
import { SearchboxProvider, useSearchboxRef } from './Searchbox.utils';

export function Searchbox<
  TTag extends React.ElementType = typeof DEFAULT_SEARCHBOX_TAG,
  TValue = any
>({
  // @ts-ignore: This component is replaced with native combobox in a future PR
  as = DEFAULT_SEARCHBOX_TAG,
  children,
  value,
  onChange,
  ...props
}: SearchboxProps<TTag, TValue>): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialSearchboxState);

  /**
   * Initialise onChange handler.
   */
  useEffect(() => {
    if (!onChange) {
      return;
    }

    dispatch(changeHandlerUpdated(onChange));
  }, [onChange, dispatch]);

  /**
   * Initialise value.
   */
  useEffect(() => {
    if (!value) {
      return;
    }

    dispatch(valueUpdated(value));
  }, [value, dispatch]);

  return React.createElement(
    as,
    { ...props },
    <SearchboxProvider value={[state, dispatch]}>{children}</SearchboxProvider>
  );
}

const Input = React.forwardRef(
  (
    props: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const searchboxContext = useSearchboxRef();

    if (!searchboxContext) {
      throw new Error(
        '<Searchbox.Option /> component is unable to to find the parent <Searchbox /> component'
      );
    }

    const [state, dispatch] = searchboxContext;

    /**
     * Handles keyboard selection of options.
     *
     * @param event Event to handle.
     */
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
      switch (event.key) {
        case 'Enter': {
          const activeOption = selectActiveOption(state);

          if (!activeOption) {
            return;
          }

          const onChange = selectOnChange(state);
          onChange(activeOption.value);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          dispatch(previousOptionActivated());
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          dispatch(nextOptionActivated());
          break;
        }
        default:
        // no default
      }
    };

    return <input {...props} ref={ref} onKeyDown={onKeyDown} />;
  }
);

function Options<TTag extends React.ElementType = typeof DEFAULT_OPTIONS_TAG>({
  as = DEFAULT_OPTIONS_TAG as TTag,
  ...props
}: OptionsProps<TTag>): JSX.Element {
  return React.createElement(as, { ...props, role: 'listbox' });
}

function Option<
  TTag extends React.ElementType = typeof DEFAULT_OPTION_TAG,
  TValue = any
>({
  as = DEFAULT_OPTION_TAG as TTag,
  className,
  children,
  value,
  ...props
}: OptionProps<TTag, TValue>): JSX.Element {
  const searchboxContext = useSearchboxRef();

  if (!searchboxContext) {
    throw new Error(
      '<Searchbox.Option /> component is unable to to find the parent <Searchbox /> component'
    );
  }

  const [state, dispatch] = searchboxContext;

  const id = selectOptionByValue(selectOptions(state), value)?.id ?? -1;

  /**
   * Handler for selecting the option.
   */
  const onClick = (): void => {
    const onChange = selectOnChange(state);

    onChange(value);
  };

  /**
   * Set the current option to the active option on enter.
   */
  const onEnter = (): void => {
    dispatch(activeOptionIdUpdated(id));
  };

  /**
   * Remove the current active option on leave.
   */
  const onLeave = (): void => {
    dispatch(activeOptionIdUpdated(-1));
  };

  /**
   * Returns true if the option is selected, otherwise false.
   */
  const isOptionSelected = (): boolean => selectValue(state) === value;

  /**
   * Returns true if the option is active, otherwise false.
   */
  const isOptionActive = (): boolean => {
    const activeOption = selectActiveOption(state);

    return !!activeOption && id === activeOption.id;
  };

  /**
   * Returns the classes or pass props into the class name render function.
   */
  const calculateClassName = (): string | undefined => {
    if (typeof className !== 'function') {
      return className;
    }

    return className({
      active: isOptionActive(),
      selected: isOptionSelected(),
    });
  };

  /**
   * Renders the children or pass props into the render function.
   */
  const renderChildren = (): React.ReactNode => {
    if (typeof children !== 'function') {
      return children;
    }

    return children({
      active: isOptionActive(),
      selected: isOptionSelected(),
    });
  };

  /**
   * Add and remove options from state.
   */
  useEffect(() => {
    dispatch(optionAdded(value));

    return (): void => {
      dispatch(optionRemoved(id));
    };
  }, [value, state.options.length]);

  return React.createElement(
    as,
    {
      ...props,
      onClick,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      onPointerEnter: onEnter,
      onPointerLeave: onLeave,
      className: calculateClassName(),
      role: 'option',
      'aria-selected': isOptionSelected(),
      tabIndex: 0,
    },
    renderChildren()
  );
}

Searchbox.Input = Input;
Searchbox.Options = Options;
Searchbox.Option = Option;
