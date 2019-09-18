/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3NuYWNrLWJhci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyxxQkFBcUIsR0FFOUI7Ozs7SUFFRixhQUFhLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUM5QixLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQztZQUMxQixTQUFTLEVBQUUsWUFBWTtZQUN2QixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1lBQ3JCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN2RSxVQUFVLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQztZQUN0RixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQyxDQUFDO0tBQ0wsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBzbmFjayBiYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTbmFja0JhckFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgc25hY2tCYXJTdGF0ZTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHNob3dzIGFuZCBoaWRlcyBhIHNuYWNrIGJhci4gKi9cbiAgc25hY2tCYXJTdGF0ZTogdHJpZ2dlcignc3RhdGUnLCBbXG4gICAgc3RhdGUoJ3ZvaWQsIGhpZGRlbicsIHN0eWxlKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuOCknLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICB9KSksXG4gICAgc3RhdGUoJ3Zpc2libGUnLCBzdHlsZSh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgIH0pKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZpc2libGUnLCBhbmltYXRlKCcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScpKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQsICogPT4gaGlkZGVuJywgYW5pbWF0ZSgnNzVtcyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDEsIDEpJywgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMFxuICAgIH0pKSksXG4gIF0pXG59O1xuIl19