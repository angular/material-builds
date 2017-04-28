import { ElementRef } from '@angular/core';
/**
 * Used in the `md-tab-group` view to display tab labels.
 * @docs-private
 */
export declare class MdTabLabelWrapper {
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    /** Whether the tab label is disabled.  */
    private _disabled;
    /** Whether the element is disabled. */
    disabled: any;
    /** Sets focus on the wrapper element */
    focus(): void;
    getOffsetLeft(): number;
    getOffsetWidth(): number;
}
