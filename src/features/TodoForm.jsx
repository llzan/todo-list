// TodoForm.jsx (component)

import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../utils/todoValidation';


function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");
    const inputRef = useRef();

    const handleInputChange = (event) => {
    setWorkingTodoTitle(event.target.value);
};

    const handleAddTodo = (event) => {
    event.preventDefault();

    if (isValidTodoTitle(workingTodoTitle)) {
        onAddTodo(workingTodoTitle.trim());
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
            type="text"
            name="todoTitle"
            placeholder="Todo text"
            required
        />

        <button type="submit"disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
        </form>
    );
}

export default TodoForm;