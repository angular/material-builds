/**
 * @fileoverview added by tsickle
 * Generated from: src/material/expansion/accordion-base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * Base interface for a `MatAccordion`.
 * \@docs-private
 * @record
 */
export function MatAccordionBase() { }
if (false) {
    /**
     * Whether the expansion indicator should be hidden.
     * @type {?}
     */
    MatAccordionBase.prototype.hideToggle;
    /**
     * Display mode used for all expansion panels in the accordion.
     * @type {?}
     */
    MatAccordionBase.prototype.displayMode;
    /**
     * The position of the expansion indicator.
     * @type {?}
     */
    MatAccordionBase.prototype.togglePosition;
    /**
     * Handles keyboard events coming in from the panel headers.
     * @type {?}
     */
    MatAccordionBase.prototype._handleHeaderKeydown;
    /**
     * Handles focus events on the panel headers.
     * @type {?}
     */
    MatAccordionBase.prototype._handleHeaderFocus;
}
/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 * @type {?}
 */
export const MAT_ACCORDION = new InjectionToken('MAT_ACCORDION');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2FjY29yZGlvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWE3QyxzQ0FlQzs7Ozs7O0lBYkMsc0NBQW9COzs7OztJQUdwQix1Q0FBcUM7Ozs7O0lBR3JDLDBDQUEyQzs7Ozs7SUFHM0MsZ0RBQXFEOzs7OztJQUdyRCw4Q0FBMEM7Ozs7Ozs7QUFRNUMsTUFBTSxPQUFPLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBbUIsZUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtBY2NvcmRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hY2NvcmRpb24nO1xuXG4vKiogTWF0QWNjb3JkaW9uJ3MgZGlzcGxheSBtb2Rlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlID0gJ2RlZmF1bHQnIHwgJ2ZsYXQnO1xuXG4vKiogTWF0QWNjb3JkaW9uJ3MgdG9nZ2xlIHBvc2l0aW9ucy4gKi9cbmV4cG9ydCB0eXBlIE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uID0gJ2JlZm9yZScgfCAnYWZ0ZXInO1xuXG4vKipcbiAqIEJhc2UgaW50ZXJmYWNlIGZvciBhIGBNYXRBY2NvcmRpb25gLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEFjY29yZGlvbkJhc2UgZXh0ZW5kcyBDZGtBY2NvcmRpb24ge1xuICAvKiogV2hldGhlciB0aGUgZXhwYW5zaW9uIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBoaWRlVG9nZ2xlOiBib29sZWFuO1xuXG4gIC8qKiBEaXNwbGF5IG1vZGUgdXNlZCBmb3IgYWxsIGV4cGFuc2lvbiBwYW5lbHMgaW4gdGhlIGFjY29yZGlvbi4gKi9cbiAgZGlzcGxheU1vZGU6IE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlO1xuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIHRvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbjtcblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgY29taW5nIGluIGZyb20gdGhlIHBhbmVsIGhlYWRlcnMuICovXG4gIF9oYW5kbGVIZWFkZXJLZXlkb3duOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ7XG5cbiAgLyoqIEhhbmRsZXMgZm9jdXMgZXZlbnRzIG9uIHRoZSBwYW5lbCBoZWFkZXJzLiAqL1xuICBfaGFuZGxlSGVhZGVyRm9jdXM6IChoZWFkZXI6IGFueSkgPT4gdm9pZDtcbn1cblxuXG4vKipcbiAqIFRva2VuIHVzZWQgdG8gcHJvdmlkZSBhIGBNYXRBY2NvcmRpb25gIHRvIGBNYXRFeHBhbnNpb25QYW5lbGAuXG4gKiBVc2VkIHByaW1hcmlseSB0byBhdm9pZCBjaXJjdWxhciBpbXBvcnRzIGJldHdlZW4gYE1hdEFjY29yZGlvbmAgYW5kIGBNYXRFeHBhbnNpb25QYW5lbGAuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQUNDT1JESU9OID0gbmV3IEluamVjdGlvblRva2VuPE1hdEFjY29yZGlvbkJhc2U+KCdNQVRfQUNDT1JESU9OJyk7XG4iXX0=