import React, { useState, useEffect } from 'react';
import { getBirthdayDataSummary, clearAllBirthdayData } from '../utils/localStorage';
import { 
  saveAsDefaults, 
  restoreFromBackup, 
  resetToOriginalDefaults,
  generateUpdatedDefaults,
  getPhotoDefaults,
  clearAllPhotoDefaults,
  applyPhotoDefaults
} from '../utils/defaultsManager';
import { generateAllUpdatedCode, downloadUpdatedFiles } from '../utils/codeGenerator';

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

  const handleSaveAsDefaults = async () => {
    if (window.confirm('Save current changes as new default values? This will make them the baseline for the website.')) {
      const result = await saveAsDefaults();
      if (result) {
        alert('✅ Current values saved as new defaults!\n\nThe next time someone visits this page, they will see these values as the starting point.');
        refreshData();
      } else {
        alert('❌ Failed to save defaults. Check console for details.');
      }
    }
  };

  const handleRestoreBackup = () => {
    const backup = restoreFromBackup();
    if (backup) {
      alert(`📋 Backup found from: ${new Date(backup.timestamp).toLocaleString()}\n\nCheck console for details.`);
      console.log('Backup data:', backup);
    } else {
      alert('📋 No backup found.');
    }
  };

  const handleResetToOriginal = () => {
    if (window.confirm('Reset to original default values? This will clear all customizations and reload the page.')) {
      resetToOriginalDefaults();
    }
  };

  const handleViewCurrentDefaults = () => {
    const defaults = generateUpdatedDefaults();
    console.log('Current defaults that would be saved:', defaults);
    alert('📋 Current defaults logged to console. Open developer tools to view.');
  };

  const handleGenerateCode = () => {
    const updatedCode = generateAllUpdatedCode();
    alert('🔧 Updated source code generated!\n\nCheck the console for the complete code.\nYou can copy-paste this into your source files to make changes permanent.');
    return updatedCode;
  };

  const handleDownloadFiles = () => {
    const success = downloadUpdatedFiles();
    if (success) {
      alert('📥 Updated files prepared for download!\n\nCheck your downloads folder for the updated source files.');
    } else {
      alert('❌ Failed to generate download files. Check console for details.');
    }
  };

  const handleViewPhotoDefaults = () => {
    const photoDefaults = getPhotoDefaults();
    const count = Object.keys(photoDefaults).length;
    
    if (count > 0) {
      console.log('📷 Current photo defaults:', photoDefaults);
      alert(`📷 Found ${count} photo default(s)!\n\nCheck console for details. Photos that have been set as defaults will be shown to new users.`);
    } else {
      alert('📷 No photo defaults found.\n\nRight-click on uploaded photos to set them as defaults.');
    }
  };

  const handleClearPhotoDefaults = () => {
    if (window.confirm('Clear all photo defaults? This will remove all photos that have been set as defaults.')) {
      const success = clearAllPhotoDefaults();
      if (success) {
        alert('✅ All photo defaults cleared!\n\nNew users will now see the original placeholder images.');
        refreshData();
      } else {
        alert('❌ Failed to clear photo defaults. Check console for details.');
      }
    }
  };

  const handleApplyPhotoDefaults = () => {
    if (window.confirm('Apply photo defaults to current session? This will load any photos that have been set as defaults.')) {
      const success = applyPhotoDefaults();
      if (success) {
        alert('✅ Photo defaults applied!\n\nReload the page to see the default photos.');
        window.location.reload();
      } else {
        alert('❌ Failed to apply photo defaults. Check console for details.');
      }
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
            marginRight: '5px',
            fontSize: '11px'
          }}
        >
          🗑️ Clear All
        </button>
      </div>

      <div style={{ marginBottom: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
        <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>
          <strong>💾 Defaults Management:</strong>
        </div>
        <button 
          onClick={handleSaveAsDefaults}
          style={{ 
            background: '#28a745', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          💾 Save as Defaults
        </button>
        <button 
          onClick={handleViewCurrentDefaults}
          style={{ 
            background: '#6c757d', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          👁️ View Defaults
        </button>
        <br />
        <button 
          onClick={handleRestoreBackup}
          style={{ 
            background: '#17a2b8', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          📋 View Backup
        </button>
        <button 
          onClick={handleResetToOriginal}
          style={{ 
            background: '#fd7e14', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          🔄 Reset Original
        </button>
      </div>

      <div style={{ marginBottom: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
        <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>
          <strong>📷 Photo Defaults:</strong>
        </div>
        <button 
          onClick={handleViewPhotoDefaults}
          style={{ 
            background: '#6c757d', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          👁️ View Photo Defaults
        </button>
        <button 
          onClick={handleApplyPhotoDefaults}
          style={{ 
            background: '#17a2b8', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          📥 Apply Defaults
        </button>
        <br />
        <button 
          onClick={handleClearPhotoDefaults}
          style={{ 
            background: '#dc3545', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          🗑️ Clear Photo Defaults
        </button>
      </div>

      <div style={{ marginBottom: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
        <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>
          <strong>🔧 Code Generation:</strong>
        </div>
        <button 
          onClick={handleGenerateCode}
          style={{ 
            background: '#6f42c1', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          🔧 Generate Code
        </button>
        <button 
          onClick={handleDownloadFiles}
          style={{ 
            background: '#20c997', 
            border: 'none', 
            color: 'white', 
            padding: '5px 8px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginRight: '3px',
            marginBottom: '3px',
            fontSize: '10px'
          }}
        >
          📥 Download Files
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
        <strong>💾 Making Changes Permanent:</strong>
        <ol style={{ margin: '5px 0', paddingLeft: '15px', fontSize: '10px' }}>
          <li>Edit content on the page</li>
          <li>Click "Generate Code" to create updated source files</li>
          <li>Copy the generated code from console into your source files</li>
          <li>Or use "Download Files" to get updated files</li>
          <li>Deploy the updated files to make changes permanent</li>
        </ol>
        <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '5px' }}>
          This makes your edits the new "hardcoded" defaults for all users.
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
