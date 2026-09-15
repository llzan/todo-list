// TodoList component

import TodoListItem from './TodoListItem';
import { useMemo } from 'react';
import styles from './TodoList.module.css';

const TodoList = ({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = 'all',
}) => {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;

    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter(
          (todo) => todo.isCompleted
        );
        break;

      case 'active':
        filteredTodos = todoList.filter(
          (todo) => !todo.isCompleted
        );
        break;

      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';

      case 'active':
        return 'No active todos. Add a todo above to get started.';

      case 'all':
      default:
        return 'Add a todo above to get started.';
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <div className={styles.emptyState}>
      <div
        className={styles.emptyIcon}
        aria-hidden="true"
      >
        ✓
      </div>

      <h3>No todos here</h3>

      <p>{getEmptyMessage()}</p>
    </div>
  ) : (
    <ul className={styles.todoList}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;