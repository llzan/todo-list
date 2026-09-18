// LOGIN PAGE

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 100;

function validateLogin(email, password) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return 'Please enter your email address.';
  }

  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return `Email address must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
  }

  if (!password) {
    return 'Please enter your password.';
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }

  return '';
}

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

    setAuthError('');

    // Client-side validation
    const validationError = validateLogin(email, password);

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setIsLoggingOn(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        // Use a generic message instead of exposing
        // backend/system error details to the user.
        setAuthError(
          'Unable to log in. Please check your email and password.'
        );
      }
    } catch (error) {
      // Keep technical error details out of the UI.
      console.error('Login failed:', error);

      setAuthError(
        'Unable to log in. Please try again.'
      );
    } finally {
      setIsLoggingOn(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>

          <p className={styles.subtitle}>
            Log in to manage your todos.
          </p>
        </div>

        {authError && (
          <p className={styles.error} role="alert">
            {authError}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="email"
            >
              Email
            </label>

            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={authError ? 'login-error' : undefined}
            />
          </div>

          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="password"
            >
              Password
            </label>

            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              required
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={authError ? 'login-error' : undefined}
            />
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isLoggingOn}
          >
            {isLoggingOn
              ? 'Logging in...'
              : 'Log In'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;

