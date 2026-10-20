import React, { useState } from 'react';
import { certificatesData } from '../data/portfolioData';
import './Certificates.scss';

export const Certificates = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section id="achievements" className="section certs-section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Verified Credentials</div>
          <h2>Certifications & Achievements</h2>
          <p className="section-sub muted">
            Genuine certificates and credentials earned from universities, industry simulations, and engineering programs. Click any item to inspect the document.
          </p>
        </div>

        <div className="certs-grid">
          {certificatesData.map(cert => (
            <div
              key={cert.id}
              className="cert-card card"
              onClick={() => setActiveModal(cert)}
              tabIndex="0"
              role="button"
              aria-label={`View certificate: ${cert.title}`}
            >
              <div className="cert-top">
                <span className="cert-badge">{cert.badge}</span>
                <span className="cert-date">{cert.date}</span>
              </div>

              <h3 className="cert-title">{cert.title}</h3>
              <div className="cert-issuer">{cert.issuer}</div>
              <p className="cert-desc">{cert.description}</p>

              <div className="cert-action">
                <span className="view-link">View Certificate Document ↗</span>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Modal Lightbox */}
        {activeModal && (
          <div
            className="modal-overlay"
            onClick={() => setActiveModal(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeModal.title}
          >
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge">{activeModal.category}</span>
                  <h3>{activeModal.title}</h3>
                  <div className="modal-issuer">{activeModal.issuer} • {activeModal.date}</div>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setActiveModal(null)}
                  aria-label="Close certificate modal"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {activeModal.file.endsWith('.pdf') ? (
                  <iframe
                    src={`${activeModal.file}#toolbar=0`}
                    title={activeModal.title}
                    className="modal-iframe"
                  />
                ) : (
                  <img
                    src={activeModal.file}
                    alt={activeModal.title}
                    className="modal-image"
                  />
                )}
              </div>

              <div className="modal-footer">
                <a
                  href={activeModal.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn sage"
                >
                  Open Original File ↗
                </a>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setActiveModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
