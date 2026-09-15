// TodoForm.jsx (component)

import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import {
  validateTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../utils/todoValidation';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const inputRef = useRef();

  const handleInputChange = (event) => {
    const value = event.target.value;

    setWorkingTodoTitle(value);

    // Clear the error while the user is correcting the input.
    if (validationError) {
      setValidationError('');
    }
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const validation = validateTodoTitle(
      workingTodoTitle
    );

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
    <form onSubmit={handleAddTodo} noValidate>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={handleInputChange}
        required
        maxLength={MAX_TODO_TITLE_LENGTH}
        aria-invalid={Boolean(validationError)}
        aria-describedby={
          validationError
            ? 'todoTitleError todoTitleCount'
            : 'todoTitleCount'
        }
      />

      <p id="todoTitleCount">
        {workingTodoTitle.length} / {MAX_TODO_TITLE_LENGTH}
      </p>

      {validationError && (
        <p
          id="todoTitleError"
          role="alert"
        >
          {validationError}
        </p>
      )}

      <button type="submit">
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;