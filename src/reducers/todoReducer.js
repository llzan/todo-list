// reducer /todoReducer.js


export const TODO_ACTIONS = {
    // Fetch Operations (async operations)
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    // Add todo operations (todo mutations)
    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    // Complete todo operations
    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

    // Update todo operations
    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

    // UI operations
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',
};

// Consolidated single state object
// all eight pieces of the state from TodosPage.jsx are now stored in one object

export const initialTodoState = {
    todoList: [],
    error: "",
    isTodoListLoading: true,
    sortBy: "createdAt",
    sortDirection: "asc",
    filterTerm: "",
    dataVersion: 0,
    filterError: "",
};
// the reducer receives the current state and an action
// it returns a new state based on the action type and payload
export function todoReducer(state, action) {
   

    
    switch (action.type) {
        // Fetch operations
        
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: '',
            };
        
        case  TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                todoList: action.payload.todos,
                isTodoListLoading: false,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.FETCH_ERROR:
            if (action.payload.isFilterError) {
                return {
                     ...state,
                     isTodoListLoading: false,
                     error: '',
                    filterError: action.payload.message,
            };
        } 
            return {
                ...state,
                isTodoListLoading: false,
                error: action.payload.message,
                 filterError: '',
    };
        // Add todo operations

        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                todoList: [action.payload.todo, ...state.todoList],
                isTodoListLoading: false,
                error: '',
            };
        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.tempId ? action.payload.todo : todo
                ),
                isTodoListLoading: false,
                error: '',
                dataVersion: state.dataVersion + 1,
            };
        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter((todo) => todo.id !== action.payload.tempId),
                isTodoListLoading: false,
                error: action.payload.message,
            };
        
        // Complete todo operations

        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.id 
                ? { ...todo, isCompleted: true } 
                : todo
                ),
                isTodoListLoading: false,
                error: '',
            };
        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.id ? action.payload.todo : todo),
                isTodoListLoading: false,
                error: '',
                dataVersion: state.dataVersion + 1,
            };
        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.id 
                    ? action.payload.originalTodo 
                    : todo
                ),
                isTodoListLoading: false,
                error: action.payload.message,
                filterError: '',
            };
        
        // Update todo operations

        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.todo.id 
                    ? { ...action.payload.todo } 
                    : todo
                ),
                isTodoListLoading: false,
                error: '',
        
            };
        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.todo.id ? action.payload.todo : todo
                ),
                isTodoListLoading: false,
                error: '',
                dataVersion: state.dataVersion + 1,
            };
        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.id 
                        ? action.payload.originalTodo 
                        : todo
                ),
                isTodoListLoading: false,
                error: action.payload.message,
                filterError: '',

            };
        
        // UI operations

        // SORT
        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload.sortBy,
                sortDirection: action.payload.sortDirection,  
                error: '',
                filterError: '',  
            };
        // FILTER
        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload.filterTerm,
                filterError: '',
            };
        // CLEAR ERROR
        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
            };
        // CLEAR FILTER ERROR
        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: '',
            };
        // RESET FILTERS
        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'createdAt',
                sortDirection: 'asc',
                filterError: '',
                error: '',
            };
        
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

