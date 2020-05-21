/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { DateAdapter } from './date-adapter';
import { MAT_DATE_FORMATS } from './date-formats';
import { NativeDateAdapter } from './native-date-adapter';
import { MAT_NATIVE_DATE_FORMATS } from './native-date-formats';
export * from './date-adapter';
export * from './date-formats';
export * from './native-date-adapter';
export * from './native-date-formats';
let NativeDateModule = /** @class */ (() => {
    let NativeDateModule = class NativeDateModule {
    };
    NativeDateModule = __decorate([
        NgModule({
            imports: [PlatformModule],
            providers: [
                { provide: DateAdapter, useClass: NativeDateAdapter },
            ],
        })
    ], NativeDateModule);
    return NativeDateModule;
})();
export { NativeDateModule };
const ɵ0 = MAT_NATIVE_DATE_FORMATS;
let MatNativeDateModule = /** @class */ (() => {
    let MatNativeDateModule = class MatNativeDateModule {
    };
    MatNativeDateModule = __decorate([
        NgModule({
            imports: [NativeDateModule],
            providers: [{ provide: MAT_DATE_FORMATS, useValue: ɵ0 }],
        })
    ], MatNativeDateModule);
    return MatNativeDateModule;
})();
export { MatNativeDateModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9kYXRldGltZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTlELGNBQWMsZ0JBQWdCLENBQUM7QUFDL0IsY0FBYyxnQkFBZ0IsQ0FBQztBQUMvQixjQUFjLHVCQUF1QixDQUFDO0FBQ3RDLGNBQWMsdUJBQXVCLENBQUM7QUFTdEM7SUFBQSxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtLQUFHLENBQUE7SUFBbkIsZ0JBQWdCO1FBTjVCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQzthQUNwRDtTQUNGLENBQUM7T0FDVyxnQkFBZ0IsQ0FBRztJQUFELHVCQUFDO0tBQUE7U0FBbkIsZ0JBQWdCO1dBS3VCLHVCQUF1QjtBQUUzRTtJQUFBLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW1CO0tBQUcsQ0FBQTtJQUF0QixtQkFBbUI7UUFKL0IsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDM0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxJQUF5QixFQUFDLENBQUM7U0FDNUUsQ0FBQztPQUNXLG1CQUFtQixDQUFHO0lBQUQsMEJBQUM7S0FBQTtTQUF0QixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlcn0gZnJvbSAnLi9kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtNQVRfREFURV9GT1JNQVRTfSBmcm9tICcuL2RhdGUtZm9ybWF0cyc7XG5pbXBvcnQge05hdGl2ZURhdGVBZGFwdGVyfSBmcm9tICcuL25hdGl2ZS1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtNQVRfTkFUSVZFX0RBVEVfRk9STUFUU30gZnJvbSAnLi9uYXRpdmUtZGF0ZS1mb3JtYXRzJztcblxuZXhwb3J0ICogZnJvbSAnLi9kYXRlLWFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9kYXRlLWZvcm1hdHMnO1xuZXhwb3J0ICogZnJvbSAnLi9uYXRpdmUtZGF0ZS1hZGFwdGVyJztcbmV4cG9ydCAqIGZyb20gJy4vbmF0aXZlLWRhdGUtZm9ybWF0cyc7XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1BsYXRmb3JtTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IERhdGVBZGFwdGVyLCB1c2VDbGFzczogTmF0aXZlRGF0ZUFkYXB0ZXJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOYXRpdmVEYXRlTW9kdWxlIHt9XG5cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW05hdGl2ZURhdGVNb2R1bGVdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX0RBVEVfRk9STUFUUywgdXNlVmFsdWU6IE1BVF9OQVRJVkVfREFURV9GT1JNQVRTfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE5hdGl2ZURhdGVNb2R1bGUge31cbiJdfQ==