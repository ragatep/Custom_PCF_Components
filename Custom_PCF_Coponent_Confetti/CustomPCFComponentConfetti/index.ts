import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as confetti from 'canvas-confetti';

export class Confetti implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private myCanvas: HTMLCanvasElement;
    private _notifyOutputChanged: () => void;
    private myConfetti: any; 
    private timeoutId: number | undefined;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        
        // 1. CRITICAL: Enable resize tracking
        context.mode.trackContainerResize(true);

        this.myCanvas = document.createElement('canvas');
        this.myCanvas.style.width = '100%';
        this.myCanvas.style.height = '100%';
        container.appendChild(this.myCanvas);

        // 2. Initialize with resize: false so we control the dimensions
        this.myConfetti = confetti.create(this.myCanvas, {
            resize: false, 
            useWorker: true
        });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        if (this.timeoutId !== undefined) clearTimeout(this.timeoutId);

        // 3. Fix Resolution: Match internal bitmap size to display size
        if (context.mode.allocatedWidth > 0) {
            this.myCanvas.width = context.mode.allocatedWidth;
            this.myCanvas.height = context.mode.allocatedHeight;
        } else {
            this.myCanvas.width = this.myCanvas.clientWidth;
            this.myCanvas.height = this.myCanvas.clientHeight;
        }

        const spread = context.parameters.Spread.raw || 160;
        const delaySeconds = context.parameters.Delay.raw || 0;

        this.timeoutId = window.setTimeout(() => {
            this.myConfetti({
                particleCount: 100,
                spread: spread,
                origin: { x: 0.5, y: 0.5 }
            });
        }, delaySeconds * 1000);
    }

    public getOutputs(): IOutputs { return {}; }

    public destroy(): void {
        if (this.timeoutId !== undefined) clearTimeout(this.timeoutId);
        if(this.myConfetti) this.myConfetti.reset();
    }
}