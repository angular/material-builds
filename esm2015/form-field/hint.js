/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
/** @type {?} */
let nextUniqueId = 0;
/**
 * Hint text to be shown underneath the form field control.
 */
export class MatHint {
    constructor() {
        /**
         * Whether to align the hint label at the start or end of the line.
         */
        this.align = 'start';
        /**
         * Unique ID for the hint. Used for the aria-describedby on the form field control.
         */
        this.id = `mat-hint-${nextUniqueId++}`;
    }
}
MatHint.decorators = [
    { type: Directive, args: [{
                selector: 'mat-hint',
                host: {
                    'class': 'mat-hint',
                    '[class.mat-right]': 'align == "end"',
                    '[attr.id]': 'id',
                    // Remove align attribute to prevent it from interfering with layout.
                    '[attr.align]': 'null',
                }
            },] }
];
MatHint.propDecorators = {
    align: [{ type: Input }],
    id: [{ type: Input }]
};
if (false) {
    /**
     * Whether to align the hint label at the start or end of the line.
     * @type {?}
     */
    MatHint.prototype.align;
    /**
     * Unique ID for the hint. Used for the aria-describedby on the form field control.
     * @type {?}
     */
    MatHint.prototype.id;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2hpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7SUFHM0MsWUFBWSxHQUFHLENBQUM7Ozs7QUFjcEIsTUFBTSxPQUFPLE9BQU87SUFWcEI7Ozs7UUFZVyxVQUFLLEdBQW9CLE9BQU8sQ0FBQzs7OztRQUdqQyxPQUFFLEdBQVcsWUFBWSxZQUFZLEVBQUUsRUFBRSxDQUFDO0lBQ3JELENBQUM7OztZQWhCQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsVUFBVTtvQkFDbkIsbUJBQW1CLEVBQUUsZ0JBQWdCO29CQUNyQyxXQUFXLEVBQUUsSUFBSTs7b0JBRWpCLGNBQWMsRUFBRSxNQUFNO2lCQUN2QjthQUNGOzs7b0JBR0UsS0FBSztpQkFHTCxLQUFLOzs7Ozs7O0lBSE4sd0JBQTBDOzs7OztJQUcxQyxxQkFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuXG4vKiogSGludCB0ZXh0IHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQgY29udHJvbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oaW50JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaGludCcsXG4gICAgJ1tjbGFzcy5tYXQtcmlnaHRdJzogJ2FsaWduID09IFwiZW5kXCInLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgIC8vIFJlbW92ZSBhbGlnbiBhdHRyaWJ1dGUgdG8gcHJldmVudCBpdCBmcm9tIGludGVyZmVyaW5nIHdpdGggbGF5b3V0LlxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SGludCB7XG4gIC8qKiBXaGV0aGVyIHRvIGFsaWduIHRoZSBoaW50IGxhYmVsIGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIGxpbmUuICovXG4gIEBJbnB1dCgpIGFsaWduOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBoaW50LiBVc2VkIGZvciB0aGUgYXJpYS1kZXNjcmliZWRieSBvbiB0aGUgZm9ybSBmaWVsZCBjb250cm9sLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbn1cbiJdfQ==