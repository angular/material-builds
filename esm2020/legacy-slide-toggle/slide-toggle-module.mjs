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
import { MatLegacySlideToggle } from './slide-toggle';
import { _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
export class MatLegacySlideToggleModule {
}
MatLegacySlideToggleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacySlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLegacySlideToggleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacySlideToggleModule, declarations: [MatLegacySlideToggle], imports: [_MatSlideToggleRequiredValidatorModule,
        MatRippleModule,
        MatCommonModule,
        ObserversModule], exports: [_MatSlideToggleRequiredValidatorModule, MatLegacySlideToggle, MatCommonModule] });
MatLegacySlideToggleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacySlideToggleModule, imports: [_MatSlideToggleRequiredValidatorModule,
        MatRippleModule,
        MatCommonModule,
        ObserversModule, _MatSlideToggleRequiredValidatorModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatLegacySlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatRippleModule,
                        MatCommonModule,
                        ObserversModule,
                    ],
                    exports: [_MatSlideToggleRequiredValidatorModule, MatLegacySlideToggle, MatCommonModule],
                    declarations: [MatLegacySlideToggle],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktc2xpZGUtdG9nZ2xlL3NsaWRlLXRvZ2dsZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsc0NBQXNDLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFZdEYsTUFBTSxPQUFPLDBCQUEwQjs7NEhBQTFCLDBCQUEwQjs2SEFBMUIsMEJBQTBCLGlCQUZ0QixvQkFBb0IsYUFOakMsc0NBQXNDO1FBQ3RDLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZSxhQUVQLHNDQUFzQyxFQUFFLG9CQUFvQixFQUFFLGVBQWU7NkhBRzVFLDBCQUEwQixZQVJuQyxzQ0FBc0M7UUFDdEMsZUFBZTtRQUNmLGVBQWU7UUFDZixlQUFlLEVBRVAsc0NBQXNDLEVBQXdCLGVBQWU7Z0dBRzVFLDBCQUEwQjtrQkFWdEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1Asc0NBQXNDO3dCQUN0QyxlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsc0NBQXNDLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDO29CQUN4RixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0TGVnYWN5U2xpZGVUb2dnbGV9IGZyb20gJy4vc2xpZGUtdG9nZ2xlJztcbmltcG9ydCB7X01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NsaWRlLXRvZ2dsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBfTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW19NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlLCBNYXRMZWdhY3lTbGlkZVRvZ2dsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0TGVnYWN5U2xpZGVUb2dnbGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lTbGlkZVRvZ2dsZU1vZHVsZSB7fVxuIl19