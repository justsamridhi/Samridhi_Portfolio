import React, { useState, useEffect, useRef } from 'react';
import { paintingsData } from '../data/portfolioData';
import './CreativeCorner.scss';

export const CreativeCorner = () => {
  // Gallery open state: false = sketchbook cover; true = circular gallery
  const [isOpen, setIsOpen] = useState(false);
  // Animation state: 'revealing' (animated burst on open) | 'settled' (stable circular selection)
  const [revealState, setRevealState] = useState('idle');
  // Selected painting index for lightbox modal preview (null = closed)
  const [selectedIdx, setSelectedIdx] = useState(null);

  const lastFocusedTriggerRef = useRef(null);
  const modalCloseBtnRef = useRef(null);
  const galleryCardRef = useRef(null);

  // Check if reduced motion or motion off is requested
  const isReducedMotion = () => {
    return (
      document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  };

  // Open the sketchbook
  const handleOpenSketchbook = (e) => {
    lastFocusedTriggerRef.current = e.currentTarget;
    setIsOpen(true);

    if (isReducedMotion()) {
      setRevealState('settled');
    } else {
      setRevealState('revealing');
      // After opening reveal finishes (~700ms), transition into stable settled circular state
      setTimeout(() => {
        setRevealState('settled');
      }, 700);
    }
  };

  // Close the sketchbook back to the cover
  const handleCloseSketchbook = () => {
    setIsOpen(false);
    setRevealState('idle');
    setSelectedIdx(null);
    if (lastFocusedTriggerRef.current) {
      lastFocusedTriggerRef.current.focus();
    }
  };

  // Lightbox opening for a clicked painting in the circle
  const handleOpenPainting = (index, e) => {
    lastFocusedTriggerRef.current = e.currentTarget;
    setSelectedIdx(index);
  };

  // Lightbox closing (returns directly to the circular arrangement)
  const handleCloseLightbox = () => {
    setSelectedIdx(null);
    if (lastFocusedTriggerRef.current) {
      lastFocusedTriggerRef.current.focus();
    }
  };

  // Next / Previous controls within the preview
  const handlePrevPainting = (e) => {
    if (e) e.stopPropagation();
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : paintingsData.length - 1));
  };

  const handleNextPainting = (e) => {
    if (e) e.stopPropagation();
    setSelectedIdx((prev) => (prev < paintingsData.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation & body scroll lock when modal is open
  useEffect(() => {
    if (selectedIdx === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      if (modalCloseBtnRef.current) {
        modalCloseBtnRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPainting();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPainting();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIdx]);

  return (
    <section id="creative-corner" className="section creative-corner-section" aria-label="Creative Corner">
      <div className="wrap">
        {/* Section Heading */}
        <div className="section-head">
          <div className="eyebrow">Offline Curiosity & Expression</div>
          <h2 className="pixel-heading">Creative Corner</h2>
          <p className="section-sub muted">
            When not debugging or analyzing security traces, I explore tactile mediums—traditional acrylic painting, mechanical cameras, and visual storytelling.
          </p>
        </div>

        {/* Existing Studio Cards (Preserved) */}
        <div className="creative-grid">
          <div className="creative-card easel-card card">
            <div className="easel-art-frame">
              <img
                src="/assets/samridhi_individual_avatar_poses/07_pose_painting_canvas.png"
                alt="Samridhi painting a sky landscape at her easel"
                className="easel-avatar-img"
              />
            </div>
            <div className="creative-info">
              <h3>Sky & Landscape Studies</h3>
              <p>
                Working with paint forces patience that software often hides. Every brushstroke is permanent and tactile—teaching intentional composition.
              </p>
            </div>
          </div>

          <div className="creative-card camera-card card">
            <div className="polaroid-duo">
              <img
                src="/assets/samridhi_ui_workspace_assets/09_polaroid_sunset.png"
                alt="Sunset Polaroid print: good code brighter days"
                className="polaroid-print"
              />
              <img
                src="/assets/samridhi_ui_workspace_assets/27_retro_camera.png"
                alt="Retro instant camera"
                className="camera-object"
              />
            </div>
            <div className="creative-info">
              <h3>Analog Observations</h3>
              <p>
                Documenting everyday light and quiet moments around Jaipur with instant film. Reminding myself that reality needs no filtering.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SKETCHBOOK COMES TO LIFE: Interactive Cover & Circular Gallery */}
        {/* ============================================================ */}
        <div className="sketchbook-experience-card card" ref={galleryCardRef}>
          {!isOpen ? (
            /* 1. INITIAL STATE: Sketchbook Cover with 25-35% Larger Icon */
            <div className="sketchbook-cover-stage">
              <button
                type="button"
                className="sketchbook-cover-btn"
                onClick={handleOpenSketchbook}
                aria-label="Open my sketchbook to view original paintings"
              >
                <div className="sketchbook-icon-frame">
                  <img
                    src="/art/creative-corner-icon.png"
                    alt="Pixel-art sketchbook with paintbrush and bookmark"
                    width="330"
                    height="330"
                    className="sketchbook-cover-art"
                  />
                  <div className="cover-glow-ring" aria-hidden="true" />
                </div>

                <div className="sketchbook-caption">
                  <span className="caption-tag">12 ORIGINAL PAINTINGS</span>
                  <h3 className="caption-title">SKETCHBOOK COMES TO LIFE</h3>
                  <div className="interaction-cue">
                    <span className="sparkle-icon" aria-hidden="true">✦</span>
                    <span className="cue-text">Click to open my sketchbook</span>
                    <span className="sparkle-icon" aria-hidden="true">✦</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* 2. CIRCULAR GALLERY: The Stable Final Browsing Screen */
            <div className={`sketchbook-circular-stage state-${revealState}`}>
              {/* Header Bar with Close Control */}
              <div className="gallery-header-bar">
                <div className="gallery-title-group">
                  <span className="sketchbook-badge">SKETCHBOOK OPEN</span>
                  <h3 className="gallery-title">Original Paintings</h3>
                </div>

                <button
                  type="button"
                  className="btn dark close-sketchbook-btn"
                  onClick={handleCloseSketchbook}
                  aria-label="Close sketchbook gallery"
                >
                  <span aria-hidden="true">✕</span>
                  <span>Close sketchbook</span>
                </button>
              </div>

              {/* Data-Driven Circular Arrangement of Paintings */}
              <div
                className="circular-gallery-arena"
                role="region"
                aria-label="Circular artwork selection gallery"
              >
                {/* Center Sketchbook Anchor */}
                <div className="circle-center-hub" aria-hidden="true">
                  <img
                    src="/art/creative-corner-icon.png"
                    alt=""
                    className="center-hub-icon"
                  />
                  <div className="center-hub-halo" />
                </div>

                {/* Circular Array of Individually Selectable Paintings */}
                <div className="circle-paintings-ring" role="list">
                  {paintingsData.map((painting, index) => {
                    const total = paintingsData.length;
                    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // start from top (-90deg)
                    const cosA = Math.cos(angle);
                    const sinA = Math.sin(angle);

                    return (
                      <div
                        key={painting.id}
                        role="listitem"
                        className="circle-painting-node"
                        style={{
                          '--cos-a': cosA.toFixed(4),
                          '--sin-a': sinA.toFixed(4),
                          '--stagger-delay': `${index * 35}ms`
                        }}
                      >
                        <button
                          type="button"
                          className="circle-painting-btn"
                          onClick={(e) => handleOpenPainting(index, e)}
                          aria-label={`Open painting ${index + 1} of ${total} full size`}
                        >
                          <div className="painting-frame">
                            <img
                              src={painting.src}
                              alt=""
                              loading="lazy"
                              className="node-painting-img"
                            />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* INDIVIDUAL ARTWORK PREVIEW (Accessible Lightbox Modal) */}
        {/* ============================================================ */}
        {selectedIdx !== null && (
          <div
            className="artwork-lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Artwork preview ${selectedIdx + 1} of ${paintingsData.length}`}
            onClick={handleCloseLightbox}
          >
            <div
              className="artwork-lightbox-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="lightbox-topbar">
                <span className="lightbox-counter">
                  Artwork {selectedIdx + 1} of {paintingsData.length}
                </span>

                <button
                  ref={modalCloseBtnRef}
                  type="button"
                  className="lightbox-close-btn"
                  onClick={handleCloseLightbox}
                  aria-label="Close image preview (Escape)"
                >
                  ✕
                </button>
              </div>

              {/* Main Artwork Stage */}
              <div className="lightbox-canvas-area">
                <button
                  type="button"
                  className="lightbox-nav-btn prev-btn"
                  onClick={handlePrevPainting}
                  aria-label="Previous painting (Left Arrow)"
                >
                  ‹
                </button>

                <div className="lightbox-image-box">
                  <img
                    src={paintingsData[selectedIdx].src}
                    alt={paintingsData[selectedIdx].alt}
                    className="lightbox-full-img"
                  />
                </div>

                <button
                  type="button"
                  className="lightbox-nav-btn next-btn"
                  onClick={handleNextPainting}
                  aria-label="Next painting (Right Arrow)"
                >
                  ›
                </button>
              </div>

              {/* Lightbox Footer Instruction */}
              <div className="lightbox-footer">
                <span className="lightbox-hint muted">
                  Use Left / Right arrow keys to navigate · Escape to close
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreativeCorner;
