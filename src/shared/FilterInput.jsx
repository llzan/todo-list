// FilterInput.jsx Component


function FilterInput({ filterTerm, onFilterTextChange }) {

    return (
        <div>
            <label htmlFor="filterInput">Search todos:</label>
            <input
                id="filterInput"
                type="text"
                value={filterTerm}
                onChange={(e) => onFilterTextChange(e.target.value)}
                placeholder="Search by title..."
            />
        </div>
    );
}
export default FilterInput;
