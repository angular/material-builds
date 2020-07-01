/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
let nextUniqueId = 0;
/** Hint text to be shown underneath the form field control. */
export class MatHint {
    constructor() {
        /** Whether to align the hint label at the start or end of the line. */
        this.align = 'start';
        /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2hpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHL0MsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBR3JCLCtEQUErRDtBQVcvRCxNQUFNLE9BQU8sT0FBTztJQVZwQjtRQVdFLHVFQUF1RTtRQUM5RCxVQUFLLEdBQW9CLE9BQU8sQ0FBQztRQUUxQyx1RkFBdUY7UUFDOUUsT0FBRSxHQUFXLFlBQVksWUFBWSxFQUFFLEVBQUUsQ0FBQztJQUNyRCxDQUFDOzs7WUFoQkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxVQUFVO2dCQUNwQixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLFVBQVU7b0JBQ25CLG1CQUFtQixFQUFFLGdCQUFnQjtvQkFDckMsV0FBVyxFQUFFLElBQUk7b0JBQ2pCLHFFQUFxRTtvQkFDckUsY0FBYyxFQUFFLE1BQU07aUJBQ3ZCO2FBQ0Y7OztvQkFHRSxLQUFLO2lCQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuXG4vKiogSGludCB0ZXh0IHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQgY29udHJvbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oaW50JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaGludCcsXG4gICAgJ1tjbGFzcy5tYXQtcmlnaHRdJzogJ2FsaWduID09IFwiZW5kXCInLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgIC8vIFJlbW92ZSBhbGlnbiBhdHRyaWJ1dGUgdG8gcHJldmVudCBpdCBmcm9tIGludGVyZmVyaW5nIHdpdGggbGF5b3V0LlxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SGludCB7XG4gIC8qKiBXaGV0aGVyIHRvIGFsaWduIHRoZSBoaW50IGxhYmVsIGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIGxpbmUuICovXG4gIEBJbnB1dCgpIGFsaWduOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBoaW50LiBVc2VkIGZvciB0aGUgYXJpYS1kZXNjcmliZWRieSBvbiB0aGUgZm9ybSBmaWVsZCBjb250cm9sLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcbn1cbiJdfQ==