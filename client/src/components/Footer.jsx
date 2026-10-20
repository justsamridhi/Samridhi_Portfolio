import React, { useEffect, useState } from 'react';
import './Footer.scss';

export const Footer = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('guptasamridhi242@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="foot" data-site-footer="">
      <div className="location-clock">
        <span>Jaipur, India {time || '18:54:28'}</span>
      </div>

      <nav className="social-nav" aria-label="Social">
        <a
          href="https://github.com/justsamridhi"
          target="_blank"
          rel="noopener noreferrer"
          className="foot-link"
        >
          <span className="link-icon">🐙</span>
          <span>GitHub</span>
        </a>

        <a
          href="https://www.linkedin.com/in/samridhi-gupta-016b0231b/"
          target="_blank"
          rel="noopener noreferrer"
          className="foot-link"
        >
          <span className="link-icon">in</span>
          <span>LinkedIn</span>
        </a>

        <a href="mailto:guptasamridhi242@gmail.com" className="foot-link">
          <span className="link-icon">✉</span>
          <span>Email</span>
        </a>

        <button
          type="button"
          className="copy-email-btn"
          onClick={handleCopyEmail}
          title="Copy email address"
        >
          <span>{copied ? '✓ Copied' : 'Copy email'}</span>
        </button>
      </nav>
    </footer>
  );
};
