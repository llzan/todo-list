import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const [authError, setAuthError] = useState('');

  const handleLogout = async () => {
    setAuthError('');

    const result = await logout();

    if (!result.success) {
      setAuthError(result.error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>
        Log Off
      </button>

      {authError && <p role="alert">{authError}</p>}
    </div>
  );
}

export default Logoff;