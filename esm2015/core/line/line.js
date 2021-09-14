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
export class MatLine {
}
MatLine.decorators = [
    { type: Directive, args: [{
                selector: '[mat-line], [matLine]',
                host: { 'class': 'mat-line' }
            },] }
];
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
    element.nativeElement.classList.toggle(className, isAdd);
}
export class MatLineModule {
}
MatLineModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatCommonModule],
                exports: [MatLine, MatCommonModule],
                declarations: [MatLine],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2xpbmUvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsUUFBUSxFQUNSLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBR2xFOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sT0FBTzs7O1lBSm5CLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDO2FBQzVCOztBQUdEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsS0FBeUIsRUFBRSxPQUFnQyxFQUMzRCxNQUFNLEdBQUcsS0FBSztJQUNyQyx1REFBdUQ7SUFDdkQsd0RBQXdEO0lBQ3hELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBRTtRQUMxRCxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqRCxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNoQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxJQUFJLE1BQU0sT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELCtDQUErQztBQUMvQyxTQUFTLFFBQVEsQ0FBQyxPQUFnQyxFQUFFLFNBQWlCLEVBQUUsS0FBYztJQUNuRixPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFPRCxNQUFNLE9BQU8sYUFBYTs7O1lBTHpCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7Z0JBQ25DLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUN4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBOZ01vZHVsZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBRdWVyeUxpc3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuXG5cbi8qKlxuICogU2hhcmVkIGRpcmVjdGl2ZSB0byBjb3VudCBsaW5lcyBpbnNpZGUgYSB0ZXh0IGFyZWEsIHN1Y2ggYXMgYSBsaXN0IGl0ZW0uXG4gKiBMaW5lIGVsZW1lbnRzIGNhbiBiZSBleHRyYWN0ZWQgd2l0aCBhIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSkgcXVlcnksIHRoZW5cbiAqIGNvdW50ZWQgYnkgY2hlY2tpbmcgdGhlIHF1ZXJ5IGxpc3QncyBsZW5ndGguXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtbGluZV0sIFttYXRMaW5lXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWxpbmUnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaW5lIHt9XG5cbi8qKlxuICogSGVscGVyIHRoYXQgdGFrZXMgYSBxdWVyeSBsaXN0IG9mIGxpbmVzIGFuZCBzZXRzIHRoZSBjb3JyZWN0IGNsYXNzIG9uIHRoZSBob3N0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TGluZXMobGluZXM6IFF1ZXJ5TGlzdDx1bmtub3duPiwgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gJ21hdCcpIHtcbiAgLy8gTm90ZTogZG9lc24ndCBuZWVkIHRvIHVuc3Vic2NyaWJlLCBiZWNhdXNlIGBjaGFuZ2VzYFxuICAvLyBnZXRzIGNvbXBsZXRlZCBieSBBbmd1bGFyIHdoZW4gdGhlIHZpZXcgaXMgZGVzdHJveWVkLlxuICBsaW5lcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKGxpbmVzKSkuc3Vic2NyaWJlKCh7bGVuZ3RofSkgPT4ge1xuICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tMi1saW5lYCwgZmFsc2UpO1xuICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tMy1saW5lYCwgZmFsc2UpO1xuICAgIHNldENsYXNzKGVsZW1lbnQsIGAke3ByZWZpeH0tbXVsdGktbGluZWAsIGZhbHNlKTtcblxuICAgIGlmIChsZW5ndGggPT09IDIgfHwgbGVuZ3RoID09PSAzKSB7XG4gICAgICBzZXRDbGFzcyhlbGVtZW50LCBgJHtwcmVmaXh9LSR7bGVuZ3RofS1saW5lYCwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChsZW5ndGggPiAzKSB7XG4gICAgICBzZXRDbGFzcyhlbGVtZW50LCBgJHtwcmVmaXh9LW11bHRpLWxpbmVgLCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKiogQWRkcyBvciByZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50LiAqL1xuZnVuY3Rpb24gc2V0Q2xhc3MoZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIGNsYXNzTmFtZTogc3RyaW5nLCBpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUsIGlzQWRkKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRMaW5lLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRMaW5lXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGluZU1vZHVsZSB7IH1cbiJdfQ==