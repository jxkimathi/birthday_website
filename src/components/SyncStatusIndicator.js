import React, { useState, useEffect } from 'react';
import { getSyncStatus, syncAllPending, forceSync } from '../utils/enhancedStorage';

const SyncStatusIndicator = () => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Update sync status every 2 seconds
    const updateStatus = () => {
      const status = getSyncStatus();
      setSyncStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncAll = async () => {
    try {
      const success = await syncAllPending();
      if (success) {
        console.log('✅ Manual sync completed');
      } else {
        console.error('❌ Manual sync failed');
      }
    } catch (error) {
      console.error('❌ Manual sync error:', error);
    }
  };

  const handleForceSync = async () => {
    try {
      const success = await forceSync();
      if (success) {
        console.log('✅ Force sync completed');
      } else {
        console.error('❌ Force sync failed');
      }
    } catch (error) {
      console.error('❌ Force sync error:', error);
    }
  };

  if (!syncStatus || !syncStatus.syncEnabled) {
    return null; // Don't show if sync is disabled
  }

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) return '🔄';
    if (syncStatus.hasPendingUpdates) return '⏳';
    return '✅';
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress) return 'Syncing...';
    if (syncStatus.hasPendingUpdates) return `${syncStatus.pendingUpdates} pending`;
    return 'Synced';
  };

  const getStatusColor = () => {
    if (syncStatus.syncInProgress) return '#ff9800';
    if (syncStatus.hasPendingUpdates) return '#f44336';
    return '#4caf50';
  };

  return (
    <div className="sync-status-container">
      <div 
        className="sync-status-indicator"
        onClick={() => setShowDetails(!showDetails)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: getStatusColor(),
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          userSelect: 'none',
          transition: 'all 0.3s ease'
        }}
        title="Click for sync details"
      >
        <span style={{ marginRight: '5px' }}>{getStatusIcon()}</span>
        {getStatusText()}
      </div>

      {showDetails && (
        <div 
          className="sync-details-panel"
          style={{
            position: 'fixed',
            top: '60px',
            right: '20px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '250px',
            fontSize: '13px'
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <strong>Sync Status</strong>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#666' }}>Status:</span> {getStatusText()}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#666' }}>Pending Updates:</span> {syncStatus.pendingUpdates}
          </div>
          
          {syncStatus.lastSyncTime && (
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Last Sync:</span> 
              <br />
              <small>{new Date(syncStatus.lastSyncTime).toLocaleString()}</small>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {syncStatus.hasPendingUpdates && (
              <button
                onClick={handleSyncAll}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Sync Now
              </button>
            )}
            
            <button
              onClick={handleForceSync}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Force Sync
            </button>
            
            <button
              onClick={() => setShowDetails(false)}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
            Changes are automatically synced across all users
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
