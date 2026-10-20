import React, { useState } from 'react';
import { projectsData } from '../data/portfolioData';
import { playPixelSound } from '../utils/sound';
import './Projects.scss';

export const Projects = ({ activeSticker, soundEnabled, onProjectStamp }) => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [stampedStickers, setStampedStickers] = useState({});
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Extract unique tags
  const allTags = ['All', 'React', 'Python', 'Security / Analysis', 'Firebase'];

  const filteredProjects = projectsData.filter(p => {
    if (selectedTag === 'All') return true;
    if (selectedTag === 'Security / Analysis') {
      return p.tags.some(t => t.toLowerCase().includes('analysis') || t.toLowerCase().includes('security'));
    }
    return p.tags.includes(selectedTag);
  });

  const handleCardClick = (e, project) => {
    if (!activeSticker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Organic random tilt between -10 and +10 degrees
    const tilt = (Math.random() * 20 - 10).toFixed(1);
    const newSticker = {
      id: Date.now() + Math.random(),
      sticker: activeSticker,
      x: `${(x / rect.width) * 100}%`,
      y: `${(y / rect.height) * 100}%`,
      tilt: `${tilt}deg`,
    };

    setStampedStickers(prev => ({
      ...prev,
      [project.id]: [...(prev[project.id] || []), newSticker]
    }));

    // Floating reaction duplicate effect
    const heartId = Date.now();
    setFloatingHearts(prev => [
      ...prev,
      { id: heartId, x: e.clientX, y: e.clientY, icon: activeSticker.src }
    ]);

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
    }, 1200);

    if (soundEnabled) {
      playPixelSound('stamp');
    }

    if (onProjectStamp) {
      onProjectStamp(project.id);
    }
  };

  return (
    <section id="projects" className="section projects-section">
      <div className="wrap">
        <div className="projects-head-row">
          <h2 className="pixel-heading">Selected work</h2>
          <div className="head-actions">
            <button
              type="button"
              className={`btn pill-filter ${selectedTag === 'All' ? 'is-active' : ''}`}
              onClick={() => setSelectedTag('All')}
            >
              <span>All projects</span>
            </button>
          </div>
        </div>

        {/* Project Cards Grid (Screenshot 4) */}
        <div className="projects-grid">
          {filteredProjects.map(project => {
            const stickers = stampedStickers[project.id] || [];
            return (
              <article
                key={project.id}
                className={`project-card card ${activeSticker ? 'stamp-armed' : ''}`}
                onClick={(e) => handleCardClick(e, project)}
              >
                <div className="card-top-row">
                  <h3 className="project-title-pixel">{project.name}</h3>
                  <div className="sparkle-count-pill" title="Reactions on this project">
                    <span className="sparkle-icon">✦</span>
                    <span className="sparkle-num">{stickers.length}</span>
                  </div>
                </div>

                <p className="project-desc">{project.description}</p>

                <div className="project-tags">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-capsule">{tag}</span>
                  ))}
                </div>

                <div className="project-links" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn dark action-pill"
                  >
                    <span>GitHub</span>
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn sage action-pill"
                    >
                      <span>Live demo</span>
                    </a>
                  )}
                </div>

                {/* Stamped Stickers Layer on the Card */}
                <div className="stamped-layer" aria-hidden="true">
                  {stickers.map(item => (
                    <img
                      key={item.id}
                      src={item.sticker.src}
                      alt={item.sticker.name}
                      className="placed-sticker"
                      style={{
                        left: item.x,
                        top: item.y,
                        '--tilt': item.tilt
                      }}
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Screen-space Floating Reaction Particles */}
      <div className="floating-reactions-layer" aria-hidden="true">
        {floatingHearts.map(h => (
          <img
            key={h.id}
            src={h.icon}
            alt=""
            className="floating-heart"
            style={{ left: `${h.x}px`, top: `${h.y}px` }}
          />
        ))}
      </div>
    </section>
  );
};
