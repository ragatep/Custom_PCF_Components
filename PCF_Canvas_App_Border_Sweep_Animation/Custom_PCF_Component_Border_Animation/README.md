# Border Animation PCF Component

A custom Power Apps Component Framework (PCF) component that displays an animated border with customizable gradient colors, animation speed, border radius, and opacity. Designed for use in Canvas Apps.

## Features

- ✨ **Animated Border**: Smooth gradient sweep animation using SVG border-image
- 🎨 **Customizable Colors**: Start and end colors for the gradient transition
- ⚡ **Animation Speed**: Control how fast or slow the animation executes (0.1-60 seconds)
- 📐 **Border Radius**: Define corner roundness (0-1000 pixels), similar to native Canvas App properties
- 👁️ **Opacity Control**: Adjust the opacity of the border colors (0-1.0, default 1.0)

## Architecture

This component uses a **hybrid approach**:
- **SVG border-image** for the animated gradient stroke (matches the original example)
- **CSS mask/clip-path** to support border-radius with border-image (hybrid technique)
- **Scoped CSS** to prevent conflicts with host Canvas App styling

## Project Structure

```
Custom_PCF_Component_Border_Animation/
├── ControlManifest.Input.xml      # Component manifest with property definitions
├── index.ts                        # Main TypeScript component logic
├── css/
│   └── BorderAnimation.css         # Scoped CSS styles
├── generated/
│   └── ManifestTypes.d.ts          # Auto-generated TypeScript types
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── pcfconfig.json                  # PCF build configuration
├── eslint.config.mjs               # ESLint configuration
└── README.md                       # This file
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **StartColor** | SingleLine.Text | `#2d3561` | Hex color code for the gradient start (e.g., `#2d3561`) |
| **EndColor** | SingleLine.Text | `#ffb961` | Hex color code for the gradient end (e.g., `#ffb961`) |
| **AnimationSpeed** | Decimal | `5` | Animation duration in seconds (0.1-60) |
| **BorderRadius** | Whole.None | `0` | Border radius in pixels (0-1000) |
| **Opacity** | Decimal | `1.0` | Opacity of border colors (0-1.0) |

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)
- Visual Studio Code (recommended)

### Installation

1. Navigate to the component directory:
   ```bash
   cd Custom_PCF_Component_Border_Animation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server with live reload:
   ```bash
   npm run start
   ```

2. Or start with watch mode:
   ```bash
   npm run start:watch
   ```

3. Build the component:
   ```bash
   npm run build
   ```

4. Clean build artifacts:
   ```bash
   npm run clean
   ```

5. Rebuild (clean + build):
   ```bash
   npm run rebuild
   ```

### Linting

1. Run linter:
   ```bash
   npm run lint
   ```

2. Fix auto-fixable issues:
   ```bash
   npm run lint:fix
   ```

## Building for Production

1. Build the component in production mode:
   ```bash
   npm run build
   ```

2. Package the solution (requires Power Apps CLI):
   ```bash
   pac solution init --publisher-name <publisher> --publisher-prefix <prefix>
   pac solution add-reference --path <path-to-component>
   msbuild /t:build /restore
   ```

## Usage in Canvas Apps

1. **Import the component** into your Canvas App solution
2. **Add the component** to a screen
3. **Configure properties** in the Properties pane:
   - Set Start Color (hex format, e.g., `#2d3561`)
   - Set End Color (hex format, e.g., `#ffb961`)
   - Adjust Animation Speed (e.g., `5` for 5 seconds)
   - Set Border Radius (e.g., `10` for 10 pixels)
   - Set Opacity (e.g., `1.0` for 100% opacity)

### Example Property Values

```javascript
// Example 1: Default (purple to orange gradient, 5s animation)
StartColor: "#2d3561"
EndColor: "#ffb961"
AnimationSpeed: 5
BorderRadius: 0
Opacity: 1.0

// Example 2: Custom colors with rounded corners
StartColor: "#ff0000"  // Red
EndColor: "#0000ff"    // Blue
AnimationSpeed: 3      // Faster animation
BorderRadius: 20       // Rounded corners
Opacity: 0.8           // 80% opacity
```

## Implementation Details

### SVG Generation

The component dynamically generates an SVG border-image with:
- Animated stroke using `stroke-dasharray` and `stroke-dashoffset`
- CSS `@keyframes` animation for smooth sweep effect
- Linear gradient with interpolated color stops
- Proper URL encoding for data URI

### Border-Radius Support

The hybrid approach uses CSS `mask` property to support border-radius with SVG border-image:
- When `borderRadius > 0`, applies mask to exclude border area
- Allows border-radius to work correctly with border-image
- Falls back gracefully if mask is not supported

### Color Validation

- Validates hex color format (#RGB or #RRGGBB)
- Normalizes 3-digit hex to 6-digit
- Provides sensible defaults if invalid colors provided
- Interpolates between start and end colors for gradient stops

## Browser Compatibility

Tested and supported on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

All modern browsers supported by Canvas Apps are compatible.

## Best Practices

This component follows Microsoft PCF best practices:

- ✅ **Scoped CSS**: All styles are namespaced to prevent conflicts
- ✅ **Input Properties**: Uses input properties for customization
- ✅ **Resource Cleanup**: Properly cleans up in `destroy()` method
- ✅ **Property Validation**: Validates and sanitizes all input values
- ✅ **Performance**: Uses CSS animations (GPU-accelerated)
- ✅ **Responsive**: Supports container resizing

## Troubleshooting

### Border-radius not working
- Ensure `BorderRadius` is greater than 0
- Check browser support for CSS `mask` property
- Verify the component is using the hybrid approach

### Colors not displaying correctly
- Verify hex color format (e.g., `#2d3561`, not `2d3561`)
- Check that colors are valid hex codes
- Ensure opacity is between 0 and 1.0

### Animation not visible
- Check that `AnimationSpeed` is set (default: 5 seconds)
- Verify the container has sufficient size (min 50x50px)
- Ensure opacity is greater than 0

## Limitations

- Border-radius support uses CSS mask, which may have slight visual differences in some browsers
- SVG border-image may not perfectly align with very large border-radius values
- Animation uses CPU/GPU resources - limit instances per screen for performance

## Contributing

When contributing to this component:
1. Follow PCF best practices
2. Ensure all CSS is properly scoped
3. Validate all property inputs
4. Test across multiple browsers
5. Update documentation as needed

## License

MIT License

## References

- [Power Apps Component Framework Documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview)
- [PCF Best Practices](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/code-components-best-practices)
- [Canvas Apps PCF Guide](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps)

---

**Version**: 0.0.1  
**Last Updated**: Initial implementation  
**Component Namespace**: `rcaCustomPCFComponentBorderAnimation`
