/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggle } from './slide-toggle';
import { MatSlideToggleRequiredValidator } from './slide-toggle-required-validator';
/** This module is used by both original and MDC-based slide-toggle implementations. */
let _MatSlideToggleRequiredValidatorModule = /** @class */ (() => {
    let _MatSlideToggleRequiredValidatorModule = 
    // tslint:disable-next-line:class-name
    class _MatSlideToggleRequiredValidatorModule {
    };
    _MatSlideToggleRequiredValidatorModule = __decorate([
        NgModule({
            exports: [MatSlideToggleRequiredValidator],
            declarations: [MatSlideToggleRequiredValidator],
        })
        // tslint:disable-next-line:class-name
    ], _MatSlideToggleRequiredValidatorModule);
    return _MatSlideToggleRequiredValidatorModule;
})();
export { _MatSlideToggleRequiredValidatorModule };
let MatSlideToggleModule = /** @class */ (() => {
    let MatSlideToggleModule = class MatSlideToggleModule {
    };
    MatSlideToggleModule = __decorate([
        NgModule({
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
        })
    ], MatSlideToggleModule);
    return MatSlideToggleModule;
})();
export { MatSlideToggleModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFFbEYsdUZBQXVGO0FBTXZGO0lBQUEsSUFBYSxzQ0FBc0M7SUFEbkQsc0NBQXNDO0lBQ3RDLE1BQWEsc0NBQXNDO0tBQ2xELENBQUE7SUFEWSxzQ0FBc0M7UUFMbEQsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7WUFDMUMsWUFBWSxFQUFFLENBQUMsK0JBQStCLENBQUM7U0FDaEQsQ0FBQztRQUNGLHNDQUFzQztPQUN6QixzQ0FBc0MsQ0FDbEQ7SUFBRCw2Q0FBQztLQUFBO1NBRFksc0NBQXNDO0FBaUJuRDtJQUFBLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0tBQUcsQ0FBQTtJQUF2QixvQkFBb0I7UUFkaEMsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLHNDQUFzQztnQkFDdEMsZUFBZTtnQkFDZixlQUFlO2dCQUNmLGVBQWU7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asc0NBQXNDO2dCQUN0QyxjQUFjO2dCQUNkLGVBQWU7YUFDaEI7WUFDRCxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDL0IsQ0FBQztPQUNXLG9CQUFvQixDQUFHO0lBQUQsMkJBQUM7S0FBQTtTQUF2QixvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0U2xpZGVUb2dnbGV9IGZyb20gJy4vc2xpZGUtdG9nZ2xlJztcbmltcG9ydCB7TWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvcn0gZnJvbSAnLi9zbGlkZS10b2dnbGUtcmVxdWlyZWQtdmFsaWRhdG9yJztcblxuLyoqIFRoaXMgbW9kdWxlIGlzIHVzZWQgYnkgYm90aCBvcmlnaW5hbCBhbmQgTURDLWJhc2VkIHNsaWRlLXRvZ2dsZSBpbXBsZW1lbnRhdGlvbnMuICovXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JdLFxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUge1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgX01hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUsXG4gICAgTWF0UmlwcGxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBfTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSxcbiAgICBNYXRTbGlkZVRvZ2dsZSxcbiAgICBNYXRDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0U2xpZGVUb2dnbGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZU1vZHVsZSB7fVxuIl19