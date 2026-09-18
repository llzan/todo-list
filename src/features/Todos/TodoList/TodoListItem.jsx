// TodoListItem Component

import { useEffect, useRef, useState } from 'react';

import TextInputWithLabel from '../../../shared/TextInputWithLabel';

import {
  validateTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../../utils/todoValidation';

import styles from './TodoListItem.module.css';

function TodoListItem({
  todo,
  onCompleteTodo,
  onUpdateTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(
    todo.title
  );
  const [validationError, setValidationError] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleEdit(event) {
    const value = event.target.value;

    setWorkingTitle(value);

    if (validationError) {
      setValidationError('');
    }
  }

  function handleStartEditing() {
    setWorkingTitle(todo.title);
    setValidationError('');
    setIsEditing(true);
  }

  function handleCancel() {
    setWorkingTitle(todo.title);
    setValidationError('');
    setIsEditing(false);
  }

  function handleUpdate(event) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();

    const validation = validateTodoTitle(workingTitle);

    if (!validation.valid) {
      setValidationError(validation.error);
      inputRef.current?.focus();
      return;
    }

    onUpdateTodo({
      ...todo,
      title: validation.value,
    });

    setValidationError('');
    setIsEditing(false);
  }

  return (
    <li className={styles.todoItem}>
      <form
        className={styles.todoForm}
        onSubmit={handleUpdate}
      >
        {isEditing ? (
          <div className={styles.editMode}>
            <div className={styles.editInput}>
              <TextInputWithLabel
                elementId={`editTodo${todo.id}`}
                name={`editTodo${todo.id}`}
                labelText="Todo"
                ref={inputRef}
                value={workingTitle}
                onChange={handleEdit}
                required
                maxLength={MAX_TODO_TITLE_LENGTH}
                autoComplete="off"
                labelClassName={styles.inputLabel}
                inputClassName={styles.input}
                aria-invalid={Boolean(validationError)}
                aria-describedby={
                  validationError
                    ? `editTodoCount${todo.id} editTodoError${todo.id}`
                    : `editTodoCount${todo.id}`
                }
              />

              <p
                id={`editTodoCount${todo.id}`}
                className={styles.characterCount}
              >
                {workingTitle.length} / {MAX_TODO_TITLE_LENGTH}{' '}
                characters
              </p>

              {validationError && (
                <p
                  id={`editTodoError${todo.id}`}
                  className={styles.error}
                  role="alert"
                  aria-live="assertive"
                >
                  {validationError}
                </p>
              )}
            </div>

            <div className={styles.editActions}>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                className={styles.updateButton}
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.todoContent}>
            <label
              className={styles.checkboxLabel}
              htmlFor={`checkbox${todo.id}`}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />

              <span
                className={styles.checkmark}
                aria-hidden="true"
              />
            </label>

            <button
              className={`${styles.todoTitle} ${
                todo.isCompleted
                  ? styles.completed
                  : ''
              }`}
              type="button"
              onClick={handleStartEditing}
              aria-label={`Edit todo: ${todo.title}`}
            >
              {todo.title}
            </button>

            <button
              className={styles.editButton}
              type="button"
              onClick={handleStartEditing}
              aria-label={`Edit ${todo.title}`}
            >
              Edit
            </button>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;