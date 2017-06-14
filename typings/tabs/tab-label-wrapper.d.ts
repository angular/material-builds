/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
