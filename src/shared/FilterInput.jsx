// FilterInput.jsx Component

import { useState } from 'react';
import {
  validateFilter,
  MAX_FILTER_LENGTH,
} from '../utils/todoValidation';
import styles from './FilterInput.module.css';

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
    <div className={styles.filterInput}>
      <label
        className={styles.visuallyHidden}
        htmlFor="filterInput"
      >
        Search todos
      </label>

      <input
        className={styles.input}
        id="filterInput"
        type="search"
        value={filterTerm}
        onChange={handleChange}
        placeholder="Search by title..."
        maxLength={MAX_FILTER_LENGTH}
        aria-invalid={Boolean(filterError)}
        aria-describedby={
          filterError
            ? 'filterInputCount filterInputError'
            : 'filterInputCount'
        }
      />

      <p
        className={styles.characterCount}
        id="filterInputCount"
      >
        {filterTerm.length} / {MAX_FILTER_LENGTH} characters
      </p>

      {filterError && (
        <p
          className={styles.error}
          id="filterInputError"
          role="alert"
          aria-live="assertive"
        >
          {filterError}
        </p>
      )}
    </div>
  );
}

export default FilterInput;
