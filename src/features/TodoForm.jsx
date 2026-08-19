// TodoForm.jsx (component)

import { useRef } from 'react';
import { useState } from 'react';
import { TextInputWithLabel } from  './shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../utils/todoValidation';


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
    <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={handleInputChange}
        
    />
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
    disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
    </form>
    );
}

export default TodoForm;
