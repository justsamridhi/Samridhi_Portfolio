import React, { useEffect, useState, useRef } from 'react';
import './Hero.scss';

export const Hero = () => {
  // Avatar reveal animation on scroll
  const avatarRef = useRef(null);
  useEffect(() => {
    const avatarEl = avatarRef.current;
    if (!avatarEl) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          avatarEl.classList.add('reveal');
          observer.unobserve(avatarEl);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(avatarEl);
    return () => observer.disconnect();
  }, []);
  // Witty quotes list with quotation marks
  const devQuotes = [
    '"the universe runs on questionable code"',
    '"currently debugging my life.exe"',
    '"coffee in, ideas out"',
    '"404: boring ideas not found"',
    '"somewhere between art and algorithms"',
    '"reality needs a better interface"',
    '"sudo make it beautiful"',
    '"one more idea before I sleep"',
    '"pixels with a purpose"',
    '"it worked on my machine :)"'
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayQuote, setDisplayQuote] = useState(devQuotes[0]);
  const [asciiPhase, setAsciiPhase] = useState(false);

  // Terminal quote cycle with brief ASCII reveal
  useEffect(() => {
    const isMotionOff = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    if (isMotionOff) {
      setDisplayQuote(devQuotes[0]);
      return;
    }

    const asciiChars = ['#', '/', ':', '.', '+', '_', '%', '*', '~', '^'];
    const interval = setInterval(() => {
      const nextIndex = (quoteIndex + 1) % devQuotes.length;
      setQuoteIndex(nextIndex);
      const target = devQuotes[nextIndex];

      // Quick 350ms ASCII glitch transition before resolving
      setAsciiPhase(true);
      let frames = 0;
      const glitch = setInterval(() => {
        frames++;
        const scrambled = target
          .split('')
          .map(ch => (ch === ' ' || ch === '"' ? ch : asciiChars[Math.floor(Math.random() * asciiChars.length)]))
          .join('');
        setDisplayQuote(scrambled);

        if (frames > 4) {
          clearInterval(glitch);
          setDisplayQuote(target);
          setAsciiPhase(false);
        }
      }, 70);
    }, 5500);

    return () => clearInterval(interval);
  }, [quoteIndex]);

  return (
    <section id="hero" className="hero-section">
      <div className="wrap hero-grid">
        {/* Left Column: Typography & CTAs */}
        <div className="hero-content">
          <h1 className="hero-name">
            <span className="name-line">Samridhi</span>
            <span className="name-line">Gupta</span>
          </h1>

          <p className="hero-tagline">
            I build practical technology and explore the systems behind it.
          </p>

          {/* Terminal-style quote highlight with orange > and visible quotes */}
          <div className="terminal-quote-box" aria-live="polite">
            <span className="quote-prompt">&gt;</span>
            <span className={`quote-text ${asciiPhase ? 'ascii-scramble' : ''}`}>
              {displayQuote}
            </span>
            <span className="quote-caret" aria-hidden="true">|</span>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="btn sage hero-cta">
              <span>View projects</span>
            </a>
            <a
              href="/documents/Resume.pdf"
              download="Samridhi_Gupta_Resume.pdf"
              className="btn cream hero-cta"
            >
              <span>Download CV</span>
            </a>
            <a href="#contact" className="btn dark hero-cta">
              <span>Get in touch ↗</span>
            </a>
          </div>
        </div>

        {/* Right Column: Layered Cozy Pixel Workspace Illustration with Interactive Hover & Navigation */}
        <div className="hero-workspace">
          <div className="workspace-stage">
            {/* Top Wooden Shelf with Plant, Tech Books, Stickered Laptop, Mug, and Sleeping Calico Cat */}
            <a
              href="#about"
              className="interactive-art shelf-layer"
              title="Creative Workspace: DSA, Systems, Cybersecurity, AI/ML & sleeping cat"
              aria-label="Workspace shelf: jump to About section"
            >
              <img
                src="/assets/samridhi_ui_workspace_assets/01_workspace_shelf_cat_laptop.png"
                alt="Workspace shelf with tech books, stickered laptop, mug, and sleeping cat"
                className="shelf-img"
              />
              <span className="art-tooltip">My Creative Desk • View About</span>
            </a>

            {/* Asymmetric Muted Olive Arch Backdrop */}
            <div className="arch-backdrop" aria-hidden="true" />

            {/* Main Character Avatar standing in the center */}
            <div className="avatar-wrapper" title="Samridhi Gupta">
              <img
                src="/assets/samridhi_individual_avatar_poses/01_pose_standing.png"
                alt="Samridhi Gupta pixel art avatar"
                className="avatar-standing-img"
              />
              <div className="avatar-scanline-fade" aria-hidden="true" />
            </div>

            {/* Status Speech Bubble on Top-Right */}
            <a
              href="#projects"
              className="status-bubble-card"
              title="Currently building: APK-Xray, SkillSwap & Aves Migration"
              aria-label="Status: Currently building cool things. View Projects"
            >
              <span className="live-dot" aria-hidden="true" />
              <span>Currently building cool things ...</span>
            </a>

            {/* Taped Sunset Polaroid on Left */}
            <a
              href="#creative-corner"
              className="interactive-art sticker-polaroid-sunset"
              title="good code brighter days • View Creative Corner"
              aria-label="Sunset polaroid photo: jump to Creative Corner"
            >
              <img
                src="/assets/samridhi_ui_workspace_assets/09_polaroid_sunset.png"
                alt="Sunset polaroid reading good code brighter days"
              />
              <span className="art-tooltip">Golden Hour View</span>
            </a>

            {/* Retro Instant Camera beneath Polaroid */}
            <a
              href="#creative-corner"
              className="interactive-art sticker-camera"
              title="Analog Photography • View Creative Corner"
              aria-label="Retro instant camera: jump to Creative Corner"
            >
              <img
                src="/assets/samridhi_ui_workspace_assets/27_retro_camera.png"
                alt="Retro instant camera"
              />
              <span className="art-tooltip">Instant Camera</span>
            </a>

            {/* Small Painting Avatar at Easel */}
            <a
              href="#creative-corner"
              className="interactive-art sticker-painting-avatar"
              title="Painting at Easel • View Creative Corner"
              aria-label="Painting avatar at easel: jump to Creative Corner"
            >
              <img
                src="/assets/samridhi_individual_avatar_poses/07_pose_painting_canvas.png"
                alt="Mini avatar painting on easel"
              />
              <span className="art-tooltip">Art Studio</span>
            </a>

            {/* Checklist Sticky Note on Right */}
            <a
              href="#skills"
              className="interactive-art sticker-checklist"
              title="Daily Checklist: Build, Learn, Explore, Grow • View Skills"
              aria-label="Checklist note: jump to Skills section"
            >
              <img
                src="/assets/samridhi_ui_workspace_assets/12_build_learn_checklist.png"
                alt="Checklist note: Build, Learn, Explore, Grow"
              />
              <span className="art-tooltip">Core Principles</span>
            </a>

            {/* Floating Dark Contact Invitation */}
            <a
              href="#contact"
              className="floating-buddy-pill"
              aria-label="Contact invitation: Need a buddy? Get in touch"
              title="Let's build together! Send a message"
            >
              <span className="buddy-eyebrow">Need a buddy?</span>
              <span className="buddy-link">Get in touch ↗</span>
            </a>

            {/* Sleeping German Shepherd Puppy by Coffee Mug */}
            <div
              className="interactive-art sticker-sleeping-dog"
              title="Resting German Shepherd pup: quiet moments"
              tabIndex="0"
              role="img"
              aria-label="Sleeping puppy resting near coffee mug"
            >
              <img
                src="/assets/samridhi_ui_workspace_assets/02_sleeping_german_shepherd.png"
                alt="Sleeping German Shepherd pet beside mug"
              />
              <span className="art-tooltip">Zzz...</span>
            </div>
          </div>

          <p className="workspace-caption">
            A little corner for code, curiosity, and creating things by hand.
          </p>
        </div>
      </div>
    </section>
  );
};
