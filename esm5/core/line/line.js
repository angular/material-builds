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
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
var MatLine = /** @class */ (function () {
    function MatLine() {
    }
    MatLine.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-line], [matLine]',
                    host: { 'class': 'mat-line' }
                },] }
    ];
    return MatLine;
}());
export { MatLine };
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
export function setLines(lines, element) {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    lines.changes.pipe(startWith(lines)).subscribe(function (_a) {
        var length = _a.length;
        setClass(element, 'mat-2-line', false);
        setClass(element, 'mat-3-line', false);
        setClass(element, 'mat-multi-line', false);
        if (length === 2 || length === 3) {
            setClass(element, "mat-" + length + "-line", true);
        }
        else if (length > 3) {
            setClass(element, "mat-multi-line", true);
        }
    });
}
/** Adds or removes a class from an element. */
function setClass(element, className, isAdd) {
    var classList = element.nativeElement.classList;
    isAdd ? classList.add(className) : classList.remove(className);
}
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 * @deprecated Use `setLines` instead.
 * @breaking-change 8.0.0
 */
var MatLineSetter = /** @class */ (function () {
    function MatLineSetter(lines, element) {
        setLines(lines, element);
    }
    return MatLineSetter;
}());
export { MatLineSetter };
var MatLineModule = /** @class */ (function () {
    function MatLineModule() {
    }
    MatLineModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule],
                    exports: [MatLine, MatCommonModule],
                    declarations: [MatLine],
                },] }
    ];
    return MatLineModule;
}());
export { MatLineModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xpbmUvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsUUFBUSxFQUNSLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBR2xFOzs7O0dBSUc7QUFDSDtJQUFBO0lBSXNCLENBQUM7O2dCQUp0QixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQztpQkFDNUI7O0lBQ3FCLGNBQUM7Q0FBQSxBQUp2QixJQUl1QjtTQUFWLE9BQU87QUFFcEI7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxLQUF5QixFQUFFLE9BQWdDO0lBQ2xGLHVEQUF1RDtJQUN2RCx3REFBd0Q7SUFDeEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsRUFBUTtZQUFQLGtCQUFNO1FBQ3JELFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFPLE1BQU0sVUFBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO2FBQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCwrQ0FBK0M7QUFDL0MsU0FBUyxRQUFRLENBQUMsT0FBZ0MsRUFBRSxTQUFpQixFQUFFLEtBQWM7SUFDbkYsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDbEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQ0UsdUJBQVksS0FBeUIsRUFBRSxPQUFnQztRQUNyRSxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOztBQUVEO0lBQUE7SUFLNkIsQ0FBQzs7Z0JBTDdCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQzFCLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7b0JBQ25DLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDeEI7O0lBQzRCLG9CQUFDO0NBQUEsQUFMOUIsSUFLOEI7U0FBakIsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBOZ01vZHVsZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBRdWVyeUxpc3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuXG5cbi8qKlxuICogU2hhcmVkIGRpcmVjdGl2ZSB0byBjb3VudCBsaW5lcyBpbnNpZGUgYSB0ZXh0IGFyZWEsIHN1Y2ggYXMgYSBsaXN0IGl0ZW0uXG4gKiBMaW5lIGVsZW1lbnRzIGNhbiBiZSBleHRyYWN0ZWQgd2l0aCBhIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSkgcXVlcnksIHRoZW5cbiAqIGNvdW50ZWQgYnkgY2hlY2tpbmcgdGhlIHF1ZXJ5IGxpc3QncyBsZW5ndGguXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtbGluZV0sIFttYXRMaW5lXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWxpbmUnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaW5lIHt9XG5cbi8qKlxuICogSGVscGVyIHRoYXQgdGFrZXMgYSBxdWVyeSBsaXN0IG9mIGxpbmVzIGFuZCBzZXRzIHRoZSBjb3JyZWN0IGNsYXNzIG9uIHRoZSBob3N0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TGluZXMobGluZXM6IFF1ZXJ5TGlzdDxNYXRMaW5lPiwgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgLy8gTm90ZTogZG9lc24ndCBuZWVkIHRvIHVuc3Vic2NyaWJlLCBiZWNhdXNlIGBjaGFuZ2VzYFxuICAvLyBnZXRzIGNvbXBsZXRlZCBieSBBbmd1bGFyIHdoZW4gdGhlIHZpZXcgaXMgZGVzdHJveWVkLlxuICBsaW5lcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKGxpbmVzKSkuc3Vic2NyaWJlKCh7bGVuZ3RofSkgPT4ge1xuICAgIHNldENsYXNzKGVsZW1lbnQsICdtYXQtMi1saW5lJywgZmFsc2UpO1xuICAgIHNldENsYXNzKGVsZW1lbnQsICdtYXQtMy1saW5lJywgZmFsc2UpO1xuICAgIHNldENsYXNzKGVsZW1lbnQsICdtYXQtbXVsdGktbGluZScsIGZhbHNlKTtcblxuICAgIGlmIChsZW5ndGggPT09IDIgfHwgbGVuZ3RoID09PSAzKSB7XG4gICAgICBzZXRDbGFzcyhlbGVtZW50LCBgbWF0LSR7bGVuZ3RofS1saW5lYCwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChsZW5ndGggPiAzKSB7XG4gICAgICBzZXRDbGFzcyhlbGVtZW50LCBgbWF0LW11bHRpLWxpbmVgLCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKiogQWRkcyBvciByZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50LiAqL1xuZnVuY3Rpb24gc2V0Q2xhc3MoZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIGNsYXNzTmFtZTogc3RyaW5nLCBpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICBpc0FkZCA/IGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IGNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgdGhhdCB0YWtlcyBhIHF1ZXJ5IGxpc3Qgb2YgbGluZXMgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Mgb24gdGhlIGhvc3QuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYHNldExpbmVzYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICovXG5leHBvcnQgY2xhc3MgTWF0TGluZVNldHRlciB7XG4gIGNvbnN0cnVjdG9yKGxpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT4sIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgc2V0TGluZXMobGluZXMsIGVsZW1lbnQpO1xuICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0TGluZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGluZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpbmVNb2R1bGUgeyB9XG4iXX0=