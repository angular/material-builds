import { RippleConfig, RippleRenderer } from './ripple-renderer';
/**
 * Reference to a previously launched ripple element.
 */
export declare class RippleRef {
    private _renderer;
    element: HTMLElement;
    config: RippleConfig;
    constructor(_renderer: RippleRenderer, element: HTMLElement, config: RippleConfig);
    /** Fades out the ripple element. */
    fadeOut(): void;
}
