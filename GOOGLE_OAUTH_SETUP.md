# Google OAuth Setup Instructions

## Problem
The Google Sign-In is failing with errors:
- "The given origin is not allowed for the given client ID"
- "Cross-Origin-Opener-Policy policy would block the window.postMessage call"

## Solution
You need to configure your Google OAuth client to allow the correct origins.

### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Select your project or create a new one
3. Go to "APIs & Services" > "Credentials"

### Step 2: Configure OAuth Client
1. Find your OAuth 2.0 Client ID: `650272471355-pe937i114pgluu3q43v8v0gb3pmla5bp.apps.googleusercontent.com`
2. Click on it to edit

### Step 3: Add Authorized Origins
Add these origins under "Authorized JavaScript origins":
- `http://localhost:3000` (if using Create React App)
- `http://localhost:5173` (if using Vite)
- `http://localhost:5000` (your server)
- Your production domain when deployed

### Step 4: Add Authorized Redirect URIs
Add these redirect URIs:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5000/auth/google/callback`
- Your production domain

### Step 5: Save Changes
Click "Save" and wait a few minutes for changes to propagate.

## Server Configuration
The server has been updated with:
- Improved CORS configuration
- Removed restrictive Cross-Origin-Opener-Policy headers
- Added proper OAuth headers

## Testing
After updating Google Cloud Console:
1. Restart your development servers
2. Try logging in with Google again
3. The errors should be resolved








