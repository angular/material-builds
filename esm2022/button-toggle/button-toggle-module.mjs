/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatButtonToggle, MatButtonToggleGroup } from './button-toggle';
import * as i0 from "@angular/core";
class MatButtonToggleModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatButtonToggleModule, declarations: [MatButtonToggleGroup, MatButtonToggle], imports: [MatCommonModule, MatRippleModule], exports: [MatCommonModule, MatButtonToggleGroup, MatButtonToggle] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonToggleModule, imports: [MatCommonModule, MatRippleModule, MatCommonModule] }); }
}
export { MatButtonToggleModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRippleModule],
                    exports: [MatCommonModule, MatButtonToggleGroup, MatButtonToggle],
                    declarations: [MatButtonToggleGroup, MatButtonToggle],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZS9idXR0b24tdG9nZ2xlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUV0RSxNQUthLHFCQUFxQjs4R0FBckIscUJBQXFCOytHQUFyQixxQkFBcUIsaUJBRmpCLG9CQUFvQixFQUFFLGVBQWUsYUFGMUMsZUFBZSxFQUFFLGVBQWUsYUFDaEMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLGVBQWU7K0dBR3JELHFCQUFxQixZQUp0QixlQUFlLEVBQUUsZUFBZSxFQUNoQyxlQUFlOztTQUdkLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQUxqQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUM7b0JBQ2pFLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLGVBQWUsQ0FBQztpQkFDdEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0QnV0dG9uVG9nZ2xlLCBNYXRCdXR0b25Ub2dnbGVHcm91cH0gZnJvbSAnLi9idXR0b24tdG9nZ2xlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdENvbW1vbk1vZHVsZSwgTWF0QnV0dG9uVG9nZ2xlR3JvdXAsIE1hdEJ1dHRvblRvZ2dsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdEJ1dHRvblRvZ2dsZUdyb3VwLCBNYXRCdXR0b25Ub2dnbGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGVNb2R1bGUge31cbiJdfQ==