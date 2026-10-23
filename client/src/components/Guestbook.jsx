import React, { useState, useEffect, useRef, useCallback } from 'react';
import { stickerPack } from '../data/portfolioData';
import { playPixelSound } from '../utils/sound';
import { apiUrl } from '../utils/api';
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
  const [isEraser, setIsEraser] = useState(false);

  // Undo / Redo history stacks (up to 50 states)
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Submission state
  const [shareApproved, setShareApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wallMsg, setWallMsg] = useState('');

  // Moderation state: Approved public marks vs Pending visitor reviews
  const [approvedGallery, setApprovedGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('samridhi-pixel-gallery');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pendingQueue, setPendingQueue] = useState([]);
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'approved'
  const [showAdminReview, setShowAdminReview] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Sound ref to avoid stale closures in event listeners
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const formatEntryDate = (item) => {
    if (!item) return '';
    if (item.createdAt) {
      try {
        return new Date(item.createdAt).toLocaleDateString();
      } catch {
        // fallback to date field
      }
    }
    return item.date || '';
  };

  // Exactly 6 presets: #b7c46f Sage, #d9700f Orange, #f8c9a0 Peach, #5a8bbd Blue, #e25555 Red, #fbf4e4 Cream
  const PRESET_INKS = [
    { hex: '#b7c46f', name: 'Sage' },
    { hex: '#d9700f', name: 'Orange' },
    { hex: '#f8c9a0', name: 'Peach' },
    { hex: '#5a8bbd', name: 'Blue' },
    { hex: '#e25555', name: 'Red' },
    { hex: '#fbf4e4', name: 'Cream' },
  ];

  const normalizeHex = (raw) => {
    if (!raw) return null;
    let val = raw.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{3}$/.test(val)) {
      return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      return val.toLowerCase();
    }
    return null;
  };

  const [hexInputText, setHexInputText] = useState(selectedColor);
  const [hexError, setHexError] = useState('');

  // Recent custom inks: up to 6 custom colours, newest first, case-insensitive dedupe, localStorage key "samridhi-recent-inks"
  const [recentInks, setRecentInks] = useState(() => {
    try {
      const saved = localStorage.getItem('samridhi-recent-inks');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      const presetSet = new Set(PRESET_INKS.map(p => p.hex.toLowerCase()));
      const cleaned = [];
      for (const item of parsed) {
        const norm = normalizeHex(item);
        if (norm && !presetSet.has(norm.toLowerCase()) && !cleaned.includes(norm.toLowerCase())) {
          cleaned.push(norm.toLowerCase());
        }
      }
      return cleaned.slice(0, 6);
    } catch {
      return [];
    }
  });

  const addRecentInk = useCallback((color) => {
    const norm = normalizeHex(color);
    if (!norm) return;
    const lower = norm.toLowerCase();
    const isPreset = PRESET_INKS.some(p => p.hex.toLowerCase() === lower);
    if (isPreset) return; // Do not add presets to custom recents

    setRecentInks(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== lower);
      const updated = [lower, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('samridhi-recent-inks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const customColorInputRef = useRef(null);

  const selectInkColor = (color) => {
    const norm = normalizeHex(color) || color.toLowerCase();
    setSelectedColor(norm);
    setHexInputText(norm);
    setHexError('');
    setIsEraser(false);
    if (soundEnabledRef.current) playPixelSound('pixel');
  };

  // Immediate ink application during native color picker adjustment
  const handleCustomColorChange = (hex) => {
    const norm = normalizeHex(hex) || hex.toLowerCase();
    setSelectedColor(norm);
    setHexInputText(norm);
    setHexError('');
    setIsEraser(false);
  };

  // Final committed color added to recent inks only when selection finishes
  const handleCustomColorFinish = useCallback((hex) => {
    const norm = normalizeHex(hex) || hex.toLowerCase();
    addRecentInk(norm);
    if (soundEnabledRef.current) playPixelSound('pixel');
  }, [addRecentInk]);

  const handleCustomColorFinishRef = useRef(handleCustomColorFinish);
  useEffect(() => {
    handleCustomColorFinishRef.current = handleCustomColorFinish;
  }, [handleCustomColorFinish]);

  useEffect(() => {
    const el = customColorInputRef.current;
    if (!el) return;
    const onNativeChange = (e) => {
      if (handleCustomColorFinishRef.current) {
        handleCustomColorFinishRef.current(e.target.value);
      }
    };
    el.addEventListener('change', onNativeChange);
    return () => el.removeEventListener('change', onNativeChange);
  }, []);

  const handleHexInputChange = (e) => {
    const text = e.target.value;
    setHexInputText(text);
    const normalized = normalizeHex(text);
    if (normalized) {
      setHexError('');
      setSelectedColor(normalized);
      setIsEraser(false);
      if (text.replace(/^#/, '').length >= 6) {
        addRecentInk(normalized);
      }
      if (soundEnabledRef.current) playPixelSound('pixel');
    } else {
      if (text.trim().length > 0 && text.trim() !== '#') {
        setHexError('Use #RGB or #RRGGBB');
      } else {
        setHexError('');
      }
    }
  };

  const handleHexInputBlur = () => {
    const normalized = normalizeHex(hexInputText);
    if (normalized) {
      addRecentInk(normalized);
      setHexInputText(normalized.toUpperCase());
    }
  };

  // Canvas ref & drawing states
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const lastPaintedIdxRef = useRef(-1);
  const strokeSnapshotRef = useRef(null);
  const strokeModifiedRef = useRef(false);

  const getCellIndexFromPointer = (e) => {
    const container = canvasRef.current;
    if (!container) return -1;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || x >= rect.width || y < 0 || y >= rect.height) return -1;
    const col = Math.floor((x / rect.width) * GRID_SIZE);
    const row = Math.floor((y / rect.height) * GRID_SIZE);
    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
      return row * GRID_SIZE + col;
    }
    return -1;
  };

  const paintCellDirect = (idx) => {
    if (idx < 0 || idx >= GRID_SIZE * GRID_SIZE) return;
    const paintColor = isEraser ? 'transparent' : selectedColor;
    setGrid(prev => {
      if (prev[idx] === paintColor) return prev;
      strokeModifiedRef.current = true;
      const next = [...prev];
      next[idx] = paintColor;
      return next;
    });
    if (soundEnabledRef.current) {
      playPixelSound('pixel');
    }
  };

  // Bresenham line algorithm to interpolate fast drags between pointer positions
  const interpolateAndPaint = (fromIdx, toIdx) => {
    if (fromIdx === -1 || fromIdx === toIdx) {
      paintCellDirect(toIdx);
      return;
    }
    const x0 = fromIdx % GRID_SIZE;
    const y0 = Math.floor(fromIdx / GRID_SIZE);
    const x1 = toIdx % GRID_SIZE;
    const y1 = Math.floor(toIdx / GRID_SIZE);

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let currX = x0;
    let currY = y0;

    while (true) {
      const idx = currY * GRID_SIZE + currX;
      paintCellDirect(idx);
      if (currX === x1 && currY === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        currX += sx;
      }
      if (e2 < dx) {
        err += dx;
        currY += sy;
      }
    }
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    activePointerIdRef.current = e.pointerId;
    isDrawingRef.current = true;
    strokeSnapshotRef.current = [...grid];
    strokeModifiedRef.current = false;
    lastPaintedIdxRef.current = -1;

    const idx = getCellIndexFromPointer(e);
    if (idx !== -1) {
      paintCellDirect(idx);
      lastPaintedIdxRef.current = idx;
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || e.pointerId !== activePointerIdRef.current) return;
    e.preventDefault();
    const idx = getCellIndexFromPointer(e);
    if (idx !== -1 && idx !== lastPaintedIdxRef.current) {
      interpolateAndPaint(lastPaintedIdxRef.current, idx);
      lastPaintedIdxRef.current = idx;
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    isDrawingRef.current = false;
    activePointerIdRef.current = null;
    lastPaintedIdxRef.current = -1;

    if (strokeModifiedRef.current && strokeSnapshotRef.current) {
      const snapshot = strokeSnapshotRef.current;
      setUndoStack(prev => [...prev.slice(-49), snapshot]);
      setRedoStack([]);
    }
    strokeSnapshotRef.current = null;
    strokeModifiedRef.current = false;
  };

  const handleKeyboardPaint = (idx) => {
    const paintColor = isEraser ? 'transparent' : selectedColor;
    if (grid[idx] === paintColor) return;
    const snapshot = [...grid];
    setUndoStack(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
    setGrid(prev => {
      const next = [...prev];
      next[idx] = paintColor;
      return next;
    });
    if (soundEnabledRef.current) playPixelSound('pixel');
  };

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    setUndoStack(prevUndo => {
      if (prevUndo.length === 0) return prevUndo;
      const prevGrid = prevUndo[prevUndo.length - 1];
      setGrid(currentGrid => {
        setRedoStack(prevRedo => [...prevRedo, currentGrid]);
        return prevGrid;
      });
      return prevUndo.slice(0, -1);
    });
    if (soundEnabledRef.current) playPixelSound('pop');
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;
      const nextGrid = prevRedo[prevRedo.length - 1];
      setGrid(currentGrid => {
        setUndoStack(prevUndo => [...prevUndo.slice(-49), currentGrid]);
        return nextGrid;
      });
      return prevRedo.slice(0, -1);
    });
    if (soundEnabledRef.current) playPixelSound('pop');
  }, []);

  // Global Undo / Redo shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y), ignoring inputs/textareas
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (!modifier) return;

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.key === 'y' || e.key === 'Y') && !isMac) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Undoable Clear (confirms only when pixels exist)
  const handleClear = () => {
    const hasPixels = grid.some(c => c !== 'transparent');
    if (!hasPixels) return;
    if (!window.confirm('Clear the drawing?')) return;
    const snapshot = [...grid];
    setUndoStack(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill('transparent'));
    if (soundEnabledRef.current) playPixelSound('pop');
  };

  // Undoable Heart Stamp
  const handleHeartStamp = () => {
    const snapshot = [...grid];
    setUndoStack(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
    const heartGrid = Array(GRID_SIZE * GRID_SIZE).fill('transparent');
    const stampColor = isEraser || selectedColor === 'transparent' ? '#a3b88c' : selectedColor;
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
      heartGrid[r * 16 + c] = stampColor;
    });
    setGrid(heartGrid);
    if (soundEnabledRef.current) playPixelSound('pop');
  };

  // Helper state calculation
  const hasDrawnPixels = grid.some(c => c !== 'transparent');
  let helperStateText = 'Draw at least one pixel.';
  if (hasDrawnPixels) {
    helperStateText = shareApproved ? 'Ready to send.' : 'Looking good. Tick the box to submit.';
  }

  // Visitor Submits Drawing for Review
  const handleSubmitForReview = async () => {
    if (isSubmitting) return;
    const hasPixels = grid.some(c => c !== 'transparent');
    if (!hasPixels) {
      setWallMsg('Draw at least one pixel.');
      return;
    }
    if (!shareApproved) {
      setWallMsg('Looking good. Tick the box to submit.');
      return;
    }

    setIsSubmitting(true);
    setWallMsg('');
    try {
      const res = await fetch(apiUrl('/api/guestbook'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridData: grid })
      });
      if (res.ok) {
        setWallMsg('✓ Your drawing was submitted for review! It will appear on the wall once approved.');
        setGrid(Array(GRID_SIZE * GRID_SIZE).fill('transparent'));
        setUndoStack([]);
        setRedoStack([]);
        setShareApproved(false);
        if (soundEnabledRef.current) playPixelSound('pop');
      } else {
        const err = await res.json().catch(() => ({}));
        setWallMsg(`Submission failed: ${err.error || 'Server error. Please try again.'}`);
        // Preserve drawing on failure
      }
    } catch (e) {
      console.error(e);
      setWallMsg('Submission failed: Network error. Please try again.');
      // Preserve drawing on failure
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setWallMsg(''), 6000);
    }
  };

  const handleApprovePending = async (id) => {
    try {
      setAdminError('');
      const res = await fetch(apiUrl(`/api/guestbook/${id}/approve`), {
        method: 'PATCH',
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        await fetchApproved();
        await fetchPending();
        if (soundEnabledRef.current) playPixelSound('pop');
      } else {
        const err = await res.json().catch(() => ({}));
        setAdminError(err.error || 'Failed to approve submission');
      }
    } catch (e) {
      console.error(e);
      setAdminError('Approve failed: network error');
    }
  };

  const handleRejectPending = async (id) => {
    try {
      setAdminError('');
      const res = await fetch(apiUrl(`/api/guestbook/${id}`), {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        await fetchApproved();
        await fetchPending();
        if (soundEnabledRef.current) playPixelSound('pop');
      } else {
        const err = await res.json().catch(() => ({}));
        setAdminError(err.error || 'Failed to reject submission');
      }
    } catch (e) {
      console.error(e);
      setAdminError('Reject failed: network error');
    }
  };

  // Animate deletion only when Motion is on and reduced motion is not requested
  const handleDeleteApproved = async (id) => {
    if (!window.confirm('Delete this drawing from the wall permanently?')) {
      return;
    }

    const motionSetting = localStorage.getItem('samridhi-motion');
    const isReducedMotion =
      document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const shouldAnimate = motionSetting !== 'false' && !isReducedMotion;

    if (shouldAnimate) {
      setDeletingId(id);
      await new Promise(resolve => setTimeout(resolve, 220));
    }

    try {
      setAdminError('');
      const res = await fetch(apiUrl(`/api/guestbook/${id}`), {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        await fetchApproved();
        await fetchPending();
        if (soundEnabledRef.current) playPixelSound('pop');
      } else {
        const err = await res.json().catch(() => ({}));
        setAdminError(err.error || 'Failed to delete drawing');
      }
    } catch (e) {
      console.error(e);
      setAdminError('Delete failed: network error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminPasscode) {
      try {
        const res = await fetch(apiUrl('/api/guestbook/pending'), {
          headers: { 'x-admin-secret': adminPasscode }
        });
        if (res.ok) {
          const data = await res.json();
          setPendingQueue(data);
          setAdminAuthenticated(true);
          setAdminTab('pending');
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

  const handleAdminLock = () => {
    setAdminAuthenticated(false);
    setAdminPasscode('');
    setAdminError('');
    setPendingQueue([]);
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  useEffect(() => {
    if (adminAuthenticated) {
      fetchPending();
    }
  }, [adminAuthenticated]);

  const fetchApproved = async () => {
    try {
      const res = await fetch(apiUrl('/api/guestbook'));
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
    if (!adminPasscode) return false;
    try {
      const res = await fetch(apiUrl('/api/guestbook/pending'), {
        headers: { 'x-admin-secret': adminPasscode }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingQueue(data);
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
        {/* Section 1: Leave a pixel on the wall */}
        <div className="guestbook-block">
          <div className="block-head-row">
            <div>
              <div className="eyebrow">A TINY CORNER OF THE INTERNET</div>
              <h2 className="pixel-heading">Leave a pixel on the wall.</h2>
              <p className="block-sub muted">
                Draw a tiny 8-bit icon, submit it, and once approved it joins the wall.
              </p>
            </div>
            <div className="block-badge mono-tag">16 × 16 · PIXEL GUESTBOOK</div>
          </div>

          <div className="pixel-draw-card card">
            {/* Left: 16x16 Canvas Board */}
            <div className="canvas-col">
              <div
                ref={canvasRef}
                className="canvas-container"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                role="grid"
                aria-label="16 by 16 pixel canvas"
                tabIndex={0}
              >
                {grid.map((cellColor, idx) => (
                  <div
                    key={idx}
                    className="pixel-cell"
                    style={{ backgroundColor: cellColor }}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`Row ${Math.floor(idx / 16) + 1}, column ${(idx % 16) + 1}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleKeyboardPaint(idx);
                      }
                    }}
                  />
                ))}
              </div>
              <div className="canvas-meta">
                <span className="dot" aria-hidden="true">●</span> 16 × 16 canvas · 256 pixels
              </div>
            </div>

            {/* Right: Controls & History */}
            <div className="controls-col">
              <div className="tool-row">
                <div className="pixel-ink-badge" aria-label={`Current ink colour: ${selectedColor.toUpperCase()}`}>
                  <span className="badge-title">Pixel ink</span>
                  <span className="ink-swatch" style={{ backgroundColor: selectedColor }} />
                  <span className="ink-hex-val">{selectedColor.toUpperCase()}</span>
                </div>

                <div className="history-btn-group" role="group" aria-label="Undo and redo history">
                  <button
                    type="button"
                    className="btn dark history-btn"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    title="Undo last action (Ctrl+Z)"
                    aria-label="Undo drawing step"
                  >
                    <span>↶ Undo</span>
                  </button>
                  <button
                    type="button"
                    className="btn dark history-btn"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    title="Redo action (Ctrl+Shift+Z)"
                    aria-label="Redo drawing step"
                  >
                    <span>↷ Redo</span>
                  </button>
                </div>

                <button type="button" className="btn sage stamp-btn" onClick={handleHeartStamp}>
                  <span>Stamp a heart</span>
                </button>

                <button type="button" className="btn dark clear-btn" onClick={handleClear}>
                  <span>Clear</span>
                </button>
              </div>

              {/* Ink Palette & Controls */}
              <div className="ink-picker-container">
                <div className="swatches-row">
                  {/* Exactly 6 presets */}
                  {PRESET_INKS.map((preset) => {
                    const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase() && !isEraser;
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        className={`palette-swatch ${isSelected ? 'is-selected' : ''}`}
                        style={{ backgroundColor: preset.hex }}
                        onClick={() => selectInkColor(preset.hex)}
                        aria-label={`Ink colour ${preset.hex}`}
                        aria-pressed={isSelected}
                        title={`${preset.name} (${preset.hex})`}
                      />
                    );
                  })}

                  {/* 7th swatch: rainbow-ring custom label wrapping hidden color input */}
                  <label
                    className={`palette-swatch custom-color-swatch ${!isEraser && !PRESET_INKS.some(p => p.hex.toLowerCase() === selectedColor.toLowerCase()) ? 'is-selected' : ''}`}
                    title="Custom colour picker"
                    aria-label="Custom ink colour picker"
                  >
                    <span className="rainbow-ring" aria-hidden="true" />
                    <input
                      ref={customColorInputRef}
                      type="color"
                      className="visually-hidden-color-input"
                      value={selectedColor.startsWith('#') && selectedColor.length === 7 ? selectedColor : '#b7c46f'}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      onBlur={(e) => handleCustomColorFinish(e.target.value)}
                      aria-label="Pick custom colour"
                    />
                  </label>

                  {/* Eraser tool */}
                  <button
                    type="button"
                    className={`eraser-pill ${isEraser ? 'is-selected' : ''}`}
                    onClick={() => {
                      setIsEraser(!isEraser);
                      if (soundEnabledRef.current) playPixelSound('pop');
                    }}
                    aria-pressed={isEraser}
                    title={isEraser ? 'Eraser active (click to resume drawing)' : 'Eraser tool'}
                  >
                    Eraser
                  </button>
                </div>

                {/* HEX manual input row */}
                <div className="hex-input-row">
                  <div className="hex-input-group">
                    <span className="hex-hash" aria-hidden="true">#</span>
                    <input
                      type="text"
                      className={`hex-text-input ${hexError ? 'has-error' : ''}`}
                      value={hexInputText.replace(/^#/, '')}
                      onChange={handleHexInputChange}
                      onBlur={handleHexInputBlur}
                      placeholder="B7C46F"
                      maxLength={6}
                      spellCheck="false"
                      aria-label="Hex ink colour code (3 or 6 digits)"
                    />
                  </div>
                  {hexError && <span className="hex-err-text" role="alert">{hexError}</span>}
                </div>

                {/* Recent row: up to 6 custom colours, newest first, hidden when empty */}
                {recentInks.length > 0 && (
                  <div className="recent-inks-row">
                    <span className="recent-label">Recent:</span>
                    <div className="recent-swatches">
                      {recentInks.map((color) => {
                        const isSelected = selectedColor.toLowerCase() === color.toLowerCase() && !isEraser;
                        return (
                          <button
                            key={color}
                            type="button"
                            className={`palette-swatch recent-swatch ${isSelected ? 'is-selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => selectInkColor(color)}
                            aria-label={`Ink colour ${color}`}
                            aria-pressed={isSelected}
                            title={`Recent ink: ${color.toUpperCase()}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accessible Pixel-Style Consent Box */}
              <label className="approval-checkbox-card" htmlFor="guestbook-consent-checkbox">
                <input
                  id="guestbook-consent-checkbox"
                  type="checkbox"
                  className="pixel-checkbox-input"
                  checked={shareApproved}
                  onChange={(e) => setShareApproved(e.target.checked)}
                />
                <span className="pixel-checkbox-custom" aria-hidden="true" />
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
                  disabled={!hasDrawnPixels || !shareApproved || isSubmitting}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit for review ↗'}</span>
                </button>
              </div>

              {/* Exact Helper States */}
              <div className="canvas-ready-hint" aria-live="polite">
                {helperStateText}
              </div>

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
                  aria-label={adminAuthenticated && pendingQueue.length > 0 ? `Moderate guestbook, ${pendingQueue.length} pending` : "Moderate guestbook"}
                >
                  <span aria-hidden="true">⚙</span> Moderate{adminAuthenticated && pendingQueue.length > 0 ? ` (${pendingQueue.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Tiny Guestbook (Approved Wall) */}
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
                  <div
                    key={item._id}
                    className={`mosaic-item-frame ${deletingId === item._id ? 'is-deleting' : ''}`}
                    title={`Drawn on ${formatEntryDate(item)}`}
                  >
                    <div className="mosaic-thumb-grid">
                      {item.gridData.map((c, i) => (
                        <div key={i} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    {adminAuthenticated && (
                      <button
                        type="button"
                        className="tile-delete-btn"
                        aria-label="Delete this drawing"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteApproved(item._id);
                        }}
                      >
                        <span aria-hidden="true">✕</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: A Little Sticker Book */}
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
                      if (soundEnabledRef.current) playPixelSound('pop');
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
                    <div className="admin-tabs" role="tablist" aria-label="Moderation tabs">
                      <button
                        type="button"
                        role="tab"
                        id="tab-pending"
                        aria-controls="panel-pending"
                        aria-selected={adminTab === 'pending'}
                        className={`admin-tab-btn ${adminTab === 'pending' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAdminTab('pending');
                          setAdminError('');
                        }}
                      >
                        Pending ({pendingQueue.length})
                      </button>
                      <button
                        type="button"
                        role="tab"
                        id="tab-approved"
                        aria-controls="panel-approved"
                        aria-selected={adminTab === 'approved'}
                        className={`admin-tab-btn ${adminTab === 'approved' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAdminTab('approved');
                          setAdminError('');
                        }}
                      >
                        Approved ({approvedGallery.length})
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn dark text-btn"
                      onClick={handleAdminLock}
                    >
                      Lock Panel
                    </button>
                  </div>

                  {adminError && <div className="err-msg" role="alert">{adminError}</div>}

                  {adminTab === 'pending' ? (
                    <div id="panel-pending" role="tabpanel" aria-labelledby="tab-pending">
                      {pendingQueue.length === 0 ? (
                        <div className="empty-queue-msg">
                          ✓ No submissions are currently pending review. The queue is all caught up!
                        </div>
                      ) : (
                        <div className="pending-grid">
                          {pendingQueue.map((item) => (
                            <div key={item._id} className="pending-item card">
                              <div className="pending-preview-frame">
                                <div className="pending-thumb-grid">
                                  {item.gridData.map((c, i) => (
                                    <div key={i} style={{ backgroundColor: c }} />
                                  ))}
                                </div>
                              </div>

                              <div className="pending-details">
                                <span className="pending-time">Submitted: {formatEntryDate(item)}</span>
                                <div className="pending-actions">
                                  <button
                                    type="button"
                                    className="btn sage btn-sm"
                                    onClick={() => handleApprovePending(item._id)}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="btn dark btn-sm"
                                    onClick={() => handleRejectPending(item._id)}
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
                  ) : (
                    <div id="panel-approved" role="tabpanel" aria-labelledby="tab-approved">
                      {approvedGallery.length === 0 ? (
                        <div className="empty-queue-msg">
                          No approved drawings on the wall.
                        </div>
                      ) : (
                        <div className="approved-grid">
                          {approvedGallery.map((item) => (
                            <div key={item._id} className="approved-item card">
                              <div className="approved-preview-frame">
                                <div className="approved-thumb-grid">
                                  {item.gridData.map((c, i) => (
                                    <div key={i} style={{ backgroundColor: c }} />
                                  ))}
                                </div>
                              </div>

                              <div className="approved-details">
                                <span className="approved-time">Drawn: {formatEntryDate(item)}</span>
                                <button
                                  type="button"
                                  className="btn dark btn-sm btn-delete"
                                  onClick={() => handleDeleteApproved(item._id)}
                                  aria-label={`Delete drawing from ${formatEntryDate(item)}`}
                                >
                                  🗑 Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
