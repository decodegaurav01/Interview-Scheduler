import React from 'react';

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  title, 
  message,
  warning
}) {
  
  if (!isOpen) return null;

  return (
    <div className="pop-card">
      <div className="pop-overlay" onClick={!isLoading ? onClose : undefined} />
      
      <div className="pop-content animate-in fade-in zoom-in-95 duration-200">
        <h3 className="pop-title">
          {title}
        </h3>
        
        <p className="pop-title-2">
          {message}
          <br />
          <span className="pop-warning">
            {warning}
          </span>
        </p>

        <div className="pop-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm-delete flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}