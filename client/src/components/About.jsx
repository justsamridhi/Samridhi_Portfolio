import React from 'react';
import './About.scss';

export const About = () => {
  return (
    <section id="about" className="section about-section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Identity & Background</div>
          <h2>About Me</h2>
        </div>

        <div className="about-grid">
          <div className="about-card card">
            <div className="avatar-art-badge">
              <img
                src="/assets/samridhi_individual_avatar_poses/02_pose_backpack.png"
                alt="Samridhi Gupta with backpack"
                className="art-pose-img"
              />
            </div>

            <div className="bio-text">
              <p>
                Hi! I am <strong>Samridhi Gupta</strong>, an undergraduate Computer Science & Engineering student based in <strong>Jaipur, Rajasthan, India</strong>.
              </p>
              <p>
                My technical passion lies at the intersection of <strong>systems programming</strong>, <strong>cybersecurity static analysis</strong>, and <strong>practical full-stack web applications</strong>. I enjoy understanding the internal mechanics of how systems execute—from parsing compiled bytecodes in Android APKs to modeling large-scale spatial migrations.
              </p>
              <p>
                Beyond writing clean code and shipping scalable web applications, I have worked as a research intern at <strong>MNIT Jaipur (ISEA-III)</strong> in cybersecurity protocols and at <strong>LNMIIT Jaipur (LUSIP)</strong> in acoustic deepfake voice analysis.
              </p>
            </div>

            <div className="quick-facts">
              <div className="fact-item">
                <span className="fact-label">Location</span>
                <span className="fact-val">Jaipur, Rajasthan, India</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Current Status</span>
                <span className="fact-val">CSE Undergraduate (Final Years)</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Core Focus</span>
                <span className="fact-val">MERN Stack • Systems • Security Analysis</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Interests</span>
                <span className="fact-val">Research, Deepfake Forensics, Retro Pixel Art</span>
              </div>
            </div>
          </div>

          <div className="values-column">
            <div className="value-card card">
              <div className="value-icon">
                <img src="/assets/samridhi_ui_workspace_assets/13_code_impact_card.png" alt="Code with purpose icon" />
              </div>
              <h3>Evidence-First Engineering</h3>
              <p>I prioritize rigorous, deterministic logic and reproducible benchmarks over surface-level claims or hand-waving abstractions.</p>
            </div>

            <div className="value-card card">
              <div className="value-icon">
                <img src="/assets/samridhi_ui_workspace_assets/12_build_learn_checklist.png" alt="Continuous learning checklist icon" />
              </div>
              <h3>Continuous Systems Learning</h3>
              <p>From low-level Linux administration (RH124) to distributed document stores, I invest in deep computer science foundations.</p>
            </div>

            <div className="value-card card">
              <div className="value-icon">
                <img src="/assets/samridhi_ui_workspace_assets/21_spiral_notebook_quote.png" alt="Creative exploration notebook icon" />
              </div>
              <h3>Creative & Thoughtful Design</h3>
              <p>Digital tools should feel tactile, responsive, and humane—combining pixel craft with modern responsive architecture.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
