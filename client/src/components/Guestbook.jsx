import React, { useState, useEffect } from 'react';
import { stickerPack } from '../data/portfolioData';
import { playPixelSound } from '../utils/sound';
import './Guestbook.scss';

export const Guestbook = ({
  activeSticker,
  setActiveSticker,
  soundEnabled,
  setSoundEnabled
}) => {
  // 16x16 Pixel Grid state
  const GRID_SIZE = 16;
  const [grid, setGrid] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill('transparent'));
  const [selectedColor, setSelectedColor] = useState('#b7c46f'); // Default sage green
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  // Moderation state: Approved public marks vs Pending visitor reviews
  const [approvedGallery, setApprovedGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('samridhi-pixel-gallery');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pendingQueue, setPendingQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('samridhi-pending-pixels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAdminReview, setShowAdminReview] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [wallMsg, setWallMsg] = useState('');

  const colorPalette = [
    '#b7c46f', // Sage
    '#3f4a17', // Deep forest
    '#f8c9a0', // Peach
    '#d9700f', // Orange accent
    '#25211c', // Charcoal ink
    '#fbf4e4', // Cream paper
    '#5a8bbd', // Soft denim
    '#e25555', // Berry red
  ];

  const handleCellPaint = (index) => {
    const newGrid = [...grid];
    newGrid[index] = isEraser ? 'transparent' : selectedColor;
    setGrid(newGrid);
    if (soundEnabled) {
      playPixelSound('pixel');
    }
  };

  const handleClear = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill('transparent'));
    if (soundEnabled) playPixelSound('pop');
  };

  // Visitor Submits Drawing for Review (send to backend)
  const handleSubmitForReview = async () => {
    const hasPixels = grid.some(c => c !== 'transparent');
    if (!hasPixels) {
      setWallMsg('Please draw at least one pixel before submitting.');
      return;
    }
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridData: grid })
      });
      if (res.ok) {
        setWallMsg('✓ Your drawing was submitted for review! It will appear on the wall once approved.');
        setGrid(Array(GRID_SIZE * GRID_SIZE).fill('transparent'));
        setShareApproved(false);
        // Refresh pending queue (admin will see it later)
      } else {
        const err = await res.json();
        setWallMsg(`Submission failed: ${err.error || 'unknown error'}`);
      }
    } catch (e) {
      setWallMsg('Submission error: network issue');
    }
    if (soundEnabled) playPixelSound('pop');
    setTimeout(() => setWallMsg(''), 5500);
  };

  const handleApprovePending = async (id) => {
    try {
      const res = await fetch(`/api/guestbook/${id}/approve`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        // Refresh approved and pending lists
        await fetchApproved();
        await fetchPending();
        if (soundEnabled) playPixelSound('pop');
      } else {
        const err = await res.json();
        console.error('Approve error:', err);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectPending = async (id) => {
    try {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        await fetchApproved();
        await fetchPending();
        if (soundEnabled) playPixelSound('pop');
      } else {
        const err = await res.json();
        console.error('Reject error:', err);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (adminPasscode) {
      try {
        const ok = await fetchPending();
        if (ok) {
          setAdminAuthenticated(true);
        } else {
          setAdminError('Invalid admin secret');
        }
      } catch (e) {
        setAdminError('Admin verification failed');
      }
    } else {
      setAdminError('Enter admin secret');
    }
  };

  const handleHeartStamp = () => {
    // 16x16 Heart bitmap pattern
    const heartGrid = Array(GRID_SIZE * GRID_SIZE).fill('transparent');
    const heartPixels = [
      [3, 4], [3, 5], [3, 10], [3, 11],
      [4, 3], [4, 4], [4, 5], [4, 6], [4, 9], [4, 10], [4, 11], [4, 12],
      [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13],
      [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13],
      [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13],
      [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [8, 11], [8, 12],
      [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9], [9, 10], [9, 11],
      [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10],
      [11, 6], [11, 7], [11, 8], [11, 9],
      [12, 7], [12, 8]
    ];
    heartPixels.forEach(([r, c]) => {
      heartGrid[r * 16 + c] = '#a3b88c';
    });
    setGrid(heartGrid);
    if (soundEnabled) playPixelSound('pop');
  };

  const [shareApproved, setShareApproved] = useState(false);
useEffect(() => {
  // Load approved gallery on mount
  fetchApproved();
}, []);

useEffect(() => {
  if (adminAuthenticated) {
    fetchPending();
  }
}, [adminAuthenticated]);

const fetchApproved = async () => {
  try {
    const res = await fetch('/api/guestbook');
    if (res.ok) {
      const data = await res.json();
      setApprovedGallery(data);
      localStorage.setItem('samridhi-pixel-gallery', JSON.stringify(data));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error fetching approved gallery', e);
    return false;
  }
};

const fetchPending = async () => {
  try {
    const res = await fetch('/api/guestbook/pending', {
      headers: { 'x-admin-secret': adminPasscode }
    });
    if (res.ok) {
      const data = await res.json();
      setPendingQueue(data);
      localStorage.setItem('samridhi-pending-pixels', JSON.stringify(data));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error fetching pending queue', e);
    return false;
  }
};
  return (
    <section id="guestbook" className="section guestbook-section">
      <div className="wrap">
        {/* Section 1: Leave a pixel on the wall (Screenshot 3) */}
        <div className="guestbook-block">
          <div className="block-head-row">
            <div>
              <div className="eyebrow">A TINY CORNER OF THE INTERNET</div>
              <h2 className="pixel-heading">Leave a pixel on the wall.</h2>
              <p className="block-sub muted">
                Draw a tiny 8-bit icon on a 16 × 16 canvas. Preview it, then approve it for the mosaic below. It becomes a little guestbook mark on this browser.
              </p>
            </div>
            <div className="block-badge mono-tag">16 × 16 · PIXEL GUESTBOOK</div>
          </div>

          <div className="pixel-draw-card card">
            {/* Left: 16x16 Canvas Board */}
            <div className="canvas-col">
              <div
                className="canvas-container"
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                role="grid"
                aria-label="16 by 16 pixel canvas"
              >
                {grid.map((cellColor, idx) => (
                  <div
                    key={idx}
                    className="pixel-cell"
                    style={{ backgroundColor: cellColor }}
                    onMouseDown={() => handleCellPaint(idx)}
                    onMouseEnter={() => {
                      if (isDrawing) handleCellPaint(idx);
                    }}
                    role="gridcell"
                    tabIndex="0"
                    aria-label={`Pixel ${idx}`}
                  />
                ))}
              </div>
              <div className="canvas-meta">
                <span className="dot" aria-hidden="true">●</span> 16 × 16 canvas · 256 pixels
              </div>
            </div>

            {/* Right: Controls & Description */}
            <div className="controls-col">
              <h3 className="controls-title">Leave a tiny mark.</h3>
              <p className="controls-lede">
                Draw a little face, flower, star, heart, or your own 8-bit symbol. Choose a colour and use the stamp if you need inspiration.
              </p>

              <div className="tool-row">
                <div className="pixel-ink-badge">
                  <span>Pixel ink</span>
                  <span className="ink-swatch" style={{ backgroundColor: selectedColor }} />
                </div>

                <button type="button" className="btn sage stamp-btn" onClick={handleHeartStamp}>
                  <span>Stamp a heart</span>
                </button>

                <button type="button" className="btn dark clear-btn" onClick={handleClear}>
                  <span>Clear</span>
                </button>
              </div>

              {/* Color swatches palette */}
              <div className="swatches-row">
                {colorPalette.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`palette-swatch ${selectedColor === color && !isEraser ? 'is-selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setIsEraser(false);
                      if (soundEnabled) playPixelSound('pixel');
                    }}
                    aria-label={`Color ${color}`}
                  />
                ))}
                <button
                  type="button"
                  className={`eraser-pill ${isEraser ? 'is-selected' : ''}`}
                  onClick={() => {
                    setIsEraser(!isEraser);
                    if (soundEnabled) playPixelSound('pop');
                  }}
                  title="Eraser tool"
                >
                  Eraser
                </button>
              </div>

              {/* Consent Box */}
              <label className="approval-checkbox-card">
                <input
                  type="checkbox"
                  checked={shareApproved}
                  onChange={(e) => setShareApproved(e.target.checked)}
                />
                <div className="checkbox-text">
                  <strong>Ready for review</strong>
                  <span>I agree to submit this doodle for moderation before it appears publicly.</span>
                </div>
              </label>

              <div className="approve-action-row">
                <button
                  type="button"
                  className="btn cream approve-btn"
                  onClick={handleSubmitForReview}
                  disabled={!shareApproved}
                >
                  <span>Submit for review ↗</span>
                </button>
              </div>

              <div className="canvas-ready-hint">Your canvas is ready. Draw something tiny.</div>

              {wallMsg && <div className="wall-status-msg" aria-live="polite">{wallMsg}</div>}

              <div className="moderation-footer-row">
                <p className="prototype-note muted">
                  Note: All drawings enter a review queue and remain pending until approved by Samridhi.
                </p>
                <button
                  type="button"
                  className="admin-review-link"
                  onClick={() => setShowAdminReview(true)}
                  title="Moderator review panel"
                >
                  ⚙ Moderate {pendingQueue.length > 0 && `(${pendingQueue.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Tiny Guestbook (Screenshot 2 top) */}
        <div className="tiny-guestbook-card card">
          <div className="guestbook-header-row">
            <div>
              <div className="eyebrow">THE TINY GUESTBOOK</div>
              <h2 className="pixel-title">{approvedGallery.length} visitors left a mark</h2>
              <p className="guestbook-sub muted">
                A little gallery of approved pixel doodles. Each mark is small; together, they make the wall.
              </p>
            </div>
            <div className="tag">approved pixels only</div>
          </div>

          <div className="mosaic-display-area">
            {approvedGallery.length === 0 ? (
              <div className="mosaic-empty-dashed">
                The wall is waiting for its first tiny masterpiece.
              </div>
            ) : (
              <div className="mosaic-grid-gallery">
                {approvedGallery.map(item => (
                  <div key={item.id} className="mosaic-item-frame" title={`Drawn on ${item.date}`}>
                    <div className="mosaic-thumb-grid">
                      {item.gridData.map((c, i) => (
                        <div key={i} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: A Little Sticker Book (Screenshot 2 bottom) */}
        <div className="sticker-book-card card">
          <div className="sticker-book-header">
            <div>
              <div className="eyebrow">A LITTLE STICKER BOOK</div>
              <h2 className="pixel-title">Leave a reaction anywhere.</h2>
              <p className="sticker-book-sub muted">
                Choose an avatar expression, then tap or click anywhere on the page to leave a temporary sticker. It floats away after five seconds.
              </p>
            </div>
            <div className="mono-subtag">PICK · PLACE · FADE</div>
          </div>

          {/* Expressions Carousel / Row */}
          <div className="stickers-expression-row">
            {stickerPack.map(sticker => {
              const isSelected = activeSticker?.id === sticker.id;
              return (
                <button
                  key={sticker.id}
                  type="button"
                  className={`sticker-box ${isSelected ? 'is-active' : ''}`}
                  onClick={() => {
                    if (isSelected) {
                      setActiveSticker(null);
                    } else {
                      setActiveSticker(sticker);
                      if (soundEnabled) playPixelSound('pop');
                    }
                  }}
                  aria-pressed={isSelected}
                  title={`Select ${sticker.name} expression`}
                >
                  <img src={sticker.src} alt={sticker.name} className="sticker-avatar-thumb" />
                  <span className="sticker-label">{sticker.name}</span>
                </button>
              );
            })}

            <button
              type="button"
              className={`sticker-box cancel-box ${activeSticker ? 'has-active' : ''}`}
              onClick={() => setActiveSticker(null)}
              title="Cancel reaction mode"
            >
              <span className="cancel-icon">✕</span>
              <span className="sticker-label">Cancel</span>
            </button>
          </div>

          <div className="sticker-book-footer">
            <span className="footer-hint muted">
              Choose a sticker to turn on sticker mode. Click anywhere on the page to leave a five-second reaction.
            </span>

            <label className="pixel-sound-checkbox">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Optional pixel-pop sound</span>
            </label>
          </div>
        </div>

        {/* Admin Moderation Modal */}
        {showAdminReview && (
          <div
            className="admin-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Moderation review queue"
            onClick={() => setShowAdminReview(false)}
          >
            <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-head">
                <div>
                  <div className="eyebrow">MODERATOR QUEUE</div>
                  <h3>Guestbook Review Panel</h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowAdminReview(false)}
                  aria-label="Close moderation panel"
                >
                  ✕
                </button>
              </div>

              {!adminAuthenticated ? (
                <form className="admin-login-form" onSubmit={handleAdminLogin}>
                  <p className="muted">Enter administrator key to review pending visitor doodles:</p>
                  <div className="login-row">
                    <input
                      type="password"
                      placeholder="Enter moderator passkey..."
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="admin-input"
                      autoFocus
                    />
                    <button type="submit" className="btn sage">
                      <span>Unlock</span>
                    </button>
                  </div>
                  {adminError && <div className="err-msg">{adminError}</div>}
                  <p className="admin-phase2-hint muted">
                    Phase 2 note: In production with MongoDB & Express, moderation runs via authenticated backend routes with JWT/session cookies.
                  </p>
                </form>
              ) : (
                <div className="admin-submissions-list">
                  <div className="queue-status-bar">
                    <span>{pendingQueue.length} pending submission(s) awaiting review</span>
                    <button
                      type="button"
                      className="btn dark text-btn"
                      onClick={() => setAdminAuthenticated(false)}
                    >
                      Lock Panel
                    </button>
                  </div>

                  {pendingQueue.length === 0 ? (
                    <div className="empty-queue-msg">
                      ✓ No submissions are currently pending review. The queue is all caught up!
                    </div>
                  ) : (
                    <div className="pending-grid">
                      {pendingQueue.map((item) => (
                        <div key={item.id} className="pending-item card">
                          <div className="pending-preview-frame">
                            <div className="pending-thumb-grid">
                              {item.gridData.map((c, i) => (
                                <div key={i} style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </div>

                          <div className="pending-details">
                            <span className="pending-time">Submitted: {item.date}</span>
                            <div className="pending-actions">
                              <button
                                type="button"
                                className="btn sage btn-sm"
                                onClick={() => handleApprovePending(item.id)}
                              >
                                ✓ Approve
                              </button>
                              <button
                                type="button"
                                className="btn dark btn-sm"
                                onClick={() => handleRejectPending(item.id)}
                              >
                                ✕ Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
