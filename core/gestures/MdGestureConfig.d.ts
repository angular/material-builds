import { HammerGestureConfig } from '@angular/platform-browser';
export declare class MdGestureConfig extends HammerGestureConfig {
    events: string[];
    buildHammer(element: HTMLElement): HammerManager;
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    private _createRecognizer(base, options, ...inheritances);
}
