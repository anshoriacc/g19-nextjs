import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button } from 'antd';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const onClick = useCallback(
    () => (theme === 'dark' ? setTheme('light') : setTheme('dark')),
    [setTheme, theme]
  );

  return (
    <Button
      title="toggle theme"
      icon={
        theme === 'dark' ? (
          <FaMoon className="text-blue-500" />
        ) : (
          <FaSun className="text-yellow-400" />
        )
      }
      onClick={onClick}
    />
  );
}
