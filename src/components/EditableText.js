import React, { useState, useRef, useEffect } from 'react';

const EditableText = ({ 
  text, 
  onSave, 
  element = 'p', 
  className = '', 
  placeholder = 'Click to edit...' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [currentText, setCurrentText] = useState(text);
  const inputRef = useRef(null);
  const textRef = useRef(null);

  // Update current text when prop changes
  useEffect(() => {
    setCurrentText(text);
    setEditText(text);
  }, [text]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText !== currentText) {
      setCurrentText(trimmedText);
      onSave(trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(currentText);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Small delay to allow clicking save button
    setTimeout(() => {
      if (isEditing) {
        handleSave();
      }
    }, 150);
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    const isHeading = element === 'h1' || element === 'h2' || element === 'h3' || element === 'h4' || element === 'h5' || element === 'h6';
    
    return (
      <div className="editable-text-container">
        <textarea
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`editable-textarea ${className} ${isHeading ? 'heading-textarea' : ''}`}
          placeholder={placeholder}
          rows={isHeading ? "2" : "3"}
        />
        <div className="edit-controls">
          <button 
            className="save-btn" 
            onClick={handleSave}
            title="Save (Enter)"
          >
            ✓
          </button>
          <button 
            className="cancel-btn" 
            onClick={handleCancel}
            title="Cancel (Esc)"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  const Element = element;
  return (
    <Element
      ref={textRef}
      className={`editable-text ${className}`}
      onClick={handleClick}
      title="Click to edit"
    >
      {currentText || placeholder}
    </Element>
  );
};

export default EditableText;
