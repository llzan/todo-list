import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';



function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (todoTitle) => {
    const newTodo = {
      id: Date.now(),
      title: todoTitle
    };

    setTodoList(previous => [newTodo, ...previous]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoList todoList={todoList} />
      <TodoForm onAddTodo={addTodo} />
    </div>
  )

}




export default App
