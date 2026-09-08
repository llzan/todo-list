// authenticaiton component

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoggingOn(true);
    setAuthError('');

    const result =await login(email, password);

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

export default Logon;