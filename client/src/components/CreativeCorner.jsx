import React from 'react';
import './CreativeCorner.scss';

export const CreativeCorner = () => {
  return (
    <section id="creative-corner" className="section creative-corner-section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Offline Curiosity & Expression</div>
          <h2 className="pixel-heading">Creative Corner</h2>
          <p className="section-sub muted">
            When not debugging or analyzing security traces, I explore tactile mediums—traditional acrylic painting, mechanical cameras, and pixel design.
          </p>
        </div>

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
      </div>
    </section>
  );
};
