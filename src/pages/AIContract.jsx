import React, { useState } from 'react';

const AIContract = ({ onBack }) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const embedLink = "https://aistudio.google.com/apps/eb4c15d0-3b34-43c4-9a0a-dfe09a5ea18d?showAssistant=true&showPreview=true&fullscreenApplet=true";

  return (
    <>
      <style>{`
        .ai-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000; /* Deep black background */
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          z-index: 100;
          overflow: hidden;
        }

        /* Ambient glowing effect - Cyan */
        .ai-container::before {
          content: '';
          position: absolute;
          width: 80vw;
          height: 80vh;
          background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, rgba(0,0,0,0) 60%);
          border-radius: 50%;
          top: -20vh;
          left: -10vw;
          animation: float 12s ease-in-out infinite;
          pointer-events: none;
        }

        /* Ambient glowing effect - Magenta/Purple */
        .ai-container::after {
          content: '';
          position: absolute;
          width: 70vw;
          height: 70vh;
          background: radial-gradient(ellipse at center, rgba(192, 38, 211, 0.12) 0%, rgba(0,0,0,0) 60%);
          border-radius: 50%;
          bottom: -15vh;
          right: -10vw;
          animation: float-reverse 15s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes float-reverse {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -20px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .back-button {
          position: absolute;
          top: 30px;
          left: 40px;
          background: transparent;
          border: none;
          color: #a1a1aa;
          font-size: 0.85rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 12px 20px;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 20;
        }

        .back-button:hover {
          color: #ffffff;
        }

        .glass-card {
          position: relative;
          background: transparent;
          padding: 50px;
          width: 90%;
          max-width: 650px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 30px;
          z-index: 10;
        }

        .glass-card.expanded {
          width: 98vw;
          max-width: 98vw;
          height: 96vh;
          padding: 20px;
          zoom: 0.9;
        }

        .title {
          margin: 0;
          font-size: 3.5rem;
          font-weight: 400; /* Lighter font weight to match reference */
          letter-spacing: -1px;
          color: #ffffff;
          line-height: 1.1;
        }

        .description {
          margin: 0;
          font-size: 1.1rem;
          color: #a1a1aa;
          line-height: 1.6;
          font-weight: 300;
          max-width: 80%;
          margin-inline: auto;
        }

        .button-group {
          display: flex;
          flex-direction: row; /* Side by side on desktop */
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
        }

        .btn {
          padding: 16px 32px;
          border-radius: 50px; /* Pill shape */
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* Styled like the 'GET IN TOUCH' button from the reference */
        .btn-primary {
          background: #ffffff;
          color: #000000;
          border: 1px solid #ffffff;
        }

        .btn-primary:hover {
          background: #e4e4e7;
          border-color: #e4e4e7;
          transform: translateY(-2px);
        }

        .btn-outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .embed-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex-grow: 1;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .iframe-container {
          flex-grow: 1;
          border-radius: 12px;
          overflow: hidden;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .iframe {
          width: 100%;
          height: 100%;
          min-height: 700px;
        }

        .btn-close {
          background: transparent;
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 50px; /* Pill shape */
          cursor: pointer;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.2s;
          align-self: center;
        }

        .btn-close:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      <div className="ai-container">
        <button className="back-button" onClick={onBack}>
          <span>&larr;</span> Dashboard
        </button>

        <div className={`glass-card ${showEmbed ? 'expanded' : ''}`}>
          <div>
            <h1 className="title">AI EST</h1>
            <p className="description">Secure, automated smart contract management.</p>
          </div>
          
          {!showEmbed ? (
            <div className="button-group">
              <button className="btn btn-primary" onClick={() => setShowEmbed(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Preview Website
              </button>
              
              <button className="btn btn-outline" onClick={() => window.open(embedLink, '_blank', 'noopener,noreferrer')}>
                Open in New Tab
              </button>
            </div>
          ) : (
            <div className="embed-wrapper">
              <div className="iframe-container">
                <iframe 
                  className="iframe"
                  src={embedLink} 
                  title="Embedded Website" 
                  frameBorder="0" 
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                ></iframe>
              </div>
              
              <button className="btn-close" onClick={() => setShowEmbed(false)}>
                Close Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIContract;