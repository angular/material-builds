/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlider } from './slider';
import { MatSliderVisualThumb } from './slider-thumb';
import { MatSliderThumb, MatSliderRangeThumb } from './slider-input';
import * as i0 from "@angular/core";
class MatSliderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatSliderModule, declarations: [MatSlider, MatSliderThumb, MatSliderRangeThumb, MatSliderVisualThumb], imports: [MatCommonModule, CommonModule, MatRippleModule], exports: [MatSlider, MatSliderThumb, MatSliderRangeThumb] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderModule, imports: [MatCommonModule, CommonModule, MatRippleModule] }); }
}
export { MatSliderModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatSliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, CommonModule, MatRippleModule],
                    exports: [MatSlider, MatSliderThumb, MatSliderRangeThumb],
                    declarations: [MatSlider, MatSliderThumb, MatSliderRangeThumb, MatSliderVisualThumb],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFbkUsTUFLYSxlQUFlOzhHQUFmLGVBQWU7K0dBQWYsZUFBZSxpQkFGWCxTQUFTLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixhQUZ6RSxlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsYUFDOUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxtQkFBbUI7K0dBRzdDLGVBQWUsWUFKaEIsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlOztTQUk3QyxlQUFlOzJGQUFmLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3pELE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7b0JBQ3pELFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7aUJBQ3JGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0U2xpZGVyfSBmcm9tICcuL3NsaWRlcic7XG5pbXBvcnQge01hdFNsaWRlclZpc3VhbFRodW1ifSBmcm9tICcuL3NsaWRlci10aHVtYic7XG5pbXBvcnQge01hdFNsaWRlclRodW1iLCBNYXRTbGlkZXJSYW5nZVRodW1ifSBmcm9tICcuL3NsaWRlci1pbnB1dCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFNsaWRlciwgTWF0U2xpZGVyVGh1bWIsIE1hdFNsaWRlclJhbmdlVGh1bWJdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTbGlkZXIsIE1hdFNsaWRlclRodW1iLCBNYXRTbGlkZXJSYW5nZVRodW1iLCBNYXRTbGlkZXJWaXN1YWxUaHVtYl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlck1vZHVsZSB7fVxuIl19