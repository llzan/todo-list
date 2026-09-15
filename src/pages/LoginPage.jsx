// LOGIN PAGE

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from protected route redirect.
  // Default to /todos if there is no intended destination.
  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Redirect if already authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {authError && <p role="alert">{authError}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? 'Logging in...' : 'Log On'}
      </button>
    </form>
  );
}

export default LoginPage;