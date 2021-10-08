/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggle } from './slide-toggle';
import { MatSlideToggleRequiredValidator } from './slide-toggle-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based slide-toggle implementations. */
export class _MatSlideToggleRequiredValidatorModule {
}
_MatSlideToggleRequiredValidatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
_MatSlideToggleRequiredValidatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, declarations: [MatSlideToggleRequiredValidator], exports: [MatSlideToggleRequiredValidator] });
_MatSlideToggleRequiredValidatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [MatSlideToggleRequiredValidator],
                    declarations: [MatSlideToggleRequiredValidator],
                }]
        }] });
export class MatSlideToggleModule {
}
MatSlideToggleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSlideToggleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleModule, declarations: [MatSlideToggle], imports: [_MatSlideToggleRequiredValidatorModule, MatRippleModule,
        MatCommonModule,
        ObserversModule], exports: [_MatSlideToggleRequiredValidatorModule, MatSlideToggle,
        MatCommonModule] });
MatSlideToggleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleModule, imports: [[
            _MatSlideToggleRequiredValidatorModule,
            MatRippleModule,
            MatCommonModule,
            ObserversModule,
        ], _MatSlideToggleRequiredValidatorModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatRippleModule,
                        MatCommonModule,
                        ObserversModule,
                    ],
                    exports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatSlideToggle,
                        MatCommonModule
                    ],
                    declarations: [MatSlideToggle],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFFbEYsdUZBQXVGO0FBS3ZGLE1BQU0sT0FBTyxzQ0FBc0M7OzJJQUF0QyxzQ0FBc0M7NElBQXRDLHNDQUFzQyxpQkFGbEMsK0JBQStCLGFBRHBDLCtCQUErQjs0SUFHOUIsc0NBQXNDO21HQUF0QyxzQ0FBc0M7a0JBSmxELFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7b0JBQzFDLFlBQVksRUFBRSxDQUFDLCtCQUErQixDQUFDO2lCQUNoRDs7QUFpQkQsTUFBTSxPQUFPLG9CQUFvQjs7eUhBQXBCLG9CQUFvQjswSEFBcEIsb0JBQW9CLGlCQUZoQixjQUFjLGFBZGxCLHNDQUFzQyxFQUsvQyxlQUFlO1FBQ2YsZUFBZTtRQUNmLGVBQWUsYUFQTixzQ0FBc0MsRUFXL0MsY0FBYztRQUNkLGVBQWU7MEhBSU4sb0JBQW9CLFlBYnRCO1lBQ1Asc0NBQXNDO1lBQ3RDLGVBQWU7WUFDZixlQUFlO1lBQ2YsZUFBZTtTQUNoQixFQVJVLHNDQUFzQyxFQVkvQyxlQUFlO21HQUlOLG9CQUFvQjtrQkFkaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1Asc0NBQXNDO3dCQUN0QyxlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLHNDQUFzQzt3QkFDdEMsY0FBYzt3QkFDZCxlQUFlO3FCQUNoQjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUM7aUJBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlfSBmcm9tICcuL3NsaWRlLXRvZ2dsZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4vc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvcic7XG5cbi8qKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGJ5IGJvdGggb3JpZ2luYWwgYW5kIE1EQy1iYXNlZCBzbGlkZS10b2dnbGUgaW1wbGVtZW50YXRpb25zLiAqL1xuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yXSxcbn0pXG5leHBvcnQgY2xhc3MgX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUge31cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIF9NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlLFxuICAgIE1hdFJpcHBsZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUsXG4gICAgTWF0U2xpZGVUb2dnbGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW01hdFNsaWRlVG9nZ2xlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVUb2dnbGVNb2R1bGUge31cbiJdfQ==