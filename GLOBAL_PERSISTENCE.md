# Global Persistence Setup Guide 🌐

This document explains how the global persistence feature works and how to use it.

## 🎯 What is Global Persistence?

Global persistence means that when one user edits the website content, **all other users will see those changes**. This transforms your birthday website from a personal experience to a collaborative celebration where friends and family can contribute.

## 🔄 How It Works

### Before (Local Only)
- User edits content → Saved only in their browser
- Other users don't see the changes
- Each visitor has their own version

### After (Global Persistence)
- User edits content → Saved locally AND to server
- Changes sync to all users automatically
- Everyone sees the same updated content

## 🛠️ Technical Implementation

### Storage Architecture
```
User Edits → localStorage (instant) → Server API → JSON File
                                          ↓
All Users ← Auto-sync ← Server API ← JSON File
```

### Key Components Added

1. **Enhanced Storage System** (`src/utils/enhancedStorage.js`)
   - Hybrid local + server storage
   - Automatic background sync
   - Offline fallback support

2. **API Backend** (`api/data.js`)
   - Vercel serverless function
   - JSON file storage
   - RESTful API endpoints

3. **Sync Status Indicator** (`src/components/SyncStatusIndicator.js`)
   - Real-time sync monitoring
   - Manual sync controls
   - Visual feedback

## 📱 User Experience

### For Editors
1. Click any text to edit (same as before)
2. Changes save instantly locally
3. Sync indicator shows server sync status
4. Changes appear for all users within seconds

### For Viewers
1. Load page to see latest content from server
2. Watch sync indicator for real-time status
3. Use "Refresh from Server" to manually update

## 🚀 Deployment Setup

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Step 2: Verify API Functions
After deployment, check:
- Visit `https://your-app.vercel.app/api/data`
- Should return JSON with website data
- If error, check function logs in Vercel dashboard

### Step 3: Test Global Sync
1. Open website in multiple browsers/devices
2. Edit content in one browser
3. Refresh other browsers to see changes
4. Check sync indicator status

## 🔧 Configuration Options

### Disable Global Sync
Edit `src/utils/enhancedStorage.js`:
```javascript
const SYNC_ENABLED = false; // Disable server sync
```

### Adjust Sync Timing
```javascript
const SYNC_TIMEOUT = 5000; // API timeout (ms)
```

### Change Sync Check Interval
Edit `src/components/SyncStatusIndicator.js`:
```javascript
const interval = setInterval(updateStatus, 2000); // Check every 2s
```

## 🎨 Sync Status Indicator

Located in the top-right corner:

### Status Icons
- 🔒 **Offline Mode**: Server sync disabled
- 🔄 **Syncing**: Currently saving to server
- ⏳ **Pending**: Changes waiting to sync
- ✅ **Synced**: All changes saved globally

### Manual Controls
- **Sync Now**: Force sync pending changes
- **Refresh from Server**: Pull latest server data
- **Click indicator**: Show detailed status

## 🐛 Troubleshooting

### Common Issues

#### "Offline Mode" Always Showing
**Cause**: API function not deployed or accessible
**Fix**: 
1. Redeploy to Vercel
2. Check API endpoint: `/api/data`
3. Verify function logs

#### Changes Not Syncing
**Cause**: Network issues or API errors
**Fix**:
1. Check browser console for errors
2. Use "Sync Now" button manually
3. Verify internet connection

#### Server Data Not Loading
**Cause**: API function returning errors
**Fix**:
1. Check Vercel function logs
2. Verify `data/website-data.json` permissions
3. Try force refresh with "Refresh from Server"

### Debug Tips

1. **Check Browser Console**: All operations are logged with emoji indicators
2. **Monitor Sync Status**: Click sync indicator for detailed info
3. **Test API Directly**: Visit `/api/data` to test server response
4. **Verify File Permissions**: Ensure API can write to data directory

## 📊 Data Format

### Server Storage (`data/website-data.json`)
```json
{
  "heroTitle": "Happy Birthday!",
  "heroSubtitle": "Celebrating another amazing year",
  "birthdayMessageTitle": "Special Message",
  "birthdayMessageText": "Your birthday message here...",
  "memories": {
    "1": {
      "title": "Memory Title",
      "text": "Memory description..."
    }
  },
  "lastUpdated": "2025-07-24T10:30:00.000Z"
}
```

### Local Storage (Browser)
```
hero-title: "Happy Birthday!"
hero-subtitle: "Celebrating..."
memory-title-1: "Memory Title"
memory-text-1: "Memory description"
birthday-message-title: "Special Message"
birthday-message-text: "Your message..."
```

## 🔐 Security Considerations

### Current Implementation
- **No Authentication**: Anyone can edit
- **No Moderation**: Changes are immediate
- **No History**: Previous versions not stored

### For Production Use
Consider adding:
- Simple password protection
- Edit history/versioning
- Content moderation
- User identification

## 🚀 Advanced Features

### Add Real-time Updates
For instant updates without refresh:
1. Add WebSocket support
2. Implement Server-Sent Events
3. Use polling for updates

### Add User Tracking
Track who made changes:
1. Add user identification
2. Store edit history with usernames
3. Show "Last edited by" info

### Add Collaboration Features
Multiple users editing simultaneously:
1. Conflict resolution
2. Live cursors
3. Change highlighting

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console errors
3. Test API endpoints directly
4. Check Vercel function logs

---

**Happy Birthday! 🎉 Now with global collaboration!**
