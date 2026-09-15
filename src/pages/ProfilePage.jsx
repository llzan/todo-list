// PROFILE PAGE

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfilesPage.module.css';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        const tasks = data.tasks || [];

        const total = tasks.length;

        const completed = tasks.filter(
          (todo) => todo.isCompleted
        ).length;

        const active = total - completed;

        setTodoStats({
          total,
          completed,
          active,
        });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage =
    todoStats.total > 0
      ? Math.round(
          (todoStats.completed / todoStats.total) * 100
        )
      : 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>
          View your account information and todo activity.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Account Information
        </h2>

        <div className={styles.accountInfo}>
          <div className={styles.avatar} aria-hidden="true">
            {email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className={styles.email}>{email}</p>
            <p className={styles.status}>
              <span className={styles.statusDot} />
              Authenticated
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Todo Statistics
            </h2>
            <p className={styles.sectionDescription}>
              A summary of your current tasks.
            </p>
          </div>
        </div>

        {loading && (
          <p className={styles.message}>
            Loading statistics...
          </p>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>
                  {todoStats.total}
                </span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Active</span>
                <span className={styles.statValue}>
                  {todoStats.active}
                </span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Completed</span>
                <span className={styles.statValue}>
                  {todoStats.completed}
                </span>
              </div>
            </div>

            <div className={styles.completion}>
              <div className={styles.completionHeader}>
                <span>Completion</span>
                <strong>{completionPercentage}%</strong>
              </div>

              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Todo completion"
              >
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;