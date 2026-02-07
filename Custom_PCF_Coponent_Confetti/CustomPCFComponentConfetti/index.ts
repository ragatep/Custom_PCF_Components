import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as confetti from 'canvas-confetti';

export class Confetti implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private myCanvas: HTMLCanvasElement;
    private _notifyOutputChanged: () => void;
    private myConfetti: confetti.CreateTypes;
    private timeoutId: number | undefined;
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
        this._notifyOutputChanged = notifyOutputChanged;
        this.myCanvas = document.createElement('canvas')
        this.myCanvas.style.width = '100%'
        this.myCanvas.style.height = '100%'
        container.appendChild(this.myCanvas)

        // Initialize confetti instance
        this.myConfetti = confetti.create(this.myCanvas, {
            resize: true,
            useWorker: true
        });
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Clear any pending timeout
        if (this.timeoutId !== undefined) {
            clearTimeout(this.timeoutId);
        }

        // Get parameters from context
        const spread = context.parameters.Spread.raw || 160;
        const delaySeconds = context.parameters.Delay.raw || 0;

        // Deploy confetti after delay
        this.timeoutId = window.setTimeout(() => {
            this.myConfetti({
                particleCount: 100,
                spread: spread,
            });
        }, delaySeconds * 1000); // Convert seconds to milliseconds
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
        // Clear any pending timeout
        if (this.timeoutId !== undefined) {
            clearTimeout(this.timeoutId);
        }
    }
}
