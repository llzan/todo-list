// URL BASED STATUS FILTERING

import { useSearchParams } from 'react-router';
import styles from './StatusFilter.module.css';

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);

    if (status === 'all') {
      // Remove status parameter for the All Todos view.
      newParams.delete('status');
    } else {
      newParams.set('status', status);
    }

    setSearchParams(newParams);
  };

  return (
    <nav
      className={styles.statusFilter}
      aria-label="Todo status navigation"
    >
      <button
        type="button"
        className={
          currentStatus === 'all'
            ? styles.activeButton
            : styles.button
        }
        onClick={() => handleStatusChange('all')}
        aria-current={
          currentStatus === 'all' ? 'page' : undefined
        }
      >
        All Todos
      </button>

      <button
        type="button"
        className={
          currentStatus === 'active'
            ? styles.activeButton
            : styles.button
        }
        onClick={() => handleStatusChange('active')}
        aria-current={
          currentStatus === 'active' ? 'page' : undefined
        }
      >
        Active Todos
      </button>

      <button
        type="button"
        className={
          currentStatus === 'completed'
            ? styles.activeButton
            : styles.button
        }
        onClick={() => handleStatusChange('completed')}
        aria-current={
          currentStatus === 'completed'
            ? 'page'
            : undefined
        }
      >
        Completed Todos
      </button>
    </nav>
  );
}

export default StatusFilter;
