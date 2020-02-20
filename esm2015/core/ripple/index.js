/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/ripple/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatRipple } from './ripple';
export { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple } from './ripple';
export { RippleRef } from './ripple-ref';
export { defaultRippleAnimationConfig, RippleRenderer } from './ripple-renderer';
export class MatRippleModule {
}
MatRippleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatCommonModule, PlatformModule],
                exports: [MatRipple, MatCommonModule],
                declarations: [MatRipple],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9yaXBwbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbkMscURBQWMsVUFBVSxDQUFDO0FBQ3pCLDBCQUFjLGNBQWMsQ0FBQztBQUM3Qiw2REFBYyxtQkFBbUIsQ0FBQztBQU9sQyxNQUFNLE9BQU8sZUFBZTs7O1lBTDNCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDO2dCQUMxQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO2dCQUNyQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5pbXBvcnQge01hdFJpcHBsZX0gZnJvbSAnLi9yaXBwbGUnO1xuXG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZSc7XG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZS1yZWYnO1xuZXhwb3J0ICogZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBQbGF0Zm9ybU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRSaXBwbGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdFJpcHBsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZU1vZHVsZSB7fVxuIl19