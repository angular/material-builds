/**
 * @fileoverview added by tsickle
 * Generated from: src/material/icon/testing/fake-icon-registry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { of as observableOf } from 'rxjs';
// tslint:enable:no-any
/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
let FakeMatIconRegistry = /** @class */ (() => {
    // tslint:enable:no-any
    /**
     * A null icon registry that must be imported to allow disabling of custom
     * icons.
     */
    class FakeMatIconRegistry {
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIcon() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconLiteral() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconInNamespace() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconLiteralInNamespace() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconSet() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconSetLiteral() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconSetInNamespace() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        addSvgIconSetLiteralInNamespace() {
            return (/** @type {?} */ (this));
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        registerFontClassAlias() {
            return (/** @type {?} */ (this));
        }
        /**
         * @param {?} alias
         * @return {?}
         */
        classNameForFontAlias(alias) {
            return alias;
        }
        /**
         * @return {?}
         */
        getDefaultFontSetClass() {
            return 'material-icons';
        }
        /**
         * @return {?}
         */
        getSvgIconFromUrl() {
            return observableOf(this._generateEmptySvg());
        }
        /**
         * @return {?}
         */
        getNamedSvgIcon() {
            return observableOf(this._generateEmptySvg());
        }
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        setDefaultFontSetClass() {
            return (/** @type {?} */ (this));
        }
        /**
         * @return {?}
         */
        ngOnDestroy() { }
        /**
         * @private
         * @return {?}
         */
        _generateEmptySvg() {
            /** @type {?} */
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
    }
    FakeMatIconRegistry.decorators = [
        { type: Injectable }
    ];
    return FakeMatIconRegistry;
})();
export { FakeMatIconRegistry };
/**
 * Import this module in tests to install the null icon registry.
 */
let MatIconTestingModule = /** @class */ (() => {
    /**
     * Import this module in tests to install the null icon registry.
     */
    class MatIconTestingModule {
    }
    MatIconTestingModule.decorators = [
        { type: NgModule, args: [{
                    providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
                },] }
    ];
    return MatIconTestingModule;
})();
export { MatIconTestingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1pY29uLXJlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9mYWtlLWljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBYSxFQUFFLElBQUksWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFZcEQ7Ozs7OztJQUFBLE1BQ2EsbUJBQW1COzs7Ozs7UUFDOUIsVUFBVTtZQUNSLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7UUFDZCxDQUFDOzs7Ozs7UUFFRCxpQkFBaUI7WUFDZixPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO1FBQ2QsQ0FBQzs7Ozs7O1FBRUQscUJBQXFCO1lBQ25CLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7UUFDZCxDQUFDOzs7Ozs7UUFFRCw0QkFBNEI7WUFDMUIsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztRQUNkLENBQUM7Ozs7OztRQUVELGFBQWE7WUFDWCxPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO1FBQ2QsQ0FBQzs7Ozs7O1FBRUQsb0JBQW9CO1lBQ2xCLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7UUFDZCxDQUFDOzs7Ozs7UUFFRCx3QkFBd0I7WUFDdEIsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztRQUNkLENBQUM7Ozs7OztRQUVELCtCQUErQjtZQUM3QixPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO1FBQ2QsQ0FBQzs7Ozs7O1FBRUQsc0JBQXNCO1lBQ3BCLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7UUFDZCxDQUFDOzs7OztRQUVELHFCQUFxQixDQUFDLEtBQWE7WUFDakMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDOzs7O1FBRUQsc0JBQXNCO1lBQ3BCLE9BQU8sZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQzs7OztRQUVELGlCQUFpQjtZQUNmLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQzs7OztRQUVELGVBQWU7WUFDYixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7Ozs7OztRQUVELHNCQUFzQjtZQUNwQixPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO1FBQ2QsQ0FBQzs7OztRQUVELFdBQVcsS0FBSyxDQUFDOzs7OztRQUVULGlCQUFpQjs7a0JBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQztZQUM5RSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNDLGdHQUFnRztZQUNoRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlELFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7OztnQkF0RUYsVUFBVTs7SUF1RVgsMEJBQUM7S0FBQTtTQXRFWSxtQkFBbUI7Ozs7QUF5RWhDOzs7O0lBQUEsTUFHYSxvQkFBb0I7OztnQkFIaEMsUUFBUSxTQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztpQkFDdkU7O0lBRUQsMkJBQUM7S0FBQTtTQURZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE5nTW9kdWxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRJY29uUmVnaXN0cnl9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgSW1wb3NzaWJsZSB0byB0ZWxsIHBhcmFtIHR5cGVzLlxudHlwZSBQdWJsaWNBcGk8VD4gPSB7XG4gIFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgKC4uLng6IGFueVtdKSA9PiBUID8gKC4uLng6IGFueVtdKSA9PiBQdWJsaWNBcGk8VD4gOiBUW0tdXG59O1xuLy8gdHNsaW50OmVuYWJsZTpuby1hbnlcblxuLyoqXG4gKiBBIG51bGwgaWNvbiByZWdpc3RyeSB0aGF0IG11c3QgYmUgaW1wb3J0ZWQgdG8gYWxsb3cgZGlzYWJsaW5nIG9mIGN1c3RvbVxuICogaWNvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGYWtlTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgUHVibGljQXBpPE1hdEljb25SZWdpc3RyeT4sIE9uRGVzdHJveSB7XG4gIGFkZFN2Z0ljb24oKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uTGl0ZXJhbCgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0KCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkU3ZnSWNvblNldExpdGVyYWwoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcygpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYWxpYXM7XG4gIH1cblxuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCkge1xuICAgIHJldHVybiAnbWF0ZXJpYWwtaWNvbnMnO1xuICB9XG5cbiAgZ2V0U3ZnSWNvbkZyb21VcmwoKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih0aGlzLl9nZW5lcmF0ZUVtcHR5U3ZnKCkpO1xuICB9XG5cbiAgZ2V0TmFtZWRTdmdJY29uKCk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIHJldHVybiBvYnNlcnZhYmxlT2YodGhpcy5fZ2VuZXJhdGVFbXB0eVN2ZygpKTtcbiAgfVxuXG4gIHNldERlZmF1bHRGb250U2V0Q2xhc3MoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgfVxuXG4gIHByaXZhdGUgX2dlbmVyYXRlRW1wdHlTdmcoKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3QgZW1wdHlTdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIGVtcHR5U3ZnLmNsYXNzTGlzdC5hZGQoJ2Zha2UtdGVzdGluZy1zdmcnKTtcbiAgICAvLyBFbXVsYXRlIHJlYWwgaWNvbiBjaGFyYWN0ZXJpc3RpY3MgZnJvbSBgTWF0SWNvblJlZ2lzdHJ5YCBzbyBzaXplIHJlbWFpbnMgY29uc2lzdGVudCBpbiB0ZXN0cy5cbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzYWJsZScsICdmYWxzZScpO1xuICAgIHJldHVybiBlbXB0eVN2ZztcbiAgfVxufVxuXG4vKiogSW1wb3J0IHRoaXMgbW9kdWxlIGluIHRlc3RzIHRvIGluc3RhbGwgdGhlIG51bGwgaWNvbiByZWdpc3RyeS4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRJY29uUmVnaXN0cnksIHVzZUNsYXNzOiBGYWtlTWF0SWNvblJlZ2lzdHJ5fV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SWNvblRlc3RpbmdNb2R1bGUge1xufVxuIl19