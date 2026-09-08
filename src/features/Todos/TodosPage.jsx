import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import { useEffect, useCallback, useReducer } from 'react';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../../reducers/todoReducer';

function TodosPage({ token }) {
  // One reducer replaces the 8 useState calls
  const [state, dispatch] = useReducer(
    todoReducer,
    initialTodoState
  );

  // Get individual values from our reducer state
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

  // Derived value - does not need to be in the reducer
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // Update the filter using dispatch
  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm,
      },
    });
  };

  // Update dataVersion using dispatch
  const invalidateCache = useCallback(() => {
    dispatch({
      type: TODO_ACTIONS.INVALIDATE_CACHE,
    });
  }, []);

  // Fetch todos when the token, sort, or filter changes
  useEffect(() => {
    const fetchTodos = async () => {
      // Start loading
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
          throw new Error('unauthorized');
        }

        if (!response.ok) {
          throw new Error('Unable to fetch todos');
        }

        const data = await response.json();

        // Successful fetch
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {
            todos: data.tasks,
          },
        });
      } catch (error) {
        // Determine whether this is a filter/sort error
        const isFilterError =
          Boolean(debouncedFilterTerm) ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'desc';

        // Handle the error through the reducer
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${error.message}`
              : `Error fetching todos: ${error.message}`,
            isFilterError,
          },
        });
      }

      // No finally block is needed.
      // FETCH_SUCCESS and FETCH_ERROR both stop loading.
    };

    if (token) {
      fetchTodos();
    }
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
  ]);

  // Add a new todo
  const addTodo = async (todoTitle) => {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    // Optimistic update:
    // show the todo immediately before the API responds
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

      // Replace temporary todo with server version
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          todo: savedTodo,
        },
      });

      invalidateCache();
    } catch (error) {
      // Roll back optimistic update if API fails
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          message: 'Failed to add todo. Please try again.',
        },
      });
    }
  };

  // Complete a todo
  const completeTodo = async (id) => {
    // Save the original todo for rollback
    const originalTodo = todoList.find(
      (todo) => todo.id === id
    );

    // Optimistically mark the todo as completed
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

      // Replace optimistic version with server version
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: {
          id,
          todo: updatedTodo,
        },
      });

      invalidateCache();
    } catch (error) {
      // Roll back to the original todo
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          message: 'Failed to complete todo. Please try again.',
        },
      });
    }
  };

  // Update a todo
  const updateTodo = async (editedTodo) => {
    // Save the original todo for rollback
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    // Optimistically update the todo
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        todo: editedTodo,
      },
    });

    try {
      const response = await fetch(
        `/api/tasks/${editedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();

      // Replace optimistic version with server version
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: {
          todo: updatedTodo,
        },
      });

      invalidateCache();
    } catch (error) {
      // Roll back to original todo
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: 'Failed to update todo. Please try again.',
        },
      });
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      {isTodoListLoading && (
        <p>Loading todos...</p>
      )}

      {error && (
        <div>
          <p>{error}</p>

          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
              })
            }
          >
            Clear Filter Error
          </button>

          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.RESET_FILTERS,
              })
            }
          >
            Reset Filters
          </button>
        </div>
      )}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}

        // Sorting is handled by the reducer
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

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;