# Lay Lay's CTD Todo Application Project

A productivity management application built with React that allows users to create, organize, search, filter, and manage todo items.

The application includes user authentication, protected pages, client-side validation, responsive styling, and a profile dashboard with todo statistics.

This project demonstrates proficiency in React hooks, state management, component architecture, accessibility, responsive design, and reusable styling.

## Live Demo

**Status:** Not currently deployed.

A live demo link will be added here once the application is deployed.

## Features

- User registration and authentication
- Protected pages for authenticated users
- Create todo items
- Mark todo items as completed
- View active and completed todos
- Search todos by title
- Sort todos by available sorting options
- Filter todos by status
- Optimistic UI updates for todo actions
- Loading states
- Error handling for failed API requests
- Empty states when no todos are available
- Responsive interface for desktop and mobile devices
- Client-side validation for todo titles
- Maximum length validation for user input
- Profile page with todo statistics
- Completion percentage calculation
- Consistent application-wide design using CSS variables

## Technologies Used

- React 18
- React Router
- JavaScript
- CSS Modules
- CSS Variables
- Context API
- React `useReducer`
- React Hooks
- Vite

## Screenshots

### Desktop

#### Login Page

![Todo App Login](./screenshots/LoginPage.png)

#### Todo List Page

![Todo App Todo List](./screenshots/TodoListPage.png)

#### About Page

![Todo App About](./screenshots/AboutPage.png)

#### Profile Page

![Todo App Profile](./screenshots/ProfilePage.png)

### Mobile

#### Login Page

![Todo App Login Mobile](./screenshots/LoginPage-iPhone.png)

#### Todo List Page

![Todo App Todo List Mobile](./screenshots/TodoListPage-iPhone.png)

#### About Page

![Todo App About Mobile](./screenshots/AboutPage-iPhone.png)

#### Profile Page

![Todo App Profile Mobile](./screenshots/ProfilePage-iPhone.png)

## Getting Started

### Prerequisites

Before running the application locally, make sure you have the following installed:

- Node.js
- npm
- Git

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/llzan/todo-list
```

2. Navigate to the project directory:

```bash
cd todo-list
```

3. Install the project dependencies:
    
```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local development URL provided by Vite in your browser: [http://localhost:3001/](http://localhost:5173) 


## Available Scripts

The following npm scripts are available through `package.json`.

### `npm run dev`

Starts the Vite development server for local development.

### `npm run build`

Creates an optimized production build of the application.

### `npm run preview`

Runs the production build locally so it can be tested before deployment.

## Design Decisions

### Styling Approach

The application uses a consistent design system build around reusable CSS variables and CSS Modules.

- Global colors, spacing, typography, borders, border radii, shadows, and transitions are defined in `variables.css`.
- CSS variables help maintain consistent styling across pages and components.
- CSS Modules keep component styles scoped and reduce the possibility of unintended CSS conflicts.
- Reusable styling patterns are used for buttons, form controls, navigation, todo items, and application states.

### Visual Style

The application uses a modern and minimal visual style to keep the interface organized and focused.

- Light and clean background
- White surface cards
- Green primary and accent colors
- Muted secondary text for visual hierarchy
- Subtle borders
- Soft shadows
- Rounded corners
- Consistent spacing
- Clear typography hierarchy
- Responsive layouts for desktop and mobile devices

The green color palette was inspired by the green check emoji and reinforces the application's task-completion theme.

### Accessibility and UX

Accessibility and usability were considered throughout the application.

- Form inputs have associated labels.
- Validation errors are communicated to users.
- Keyboard focus indicators are provided for interactive elements.
- Interactive controls use touch-friendly sizing.
- Loading, error, and empty states provide feedback during different application states.
- Text input fields have maximum length limits.
- Responsive layouts support different screen sizes.
- Buttons include hover and disabled states where appropriate.

The overall goal was to create a simple interface that keeps the user's focus on managing tasks while providing clear feedback and predictable interactions.

## Future Improvements

If I had additional development time, I would consider adding:

- Todo deletion functionality
- Todo due dates or calendar integration
- Todo categories
- Dark mode
- Profile editing and customization
- A more whimsical and playful visual design

## License 

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


## Contact Information

GitHub Profile: https://github.com/llzan
GitHub Repository: https://github.com/llzan?tab=repositories

