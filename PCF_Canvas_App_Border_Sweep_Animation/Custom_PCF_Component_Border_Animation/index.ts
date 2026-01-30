import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class GradientBorder implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _borderContainer: HTMLDivElement;
    private _notifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Store the notifyOutputChanged callback
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        // Ensure container has proper styling
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.minHeight = "50px";
        container.style.minWidth = "50px";
        container.style.display = "block";
        container.style.position = "relative";

        // Create the border container div
        this._borderContainer = document.createElement("div");
        this._borderContainer.classList.add("border-animation-container");
        
        // Append to container
        container.appendChild(this._borderContainer);

        // Set initial size to fill container
        this._borderContainer.style.width = "100%";
        this._borderContainer.style.height = "100%";
        this._borderContainer.style.minHeight = "50px";
        this._borderContainer.style.minWidth = "50px";
        
        // Apply initial styles to ensure component renders immediately
        // PCF will call updateView after init, but we set defaults here
        this.updateView(context);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Get property values with defaults
        const startColor = this.validateColor(context.parameters.StartColor.raw) || "#2d3561";
        const endColor = this.validateColor(context.parameters.EndColor.raw) || "#ffb961";
        const animationSpeed = this.validateAnimationSpeed(context.parameters.AnimationSpeed.raw) || 5;
        const borderRadius = this.validateBorderRadius(context.parameters.BorderRadius.raw) || 0;
        const opacity = this.validateOpacity(context.parameters.Opacity.raw) || 1.0;

        // Generate SVG data URI for border
        const svgDataUri = this.generateAnimatedBorderSVG(startColor, endColor, animationSpeed, opacity);

        // Apply styles to border container
        this._borderContainer.style.border = "10px solid transparent";
        this._borderContainer.style.borderImage = `url("${svgDataUri}") 1`;
        this._borderContainer.style.borderRadius = `${borderRadius}px`;
        
        // Hybrid approach: Use mask to support border-radius with border-image
        // This creates a mask that excludes the border area, allowing border-radius to work
        if (borderRadius > 0) {
            this._borderContainer.style.webkitMask = 
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)";
            this._borderContainer.style.webkitMaskComposite = "exclude";
            this._borderContainer.style.mask = 
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)";
            this._borderContainer.style.maskComposite = "exclude";
        } else {
            // Reset mask if no border radius
            this._borderContainer.style.webkitMask = "";
            this._borderContainer.style.webkitMaskComposite = "";
            this._borderContainer.style.mask = "";
            this._borderContainer.style.maskComposite = "";
        }
    }

    /**
     * Generates an animated border SVG as a data URI
     * Uses the hybrid approach: SVG for animation, CSS for border-radius support
     */
    private generateAnimatedBorderSVG(
        startColor: string,
        endColor: string,
        animationSpeed: number,
        opacity: number
    ): string {
        // Create SVG with animated stroke
        // The stroke uses stroke-dasharray and stroke-dashoffset for animation
        const svg = `
            <svg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <style>
                    path {
                        animation: stroke ${animationSpeed}s infinite linear;
                    }
                    @keyframes stroke {
                        to { stroke-dashoffset: 776; }
                    }
                </style>
                <linearGradient id='borderGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stop-color='${this.escapeXml(startColor)}' stop-opacity='${opacity}' />
                    <stop offset='25%' stop-color='${this.escapeXml(this.interpolateColor(startColor, endColor, 0.25))}' stop-opacity='${opacity}' />
                    <stop offset='50%' stop-color='${this.escapeXml(this.interpolateColor(startColor, endColor, 0.5))}' stop-opacity='${opacity}' />
                    <stop offset='75%' stop-color='${this.escapeXml(this.interpolateColor(startColor, endColor, 0.75))}' stop-opacity='${opacity}' />
                    <stop offset='100%' stop-color='${this.escapeXml(endColor)}' stop-opacity='${opacity}' />
                </linearGradient>
                <path d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' 
                      stroke-linecap='square' 
                      stroke='url(%23borderGradient)' 
                      stroke-width='3' 
                      stroke-dasharray='388'/>
            </svg>
        `.trim();

        // Encode SVG for data URI
        const encodedSvg = encodeURIComponent(svg);
        return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
    }

    /**
     * Validates and normalizes color values (hex format)
     */
    private validateColor(color: string | null | undefined): string | null {
        if (!color || typeof color !== "string") {
            return null;
        }

        // Trim whitespace
        const trimmedColor = color.trim();

        // Check if it's a valid hex color
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (hexPattern.test(trimmedColor)) {
            // Normalize 3-digit hex to 6-digit
            if (trimmedColor.length === 4) {
                return `#${trimmedColor[1]}${trimmedColor[1]}${trimmedColor[2]}${trimmedColor[2]}${trimmedColor[3]}${trimmedColor[3]}`;
            }
            return trimmedColor;
        }

        // Try to parse named colors or other formats (basic support)
        // For now, return null if invalid
        return null;
    }

    /**
     * Validates animation speed (0.1 to 60 seconds)
     */
    private validateAnimationSpeed(speed: number | null | undefined): number | null {
        if (speed === null || speed === undefined || isNaN(speed)) {
            return null;
        }
        // Clamp between 0.1 and 60 seconds
        return Math.max(0.1, Math.min(60, speed));
    }

    /**
     * Validates border radius (0 to 1000 pixels)
     */
    private validateBorderRadius(radius: number | null | undefined): number | null {
        if (radius === null || radius === undefined || isNaN(radius)) {
            return null;
        }
        // Clamp between 0 and 1000 pixels
        return Math.max(0, Math.min(1000, Math.round(radius)));
    }

    /**
     * Validates opacity (0 to 1.0)
     */
    private validateOpacity(opacity: number | null | undefined): number | null {
        if (opacity === null || opacity === undefined || isNaN(opacity)) {
            return null;
        }
        // Clamp between 0 and 1.0
        return Math.max(0, Math.min(1.0, opacity));
    }

    /**
     * Interpolates between two hex colors
     */
    private interpolateColor(color1: string, color2: string, factor: number): string {
        // Parse hex colors to RGB
        const rgb1 = this.hexToRgb(color1) || { r: 45, g: 53, b: 97 }; // Default fallback
        const rgb2 = this.hexToRgb(color2) || { r: 255, g: 185, b: 97 }; // Default fallback

        // Interpolate
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

        // Convert back to hex
        return this.rgbToHex(r, g, b);
    }

    /**
     * Converts hex color to RGB
     */
    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Converts RGB to hex color
     */
    private rgbToHex(r: number, g: number, b: number): string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Escapes XML special characters in color strings
     */
    private escapeXml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Clean up any resources
        // The container element will be automatically removed by the framework
        this._borderContainer = null as any;
        this._container = null as any;
    }
}
