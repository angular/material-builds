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
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_ERROR = new InjectionToken('MatError');
/** Single error message to be shown underneath the form field. */
let MatError = /** @class */ (() => {
    class MatError {
        constructor() {
            this.id = `mat-error-${nextUniqueId++}`;
        }
    }
    MatError.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-error',
                    host: {
                        'class': 'mat-error',
                        'role': 'alert',
                        '[attr.id]': 'id',
                    },
                    providers: [{ provide: MAT_ERROR, useExisting: MatError }],
                },] }
    ];
    MatError.propDecorators = {
        id: [{ type: Input }]
    };
    return MatError;
})();
export { MatError };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFL0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxjQUFjLENBQVcsVUFBVSxDQUFDLENBQUM7QUFFbEUsa0VBQWtFO0FBQ2xFO0lBQUEsTUFTYSxRQUFRO1FBVHJCO1lBVVcsT0FBRSxHQUFXLGFBQWEsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQUN0RCxDQUFDOzs7Z0JBWEEsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO29CQUNyQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQyxDQUFDO2lCQUN6RDs7O3FCQUVFLEtBQUs7O0lBQ1IsZUFBQztLQUFBO1NBRlksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5qZWN0aW9uVG9rZW4sIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0RXJyb3JgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdEVycm9yYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9FUlJPUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRFcnJvcj4oJ01hdEVycm9yJyk7XG5cbi8qKiBTaW5nbGUgZXJyb3IgbWVzc2FnZSB0byBiZSBzaG93biB1bmRlcm5lYXRoIHRoZSBmb3JtIGZpZWxkLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWVycm9yJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZXJyb3InLFxuICAgICdyb2xlJzogJ2FsZXJ0JyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9FUlJPUiwgdXNlRXhpc3Rpbmc6IE1hdEVycm9yfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEVycm9yIHtcbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtZXJyb3ItJHtuZXh0VW5pcXVlSWQrK31gO1xufVxuIl19