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
var FakeMatIconRegistry = /** @class */ (function () {
    function FakeMatIconRegistry() {
    }
    FakeMatIconRegistry.prototype.addSvgIcon = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconLiteral = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconLiteralInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSet = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetLiteral = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetLiteralInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.registerFontClassAlias = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return alias;
    };
    FakeMatIconRegistry.prototype.getDefaultFontSetClass = function () {
        return 'material-icons';
    };
    FakeMatIconRegistry.prototype.getSvgIconFromUrl = function () {
        return observableOf(this._generateEmptySvg());
    };
    FakeMatIconRegistry.prototype.getNamedSvgIcon = function () {
        return observableOf(this._generateEmptySvg());
    };
    FakeMatIconRegistry.prototype.setDefaultFontSetClass = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.ngOnDestroy = function () { };
    FakeMatIconRegistry.prototype._generateEmptySvg = function () {
        var emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        emptySvg.classList.add('fake-testing-svg');
        // Emulate real icon characteristics from `MatIconRegistry` so size remains consistent in tests.
        emptySvg.setAttribute('fit', '');
        emptySvg.setAttribute('height', '100%');
        emptySvg.setAttribute('width', '100%');
        emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        emptySvg.setAttribute('focusable', 'false');
        return emptySvg;
    };
    FakeMatIconRegistry.decorators = [
        { type: Injectable }
    ];
    return FakeMatIconRegistry;
}());
export { FakeMatIconRegistry };
/** Import this module in tests to install the null icon registry. */
var MatIconTestingModule = /** @class */ (function () {
    function MatIconTestingModule() {
    }
    MatIconTestingModule.decorators = [
        { type: NgModule, args: [{
                    providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
                },] }
    ];
    return MatIconTestingModule;
}());
export { MatIconTestingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1pY29uLXJlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9mYWtlLWljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBYSxFQUFFLElBQUksWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBTXBELHVCQUF1QjtBQUV2Qjs7O0dBR0c7QUFDSDtJQUFBO0lBdUVBLENBQUM7SUFyRUMsd0NBQVUsR0FBVjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELCtDQUFpQixHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELG1EQUFxQixHQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBEQUE0QixHQUE1QjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDJDQUFhLEdBQWI7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxrREFBb0IsR0FBcEI7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxzREFBd0IsR0FBeEI7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw2REFBK0IsR0FBL0I7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxvREFBc0IsR0FBdEI7UUFDRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxtREFBcUIsR0FBckIsVUFBc0IsS0FBYTtRQUNqQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxvREFBc0IsR0FBdEI7UUFDRSxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFRCwrQ0FBaUIsR0FBakI7UUFDRSxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCw2Q0FBZSxHQUFmO1FBQ0UsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsb0RBQXNCLEdBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQseUNBQVcsR0FBWCxjQUFnQixDQUFDO0lBRVQsK0NBQWlCLEdBQXpCO1FBQ0UsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzNDLGdHQUFnRztRQUNoRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzlELFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7O2dCQXRFRixVQUFVOztJQXVFWCwwQkFBQztDQUFBLEFBdkVELElBdUVDO1NBdEVZLG1CQUFtQjtBQXdFaEMscUVBQXFFO0FBQ3JFO0lBQUE7SUFJQSxDQUFDOztnQkFKQSxRQUFRLFNBQUM7b0JBQ1IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxDQUFDO2lCQUN2RTs7SUFFRCwyQkFBQztDQUFBLEFBSkQsSUFJQztTQURZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE5nTW9kdWxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRJY29uUmVnaXN0cnl9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgSW1wb3NzaWJsZSB0byB0ZWxsIHBhcmFtIHR5cGVzLlxudHlwZSBQdWJsaWNBcGk8VD4gPSB7XG4gIFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgKC4uLng6IGFueVtdKSA9PiBUID8gKC4uLng6IGFueVtdKSA9PiBQdWJsaWNBcGk8VD4gOiBUW0tdXG59O1xuLy8gdHNsaW50OmVuYWJsZTpuby1hbnlcblxuLyoqXG4gKiBBIG51bGwgaWNvbiByZWdpc3RyeSB0aGF0IG11c3QgYmUgaW1wb3J0ZWQgdG8gYWxsb3cgZGlzYWJsaW5nIG9mIGN1c3RvbVxuICogaWNvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGYWtlTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgUHVibGljQXBpPE1hdEljb25SZWdpc3RyeT4sIE9uRGVzdHJveSB7XG4gIGFkZFN2Z0ljb24oKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uTGl0ZXJhbCgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0KCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkU3ZnSWNvblNldExpdGVyYWwoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcygpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYWxpYXM7XG4gIH1cblxuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCkge1xuICAgIHJldHVybiAnbWF0ZXJpYWwtaWNvbnMnO1xuICB9XG5cbiAgZ2V0U3ZnSWNvbkZyb21VcmwoKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih0aGlzLl9nZW5lcmF0ZUVtcHR5U3ZnKCkpO1xuICB9XG5cbiAgZ2V0TmFtZWRTdmdJY29uKCk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIHJldHVybiBvYnNlcnZhYmxlT2YodGhpcy5fZ2VuZXJhdGVFbXB0eVN2ZygpKTtcbiAgfVxuXG4gIHNldERlZmF1bHRGb250U2V0Q2xhc3MoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgfVxuXG4gIHByaXZhdGUgX2dlbmVyYXRlRW1wdHlTdmcoKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3QgZW1wdHlTdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIGVtcHR5U3ZnLmNsYXNzTGlzdC5hZGQoJ2Zha2UtdGVzdGluZy1zdmcnKTtcbiAgICAvLyBFbXVsYXRlIHJlYWwgaWNvbiBjaGFyYWN0ZXJpc3RpY3MgZnJvbSBgTWF0SWNvblJlZ2lzdHJ5YCBzbyBzaXplIHJlbWFpbnMgY29uc2lzdGVudCBpbiB0ZXN0cy5cbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzYWJsZScsICdmYWxzZScpO1xuICAgIHJldHVybiBlbXB0eVN2ZztcbiAgfVxufVxuXG4vKiogSW1wb3J0IHRoaXMgbW9kdWxlIGluIHRlc3RzIHRvIGluc3RhbGwgdGhlIG51bGwgaWNvbiByZWdpc3RyeS4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRJY29uUmVnaXN0cnksIHVzZUNsYXNzOiBGYWtlTWF0SWNvblJlZ2lzdHJ5fV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SWNvblRlc3RpbmdNb2R1bGUge1xufVxuIl19