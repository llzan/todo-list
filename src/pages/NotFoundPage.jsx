// NOT FOUND PAGE

import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <p>Here are some places you can go:</p>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </main>
  );
}

export default NotFoundPage;
