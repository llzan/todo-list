import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
];

function App() {
  const [todolist, setTodolist] = useState(todos);


  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todolist={todolist} />
    </div>
  )

}

export default App
