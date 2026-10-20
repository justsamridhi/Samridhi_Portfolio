import React, { useState, useEffect, useRef } from 'react';
import { skillsData } from '../data/portfolioData';
import './Skills.scss';

export const Skills = () => {
  const [activeTab, setActiveTab] = useState(0);
  const skillsRef = useRef(null);

  // Animate skill bars when the section scrolls into view
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.meter-bar').forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) bar.style.width = width + '%';
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section skills-section" ref={skillsRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Technical Competencies</div>
          <h2>Skills &amp; Expertise</h2>
          <p className="section-sub muted">
            Structured by practical application and computer science foundations. Hover over any skill to see its context.
          </p>
        </div>
        {/* Category Tabs */}
        <div className="category-tabs" role="tablist" aria-label="Skill categories">
          {skillsData.map((cat, idx) => (
            <button
              key={cat.category}
              role="tab"
              aria-selected={activeTab === idx}
              className={`cat-btn ${activeTab === idx ? 'is-active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <img src={cat.icon} alt="" aria-hidden="true" className="cat-icon" />
              <span>{cat.category}</span>
            </button>
          ))}
        </div>
        {/* Active Category Skills */}
        <div className="skills-card card" role="tabpanel">
          <div className="cat-title-row">
            <img src={skillsData[activeTab].icon} alt="" aria-hidden="true" className="header-icon" />
            <h3>{skillsData[activeTab].category}</h3>
          </div>
          <div className="skills-list">
            {skillsData[activeTab].items.map((skill) => (
              <div
                key={skill.name}
                className="skill-item"
                data-tip={skill.desc}
                tabIndex="0"
              >
                <div className="skill-meta">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`tier-badge ${skill.tier}`}>{skill.tier}</span>
                </div>
                <div className="meter-track">
                  <div
                    className={`meter-bar ${skill.tier}`}
                    data-width={skill.level}
                    style={{ width: `${skill.level}%` }}
                    aria-label={`${skill.name} proficiency level`}
                  />
                </div>
                <div className="skill-desc-inline">{skill.desc}</div>
              </div>
            ))}
          </div>
          <div className="skills-legend">
            <span className="legend-item"><span className="dot core" /> Core Production Competency</span>
            <span className="legend-item"><span className="dot comfortable" /> Solid Practical Application</span>
            <span className="legend-item"><span className="dot exploring" /> Specialized Research / Exploring</span>
          </div>
        </div>
      </div>
    </section>
  );
};
