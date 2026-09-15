// FilterInput.jsx Component

import { useState } from 'react';
import {
  validateFilter,
  MAX_FILTER_LENGTH,
} from '../utils/todoValidation';

function FilterInput({ filterTerm, onFilterChange }) {
  const [filterError, setFilterError] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;

    const validation = validateFilter(value);

    if (!validation.valid) {
      setFilterError(validation.error);
      return;
    }

    setFilterError('');
    onFilterChange(value);
  };

  return (
    <div>
      <label htmlFor="filterInput">
        Search todos:
      </label>

      <input
        id="filterInput"
        type="search"
        value={filterTerm}
        onChange={handleChange}
        placeholder="Search by title..."
        maxLength={MAX_FILTER_LENGTH}
        aria-invalid={Boolean(filterError)}
        aria-describedby={
          filterError
            ? 'filterInputError filterInputCount'
            : 'filterInputCount'
        }
      />

      <p id="filterInputCount">
        {filterTerm.length} / {MAX_FILTER_LENGTH}
      </p>

      {filterError && (
        <p
          id="filterInputError"
          role="alert"
        >
          {filterError}
        </p>
      )}
    </div>
  );
}

export default FilterInput;