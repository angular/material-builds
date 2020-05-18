/**
 * @fileoverview added by tsickle
 * Generated from: src/material/checkbox/checkbox-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
/**
 * This module is used by both original and MDC-based checkbox implementations.
 */
let _MatCheckboxRequiredValidatorModule = /** @class */ (() => {
    /**
     * This module is used by both original and MDC-based checkbox implementations.
     */
    class _MatCheckboxRequiredValidatorModule {
    }
    _MatCheckboxRequiredValidatorModule.decorators = [
        { type: NgModule, args: [{
                    exports: [MatCheckboxRequiredValidator],
                    declarations: [MatCheckboxRequiredValidator],
                },] }
    ];
    return _MatCheckboxRequiredValidatorModule;
})();
export { _MatCheckboxRequiredValidatorModule };
let MatCheckboxModule = /** @class */ (() => {
    class MatCheckboxModule {
    }
    MatCheckboxModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        MatRippleModule, MatCommonModule, ObserversModule,
                        _MatCheckboxRequiredValidatorModule
                    ],
                    exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
                    declarations: [MatCheckbox],
                },] }
    ];
    return MatCheckboxModule;
})();
export { MatCheckboxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdkMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sK0JBQStCLENBQUM7Ozs7QUFHM0U7Ozs7SUFBQSxNQUthLG1DQUFtQzs7O2dCQUwvQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsNEJBQTRCLENBQUM7b0JBQ3ZDLFlBQVksRUFBRSxDQUFDLDRCQUE0QixDQUFDO2lCQUM3Qzs7SUFHRCwwQ0FBQztLQUFBO1NBRFksbUNBQW1DO0FBR2hEO0lBQUEsTUFRYSxpQkFBaUI7OztnQkFSN0IsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWU7d0JBQ2pELG1DQUFtQztxQkFDcEM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxtQ0FBbUMsQ0FBQztvQkFDNUUsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUM1Qjs7SUFFRCx3QkFBQztLQUFBO1NBRFksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdENoZWNrYm94fSBmcm9tICcuL2NoZWNrYm94JztcbmltcG9ydCB7TWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcn0gZnJvbSAnLi9jaGVja2JveC1yZXF1aXJlZC12YWxpZGF0b3InO1xuXG4vKiogVGhpcyBtb2R1bGUgaXMgdXNlZCBieSBib3RoIG9yaWdpbmFsIGFuZCBNREMtYmFzZWQgY2hlY2tib3ggaW1wbGVtZW50YXRpb25zLiAqL1xuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yXSxcbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlIHtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE1hdFJpcHBsZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBPYnNlcnZlcnNNb2R1bGUsXG4gICAgX01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW01hdENoZWNrYm94LCBNYXRDb21tb25Nb2R1bGUsIF9NYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0Q2hlY2tib3hdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveE1vZHVsZSB7XG59XG4iXX0=