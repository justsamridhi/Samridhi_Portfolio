import React, { useState, useEffect, useRef } from 'react';
import { aboutData } from '../data/portfolioData';
import developerImg from '../about/developer_id.png';
import creativeImg from '../about/creative_id.png';
import './About.scss';

export const About = () => {
  const [activeProfile, setActiveProfile] = useState('developer'); // 'developer' | 'creative'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardContainerRef = useRef(null);
  const tabRefs = useRef({});

  const { eyebrow, heading, identityLine, profiles } = aboutData;
  const devProfile = profiles.developer;
  const creativeProfile = profiles.creative;

  const isDev = activeProfile === 'developer';
  const targetProfileName = isDev ? 'Creative_ID.EXE' : 'Developer_ID.EXE';

  // Handle switching profiles with transition guard
  const switchProfile = (profileId) => {
    if (activeProfile === profileId) return;
    setIsTransitioning(true);
    setActiveProfile(profileId);
  };

  // Clear transition lock after 700ms
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  // Tab Keyboard navigation: Left/Right, Up/Down, Home/End
  const handleTabKeyDown = (e, currentId) => {
    const profileKeys = ['developer', 'creative'];
    const currentIndex = profileKeys.indexOf(currentId);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % profileKeys.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + profileKeys.length) % profileKeys.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = profileKeys.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextId = profileKeys[nextIndex];
      switchProfile(nextId);
      if (tabRefs.current[nextId]) {
        tabRefs.current[nextId].focus();
      }
    }
  };

  // Card click handler: ignores text selection and interactive children
  const handleCardClick = (e) => {
    const selection = window.getSelection ? window.getSelection().toString() : '';
    if (selection && selection.length > 0) return;

    const interactiveTarget = e.target.closest('button, a, input, [role="button"], label');
    if (interactiveTarget) return;

    switchProfile(isDev ? 'creative' : 'developer');
  };

  return (
    <section id="about" className="section about-section" aria-label="About Samridhi Gupta">
      <div className="wrap">
        {/* 1. Eyebrow & 2. Heading */}
        <div className="section-head">
          <div className="eyebrow">{eyebrow}</div>
          <h2>{heading}</h2>
        </div>

        {/* 3. Always-visible identity line */}
        <div className="identity-banner" role="note" aria-label="Academic identity">
          <span className="identity-pill">
            <span className="identity-status-dot" aria-hidden="true" />
            {identityLine}
          </span>
        </div>

        {/* 4. Two profile tabs: tablist */}
        <div className="profile-tabs-row">
          <div className="profile-tabs" role="tablist" aria-label="Profile identity modes">
            <button
              ref={(el) => (tabRefs.current.developer = el)}
              type="button"
              role="tab"
              id="tab-developer"
              aria-selected={isDev}
              aria-controls="panel-developer"
              tabIndex={isDev ? 0 : -1}
              className={`profile-tab-btn dev-tab ${isDev ? 'is-active' : ''}`}
              onClick={() => switchProfile('developer')}
              onKeyDown={(e) => handleTabKeyDown(e, 'developer')}
            >
              <span className="tab-marker" aria-hidden="true">■</span>
              <span>{devProfile.tabLabel}</span>
            </button>

            <button
              ref={(el) => (tabRefs.current.creative = el)}
              type="button"
              role="tab"
              id="tab-creative"
              aria-selected={!isDev}
              aria-controls="panel-creative"
              tabIndex={!isDev ? 0 : -1}
              className={`profile-tab-btn creative-tab ${!isDev ? 'is-active' : ''}`}
              onClick={() => switchProfile('creative')}
              onKeyDown={(e) => handleTabKeyDown(e, 'creative')}
            >
              <span className="tab-marker" aria-hidden="true">■</span>
              <span>{creativeProfile.tabLabel}</span>
            </button>
          </div>

          {/* Visible flip button with accessible label naming target profile */}
          <button
            type="button"
            className="btn dark flip-action-btn"
            onClick={() => switchProfile(isDev ? 'creative' : 'developer')}
            aria-label={`Flip card to ${targetProfileName}`}
            title={`Switch to ${targetProfileName}`}
          >
            <span className="flip-icon" aria-hidden="true">↻</span>
            <span>Flip card</span>
          </button>
        </div>

        {/* 5. Interactive Two-Sided ID Card: Displays Complete Artwork PNG Faces */}
        <div
          ref={cardContainerRef}
          className={`id-card-stage ${isDev ? 'show-dev' : 'show-creative'}`}
          onClick={handleCardClick}
          title="Click card to flip profile"
        >
          <div className="id-card-flipper">
            {/* FRONT FACE: Developer_ID.EXE complete card PNG */}
            <div
              className={`id-card-face developer-face ${isDev ? 'is-active-face' : 'is-hidden-face'}`}
              aria-hidden={!isDev}
            >
              <img
                src={developerImg}
                alt="Developer_ID.EXE card: Samridhi Gupta, B.Tech CSE student at JKLU, focus areas Systems, Cloud, Cybersecurity, Software Engineering, AI/ML"
                width="760"
                height="480"
                loading="lazy"
                className="id-card-img"
              />
            </div>

            {/* BACK FACE: Creative_ID.EXE complete card PNG */}
            <div
              className={`id-card-face creative-face ${!isDev ? 'is-active-face' : 'is-hidden-face'}`}
              aria-hidden={isDev}
            >
              <img
                src={creativeImg}
                alt="Creative_ID.EXE card: Samridhi Gupta, creative mode, interests Animation, Romcoms & K-dramas, Fitness, Art, Photography, Nature Walks, tools Figma, Canva, Adobe Creative Suite, Stitch, Lovable"
                width="760"
                height="480"
                loading="lazy"
                className="id-card-img"
              />
            </div>
          </div>
        </div>

        {/* 6. Selectable Profile Overview Block & Written Content Panels */}
        <div className="about-panels-stage">
          {/* DEVELOPER PANEL */}
          <div
            id="panel-developer"
            role="tabpanel"
            aria-labelledby="tab-developer"
            hidden={!isDev}
            className={`written-panel developer-panel ${isDev ? 'is-visible' : ''}`}
          >
            <div className="panel-sections-stack">
              {/* Selectable Profile Overview Block */}
              <div className="panel-block card profile-overview-card dev-profile-card">
                <div className="block-head">
                  <span className="section-dot sage-dot" aria-hidden="true" />
                  <h3 className="block-title">Developer Profile Overview</h3>
                  <span className="role-strip-badge">{devProfile.card.roleStrip}</span>
                </div>

                <div className="profile-chips-layout">
                  {/* Focus Areas */}
                  <div className="chips-group">
                    <div className="chips-group-label">// FOCUS AREAS</div>
                    <ul className="chips-list" aria-label="Core focus areas">
                      {devProfile.card.focusChips.map((chip) => (
                        <li key={chip} className="profile-chip focus-chip">
                          <span className="chip-pixel-dot" aria-hidden="true" />
                          <span>{chip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Verified Technologies */}
                  <div className="chips-group">
                    <div className="chips-group-label">// TECHNOLOGIES</div>
                    <ul className="chips-list" aria-label="Verified technologies">
                      {devProfile.card.techChips.map((tech) => (
                        <li key={tech} className="profile-chip tech-chip">
                          <span className="chip-pixel-dot" aria-hidden="true" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Research & Engineering */}
              <div className="panel-block card">
                <div className="block-head">
                  <span className="section-dot sage-dot" aria-hidden="true" />
                  <h3 className="block-title">{devProfile.written.research.title}</h3>
                </div>
                <p className="block-intro">{devProfile.written.research.intro}</p>
                <div className="research-items-grid">
                  {devProfile.written.research.items.map((res) => (
                    <div key={res.role} className="research-card">
                      <div className="research-role">{res.role}</div>
                      <div className="research-org">{res.org}</div>
                      <p className="research-details">{res.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How I Work & Engineering Direction */}
              <div className="panel-two-col">
                {/* How I Work */}
                <div className="panel-block card">
                  <div className="block-head">
                    <span className="section-dot sage-dot" aria-hidden="true" />
                    <h3 className="block-title">{devProfile.written.howIWork.title}</h3>
                  </div>
                  <div className="work-values-list">
                    {devProfile.written.howIWork.items.map((item) => (
                      <div key={item.title} className="work-val-item">
                        <strong className="val-title">{item.title}</strong>
                        <p className="val-text">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engineering Direction */}
                <div className="panel-block card">
                  <div className="block-head">
                    <span className="section-dot sage-dot" aria-hidden="true" />
                    <h3 className="block-title">{devProfile.written.direction.title}</h3>
                  </div>
                  <p className="direction-text">{devProfile.written.direction.text}</p>
                </div>
              </div>

              {/* 7. Compact Facts Row (Semantic DL) */}
              <div className="panel-block card facts-block">
                <div className="block-head">
                  <span className="section-dot sage-dot" aria-hidden="true" />
                  <h4 className="facts-heading">Quick Facts</h4>
                </div>
                <dl className="compact-facts-grid">
                  {devProfile.written.facts.map((fact) => (
                    <div key={fact.label} className="fact-unit">
                      <dt className="fact-label">{fact.label}</dt>
                      <dd className="fact-value">{fact.val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* CREATIVE PANEL */}
          <div
            id="panel-creative"
            role="tabpanel"
            aria-labelledby="tab-creative"
            hidden={isDev}
            className={`written-panel creative-panel ${!isDev ? 'is-visible' : ''}`}
          >
            <div className="panel-sections-stack">
              {/* Selectable Profile Overview Block */}
              <div className="panel-block card profile-overview-card creative-profile-card">
                <div className="block-head">
                  <span className="section-dot orange-dot" aria-hidden="true" />
                  <h3 className="block-title">Creative Profile Overview</h3>
                  <span className="role-strip-badge">CREATIVE · STORYTELLER · EXPLORER</span>
                </div>

                <div className="profile-chips-layout">
                  {/* Creative Interests */}
                  <div className="chips-group">
                    <div className="chips-group-label">// INTERESTS</div>
                    <ul className="chips-list" aria-label="Creative interests">
                      {creativeProfile.card.interests.map((interest) => (
                        <li key={interest} className="profile-chip creative-chip">
                          <span className="chip-pixel-dot" aria-hidden="true" />
                          <span>{interest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Creative Tools */}
                  <div className="chips-group">
                    <div className="chips-group-label">// TOOLS</div>
                    <ul className="chips-list" aria-label="Creative tools">
                      {creativeProfile.card.tools.map((tool) => (
                        <li key={tool} className="profile-chip tool-chip">
                          <span className="chip-pixel-dot" aria-hidden="true" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Creative Narrative */}
              <div className="panel-block card creative-intro-card">
                <div className="block-head">
                  <span className="section-dot orange-dot" aria-hidden="true" />
                  <h3 className="block-title">Visual Storytelling & Expression</h3>
                </div>
                <p className="creative-main-paragraph">
                  {creativeProfile.written.paragraph}
                </p>

                <div className="creative-supporting-line">
                  <strong className="supporting-title">
                    {creativeProfile.written.howIWork.title}:
                  </strong>
                  <span className="supporting-text">
                    {" "}{creativeProfile.written.howIWork.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
