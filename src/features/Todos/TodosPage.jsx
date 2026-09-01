import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import { useState, useEffect } from 'react';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';
import { useCallback } from 'react';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTododListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');


  const handleFilterChange = (newTerm) => {setFilterTerm(newTerm);};
  

  const invalidateCache = useCallback(() => {
    
    setDataVersion((prevVersion) => prevVersion + 1);
  }, []);



  useEffect(() => {
    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');

      try {
        
        const paramsObject= {
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
        setTodoList(data.tasks);
        setFilterError('');
      } 
        catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (todoTitle) => {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
   

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
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === newTodo.id ? savedTodo : todo
        )
      );
      invalidateCache();

    } catch (error) {
      
      setTodoList((previous) =>
        previous.filter((todo) => todo.id !== newTodo.id)
      );

      setError('Failed to add todo. Please try again.');
    }
  };

  const completeTodo = async (id) => {
    
    const originalTodo = todoList.find((todo) => todo.id === id);

    
    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );

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

      
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
      invalidateCache();

    } catch (error) {
   
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError('Failed to complete todo. Please try again.');
    }
  };

  const updateTodo = async (editedTodo) => {
   
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

   
    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === editedTodo.id
          ? { ...editedTodo }
          : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
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
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();

     
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === editedTodo.id ? updatedTodo : todo
        )
      );
      invalidateCache();

    } catch (error) {
    
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );

      setError('Failed to update todo. Please try again.');
    }
  };

 return (
  <div>
    <h1>Todo List</h1>

    {isTodoListLoading && <p>Loading todos...</p>}

    {error && (
      <div>
        <p>{error}</p>
        <button onClick={() => setError('')}>
          Clear Error
        </button>
      </div>
    )}
    {filterError && (
      <div>
        <p>{filterError}</p>

        <button onClick={() => setFilterError('')}>
          Clear Filter Error
        </button>

        <button
          onClick={() => {
            setFilterTerm('');
            setSortBy('createdAt');
            setSortDirection('desc');
            setFilterError('');
          }}
        >
          Reset Filters
        </button>
      </div>
    )}


    <SortBy
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={setSortBy}
      onSortDirectionChange={setSortDirection}
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