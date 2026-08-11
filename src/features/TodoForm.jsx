// TodoForm.jsx (component)

import { useRef } from "react";
import { useState } from "react";


function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");
    const inputRef = useRef();

    const handleInputChange = (event) => {
    setWorkingTodoTitle(event.target.value);
};

    const handleAddTodo = (event) => {
        event.preventDefault();
    
        const todoTitle = workingTodoTitle.trim();
        if (todoTitle) {
            onAddTodo(todoTitle);
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }   
};

return (
    <form onSubmit={handleAddTodo}>
    <label htmlFor="todoTitle">Todo</label>
    <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={'Todo text'}
        value={workingTodoTitle}
        onChange={handleInputChange}
        required
    />  

    <button 
    type="submit" 
    disabled={!workingTodoTitle.trim()}
    >
     Add Todo
    </button>
    </form>
    );
}

export default TodoForm;
