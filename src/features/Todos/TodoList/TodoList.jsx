// TodoList component

import { useMemo } from 'react';
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

const TodoList = ({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  statusFilter = 'all',
}) => {
  const filteredTodoList = useMemo(() => {
    switch (statusFilter) {
      case 'completed':
        return todoList.filter((todo) => todo.isCompleted);

      case 'active':
        return todoList.filter((todo) => !todo.isCompleted);

      case 'all':
      default:
        return todoList;
    }
  }, [todoList, statusFilter]);

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

  if (filteredTodoList.length === 0) {
    return (
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
    );
  }

  return (
    <ul className={styles.todoList}>
      {filteredTodoList.map((todo) => (
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
