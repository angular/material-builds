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
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
/** This module is used by both original and MDC-based checkbox implementations. */
let _MatCheckboxRequiredValidatorModule = /** @class */ (() => {
    let _MatCheckboxRequiredValidatorModule = 
    // tslint:disable-next-line:class-name
    class _MatCheckboxRequiredValidatorModule {
    };
    _MatCheckboxRequiredValidatorModule = __decorate([
        NgModule({
            exports: [MatCheckboxRequiredValidator],
            declarations: [MatCheckboxRequiredValidator],
        })
        // tslint:disable-next-line:class-name
    ], _MatCheckboxRequiredValidatorModule);
    return _MatCheckboxRequiredValidatorModule;
})();
export { _MatCheckboxRequiredValidatorModule };
let MatCheckboxModule = /** @class */ (() => {
    let MatCheckboxModule = class MatCheckboxModule {
    };
    MatCheckboxModule = __decorate([
        NgModule({
            imports: [
                MatRippleModule, MatCommonModule, ObserversModule,
                _MatCheckboxRequiredValidatorModule
            ],
            exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
            declarations: [MatCheckbox],
        })
    ], MatCheckboxModule);
    return MatCheckboxModule;
})();
export { MatCheckboxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTNFLG1GQUFtRjtBQU1uRjtJQUFBLElBQWEsbUNBQW1DO0lBRGhELHNDQUFzQztJQUN0QyxNQUFhLG1DQUFtQztLQUMvQyxDQUFBO0lBRFksbUNBQW1DO1FBTC9DLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO1lBQ3ZDLFlBQVksRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQzdDLENBQUM7UUFDRixzQ0FBc0M7T0FDekIsbUNBQW1DLENBQy9DO0lBQUQsMENBQUM7S0FBQTtTQURZLG1DQUFtQztBQVdoRDtJQUFBLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0tBQzdCLENBQUE7SUFEWSxpQkFBaUI7UUFSN0IsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZTtnQkFDakQsbUNBQW1DO2FBQ3BDO1lBQ0QsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxtQ0FBbUMsQ0FBQztZQUM1RSxZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDNUIsQ0FBQztPQUNXLGlCQUFpQixDQUM3QjtJQUFELHdCQUFDO0tBQUE7U0FEWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Q2hlY2tib3h9IGZyb20gJy4vY2hlY2tib3gnO1xuaW1wb3J0IHtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuL2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvcic7XG5cbi8qKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGJ5IGJvdGggb3JpZ2luYWwgYW5kIE1EQy1iYXNlZCBjaGVja2JveCBpbXBsZW1lbnRhdGlvbnMuICovXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JdLFxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JNb2R1bGUge1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE9ic2VydmVyc01vZHVsZSxcbiAgICBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbTWF0Q2hlY2tib3gsIE1hdENvbW1vbk1vZHVsZSwgX01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRDaGVja2JveF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94TW9kdWxlIHtcbn1cbiJdfQ==