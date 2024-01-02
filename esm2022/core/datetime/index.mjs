/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { DateAdapter } from './date-adapter';
import { MAT_DATE_FORMATS } from './date-formats';
import { NativeDateAdapter } from './native-date-adapter';
import { MAT_NATIVE_DATE_FORMATS } from './native-date-formats';
import * as i0 from "@angular/core";
export * from './date-adapter';
export * from './date-formats';
export * from './native-date-adapter';
export * from './native-date-formats';
export class NativeDateModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: NativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.5", ngImport: i0, type: NativeDateModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: NativeDateModule, providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: NativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
                }]
        }] });
export class MatNativeDateModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatNativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatNativeDateModule, imports: [NativeDateModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatNativeDateModule, providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }], imports: [NativeDateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatNativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDateModule],
                    providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }],
                }]
        }] });
export function provideNativeDateAdapter(formats = MAT_NATIVE_DATE_FORMATS) {
    return [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: formats },
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9kYXRldGltZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFXLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQWlCLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sdUJBQXVCLENBQUM7O0FBRTlELGNBQWMsZ0JBQWdCLENBQUM7QUFDL0IsY0FBYyxnQkFBZ0IsQ0FBQztBQUMvQixjQUFjLHVCQUF1QixDQUFDO0FBQ3RDLGNBQWMsdUJBQXVCLENBQUM7QUFLdEMsTUFBTSxPQUFPLGdCQUFnQjtxSEFBaEIsZ0JBQWdCO3NIQUFoQixnQkFBZ0I7c0hBQWhCLGdCQUFnQixhQUZoQixDQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQzs7a0dBRXJELGdCQUFnQjtrQkFINUIsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7aUJBQ2pFOztBQU9ELE1BQU0sT0FBTyxtQkFBbUI7cUhBQW5CLG1CQUFtQjtzSEFBbkIsbUJBQW1CLFlBTm5CLGdCQUFnQjtzSEFNaEIsbUJBQW1CLGFBRm5CLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFDLENBQUMsWUFEakUsZ0JBQWdCOztrR0FHZixtQkFBbUI7a0JBSi9CLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBQyxDQUFDO2lCQUM1RTs7QUFHRCxNQUFNLFVBQVUsd0JBQXdCLENBQ3RDLFVBQTBCLHVCQUF1QjtJQUVqRCxPQUFPO1FBQ0wsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQztRQUNuRCxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO0tBQy9DLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGUsIFByb3ZpZGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXJ9IGZyb20gJy4vZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TUFUX0RBVEVfRk9STUFUUywgTWF0RGF0ZUZvcm1hdHN9IGZyb20gJy4vZGF0ZS1mb3JtYXRzJztcbmltcG9ydCB7TmF0aXZlRGF0ZUFkYXB0ZXJ9IGZyb20gJy4vbmF0aXZlLWRhdGUtYWRhcHRlcic7XG5pbXBvcnQge01BVF9OQVRJVkVfREFURV9GT1JNQVRTfSBmcm9tICcuL25hdGl2ZS1kYXRlLWZvcm1hdHMnO1xuXG5leHBvcnQgKiBmcm9tICcuL2RhdGUtYWRhcHRlcic7XG5leHBvcnQgKiBmcm9tICcuL2RhdGUtZm9ybWF0cyc7XG5leHBvcnQgKiBmcm9tICcuL25hdGl2ZS1kYXRlLWFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9uYXRpdmUtZGF0ZS1mb3JtYXRzJztcblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IERhdGVBZGFwdGVyLCB1c2VDbGFzczogTmF0aXZlRGF0ZUFkYXB0ZXJ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTmF0aXZlRGF0ZU1vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTmF0aXZlRGF0ZU1vZHVsZV0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfREFURV9GT1JNQVRTLCB1c2VWYWx1ZTogTUFUX05BVElWRV9EQVRFX0ZPUk1BVFN9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TmF0aXZlRGF0ZU1vZHVsZSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZU5hdGl2ZURhdGVBZGFwdGVyKFxuICBmb3JtYXRzOiBNYXREYXRlRm9ybWF0cyA9IE1BVF9OQVRJVkVfREFURV9GT1JNQVRTLFxuKTogUHJvdmlkZXJbXSB7XG4gIHJldHVybiBbXG4gICAge3Byb3ZpZGU6IERhdGVBZGFwdGVyLCB1c2VDbGFzczogTmF0aXZlRGF0ZUFkYXB0ZXJ9LFxuICAgIHtwcm92aWRlOiBNQVRfREFURV9GT1JNQVRTLCB1c2VWYWx1ZTogZm9ybWF0c30sXG4gIF07XG59XG4iXX0=