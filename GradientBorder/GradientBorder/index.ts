import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class GradientBorder implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private width = 100;
    private height = 100;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.container = container;
        this.container.style.position = "relative";
        this.container.style.overflow = "hidden";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {

        // 1. GET DIMENSIONS & FORCE SIZE
        this.width = context.mode.allocatedWidth;
        this.height = context.mode.allocatedHeight;

        if (this.width <= 0) {
            this.width = this.container.clientWidth;
        }
        if (this.height <= 0) {
            this.height = this.container.clientHeight;
        }

        // Safety fallback
        if (this.width <= 0) this.width = 300;
        if (this.height <= 0) this.height = 300;

        this.container.style.width = `${this.width}px`;
        this.container.style.height = `${this.height}px`;

        // 2. GET PROPERTIES
        const startColor = context.parameters.startColor.raw || "#2d3561";
        const endColor = context.parameters.endColor.raw || "#c05c7e";
        const duration = context.parameters.animDuration.raw || 5;
        const radius = context.parameters.borderRadius.raw || 15;
        const strokeWidth = context.parameters.strokeWidth.raw || 10;
        const opacityVal = context.parameters.borderOpacity.raw || 100;

        const iterInput = context.parameters.animIterationCount.raw;
        const iterationCount = (iterInput === null || iterInput <= 0) ? "infinite" : iterInput.toString();

        const opacity = opacityVal / 100;

        // 3. CALCULATE GEOMETRY
        const offset = strokeWidth / 2;
        const rectW = Math.max(0, this.width - strokeWidth);
        const rectH = Math.max(0, this.height - strokeWidth);
        const perimeter = (2 * rectW) + (2 * rectH);

        // 4. GENERATE SVG
        // CHANGE 1: We changed the keyframe to animate to '0' instead of 'perimeter * 2'.
        // This reverses the flow to be CLOCKWISE.
        const svgHTML = `
            <svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg" style="position:absolute; top:0; left:0;">
                
                <defs>
                    <linearGradient id="gGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${startColor}" />
                        <stop offset="50%" stop-color="${endColor}" />
                        <stop offset="100%" stop-color="${startColor}" />
                    </linearGradient>
                    
                    <style>
                        .border-path {
                            animation: strokeAnim ${duration}s linear ${iterationCount}; 
                            animation-fill-mode: forwards;
                            opacity: ${opacity};
                        }
                        @keyframes strokeAnim {
                            to { stroke-dashoffset: 0; } 
                        }
                    </style>
                </defs>

                <rect 
                    x="${offset}" 
                    y="${offset}" 
                    width="${rectW}" 
                    height="${rectH}" 
                    rx="${radius}"
                    fill="transparent"
                    stroke="url(#gGradient)"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${perimeter}"
                    stroke-dashoffset="${perimeter}"
                    stroke-linecap="round"
                    class="border-path"
                />
            </svg>
        `;

        this.container.innerHTML = svgHTML;
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this.container.innerHTML = "";
    }
}