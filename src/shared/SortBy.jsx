// SortBy component

import styles from './SortBy.module.css';

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className={styles.sortBy}>
      <div className={styles.control}>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.control}>
        <label htmlFor="sortDirection">Order</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
