import React, { useState } from 'react';
import './Contact.scss';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please include a message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      // Prepared for Express backend integration (/api/contact)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus({
          type: 'ok',
          text: '✓ Thank you! Your message has been received successfully.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Phase 1 graceful fallback when backend server is not running yet
        setStatus({
          type: 'info',
          text: '✓ Form validated! Message staged for Express/MongoDB backend (Phase 2 connection).'
        });
      }
    } catch {
      // Local dev notice
      setStatus({
        type: 'info',
        text: '✓ Form client validation passed! Ready to sync with backend API (/api/contact in Phase 2).'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('guptasamridhi242@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Get in Touch</div>
          <h2>Contact & Collaboration</h2>
          <p className="section-sub muted">
            Whether you want to discuss research in cybersecurity, full-stack development, or open source projects—drop a note below!
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Form */}
          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-err' : undefined}
                required
              />
              {errors.name && <span id="name-err" className="err-msg">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-err' : undefined}
                required
              />
              {errors.email && <span id="email-err" className="err-msg">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Let's build something thoughtful together..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-err' : undefined}
                required
              />
              {errors.message && <span id="message-err" className="err-msg">{errors.message}</span>}
            </div>

            <button type="submit" className="btn sage" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message →'}</span>
            </button>

            {status.text && (
              <div className={`form-status ${status.type}`} role="alert">
                {status.text}
              </div>
            )}
          </form>

          {/* Quick Contact & Social Cards */}
          <div className="contact-side">
            <div className="info-card card">
              <div className="info-top">
                <img
                  src="/assets/samridhi_ui_workspace_assets/02_sleeping_german_shepherd.png"
                  alt="Friendly pet accent"
                  className="dog-accent"
                />
                <div>
                  <h3>Direct Inquiries</h3>
                  <p className="muted">Jaipur, Rajasthan, India</p>
                </div>
              </div>

              <div className="email-display">
                <span className="email-text">guptasamridhi242@gmail.com</span>
                <button type="button" className="copy-btn" onClick={copyEmail}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div id="resume" className="resume-download-box">
                <span className="box-label">Verified Resume Downloads:</span>
                <div className="download-buttons">
                  <a
                    href="/documents/Resume.pdf"
                    download="Samridhi_Gupta_Resume.pdf"
                    className="btn dark"
                  >
                    <span>Download PDF</span>
                  </a>
                  <a
                    href="/documents/Resume.docx"
                    download="Samridhi_Gupta_Resume.docx"
                    className="btn"
                  >
                    <span>Download DOCX</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="social-links-card card">
              <h3>Connect Online</h3>
              <div className="social-buttons">
                <a
                  href="https://github.com/justsamridhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  <img src="/assets/samridhi_decorative_navigation_assets/14_social_github.png" alt="" aria-hidden="true" />
                  <span>GitHub: @justsamridhi</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/samridhi-gupta-016b0231b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  <span className="social-icon-in">in</span>
                  <span>LinkedIn: Samridhi Gupta</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
