import { useTheme } from '../../context/ThemeContext';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import './styles.scss';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  const currentIndex = themes.indexOf(theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  return (
    <div className="theme-switcher-container">
      <button className="theme-switcher-button" onClick={() => setTheme(nextTheme)}>
        {theme === 'dark' ? <Brightness5Icon /> : <DarkModeIcon />}
      </button>
    </div>
  );
}
