// Header,jsx

import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>
    </header>
  );
}

export default Header;