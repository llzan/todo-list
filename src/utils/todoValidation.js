// src/utils/todoValidation.js

export const MAX_TODO_TITLE_LENGTH = 200;
export const MAX_FILTER_LENGTH = 100;

export function validateTodoTitle(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return {
      valid: false,
      value: '',
      error: 'Please enter a todo.',
    };
  }

  if (trimmedTitle.length > MAX_TODO_TITLE_LENGTH) {
    return {
      valid: false,
      value: trimmedTitle,
      error: `Todo must be ${MAX_TODO_TITLE_LENGTH} characters or fewer.`,
    };
  }

  return {
    valid: true,
    value: trimmedTitle,
    error: '',
  };
}

export function validateFilter(value) {
  const trimmedValue = value.trim();

  if (trimmedValue.length > MAX_FILTER_LENGTH) {
    return {
      valid: false,
      value: trimmedValue,
      error: `Search must be ${MAX_FILTER_LENGTH} characters or fewer.`,
    };
  }

  return {
    valid: true,
    value: trimmedValue,
    error: '',
  };
}

export function isValidTodoTitle(title) {
  return validateTodoTitle(title).valid;
}


