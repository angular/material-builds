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
MatButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatButtonModule, declarations: [MatButton,
        MatAnchor], imports: [MatRippleModule,
        MatCommonModule], exports: [MatButton,
        MatAnchor,
        MatCommonModule] });
MatButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatButtonModule, imports: [[
            MatRippleModule,
            MatCommonModule,
        ], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatRippleModule,
                        MatCommonModule,
                    ],
                    exports: [
                        MatButton,
                        MatAnchor,
                        MatCommonModule,
                    ],
                    declarations: [
                        MatButton,
                        MatAnchor,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24vYnV0dG9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBa0I5QyxNQUFNLE9BQU8sZUFBZTs7b0hBQWYsZUFBZTtxSEFBZixlQUFlLGlCQUp4QixTQUFTO1FBQ1QsU0FBUyxhQVZULGVBQWU7UUFDZixlQUFlLGFBR2YsU0FBUztRQUNULFNBQVM7UUFDVCxlQUFlO3FIQU9OLGVBQWUsWUFkakI7WUFDUCxlQUFlO1lBQ2YsZUFBZTtTQUNoQixFQUlDLGVBQWU7bUdBT04sZUFBZTtrQkFmM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsU0FBUzt3QkFDVCxTQUFTO3dCQUNULGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRTt3QkFDWixTQUFTO3dCQUNULFNBQVM7cUJBQ1Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0QW5jaG9yLCBNYXRCdXR0b259IGZyb20gJy4vYnV0dG9uJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdEJ1dHRvbixcbiAgICBNYXRBbmNob3IsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRCdXR0b24sXG4gICAgTWF0QW5jaG9yLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Nb2R1bGUge31cbiJdfQ==