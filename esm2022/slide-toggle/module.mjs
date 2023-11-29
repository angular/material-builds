/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggle } from './slide-toggle';
import { MatSlideToggleRequiredValidator } from './slide-toggle-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based slide-toggle implementations. */
export class _MatSlideToggleRequiredValidatorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.4", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, imports: [MatSlideToggleRequiredValidator], exports: [MatSlideToggleRequiredValidator] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatSlideToggleRequiredValidator],
                    exports: [MatSlideToggleRequiredValidator],
                }]
        }] });
export class MatSlideToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.4", ngImport: i0, type: MatSlideToggleModule, imports: [_MatSlideToggleRequiredValidatorModule, MatCommonModule,
            MatRippleModule,
            MatSlideToggle], exports: [_MatSlideToggleRequiredValidatorModule, MatSlideToggle, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSlideToggleModule, imports: [_MatSlideToggleRequiredValidatorModule,
            MatCommonModule,
            MatRippleModule, _MatSlideToggleRequiredValidatorModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatSlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatCommonModule,
                        MatRippleModule,
                        MatSlideToggle,
                    ],
                    exports: [_MatSlideToggleRequiredValidatorModule, MatSlideToggle, MatCommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlLXRvZ2dsZS9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFFbEYsdUZBQXVGO0FBS3ZGLE1BQU0sT0FBTyxzQ0FBc0M7OEdBQXRDLHNDQUFzQzsrR0FBdEMsc0NBQXNDLFlBSHZDLCtCQUErQixhQUMvQiwrQkFBK0I7K0dBRTlCLHNDQUFzQzs7MkZBQXRDLHNDQUFzQztrQkFKbEQsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7aUJBQzNDOztBQVlELE1BQU0sT0FBTyxvQkFBb0I7OEdBQXBCLG9CQUFvQjsrR0FBcEIsb0JBQW9CLFlBWHBCLHNDQUFzQyxFQUsvQyxlQUFlO1lBQ2YsZUFBZTtZQUNmLGNBQWMsYUFQTCxzQ0FBc0MsRUFTQyxjQUFjLEVBQUUsZUFBZTsrR0FFdEUsb0JBQW9CLFlBUDdCLHNDQUFzQztZQUN0QyxlQUFlO1lBQ2YsZUFBZSxFQU5OLHNDQUFzQyxFQVNpQixlQUFlOzsyRkFFdEUsb0JBQW9CO2tCQVRoQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxzQ0FBc0M7d0JBQ3RDLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixjQUFjO3FCQUNmO29CQUNELE9BQU8sRUFBRSxDQUFDLHNDQUFzQyxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUM7aUJBQ25GIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlfSBmcm9tICcuL3NsaWRlLXRvZ2dsZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4vc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvcic7XG5cbi8qKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGJ5IGJvdGggb3JpZ2luYWwgYW5kIE1EQy1iYXNlZCBzbGlkZS10b2dnbGUgaW1wbGVtZW50YXRpb25zLiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JdLFxuICBleHBvcnRzOiBbTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvcl0sXG59KVxuZXhwb3J0IGNsYXNzIF9NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBfTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE1hdFNsaWRlVG9nZ2xlLFxuICBdLFxuICBleHBvcnRzOiBbX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUsIE1hdFNsaWRlVG9nZ2xlLCBNYXRDb21tb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZU1vZHVsZSB7fVxuIl19