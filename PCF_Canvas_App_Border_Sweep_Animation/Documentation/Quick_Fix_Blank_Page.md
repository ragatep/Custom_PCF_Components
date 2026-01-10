# Quick Fix for Blank Page in PCF Test Harness

## Immediate Steps to Try

### Step 1: Check Browser Console (CRITICAL!)

**This is the most important step!**

1. In your browser at `localhost:8181`, press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Look for any **red error messages**
4. **Copy and paste any errors you see** - this will help identify the issue

### Step 2: Hard Refresh the Page

Try a hard refresh to clear browser cache:
- **Windows**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

### Step 3: Restart the Test Harness

1. **Stop the current test harness**:
   - Go to the terminal/command prompt where `npm run start` is running
   - Press `Ctrl + C` to stop it

2. **Rebuild and restart**:
   ```powershell
   cd "E:\joffet\Documents\GitHubRepo\Custom_PCF_Components\PCF_Canvas_App_Border_Sweep_Animation\Custom_PCF_Component_Border_Animation"
   
   # Clean and rebuild
   npm run clean
   npm run build
   
   # Start the test harness again
   npm run start
   ```

3. **Wait for the browser to open** (or manually navigate to `http://localhost:8181`)

4. **Check the console again** (F12) for any errors

### Step 4: Verify Files Are Loading

In Browser Developer Tools (F12):
1. Go to the **Network** tab
2. Refresh the page (F5)
3. Check if these files load successfully (status should be 200):
   - `bundle.js`
   - `ControlManifest.xml`
   - `css/BorderAnimation.css`

If any show 404 (Not Found), there's a file loading issue.

### Step 5: Check the Terminal Output

Look at the terminal where `npm run start` is running:

**Expected output:**
```
[start] Initializing...
[start] Starting server...
[start] Building component...
[start] Server running on http://localhost:8181
```

If you see errors here, share them.

## Common Issues and Solutions

### Issue: "Cannot find module" error in console
**Solution**: Run `npm run refreshTypes` then `npm run build`

### Issue: "Component not found" error
**Solution**: Verify the class name matches the manifest constructor name (it should ✅)

### Issue: All files load but page is still blank
**Solution**: Check if the component's `init()` method is being called. Look for errors related to DOM manipulation.

### Issue: Port conflict
**Solution**: The test harness might be using a different port. Check the terminal output for the actual port number (might be 8182, 8183, etc.)

## What to Report

If the page is still blank after these steps, please share:

1. **Browser Console Errors** (from Console tab, F12)
2. **Network Tab Errors** (any files with status 404 or 500)
3. **Terminal Output** (from where `npm run start` is running)
4. **Browser Name and Version** (Chrome, Edge, Firefox, etc.)

This information will help identify the exact issue!

## Alternative: Check Page Source

If the page is completely blank, check if HTML is being served:

1. Right-click on the blank page → "View Page Source"
2. You should see HTML with references to:
   - `bundle.js`
   - `ControlManifest.xml`
   - Test harness UI

If the page source is also blank or shows an error, there's a server issue.
