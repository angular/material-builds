/**
 * @fileoverview added by tsickle
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
/** @type {?} */
const animationBody = [
    // Note: The `enter` animation transitions to `transform: none`, because for some reason
    // specifying the transform explicitly, causes IE both to blur the dialog content and
    // decimate the animation performance. Leaving it as `none` solves both issues.
    state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
    state('enter', style({ transform: 'none' })),
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
    transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))),
];
/**
 * Animations used by MatDialog.
 * \@docs-private
 * @type {?}
 */
export const matDialogAnimations = {
    /**
     * Animation that is applied on the dialog container by defalt.
     */
    dialogContainer: trigger('dialogContainer', animationBody),
    /**
     * @deprecated \@breaking-change 8.0.0 Use `matDialogAnimations.dialogContainer` instead.
     */
    slideDialog: trigger('slideDialog', animationBody)
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL2RpYWxvZy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7TUFFdkIsYUFBYSxHQUFHO0lBQ3BCLHdGQUF3RjtJQUN4RixxRkFBcUY7SUFDckYsK0VBQStFO0lBQy9FLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztJQUNqRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQzFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxFQUMvRCxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsVUFBVSxDQUFDLHNCQUFzQixFQUM3QixPQUFPLENBQUMscUNBQXFDLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztDQUN6RTs7Ozs7O0FBTUQsTUFBTSxPQUFPLG1CQUFtQixHQUc1Qjs7OztJQUVGLGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDOzs7O0lBRzFELFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQztDQUNuRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5jb25zdCBhbmltYXRpb25Cb2R5ID0gW1xuICAvLyBOb3RlOiBUaGUgYGVudGVyYCBhbmltYXRpb24gdHJhbnNpdGlvbnMgdG8gYHRyYW5zZm9ybTogbm9uZWAsIGJlY2F1c2UgZm9yIHNvbWUgcmVhc29uXG4gIC8vIHNwZWNpZnlpbmcgdGhlIHRyYW5zZm9ybSBleHBsaWNpdGx5LCBjYXVzZXMgSUUgYm90aCB0byBibHVyIHRoZSBkaWFsb2cgY29udGVudCBhbmRcbiAgLy8gZGVjaW1hdGUgdGhlIGFuaW1hdGlvbiBwZXJmb3JtYW5jZS4gTGVhdmluZyBpdCBhcyBgbm9uZWAgc29sdmVzIGJvdGggaXNzdWVzLlxuICBzdGF0ZSgndm9pZCwgZXhpdCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwLjcpJ30pKSxcbiAgc3RhdGUoJ2VudGVyJywgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnfSkpLFxuICB0cmFuc2l0aW9uKCcqID0+IGVudGVyJywgYW5pbWF0ZSgnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknLFxuICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnLCBvcGFjaXR5OiAxfSkpKSxcbiAgdHJhbnNpdGlvbignKiA9PiB2b2lkLCAqID0+IGV4aXQnLFxuICAgICAgYW5pbWF0ZSgnNzVtcyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSknLCBzdHlsZSh7b3BhY2l0eTogMH0pKSksXG5dO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSBNYXREaWFsb2cuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXREaWFsb2dBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGRpYWxvZ0NvbnRhaW5lcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBzbGlkZURpYWxvZzogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IGlzIGFwcGxpZWQgb24gdGhlIGRpYWxvZyBjb250YWluZXIgYnkgZGVmYWx0LiAqL1xuICBkaWFsb2dDb250YWluZXI6IHRyaWdnZXIoJ2RpYWxvZ0NvbnRhaW5lcicsIGFuaW1hdGlvbkJvZHkpLFxuXG4gIC8qKiBAZGVwcmVjYXRlZCBAYnJlYWtpbmctY2hhbmdlIDguMC4wIFVzZSBgbWF0RGlhbG9nQW5pbWF0aW9ucy5kaWFsb2dDb250YWluZXJgIGluc3RlYWQuICovXG4gIHNsaWRlRGlhbG9nOiB0cmlnZ2VyKCdzbGlkZURpYWxvZycsIGFuaW1hdGlvbkJvZHkpXG59O1xuIl19