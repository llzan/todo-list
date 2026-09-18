import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';

import styles from './TodosPage.module.css';

import TodoList from '../features/Todos/TodoList/TodoList';
import TodoForm from '../features/Todos/TodoForm';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import StatusFilter from '../shared/StatusFilter';

import useDebounce from '../utils/useDebounce';
import { validateTodoTitle } from '../utils/todoValidation';
import { useAuth } from '../contexts/AuthContext';

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

  const [state, dispatch] = useReducer(
    todoReducer,
    initialTodoState
  );

  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    filterError,
  } = state;

  // Read the status filter from the URL.
  const statusFilter = searchParams.get('status') || 'all';

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm,
      },
    });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({
        type: TODO_ACTIONS.FETCH_START,
      });

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Unable to fetch todos');
        }

        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {
            todos: data.tasks,
          },
        });
      } catch {
        const isFilterError =
          Boolean(debouncedFilterTerm) ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'asc';

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? 'Unable to apply your filters. Please try again.'
              : 'Unable to load your todos. Please try again.',
            isFilterError,
          },
        });
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
    dataVersion,
  ]);

  const addTodo = async (todoTitle) => {
    const validation = validateTodoTitle(todoTitle);

    if (!validation.valid) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          message: validation.error,
        },
      });

      return;
    }

    const newTodo = {
      id: Date.now(),
      title: validation.value,
      isCompleted: false,
    };

    // Add the todo immediately for a responsive UI, then replace
    // the temporary todo with the saved server response.
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        todo: newTodo,
      },
    });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const savedTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          todo: savedTodo,
        },
      });
    } catch {
      // Remove the temporary todo if the server request fails.
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          message: 'Unable to add your todo. Please try again.',
        },
      });
    }
  };

  const completeTodo = async (id) => {
    // Update the UI immediately while the server request is pending.
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id,
      },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

      const updatedTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: {
          id,
          todo: updatedTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          message: 'Unable to complete your todo. Please try again.',
        },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const validation = validateTodoTitle(editedTodo.title);

    if (!validation.valid) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          message: validation.error,
        },
      });

      return;
    }

    const updatedTodo = {
      ...editedTodo,
      title: validation.value,
    };

    // Update the displayed todo immediately while the server request
    // is pending, then replace it with the saved server response.
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        todo: updatedTodo,
      },
    });

    try {
      const response = await fetch(
        `/api/tasks/${updatedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: updatedTodo.title,
            isCompleted: updatedTodo.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const savedTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: {
          todo: savedTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: updatedTodo.id,
          message: 'Unable to update your todo. Please try again.',
        },
      });
    }
  };

  return (
    <main className={styles.todosPage}>
      <header className={styles.todosHeader}>
        <p className={styles.todosEyebrow}>Stay organized</p>

        <h1 className={styles.todosTitle}>Todo List</h1>

        <p className={styles.todosSubtitle}>
          Keep track of what needs to get done.
        </p>
      </header>

      <section
        className={styles.addTodoSection}
        aria-labelledby="add-todo-heading"
      >
        <h2
          id="add-todo-heading"
          className={styles.todoSectionTitle}
        >
          Add a Todo
        </h2>

        <TodoForm onAddTodo={addTodo} />
      </section>

      {isTodoListLoading && (
        <div
          className={`${styles.stateCard} ${styles.loadingState}`}
          role="status"
          aria-live="polite"
        >
          <div
            className={styles.loadingSpinner}
            aria-hidden="true"
          />

          <p>Loading your todos...</p>
        </div>
      )}

      {error && (
        <div
          className={`${styles.stateCard} ${styles.errorState}`}
          role="alert"
        >
          <div className={styles.stateContent}>
            <strong>Something went wrong</strong>

            <p>{error}</p>
          </div>

          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Dismiss
          </button>
        </div>
      )}

      {filterError && (
        <div
          className={`${styles.stateCard} ${styles.filterErrorState}`}
          role="alert"
        >
          <div className={styles.stateContent}>
            <strong>Unable to apply filters</strong>

            <p>{filterError}</p>
          </div>

          <div className={styles.stateActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() =>
                dispatch({
                  type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
                })
              }
            >
              Dismiss
            </button>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() =>
                dispatch({
                  type: TODO_ACTIONS.RESET_FILTERS,
                })
              }
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <section
        className={styles.controlsContainer}
        aria-label="Todo controls"
      >
        <div className={styles.controlSection}>
          <h2 className={styles.controlTitle}>Show</h2>

          <StatusFilter />
        </div>

        <div className={styles.controlSection}>
          <h2 className={styles.controlTitle}>
            Search Todos
          </h2>

          <FilterInput
            filterTerm={filterTerm}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className={styles.controlSection}>
          <h2 className={styles.controlTitle}>Sort By</h2>

          <SortBy
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={(newSortBy) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: {
                  sortBy: newSortBy,
                  sortDirection,
                },
              })
            }
            onSortDirectionChange={(newSortDirection) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: {
                  sortBy,
                  sortDirection: newSortDirection,
                },
              })
            }
          />
        </div>
      </section>

      <section
        className={styles.todoSection}
        aria-labelledby="todo-section-heading"
      >
        <h2
          id="todo-section-heading"
          className={styles.todoSectionTitle}
        >
          Todo
        </h2>

        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          dataVersion={dataVersion}
          statusFilter={statusFilter}
        />
      </section>
    </main>
  );
}

export default TodosPage;


