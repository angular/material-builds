import { Optional } from '@angular/core';
/**
 * Simple utility for getting the bounds of the browser viewport.
 * @docs-private
 */
export declare class ViewportRuler {
    /** Gets a ClientRect for the viewport's bounds. */
    getViewportRect(): ClientRect;
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param documentRect
     */
    getViewportScrollPosition(documentRect?: ClientRect): {
        top: number;
        left: number;
    };
}
export declare function VIEWPORT_RULER_PROVIDER_FACTORY(parentDispatcher: ViewportRuler): ViewportRuler;
export declare const VIEWPORT_RULER_PROVIDER: {
    provide: typeof ViewportRuler;
    deps: Optional[][];
    useFactory: (parentDispatcher: ViewportRuler) => ViewportRuler;
};
