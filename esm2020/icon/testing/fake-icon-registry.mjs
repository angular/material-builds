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
import * as i0 from "@angular/core";
/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
export class FakeMatIconRegistry {
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
    addSvgIconResolver() {
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
}
FakeMatIconRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: FakeMatIconRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FakeMatIconRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: FakeMatIconRegistry });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: FakeMatIconRegistry, decorators: [{
            type: Injectable
        }] });
/** Import this module in tests to install the null icon registry. */
export class MatIconTestingModule {
}
MatIconTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatIconTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconTestingModule });
MatIconTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconTestingModule, providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatIconTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1pY29uLXJlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9mYWtlLWljb24tcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBYSxFQUFFLElBQUksWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU1wRDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsNEJBQTRCO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsd0JBQXdCO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELCtCQUErQjtRQUM3QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxzQkFBc0I7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQscUJBQXFCLENBQUMsS0FBYTtRQUNqQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxzQkFBc0I7UUFDcEIsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVyxLQUFLLENBQUM7SUFFVCxpQkFBaUI7UUFDdkIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzNDLGdHQUFnRztRQUNoRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzlELFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7O3dIQXpFVSxtQkFBbUI7NEhBQW5CLG1CQUFtQjttR0FBbkIsbUJBQW1CO2tCQUQvQixVQUFVOztBQTZFWCxxRUFBcUU7QUFJckUsTUFBTSxPQUFPLG9CQUFvQjs7eUhBQXBCLG9CQUFvQjswSEFBcEIsb0JBQW9COzBIQUFwQixvQkFBb0IsYUFGcEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7bUdBRTNELG9CQUFvQjtrQkFIaEMsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7aUJBQ3ZFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdNb2R1bGUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEljb25SZWdpc3RyeX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQge09ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XG5cbnR5cGUgUHVibGljQXBpPFQ+ID0ge1xuICBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzICguLi54OiBhbnlbXSkgPT4gVCA/ICguLi54OiBhbnlbXSkgPT4gUHVibGljQXBpPFQ+IDogVFtLXVxufTtcblxuLyoqXG4gKiBBIG51bGwgaWNvbiByZWdpc3RyeSB0aGF0IG11c3QgYmUgaW1wb3J0ZWQgdG8gYWxsb3cgZGlzYWJsaW5nIG9mIGN1c3RvbVxuICogaWNvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGYWtlTWF0SWNvblJlZ2lzdHJ5IGltcGxlbWVudHMgUHVibGljQXBpPE1hdEljb25SZWdpc3RyeT4sIE9uRGVzdHJveSB7XG4gIGFkZFN2Z0ljb24oKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uTGl0ZXJhbCgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25Jbk5hbWVzcGFjZSgpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN2Z0ljb25MaXRlcmFsSW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0KCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkU3ZnSWNvblNldExpdGVyYWwoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uU2V0TGl0ZXJhbEluTmFtZXNwYWNlKCk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVnaXN0ZXJGb250Q2xhc3NBbGlhcygpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTmFtZUZvckZvbnRBbGlhcyhhbGlhczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYWxpYXM7XG4gIH1cblxuICBnZXREZWZhdWx0Rm9udFNldENsYXNzKCkge1xuICAgIHJldHVybiAnbWF0ZXJpYWwtaWNvbnMnO1xuICB9XG5cbiAgZ2V0U3ZnSWNvbkZyb21VcmwoKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih0aGlzLl9nZW5lcmF0ZUVtcHR5U3ZnKCkpO1xuICB9XG5cbiAgZ2V0TmFtZWRTdmdJY29uKCk6IE9ic2VydmFibGU8U1ZHRWxlbWVudD4ge1xuICAgIHJldHVybiBvYnNlcnZhYmxlT2YodGhpcy5fZ2VuZXJhdGVFbXB0eVN2ZygpKTtcbiAgfVxuXG4gIHNldERlZmF1bHRGb250U2V0Q2xhc3MoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRTdmdJY29uUmVzb2x2ZXIoKTogdGhpcyB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgfVxuXG4gIHByaXZhdGUgX2dlbmVyYXRlRW1wdHlTdmcoKTogU1ZHRWxlbWVudCB7XG4gICAgY29uc3QgZW1wdHlTdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIGVtcHR5U3ZnLmNsYXNzTGlzdC5hZGQoJ2Zha2UtdGVzdGluZy1zdmcnKTtcbiAgICAvLyBFbXVsYXRlIHJlYWwgaWNvbiBjaGFyYWN0ZXJpc3RpY3MgZnJvbSBgTWF0SWNvblJlZ2lzdHJ5YCBzbyBzaXplIHJlbWFpbnMgY29uc2lzdGVudCBpbiB0ZXN0cy5cbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgZW1wdHlTdmcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICBlbXB0eVN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvY3VzYWJsZScsICdmYWxzZScpO1xuICAgIHJldHVybiBlbXB0eVN2ZztcbiAgfVxufVxuXG4vKiogSW1wb3J0IHRoaXMgbW9kdWxlIGluIHRlc3RzIHRvIGluc3RhbGwgdGhlIG51bGwgaWNvbiByZWdpc3RyeS4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRJY29uUmVnaXN0cnksIHVzZUNsYXNzOiBGYWtlTWF0SWNvblJlZ2lzdHJ5fV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0SWNvblRlc3RpbmdNb2R1bGUge1xufVxuIl19