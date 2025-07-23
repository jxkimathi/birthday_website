import React, { useState, useEffect } from 'react';
import { getBirthdayDataSummary, clearAllBirthdayData } from '../utils/localStorage';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);

  const refreshData = () => {
    const summary = getBirthdayDataSummary();
    setData(summary);
  };

  useEffect(() => {
    if (isVisible) {
      refreshData();
    }
  }, [isVisible]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      clearAllBirthdayData();
      refreshData();
      // Force page reload to show default content
      window.location.reload();
    }
  };

  if (!isVisible) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 10000
        }}
        onClick={() => setIsVisible(true)}
      >
        🔧 Debug
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        fontSize: '12px',
        zIndex: 10000,
        fontFamily: 'monospace'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>🔧 localStorage Debug Panel</h4>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={refreshData}
          style={{ 
            background: '#007acc', 
            border: 'none', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '5px',
            fontSize: '11px'
          }}
        >
          🔄 Refresh
        </button>
        <button 
          onClick={handleClearAll}
          style={{ 
            background: '#dc3545', 
            border: 'none', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          🗑️ Clear All
        </button>
      </div>

      {data && (
        <div>
          <h5 style={{ margin: '10px 0 5px 0' }}>Saved Data:</h5>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Hero Section:</strong>
            <div>Title: {data.heroTitle || '(default)'}</div>
            <div>Subtitle: {data.heroSubtitle || '(default)'}</div>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Birthday Message:</strong>
            <div>Title: {data.birthdayMessageTitle || '(default)'}</div>
            <div>Text: {data.birthdayMessageText ? `${data.birthdayMessageText.substring(0, 30)}...` : '(default)'}</div>
          </div>
          
          <div>
            <strong>Memory Sections:</strong>
            {Object.keys(data.memories).length === 0 ? (
              <div>(all default)</div>
            ) : (
              Object.entries(data.memories).map(([id, memory]) => (
                <div key={id} style={{ marginLeft: '10px' }}>
                  <strong>Memory {id}:</strong>
                  {memory.title && <div>Title: {memory.title}</div>}
                  {memory.text && <div>Text: {memory.text.substring(0, 30)}...</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
        <strong>How to test persistence:</strong>
        <ol style={{ margin: '5px 0', paddingLeft: '15px' }}>
          <li>Edit some text on the page</li>
          <li>Refresh this panel to see if it's saved</li>
          <li>Refresh the entire page</li>
          <li>Check if your changes remain</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPanel;
