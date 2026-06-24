
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
