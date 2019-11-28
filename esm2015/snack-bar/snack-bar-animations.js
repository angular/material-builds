/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material snack bar.
 * \@docs-private
 * @type {?}
 */
export const matSnackBarAnimations = {
    /**
     * Animation that shows and hides a snack bar.
     */
    snackBarState: trigger('state', [
        state('void, hidden', style({
            transform: 'scale(0.8)',
            opacity: 0,
        })),
        state('visible', style({
            transform: 'scale(1)',
            opacity: 1,
        })),
        transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => void, * => hidden', animate('75ms cubic-bezier(0.4, 0.0, 1, 1)', style({
            opacity: 0
        }))),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3NuYWNrLWJhci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQU03QixNQUFNLE9BQU8scUJBQXFCLEdBRTlCOzs7O0lBRUYsYUFBYSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDOUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUM7WUFDMUIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztZQUNyQixTQUFTLEVBQUUsVUFBVTtZQUNyQixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDdkUsVUFBVSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLENBQUM7WUFDdEYsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUMsQ0FBQztLQUNMLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0ZXJpYWwgc25hY2sgYmFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0U25hY2tCYXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHNuYWNrQmFyU3RhdGU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCBzaG93cyBhbmQgaGlkZXMgYSBzbmFjayBiYXIuICovXG4gIHNuYWNrQmFyU3RhdGU6IHRyaWdnZXIoJ3N0YXRlJywgW1xuICAgIHN0YXRlKCd2b2lkLCBoaWRkZW4nLCBzdHlsZSh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjgpJyxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgfSkpLFxuICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoe1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9KSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2aXNpYmxlJywgYW5pbWF0ZSgnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkLCAqID0+IGhpZGRlbicsIGFuaW1hdGUoJzc1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAxLCAxKScsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDBcbiAgICB9KSkpLFxuICBdKVxufTtcbiJdfQ==