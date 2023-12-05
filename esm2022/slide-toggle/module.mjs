/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatSlideToggle } from './slide-toggle';
import { MatSlideToggleRequiredValidator } from './slide-toggle-required-validator';
import * as i0 from "@angular/core";
/**
 * @deprecated No longer used, `MatSlideToggle` implements required validation directly.
 * @breaking-change 19.0.0
 */
export class _MatSlideToggleRequiredValidatorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, imports: [MatSlideToggleRequiredValidator], exports: [MatSlideToggleRequiredValidator] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatSlideToggleRequiredValidator],
                    exports: [MatSlideToggleRequiredValidator],
                }]
        }] });
export class MatSlideToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatSlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatSlideToggleModule, imports: [MatSlideToggle, MatCommonModule], exports: [MatSlideToggle, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatSlideToggleModule, imports: [MatCommonModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatSlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatSlideToggle, MatCommonModule],
                    exports: [MatSlideToggle, MatCommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlLXRvZ2dsZS9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOztBQUVsRjs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sc0NBQXNDO3FIQUF0QyxzQ0FBc0M7c0hBQXRDLHNDQUFzQyxZQUh2QywrQkFBK0IsYUFDL0IsK0JBQStCO3NIQUU5QixzQ0FBc0M7O2tHQUF0QyxzQ0FBc0M7a0JBSmxELFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7b0JBQzFDLE9BQU8sRUFBRSxDQUFDLCtCQUErQixDQUFDO2lCQUMzQzs7QUFPRCxNQUFNLE9BQU8sb0JBQW9CO3FIQUFwQixvQkFBb0I7c0hBQXBCLG9CQUFvQixZQUhyQixjQUFjLEVBQUUsZUFBZSxhQUMvQixjQUFjLEVBQUUsZUFBZTtzSEFFOUIsb0JBQW9CLFlBSEwsZUFBZSxFQUNmLGVBQWU7O2tHQUU5QixvQkFBb0I7a0JBSmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlfSBmcm9tICcuL3NsaWRlLXRvZ2dsZSc7XG5pbXBvcnQge01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4vc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvcic7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQsIGBNYXRTbGlkZVRvZ2dsZWAgaW1wbGVtZW50cyByZXF1aXJlZCB2YWxpZGF0aW9uIGRpcmVjdGx5LlxuICogQGJyZWFraW5nLWNoYW5nZSAxOS4wLjBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JdLFxuICBleHBvcnRzOiBbTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvcl0sXG59KVxuZXhwb3J0IGNsYXNzIF9NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRTbGlkZVRvZ2dsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFNsaWRlVG9nZ2xlLCBNYXRDb21tb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZU1vZHVsZSB7fVxuIl19