/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatAnchor, MatButton } from './button';
import * as i0 from "@angular/core";
export class MatButtonModule {
}
MatButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatButtonModule, declarations: [MatButton, MatAnchor], imports: [MatRippleModule, MatCommonModule], exports: [MatButton, MatAnchor, MatCommonModule] });
MatButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatButtonModule, imports: [MatRippleModule, MatCommonModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.1", ngImport: i0, type: MatButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule],
                    exports: [MatButton, MatAnchor, MatCommonModule],
                    declarations: [MatButton, MatAnchor],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24vYnV0dG9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBTzlDLE1BQU0sT0FBTyxlQUFlOztpSEFBZixlQUFlO2tIQUFmLGVBQWUsaUJBRlgsU0FBUyxFQUFFLFNBQVMsYUFGekIsZUFBZSxFQUFFLGVBQWUsYUFDaEMsU0FBUyxFQUFFLFNBQVMsRUFBRSxlQUFlO2tIQUdwQyxlQUFlLFlBSmhCLGVBQWUsRUFBRSxlQUFlLEVBQ1YsZUFBZTtnR0FHcEMsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO29CQUMzQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQztvQkFDaEQsWUFBWSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztpQkFDckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0QW5jaG9yLCBNYXRCdXR0b259IGZyb20gJy4vYnV0dG9uJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdFJpcHBsZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdEJ1dHRvbiwgTWF0QW5jaG9yLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRCdXR0b24sIE1hdEFuY2hvcl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbk1vZHVsZSB7fVxuIl19