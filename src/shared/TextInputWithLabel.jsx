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
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedBy,
    },
    ref
  ) {
    return (
      <>
        <label htmlFor={elementId}>
          {labelText}
        </label>

        <input
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        />
      </>
    );
  }
);

export default TextInputWithLabel;
