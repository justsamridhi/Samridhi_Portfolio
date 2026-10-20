import React from 'react';
import { timelineData } from '../data/portfolioData';
import './Experience.scss';

export const Experience = () => {
  return (
    <section id="experience" className="section experience-section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Academic & Research Journey</div>
          <h2>Education & Experience</h2>
          <p className="section-sub muted">
            Verified timeline detailing university coursework, government cybersecurity research (MNIT ISEA-III), and deepfake forensics (LNMIIT LUSIP).
          </p>
        </div>

        <div className="timeline-container card">
          <ul className="timeline">
            {timelineData.map((item, idx) => (
              <li key={idx} className={`timeline-item ${item.type}`}>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-content">
                  <span className="when">{item.period}</span>
                  <h3>{item.title}</h3>
                  <div className="organization">{item.organization}</div>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
