// TodoForm.jsx (component)

import { useRef, useState } from 'react';

import TextInputWithLabel from '../../shared/TextInputWithLabel';

import {
  validateTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../utils/todoValidation';

import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;

    setWorkingTodoTitle(value);

    if (validationError) {
      setValidationError('');
    }
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const validation = validateTodoTitle(workingTodoTitle);

    if (!validation.valid) {
      setValidationError(validation.error);
      inputRef.current?.focus();
      return;
    }

    onAddTodo(validation.value);

    setWorkingTodoTitle('');
    setValidationError('');

    inputRef.current?.focus();
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleAddTodo}
      noValidate
    >
      <div className={styles.inputGroup}>
        <TextInputWithLabel
          elementId="todoTitle"
          name="todoTitle"
          labelText="New Todo"
          ref={inputRef}
          value={workingTodoTitle}
          onChange={handleInputChange}
          required
          maxLength={MAX_TODO_TITLE_LENGTH}
          autoComplete="off"
          labelClassName={styles.label}
          inputClassName={styles.input}
          aria-invalid={Boolean(validationError)}
          aria-describedby={
            validationError
              ? 'todoTitleCount todoTitleError'
              : 'todoTitleCount'
          }
        />

        <p
          id="todoTitleCount"
          className={styles.characterCount}
        >
          {workingTodoTitle.length} / {MAX_TODO_TITLE_LENGTH}{' '}
          characters
        </p>

        {validationError && (
          <p
            id="todoTitleError"
            className={styles.error}
            role="alert"
            aria-live="assertive"
          >
            {validationError}
          </p>
        )}
      </div>

      <button
        className={styles.submitButton}
        type="submit"
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

