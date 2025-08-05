import React, { useEffect, useState } from 'react';

function NightModeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      className="fixed top-4 right-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow z-50"
      onClick={() => setDark(d => !d)}
    >
      {dark ? '🌙 Night Mode' : '☀️ Day Mode'}
    </button>
  );
}

export default NightModeToggle;