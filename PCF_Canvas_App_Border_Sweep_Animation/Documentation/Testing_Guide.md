# PCF Component Testing Guide - Border Animation

## Starting the PCF Test Harness

### Step-by-Step Instructions

1. **Open PowerShell or Command Prompt**

2. **Navigate to the component directory**:
   ```powershell
   cd "E:\joffet\Documents\GitHubRepo\Custom_PCF_Components\PCF_Canvas_App_Border_Sweep_Animation\Custom_PCF_Component_Border_Animation"
   ```

3. **Start the test harness**:
   ```powershell
   npm run start
   ```

4. **Wait for the server to start**:
   - The command will build the component (if needed)
   - Start a local web server (usually on port 8181)
   - Automatically open your default browser to the test harness

### What to Expect

- **Server Starting**: You'll see output like:
  ```
  [start] Initializing...
  [start] Starting server...
  [start] Server running on http://localhost:8181
  ```

- **Browser Opens**: Your default browser should automatically open to:
  ```
  http://localhost:8181
  ```

- **Test Harness Interface**: You'll see the PCF Test Harness with your component loaded

## Using the Test Harness

### Testing Component Properties

The test harness allows you to test all 5 properties:

1. **StartColor** (Text input)
   - Default: `#2d3561`
   - Try values like: `#ff0000`, `#00ff00`, `#0000ff`

2. **EndColor** (Text input)
   - Default: `#ffb961`
   - Try different color combinations

3. **AnimationSpeed** (Number input)
   - Default: `5` (seconds)
   - Try faster: `2` or slower: `10`
   - Range: 0.1 to 60 seconds

4. **BorderRadius** (Number input)
   - Default: `0` (pixels)
   - Try: `10`, `20`, `50` for rounded corners

5. **Opacity** (Number input)
   - Default: `1.0` (100% opacity)
   - Try: `0.5` for 50% opacity, `0.25` for 25%
   - Range: 0.0 to 1.0

### Testing Scenarios

#### Basic Test
- Set StartColor: `#2d3561`
- Set EndColor: `#ffb961`
- AnimationSpeed: `5`
- BorderRadius: `0`
- Opacity: `1.0`
- **Expected**: Animated border with purple to orange gradient, no rounded corners

#### Rounded Corners Test
- BorderRadius: `20`
- All other defaults
- **Expected**: Same animation but with 20px rounded corners

#### Fast Animation Test
- AnimationSpeed: `2`
- All other defaults
- **Expected**: Faster border animation (2 seconds per cycle)

#### Low Opacity Test
- Opacity: `0.5`
- All other defaults
- **Expected**: Border visible but at 50% opacity

#### Custom Colors Test
- StartColor: `#ff0000` (red)
- EndColor: `#0000ff` (blue)
- AnimationSpeed: `3`
- BorderRadius: `15`
- Opacity: `0.8`
- **Expected**: Red to blue gradient animation, 15px rounded corners, 80% opacity

#### Invalid Color Test
- StartColor: `invalid-color`
- **Expected**: Component should use default color (`#2d3561`) or handle gracefully

## What to Look For

### Visual Checks
- ✅ Border animation is smooth and continuous
- ✅ Gradient colors match the input colors
- ✅ Animation speed matches the AnimationSpeed property
- ✅ Border radius creates rounded corners (when > 0)
- ✅ Opacity affects the visibility correctly
- ✅ Component resizes correctly when container size changes

### Browser Console Checks
- Open browser Developer Tools (F12)
- Check Console tab for any errors
- Should see no JavaScript errors
- Should see no console warnings related to the component

### Performance Checks
- Animation should be smooth (60fps)
- No lag or stuttering
- Component should render quickly

## Common Issues & Solutions

### Issue: Browser doesn't open automatically
**Solution**: Manually navigate to `http://localhost:8181`

### Issue: Component doesn't display
**Solution**: 
1. Check browser console for errors
2. Verify the component built successfully (`npm run build`)
3. Try refreshing the page (F5)

### Issue: Animation not visible
**Solution**:
- Check that AnimationSpeed is > 0
- Verify Opacity is > 0
- Check that container has a visible size (not 0x0)

### Issue: Border-radius not working
**Solution**:
- This is expected - the hybrid approach uses CSS mask
- May have slight visual differences in some browsers
- Test in different browsers (Chrome, Edge, Firefox)

### Issue: Colors not displaying correctly
**Solution**:
- Verify hex color format: `#RRGGBB` or `#RGB`
- Check browser console for validation errors
- Invalid colors should fallback to defaults

## Stopping the Test Harness

To stop the test harness:
1. In the terminal window, press `Ctrl + C`
2. Or close the terminal window
3. The server will stop and the browser will disconnect

## Testing in Different Browsers

For thorough testing, test the component in:
- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari (if on Mac)

## Next Steps After Testing

1. **If everything works**: Proceed with packaging the solution
2. **If issues found**: Note the issues and we'll fix them
3. **Performance concerns**: We can optimize based on findings

## Testing Checklist

Use this checklist when testing:

- [ ] Component displays correctly
- [ ] Border animation is visible and smooth
- [ ] StartColor property works
- [ ] EndColor property works
- [ ] AnimationSpeed property works (test different values)
- [ ] BorderRadius property works (test 0, 10, 20, 50)
- [ ] Opacity property works (test 0, 0.5, 1.0)
- [ ] Invalid colors handled gracefully
- [ ] Component resizes correctly
- [ ] No console errors
- [ ] Performance is smooth (60fps)
- [ ] Works in multiple browsers

---

**Note**: The test harness runs in the background. Keep the terminal window open while testing. Press `Ctrl+C` to stop the server when done testing.
