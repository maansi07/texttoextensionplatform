import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="searchbar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--text-muted)" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        className="searchbar-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
      />
    </div>
  );
}
Create src/components/SearchBar.css:
css.searchbar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  width: 100%;
  max-width: 320px;
  transition: border-color 0.2s;
}

.searchbar:focus-within {
  border-color: var(--accent-cyan);
}

.searchbar-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  width: 100%;
}

.searchbar-input::placeholder {
  color: var(--text-muted);
}