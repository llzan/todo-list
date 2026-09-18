// TextInputWithLabel.jsx (component)

import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(
  function TextInputWithLabel(
    {
      elementId,
      labelText,
      onChange,
      value,
      required = false,
      maxLength,
      name,
      autoComplete,
      inputClassName,
      labelClassName,
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedBy,
    },
    ref
  ) {
    return (
      <>
        <label
          htmlFor={elementId}
          className={labelClassName}
        >
          {labelText}
        </label>

        <input
          type="text"
          id={elementId}
          name={name}
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={inputClassName}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        />
      </>
    );
  }
);

export default TextInputWithLabel;
