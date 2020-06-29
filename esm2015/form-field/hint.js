/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, InjectionToken, Input } from '@angular/core';
let nextUniqueId = 0;
/**
 * Injection token that can be used to reference instances of `MatHint`. It serves as
 * alternative token to the actual `MatHint` class which could cause unnecessary
 * retention of the class and its directive metadata.
 *
 * *Note*: This is not part of the public API as the MDC-based form-field will not
 * need a lightweight token for `MatHint` and we want to reduce breaking changes.
 */
export const _MAT_HINT = new InjectionToken('MatHint');
/** Hint text to be shown underneath the form field control. */
let MatHint = /** @class */ (() => {
    class MatHint {
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
                    },
                    providers: [{ provide: _MAT_HINT, useExisting: MatHint }],
                },] }
    ];
    MatHint.propDecorators = {
        align: [{ type: Input }],
        id: [{ type: Input }]
    };
    return MatHint;
})();
export { MatHint };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2hpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9ELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLElBQUksY0FBYyxDQUFVLFNBQVMsQ0FBQyxDQUFDO0FBRWhFLCtEQUErRDtBQUMvRDtJQUFBLE1BV2EsT0FBTztRQVhwQjtZQVlFLHVFQUF1RTtZQUM5RCxVQUFLLEdBQW9CLE9BQU8sQ0FBQztZQUUxQyx1RkFBdUY7WUFDOUUsT0FBRSxHQUFXLFlBQVksWUFBWSxFQUFFLEVBQUUsQ0FBQztRQUNyRCxDQUFDOzs7Z0JBakJBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxVQUFVO3dCQUNuQixtQkFBbUIsRUFBRSxnQkFBZ0I7d0JBQ3JDLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixxRUFBcUU7d0JBQ3JFLGNBQWMsRUFBRSxNQUFNO3FCQUN2QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQyxDQUFDO2lCQUN4RDs7O3dCQUdFLEtBQUs7cUJBR0wsS0FBSzs7SUFDUixjQUFDO0tBQUE7U0FOWSxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbmplY3Rpb25Ub2tlbiwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRIaW50YC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRIaW50YCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqXG4gKiAqTm90ZSo6IFRoaXMgaXMgbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkgYXMgdGhlIE1EQy1iYXNlZCBmb3JtLWZpZWxkIHdpbGwgbm90XG4gKiBuZWVkIGEgbGlnaHR3ZWlnaHQgdG9rZW4gZm9yIGBNYXRIaW50YCBhbmQgd2Ugd2FudCB0byByZWR1Y2UgYnJlYWtpbmcgY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IF9NQVRfSElOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRIaW50PignTWF0SGludCcpO1xuXG4vKiogSGludCB0ZXh0IHRvIGJlIHNob3duIHVuZGVybmVhdGggdGhlIGZvcm0gZmllbGQgY29udHJvbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oaW50JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaGludCcsXG4gICAgJ1tjbGFzcy5tYXQtcmlnaHRdJzogJ2FsaWduID09IFwiZW5kXCInLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgIC8vIFJlbW92ZSBhbGlnbiBhdHRyaWJ1dGUgdG8gcHJldmVudCBpdCBmcm9tIGludGVyZmVyaW5nIHdpdGggbGF5b3V0LlxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBfTUFUX0hJTlQsIHVzZUV4aXN0aW5nOiBNYXRIaW50fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhpbnQge1xuICAvKiogV2hldGhlciB0byBhbGlnbiB0aGUgaGludCBsYWJlbCBhdCB0aGUgc3RhcnQgb3IgZW5kIG9mIHRoZSBsaW5lLiAqL1xuICBASW5wdXQoKSBhbGlnbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ3N0YXJ0JztcblxuICAvKiogVW5pcXVlIElEIGZvciB0aGUgaGludC4gVXNlZCBmb3IgdGhlIGFyaWEtZGVzY3JpYmVkYnkgb24gdGhlIGZvcm0gZmllbGQgY29udHJvbC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtaGludC0ke25leHRVbmlxdWVJZCsrfWA7XG59XG4iXX0=