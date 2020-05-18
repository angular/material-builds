/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/line/line.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule, Directive, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { MatCommonModule } from '../common-behaviors/common-module';
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a \@ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
let MatLine = /** @class */ (() => {
    /**
     * Shared directive to count lines inside a text area, such as a list item.
     * Line elements can be extracted with a \@ContentChildren(MatLine) query, then
     * counted by checking the query list's length.
     */
    class MatLine {
    }
    MatLine.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-line], [matLine]',
                    host: { 'class': 'mat-line' }
                },] }
    ];
    return MatLine;
})();
export { MatLine };
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * \@docs-private
 * @param {?} lines
 * @param {?} element
 * @param {?=} prefix
 * @return {?}
 */
export function setLines(lines, element, prefix = 'mat') {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    lines.changes.pipe(startWith(lines)).subscribe((/**
     * @param {?} __0
     * @return {?}
     */
    ({ length }) => {
        setClass(element, `${prefix}-2-line`, false);
        setClass(element, `${prefix}-3-line`, false);
        setClass(element, `${prefix}-multi-line`, false);
        if (length === 2 || length === 3) {
            setClass(element, `${prefix}-${length}-line`, true);
        }
        else if (length > 3) {
            setClass(element, `${prefix}-multi-line`, true);
        }
    }));
}
/**
 * Adds or removes a class from an element.
 * @param {?} element
 * @param {?} className
 * @param {?} isAdd
 * @return {?}
 */
function setClass(element, className, isAdd) {
    /** @type {?} */
    const classList = element.nativeElement.classList;
    isAdd ? classList.add(className) : classList.remove(className);
}
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * \@docs-private
 * @deprecated Use `setLines` instead.
 * \@breaking-change 8.0.0
 */
export class MatLineSetter {
    /**
     * @param {?} lines
     * @param {?} element
     */
    constructor(lines, element) {
        setLines(lines, element);
    }
}
let MatLineModule = /** @class */ (() => {
    class MatLineModule {
    }
    MatLineModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule],
                    exports: [MatLine, MatCommonModule],
                    declarations: [MatLine],
                },] }
    ];
    return MatLineModule;
})();
export { MatLineModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xpbmUvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsUUFBUSxFQUNSLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOzs7Ozs7QUFRbEU7Ozs7OztJQUFBLE1BSWEsT0FBTzs7O2dCQUpuQixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQztpQkFDNUI7O0lBQ3FCLGNBQUM7S0FBQTtTQUFWLE9BQU87Ozs7Ozs7OztBQU1wQixNQUFNLFVBQVUsUUFBUSxDQUFDLEtBQXlCLEVBQUUsT0FBZ0MsRUFDM0QsTUFBTSxHQUFHLEtBQUs7SUFDckMsdURBQXVEO0lBQ3ZELHdEQUF3RDtJQUN4RCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7O0lBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUU7UUFDMUQsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFakQsSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sSUFBSSxNQUFNLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDthQUFNLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDLEVBQUMsQ0FBQztBQUNMLENBQUM7Ozs7Ozs7O0FBR0QsU0FBUyxRQUFRLENBQUMsT0FBZ0MsRUFBRSxTQUFpQixFQUFFLEtBQWM7O1VBQzdFLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVM7SUFDakQsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7Ozs7Ozs7QUFRRCxNQUFNLE9BQU8sYUFBYTs7Ozs7SUFDeEIsWUFBWSxLQUF5QixFQUFFLE9BQWdDO1FBQ3JFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBRUQ7SUFBQSxNQUthLGFBQWE7OztnQkFMekIsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDMUIsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQztvQkFDbkMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUN4Qjs7SUFDNEIsb0JBQUM7S0FBQTtTQUFqQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIE5nTW9kdWxlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIFF1ZXJ5TGlzdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5cblxuLyoqXG4gKiBTaGFyZWQgZGlyZWN0aXZlIHRvIGNvdW50IGxpbmVzIGluc2lkZSBhIHRleHQgYXJlYSwgc3VjaCBhcyBhIGxpc3QgaXRlbS5cbiAqIExpbmUgZWxlbWVudHMgY2FuIGJlIGV4dHJhY3RlZCB3aXRoIGEgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lKSBxdWVyeSwgdGhlblxuICogY291bnRlZCBieSBjaGVja2luZyB0aGUgcXVlcnkgbGlzdCdzIGxlbmd0aC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1saW5lXSwgW21hdExpbmVdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbGluZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdExpbmUge31cblxuLyoqXG4gKiBIZWxwZXIgdGhhdCB0YWtlcyBhIHF1ZXJ5IGxpc3Qgb2YgbGluZXMgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIGhvc3QuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMaW5lcyhsaW5lczogUXVlcnlMaXN0PHVua25vd24+LCBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnbWF0Jykge1xuICAvLyBOb3RlOiBkb2Vzbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUsIGJlY2F1c2UgYGNoYW5nZXNgXG4gIC8vIGdldHMgY29tcGxldGVkIGJ5IEFuZ3VsYXIgd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWQuXG4gIGxpbmVzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobGluZXMpKS5zdWJzY3JpYmUoKHtsZW5ndGh9KSA9PiB7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0yLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0zLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS1tdWx0aS1saW5lYCwgZmFsc2UpO1xuXG4gICAgaWYgKGxlbmd0aCA9PT0gMiB8fCBsZW5ndGggPT09IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tJHtsZW5ndGh9LWxpbmVgLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tbXVsdGktbGluZWAsIHRydWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKiBBZGRzIG9yIHJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuICovXG5mdW5jdGlvbiBzZXRDbGFzcyhlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgY2xhc3NOYW1lOiBzdHJpbmcsIGlzQWRkOiBib29sZWFuKTogdm9pZCB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gIGlzQWRkID8gY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xufVxuXG4vKipcbiAqIEhlbHBlciB0aGF0IHRha2VzIGEgcXVlcnkgbGlzdCBvZiBsaW5lcyBhbmQgc2V0cyB0aGUgY29ycmVjdCBjbGFzcyBvbiB0aGUgaG9zdC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgc2V0TGluZXNgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMaW5lU2V0dGVyIHtcbiAgY29uc3RydWN0b3IobGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPiwgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzZXRMaW5lcyhsaW5lcywgZWxlbWVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRMaW5lLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRMaW5lXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGluZU1vZHVsZSB7IH1cbiJdfQ==