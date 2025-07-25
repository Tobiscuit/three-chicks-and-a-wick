import React, { useEffect, useRef } from 'react';

interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const SlideOutPanel: React.FC<SlideOutPanelProps> = ({ isOpen, onClose, children, title }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-[var(--candlelight-cream)] shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[var(--subtle-border)]">
          <h2 className="text-xl font-bold text-[var(--charcoal-tin)] font-headings">{title || 'Panel'}</h2>
          <button
            onClick={onClose}
            className="text-[var(--charcoal-tin)] hover:text-[var(--playful-pink)] transition-colors duration-200"
            aria-label="Close panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 h-[calc(100%-65px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideOutPanel;
