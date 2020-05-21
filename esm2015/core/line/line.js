/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule, Directive, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { MatCommonModule } from '../common-behaviors/common-module';
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
let MatLine = /** @class */ (() => {
    let MatLine = class MatLine {
    };
    MatLine = __decorate([
        Directive({
            selector: '[mat-line], [matLine]',
            host: { 'class': 'mat-line' }
        })
    ], MatLine);
    return MatLine;
})();
export { MatLine };
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
export function setLines(lines, element, prefix = 'mat') {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    lines.changes.pipe(startWith(lines)).subscribe(({ length }) => {
        setClass(element, `${prefix}-2-line`, false);
        setClass(element, `${prefix}-3-line`, false);
        setClass(element, `${prefix}-multi-line`, false);
        if (length === 2 || length === 3) {
            setClass(element, `${prefix}-${length}-line`, true);
        }
        else if (length > 3) {
            setClass(element, `${prefix}-multi-line`, true);
        }
    });
}
/** Adds or removes a class from an element. */
function setClass(element, className, isAdd) {
    const classList = element.nativeElement.classList;
    isAdd ? classList.add(className) : classList.remove(className);
}
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 * @deprecated Use `setLines` instead.
 * @breaking-change 8.0.0
 */
export class MatLineSetter {
    constructor(lines, element) {
        setLines(lines, element);
    }
}
let MatLineModule = /** @class */ (() => {
    let MatLineModule = class MatLineModule {
    };
    MatLineModule = __decorate([
        NgModule({
            imports: [MatCommonModule],
            exports: [MatLine, MatCommonModule],
            declarations: [MatLine],
        })
    ], MatLineModule);
    return MatLineModule;
})();
export { MatLineModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xpbmUvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFFBQVEsRUFDUixTQUFTLEdBR1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUdsRTs7OztHQUlHO0FBS0g7SUFBQSxJQUFhLE9BQU8sR0FBcEIsTUFBYSxPQUFPO0tBQUcsQ0FBQTtJQUFWLE9BQU87UUFKbkIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDO1NBQzVCLENBQUM7T0FDVyxPQUFPLENBQUc7SUFBRCxjQUFDO0tBQUE7U0FBVixPQUFPO0FBRXBCOzs7R0FHRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsS0FBeUIsRUFBRSxPQUFnQyxFQUMzRCxNQUFNLEdBQUcsS0FBSztJQUNyQyx1REFBdUQ7SUFDdkQsd0RBQXdEO0lBQ3hELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBRTtRQUMxRCxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqRCxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNoQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxJQUFJLE1BQU0sT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELCtDQUErQztBQUMvQyxTQUFTLFFBQVEsQ0FBQyxPQUFnQyxFQUFFLFNBQWlCLEVBQUUsS0FBYztJQUNuRixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUNsRCxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBWSxLQUF5QixFQUFFLE9BQWdDO1FBQ3JFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBT0Q7SUFBQSxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0tBQUksQ0FBQTtJQUFqQixhQUFhO1FBTHpCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUMxQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO1lBQ25DLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztTQUN4QixDQUFDO09BQ1csYUFBYSxDQUFJO0lBQUQsb0JBQUM7S0FBQTtTQUFqQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIE5nTW9kdWxlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIFF1ZXJ5TGlzdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5cblxuLyoqXG4gKiBTaGFyZWQgZGlyZWN0aXZlIHRvIGNvdW50IGxpbmVzIGluc2lkZSBhIHRleHQgYXJlYSwgc3VjaCBhcyBhIGxpc3QgaXRlbS5cbiAqIExpbmUgZWxlbWVudHMgY2FuIGJlIGV4dHJhY3RlZCB3aXRoIGEgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lKSBxdWVyeSwgdGhlblxuICogY291bnRlZCBieSBjaGVja2luZyB0aGUgcXVlcnkgbGlzdCdzIGxlbmd0aC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1saW5lXSwgW21hdExpbmVdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbGluZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdExpbmUge31cblxuLyoqXG4gKiBIZWxwZXIgdGhhdCB0YWtlcyBhIHF1ZXJ5IGxpc3Qgb2YgbGluZXMgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIGhvc3QuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMaW5lcyhsaW5lczogUXVlcnlMaXN0PHVua25vd24+LCBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnbWF0Jykge1xuICAvLyBOb3RlOiBkb2Vzbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUsIGJlY2F1c2UgYGNoYW5nZXNgXG4gIC8vIGdldHMgY29tcGxldGVkIGJ5IEFuZ3VsYXIgd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWQuXG4gIGxpbmVzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobGluZXMpKS5zdWJzY3JpYmUoKHtsZW5ndGh9KSA9PiB7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0yLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS0zLWxpbmVgLCBmYWxzZSk7XG4gICAgc2V0Q2xhc3MoZWxlbWVudCwgYCR7cHJlZml4fS1tdWx0aS1saW5lYCwgZmFsc2UpO1xuXG4gICAgaWYgKGxlbmd0aCA9PT0gMiB8fCBsZW5ndGggPT09IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tJHtsZW5ndGh9LWxpbmVgLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IDMpIHtcbiAgICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tbXVsdGktbGluZWAsIHRydWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKiBBZGRzIG9yIHJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuICovXG5mdW5jdGlvbiBzZXRDbGFzcyhlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgY2xhc3NOYW1lOiBzdHJpbmcsIGlzQWRkOiBib29sZWFuKTogdm9pZCB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gIGlzQWRkID8gY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xufVxuXG4vKipcbiAqIEhlbHBlciB0aGF0IHRha2VzIGEgcXVlcnkgbGlzdCBvZiBsaW5lcyBhbmQgc2V0cyB0aGUgY29ycmVjdCBjbGFzcyBvbiB0aGUgaG9zdC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgc2V0TGluZXNgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMaW5lU2V0dGVyIHtcbiAgY29uc3RydWN0b3IobGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPiwgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzZXRMaW5lcyhsaW5lcywgZWxlbWVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRMaW5lLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRMaW5lXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGluZU1vZHVsZSB7IH1cbiJdfQ==