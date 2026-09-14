// PROFILE PAGE

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email, token } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  async function fetchTodoStats() {
    if (!token) return;

    try {
      setLoading(true);
      setError('');

      const options = {
        method: 'GET',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include',
      };

      const response = await fetch('/api/tasks', options);

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const todos = await response.json();

      // Calculate statistics
      
      const total = todos.tasks.length;
      const completed = todos.tasks.filter((todo) => todo.isCompleted).length;
      const active = total - completed;

      setTodoStats({ total, completed, active });
    } catch (err) {
      setError(`Error loading statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  fetchTodoStats();
}, [token]);

  return (
    <main>
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>
        <p>
          <strong>Name:</strong> {email}
        </p>
      </section>

      <section>
        <h2>Todo Statistics</h2>

        {isLoading && <p>Loading statistics...</p>}

        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && (
          <div>
            <p>
              <strong>Total:</strong> {stats.total}
            </p>

            <p>
              <strong>Completed:</strong> {stats.completed}
            </p>

            <p>
              <strong>Active:</strong> {stats.active}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;