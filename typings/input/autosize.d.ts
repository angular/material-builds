import { ElementRef, AfterViewInit } from '@angular/core';
/**
 * Directive to automatically resize a textarea to fit its content.
 */
export declare class MdTextareaAutosize implements AfterViewInit {
    private _elementRef;
    /** @deprecated Use mdAutosizeMinRows */
    minRows: number;
    /** Minimum number of rows for this textarea. */
    mdAutosizeMinRows: number;
    /** @deprecated Use mdAutosizeMaxRows */
    maxRows: number;
    /** Minimum number of rows for this textarea. */
    mdAutosizeMaxRows: number;
    /** Cached height of a textarea with a single row. */
    private _cachedLineHeight;
    constructor(_elementRef: ElementRef);
    /** The minimum height of the textarea as determined by minRows. */
    readonly _minHeight: string;
    /** The maximum height of the textarea as determined by maxRows. */
    readonly _maxHeight: string;
    ngAfterViewInit(): void;
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     */
    private _cacheTextareaLineHeight();
    /** Resize the textarea to fit its content. */
    resizeToFitContent(): void;
}
