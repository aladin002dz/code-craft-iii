import { useState } from 'react';

export default function SettingsPanel() {
  const [isDark, setIsDark] = useState(false);

  function handleToggle() {
    // TODO: switch the theme when the button is clicked.
  }

  return (
    <section className={isDark ? 'panel dark' : 'panel light'}>
      <h2>Appearance</h2>
      <p>Choose how your workspace looks.</p>
      <button onClick={handleToggle}>
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </button>
    </section>
  );
}
