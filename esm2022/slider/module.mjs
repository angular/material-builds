/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlider } from './slider';
import { MatSliderVisualThumb } from './slider-thumb';
import { MatSliderThumb, MatSliderRangeThumb } from './slider-input';
import * as i0 from "@angular/core";
export class MatSliderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.0", ngImport: i0, type: MatSliderModule, declarations: [MatSlider, MatSliderThumb, MatSliderRangeThumb, MatSliderVisualThumb], imports: [MatCommonModule, MatRippleModule], exports: [MatSlider, MatSliderThumb, MatSliderRangeThumb] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderModule, imports: [MatCommonModule, MatRippleModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatSliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRippleModule],
                    exports: [MatSlider, MatSliderThumb, MatSliderRangeThumb],
                    declarations: [MatSlider, MatSliderThumb, MatSliderRangeThumb, MatSliderVisualThumb],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlci9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGNBQWMsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQU9uRSxNQUFNLE9BQU8sZUFBZTs4R0FBZixlQUFlOytHQUFmLGVBQWUsaUJBRlgsU0FBUyxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsYUFGekUsZUFBZSxFQUFFLGVBQWUsYUFDaEMsU0FBUyxFQUFFLGNBQWMsRUFBRSxtQkFBbUI7K0dBRzdDLGVBQWUsWUFKaEIsZUFBZSxFQUFFLGVBQWU7OzJGQUkvQixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7b0JBQ3pELFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7aUJBQ3JGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdFNsaWRlcn0gZnJvbSAnLi9zbGlkZXInO1xuaW1wb3J0IHtNYXRTbGlkZXJWaXN1YWxUaHVtYn0gZnJvbSAnLi9zbGlkZXItdGh1bWInO1xuaW1wb3J0IHtNYXRTbGlkZXJUaHVtYiwgTWF0U2xpZGVyUmFuZ2VUaHVtYn0gZnJvbSAnLi9zbGlkZXItaW5wdXQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0U2xpZGVyLCBNYXRTbGlkZXJUaHVtYiwgTWF0U2xpZGVyUmFuZ2VUaHVtYl0sXG4gIGRlY2xhcmF0aW9uczogW01hdFNsaWRlciwgTWF0U2xpZGVyVGh1bWIsIE1hdFNsaWRlclJhbmdlVGh1bWIsIE1hdFNsaWRlclZpc3VhbFRodW1iXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVyTW9kdWxlIHt9XG4iXX0=