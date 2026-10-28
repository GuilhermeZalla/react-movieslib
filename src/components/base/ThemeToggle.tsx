import IconButton from './IconButton';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton label={`Alternar para tema ${next}`} onClick={onToggle}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
