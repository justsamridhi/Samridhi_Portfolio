import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.scss';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [motionOn, setMotionOn] = useState(() => {
    return localStorage.getItem('samridhi-motion') !== 'false';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMotion = () => {
    const nextState = !motionOn;
    setMotionOn(nextState);
    localStorage.setItem('samridhi-motion', String(nextState));
    document.documentElement.setAttribute('data-reduced-motion', nextState ? 'false' : 'true');
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Resume', href: '#resume' },
    { label: 'Creative Corner', href: '#creative-corner' },
    { label: 'Guestbook', href: '#guestbook' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="top" data-site-header="">
      <a className="mark" href="#hero" aria-label="Samridhi Gupta, home">
        <span className="logo-s">S</span><span className="logo-g">G</span>
      </a>

      <nav className={`nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.href}
            className="nav-link"
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className="tools">
        <button
          type="button"
          className={`tool motion-toggle ${motionOn ? 'is-active' : ''}`}
          onClick={toggleMotion}
          aria-label={motionOn ? 'Turn motion off' : 'Turn motion on'}
          title="Toggle animation motion"
        >
          {motionOn ? 'Motion on' : 'Motion off'}
        </button>

        <button
          type="button"
          className="tool theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'day desk' : 'night desk'} mode`}
          title={`Switch to ${theme === 'dark' ? 'day desk' : 'night desk'} mode`}
        >
          {theme === 'dark' ? 'Day desk' : 'Night desk'}
        </button>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};
