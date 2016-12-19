import { ModuleWithProviders } from '@angular/core';
/**
 * <md-progress-bar> component.
 */
export declare class MdProgressBar {
    /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
    private _value;
    value: number;
    /** Buffer value of the progress bar. Defaults to zero. */
    private _bufferValue;
    bufferValue: number;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
    /** Gets the current transform value for the progress bar's primary indicator. */
    _primaryTransform(): {
        transform: string;
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    _bufferTransform(): {
        transform: string;
    };
}
export declare class MdProgressBarModule {
    static forRoot(): ModuleWithProviders;
}
