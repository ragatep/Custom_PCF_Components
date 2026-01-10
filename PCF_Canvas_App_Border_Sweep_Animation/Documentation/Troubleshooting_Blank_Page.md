# Troubleshooting Blank Page in PCF Test Harness

## Issue: Blank Page at localhost:8181

If you see a blank page when opening the PCF Test Harness, follow these troubleshooting steps:

## Step 1: Check Browser Console for Errors

**Most Important Step!**

1. Open Browser Developer Tools:
   - Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Or Right-click → "Inspect" / "Inspect Element"

2. Check the **Console** tab:
   - Look for **red error messages**
   - Common errors might include:
     - "Cannot find module"
     - "Component is not defined"
     - "ReferenceError"
     - "TypeError"
     - Syntax errors

3. Share any errors you see - they will help identify the issue

## Step 2: Check Network Tab

1. In Developer Tools, go to the **Network** tab
2. Refresh the page (`F5` or `Ctrl+R`)
3. Check if files are loading:
   - `bundle.js` should load with status 200
   - `ControlManifest.xml` should load with status 200
   - `BorderAnimation.css` should load with status 200
4. Look for any 404 (Not Found) errors

## Step 3: Verify Component Files Are Present

Run this in PowerShell:
```powershell
cd "E:\joffet\Documents\GitHubRepo\Custom_PCF_Components\PCF_Canvas_App_Border_Sweep_Animation\Custom_PCF_Component_Border_Animation"
Test-Path "out\controls\bundle.js"        # Should be True
Test-Path "out\controls\ControlManifest.xml"  # Should be True
Test-Path "out\controls\css\BorderAnimation.css"  # Should be True
```

## Step 4: Restart the Test Harness

Sometimes the test harness needs to be restarted after building:

1. Stop the current server:
   - In the terminal where `npm run start` is running
   - Press `Ctrl+C` to stop it

2. Rebuild the component:
   ```powershell
   cd "E:\joffet\Documents\GitHubRepo\Custom_PCF_Components\PCF_Canvas_App_Border_Sweep_Animation\Custom_PCF_Component_Border_Animation"
   npm run clean
   npm run build
   ```

3. Start the test harness again:
   ```powershell
   npm run start
   ```

4. Try refreshing the browser (`F5`)

## Step 5: Check Component Registration

The component class name must match the constructor name in the manifest:

**Manifest** (`ControlManifest.xml`):
```xml
<control namespace="rcaCustomPCFComponentBorderAnimation" constructor="rcaCustomPCFComponentBorderAnimation" ...>
```

**TypeScript** (`index.ts`):
```typescript
export class rcaCustomPCFComponentBorderAnimation implements ComponentFramework.StandardControl<IInputs, IOutputs> {
```

These should match exactly (they do in our case ✅)

## Step 6: Check for Common Issues

### Issue: Component Not Initializing
- **Symptom**: Blank page, no errors in console
- **Possible Cause**: Component's `init()` method might be throwing an error
- **Fix**: Check console for initialization errors

### Issue: CSS Not Loading
- **Symptom**: Component renders but looks broken
- **Possible Cause**: CSS file path incorrect in manifest
- **Fix**: Verify CSS path in ControlManifest.xml is `css/BorderAnimation.css`

### Issue: Manifest Parsing Error
- **Symptom**: Blank page with manifest error in console
- **Possible Cause**: Invalid XML in ControlManifest.xml
- **Fix**: Validate XML syntax

### Issue: Module Not Found
- **Symptom**: "Cannot find module" error in console
- **Possible Cause**: Bundle.js not exporting correctly
- **Fix**: Rebuild the component

## Step 7: Try Hard Refresh

Sometimes browser caching can cause issues:

1. Hard refresh the page:
   - Windows: `Ctrl+Shift+R` or `Ctrl+F5`
   - Mac: `Cmd+Shift+R`

2. Or clear browser cache:
   - Chrome/Edge: `Ctrl+Shift+Delete` → Clear cached images and files

## Step 8: Check Port Conflicts

If port 8181 is already in use:

1. Check what's using the port:
   ```powershell
   netstat -ano | findstr :8181
   ```

2. The test harness might use a different port (8182, 8183, etc.)
   - Check the terminal output for the actual port number
   - Navigate to that port instead

## Step 9: Verify Test Harness is Running

Check the terminal where you ran `npm run start`:

**Expected Output:**
```
[start] Initializing...
[start] Starting server...
[start] Building component...
[start] Server running on http://localhost:8181
```

If you see errors in the terminal, share them.

## Step 10: Check Browser Compatibility

PCF Test Harness should work in:
- ✅ Chrome (latest)
- ✅ Edge (latest)
- ✅ Firefox (latest)
- ⚠️ Safari (may have issues)
- ❌ Internet Explorer (not supported)

Try a different browser if one doesn't work.

## Debugging Checklist

Use this checklist to debug:

- [ ] Browser Developer Tools opened (F12)
- [ ] Console tab checked for errors
- [ ] Network tab checked for failed requests
- [ ] Component files exist in `out\controls\`
- [ ] Component rebuilt (`npm run build`)
- [ ] Test harness restarted (`npm run start`)
- [ ] Browser refreshed (F5 or hard refresh)
- [ ] Different browser tried
- [ ] Port number verified in terminal
- [ ] No port conflicts

## Common Error Messages and Solutions

### "Cannot read property 'X' of undefined"
- **Cause**: Component trying to access undefined property
- **Fix**: Check component initialization code

### "Module not found: Can't resolve './generated/ManifestTypes'"
- **Cause**: Generated types not created
- **Fix**: Run `npm run refreshTypes` then `npm run build`

### "Component framework error: Control not found"
- **Cause**: Component class name doesn't match manifest
- **Fix**: Verify class name matches constructor name exactly

### "CORS error" or "Cross-origin request blocked"
- **Cause**: Browser blocking local files
- **Fix**: This shouldn't happen with test harness, but try different browser

### "Blank white page, no errors"
- **Cause**: Component might not be initializing
- **Fix**: Check `init()` method, verify container element exists

## Still Having Issues?

If the page is still blank after these steps:

1. **Share the browser console errors** (copy/paste the red error messages)
2. **Share the Network tab** - which files failed to load (404 errors)
3. **Share the terminal output** - any errors from `npm run start`

This information will help identify the specific issue!

## Quick Fix: Full Rebuild

If nothing else works, try a full rebuild:

```powershell
cd "E:\joffet\Documents\GitHubRepo\Custom_PCF_Components\PCF_Canvas_App_Border_Sweep_Animation\Custom_PCF_Component_Border_Animation"

# Clean everything
npm run clean
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force generated -ErrorAction SilentlyContinue

# Reinstall dependencies
npm install

# Refresh types
npm run refreshTypes

# Rebuild
npm run build

# Start test harness
npm run start
```

---

**Remember**: The browser console (F12) is your best friend! Most issues will show error messages there.
