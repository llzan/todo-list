// Header,jsx

import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>
      {isAuthenticated && <p>Logged in</p>}
    </header>
  );
}

export default Header;