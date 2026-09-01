import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import { useState, useEffect } from 'react';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTododListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          limit: 100,
        });

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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

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

    <TodoForm onAddTodo={addTodo} />

    <TodoList
      todoList={todoList}
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
    />
  </div>
);
}

export default TodosPage;