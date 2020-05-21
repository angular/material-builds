/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { Injectable, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { of as observableOf } from 'rxjs';
// tslint:enable:no-any
/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
let FakeMatIconRegistry = /** @class */ (() => {
    let FakeMatIconRegistry = class FakeMatIconRegistry {
        addSvgIcon() {
            return this;
        }
        addSvgIconLiteral() {
            return this;
        }
        addSvgIconInNamespace() {
            return this;
        }
        addSvgIconLiteralInNamespace() {
            return this;
        }
        addSvgIconSet() {
            return this;
        }
        addSvgIconSetLiteral() {
            return this;
        }
        addSvgIconSetInNamespace() {
            return this;
        }
        addSvgIconSetLiteralInNamespace() {
            return this;
        }
        registerFontClassAlias() {
            return this;
        }
        classNameForFontAlias(alias) {
            return alias;
        }
        getDefaultFontSetClass() {
            return 'material-icons';
        }
        getSvgIconFromUrl() {
            return observableOf(this._generateEmptySvg());
        }
        getNamedSvgIcon() {
            return observableOf(this._generateEmptySvg());
        }
        setDefaultFontSetClass() {
            return this;
        }
        ngOnDestroy() { }
        _generateEmptySvg() {
            const emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            emptySvg.classList.add('fake-testing-svg');
            // Emulate real icon characteristics from `MatIconRegistry` so size remains consistent in tests.
            emptySvg.setAttribute('fit', '');
            emptySvg.setAttribute('height', '100%');
            emptySvg.setAttribute('width', '100%');
            emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            emptySvg.setAttribute('focusable', 'false');
            return emptySvg;
        }
    };
    FakeMatIconRegistry = __decorate([
        Injectable()
    ], FakeMatIconRegistry);
    return FakeMatIconRegistry;
})();
export { FakeMatIconRegistry };
/** Import this module in tests to install the null icon registry. */
let MatIconTestingModule = /** @class */ (() => {
    let MatIconTestingModule = class MatIconTestingModule {
    };
    MatIconTestingModule = __decorate([
        NgModule({
            providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
        })
    ], MatIconTestingModule);
    return MatIconTestingModule;
})();
export { MatIconTestingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1pY29uLXJlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9mYWtlLWljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQWEsRUFBRSxJQUFJLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQU1wRCx1QkFBdUI7QUFFdkI7OztHQUdHO0FBRUg7SUFBQSxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtRQUM5QixVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQscUJBQXFCO1lBQ25CLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELDRCQUE0QjtZQUMxQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxhQUFhO1lBQ1gsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsb0JBQW9CO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELHdCQUF3QjtZQUN0QixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCwrQkFBK0I7WUFDN0IsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsc0JBQXNCO1lBQ3BCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELHFCQUFxQixDQUFDLEtBQWE7WUFDakMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsc0JBQXNCO1lBQ3BCLE9BQU8sZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQztRQUVELGlCQUFpQjtZQUNmLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELGVBQWU7WUFDYixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxzQkFBc0I7WUFDcEIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsV0FBVyxLQUFLLENBQUM7UUFFVCxpQkFBaUI7WUFDdkIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvRSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNDLGdHQUFnRztZQUNoRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlELFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FDRixDQUFBO0lBdEVZLG1CQUFtQjtRQUQvQixVQUFVLEVBQUU7T0FDQSxtQkFBbUIsQ0FzRS9CO0lBQUQsMEJBQUM7S0FBQTtTQXRFWSxtQkFBbUI7QUF3RWhDLHFFQUFxRTtBQUlyRTtJQUFBLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0tBQ2hDLENBQUE7SUFEWSxvQkFBb0I7UUFIaEMsUUFBUSxDQUFDO1lBQ1IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxDQUFDO1NBQ3ZFLENBQUM7T0FDVyxvQkFBb0IsQ0FDaEM7SUFBRCwyQkFBQztLQUFBO1NBRFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdNb2R1bGUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEljb25SZWdpc3RyeX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQge09ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWFueSBJbXBvc3NpYmxlIHRvIHRlbGwgcGFyYW0gdHlwZXMuXG50eXBlIFB1YmxpY0FwaTxUPiA9IHtcbiAgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyAoLi4ueDogYW55W10pID0+IFQgPyAoLi4ueDogYW55W10pID0+IFB1YmxpY0FwaTxUPiA6IFRbS11cbn07XG4vLyB0c2xpbnQ6ZW5hYmxlOm5vLWFueVxuXG4vKipcbiAqIEEgbnVsbCBpY29uIHJlZ2lzdHJ5IHRoYXQgbXVzdCBiZSBpbXBvcnRlZCB0byBhbGxvdyBkaXNhYmxpbmcgb2YgY3VzdG9tXG4gKiBpY29ucy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZha2VNYXRJY29uUmVnaXN0cnkgaW1wbGVtZW50cyBQdWJsaWNBcGk8TWF0SWNvblJlZ2lzdHJ5PiwgT25EZXN0cm95IHtcbiAgYWRkU3ZnSWNvbigpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25MaXRlcmFsKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkU3ZnSWNvbkluTmFtZXNwYWNlKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkU3ZnSWNvbkxpdGVyYWxJbk5hbWVzcGFjZSgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25TZXQoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0TGl0ZXJhbCgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25TZXRJbk5hbWVzcGFjZSgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25TZXRMaXRlcmFsSW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWdpc3RlckZvbnRDbGFzc0FsaWFzKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xhc3NOYW1lRm9yRm9udEFsaWFzKGFsaWFzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBhbGlhcztcbiAgfVxuXG4gIGdldERlZmF1bHRGb250U2V0Q2xhc3MoKSB7XG4gICAgcmV0dXJuICdtYXRlcmlhbC1pY29ucyc7XG4gIH1cblxuICBnZXRTdmdJY29uRnJvbVVybCgpOiBPYnNlcnZhYmxlPFNWR0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHRoaXMuX2dlbmVyYXRlRW1wdHlTdmcoKSk7XG4gIH1cblxuICBnZXROYW1lZFN2Z0ljb24oKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih0aGlzLl9nZW5lcmF0ZUVtcHR5U3ZnKCkpO1xuICB9XG5cbiAgc2V0RGVmYXVsdEZvbnRTZXRDbGFzcygpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkgeyB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVFbXB0eVN2ZygpOiBTVkdFbGVtZW50IHtcbiAgICBjb25zdCBlbXB0eVN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgZW1wdHlTdmcuY2xhc3NMaXN0LmFkZCgnZmFrZS10ZXN0aW5nLXN2ZycpO1xuICAgIC8vIEVtdWxhdGUgcmVhbCBpY29uIGNoYXJhY3RlcmlzdGljcyBmcm9tIGBNYXRJY29uUmVnaXN0cnlgIHNvIHNpemUgcmVtYWlucyBjb25zaXN0ZW50IGluIHRlc3RzLlxuICAgIGVtcHR5U3ZnLnNldEF0dHJpYnV0ZSgnZml0JywgJycpO1xuICAgIGVtcHR5U3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuICAgIGVtcHR5U3ZnLnNldEF0dHJpYnV0ZSgnZm9jdXNhYmxlJywgJ2ZhbHNlJyk7XG4gICAgcmV0dXJuIGVtcHR5U3ZnO1xuICB9XG59XG5cbi8qKiBJbXBvcnQgdGhpcyBtb2R1bGUgaW4gdGVzdHMgdG8gaW5zdGFsbCB0aGUgbnVsbCBpY29uIHJlZ2lzdHJ5LiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdEljb25SZWdpc3RyeSwgdXNlQ2xhc3M6IEZha2VNYXRJY29uUmVnaXN0cnl9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRJY29uVGVzdGluZ01vZHVsZSB7XG59XG4iXX0=