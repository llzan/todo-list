// SortBy component

function SortBy({
    sortBy,
    sortDirection,
    onSortByChange,
    onSortDirectionChange,
  }) {
    return (
      <div className="sort-by">
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>

        <label htmlFor="sortDirection">Order</label>
        <select
          id="sort-direction"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    );
  }

  export default SortBy;
