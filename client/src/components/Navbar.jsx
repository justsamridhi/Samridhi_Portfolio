import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.scss';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [motionOn, setMotionOn] = useState(() => {
    return localStorage.getItem('samridhi-motion') !== 'false';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const moreRef = useRef(null);

  const toggleMotion = () => {
    const nextState = !motionOn;
    setMotionOn(nextState);
    localStorage.setItem('samridhi-motion', String(nextState));
    document.documentElement.setAttribute('data-reduced-motion', nextState ? 'false' : 'true');
  };

  const primaryLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Guestbook', href: '#guestbook', id: 'guestbook' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const moreLinks = [
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    { label: 'Resume', href: '#resume', id: 'resume' },
    { label: 'Creative Corner', href: '#creative-corner', id: 'creative-corner' },
  ];

  const allMobileLinks = [
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

  const headerRef = useRef(null);

  // Close "More" dropdown and mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [moreOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [mobileMenuOpen]);

  // Scroll-spy with IntersectionObserver
  useEffect(() => {
    const sectionIds = [
      'about',
      'skills',
      'projects',
      'experience',
      'achievements',
      'resume',
      'creative-corner',
      'guestbook',
      'contact',
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-70px 0px -55% 0px',
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler accounting for ~64px header offset
  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setMoreOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 64;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      const isMotionOff = document.documentElement.getAttribute('data-reduced-motion') === 'true';
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: isMotionOff ? 'auto' : 'smooth',
      });
      window.history.pushState(null, '', href);
    }
  };

  const isMoreActive = moreLinks.some((l) => l.id === activeSection);

  return (
    <header className="top" data-site-header="" ref={headerRef}>
      {/* Left region: Logo */}
      <a
        className="mark"
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          const isMotionOff = document.documentElement.getAttribute('data-reduced-motion') === 'true';
          window.scrollTo({
            top: 0,
            behavior: isMotionOff ? 'auto' : 'smooth',
          });
        }}
        aria-label="Samridhi Gupta, home"
      >
        <span className="logo-s">S</span>
        <span className="logo-g">G</span>
      </a>

      {/* Centre region: One row, no wrapping, plain text navigation */}
      <nav className="nav desktop-nav" aria-label="Primary navigation">
        {primaryLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`nav-link ${activeSection === link.id ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, link.href)}
          >
            {link.label}
          </a>
        ))}

        {/* More dropdown */}
        <div className="more-dropdown-wrap" ref={moreRef}>
          <button
            type="button"
            className={`nav-link more-trigger ${isMoreActive ? 'is-active' : ''} ${moreOpen ? 'is-open' : ''}`}
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-haspopup="true"
            aria-label="More sections"
          >
            <span>More</span>
            <span className="more-arrow" aria-hidden="true">▾</span>
          </button>

          {moreOpen && (
            <div className="more-menu" role="menu" aria-label="Additional sections">
              {moreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={`more-item ${activeSection === link.id ? 'is-active' : ''}`}
                  onClick={(e) => scrollToSection(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Right region: Labelled pill toggle buttons (Motion and Theme) + Mobile hamburger */}
      <div className="tools">
        <button
          type="button"
          className={`tool motion-toggle ${motionOn ? 'is-active' : ''}`}
          onClick={toggleMotion}
          aria-pressed={motionOn}
          title={motionOn ? 'Turn motion off' : 'Turn motion on'}
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
          aria-expanded={mobileMenuOpen}
        >
          <span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile drawer with all links */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
        {allMobileLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`mobile-nav-link ${activeSection === link.href.replace('#', '') ? 'is-active' : ''}`}
            onClick={(e) => scrollToSection(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};
