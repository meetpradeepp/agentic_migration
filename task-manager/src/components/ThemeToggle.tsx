import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

/**
 * ThemeToggle component for switching between light and dark modes
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <span className="theme-toggle__icon" role="img" aria-label="Moon">
          🌙
        </span>
      ) : (
        <span className="theme-toggle__icon" role="img" aria-label="Sun">
          ☀️
        </span>
      )}
    </button>
  );
}
