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
 * Animations used by the Material tabs.
 * \@docs-private
 * @type {?}
 */
export const matTabsAnimations = {
    /**
     * Animation translates a tab along the X axis.
     */
    translateTab: trigger('translateTab', [
        // Note: transitions to `none` instead of 0, because some browsers might blur the content.
        state('center, void, left-origin-center, right-origin-center', style({ transform: 'none' })),
        // If the tab is either on the left or right, we additionally add a `min-height` of 1px
        // in order to ensure that the element has a height before its state changes. This is
        // necessary because Chrome does seem to skip the transition in RTL mode if the element does
        // not have a static height and is not rendered. See related issue: #9465
        state('left', style({ transform: 'translate3d(-100%, 0, 0)', minHeight: '1px' })),
        state('right', style({ transform: 'translate3d(100%, 0, 0)', minHeight: '1px' })),
        transition('* => left, * => right, left => center, right => center', animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')),
        transition('void => left-origin-center', [
            style({ transform: 'translate3d(-100%, 0, 0)' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')
        ]),
        transition('void => right-origin-center', [
            style({ transform: 'translate3d(100%, 0, 0)' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')
        ])
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFicy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyxpQkFBaUIsR0FFMUI7Ozs7SUFFRixZQUFZLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtRQUNwQywwRkFBMEY7UUFDMUYsS0FBSyxDQUFDLHVEQUF1RCxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBRTFGLHVGQUF1RjtRQUN2RixxRkFBcUY7UUFDckYsNEZBQTRGO1FBQzVGLHlFQUF5RTtRQUN6RSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUMvRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUUvRSxVQUFVLENBQUMsd0RBQXdELEVBQy9ELE9BQU8sQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1FBQ3BFLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRTtZQUN2QyxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsc0RBQXNELENBQUM7U0FDaEUsQ0FBQztRQUNGLFVBQVUsQ0FBQyw2QkFBNkIsRUFBRTtZQUN4QyxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUseUJBQXlCLEVBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsc0RBQXNELENBQUM7U0FDaEUsQ0FBQztLQUNILENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0ZXJpYWwgdGFicy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdFRhYnNBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zbGF0ZVRhYjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0cmFuc2xhdGVzIGEgdGFiIGFsb25nIHRoZSBYIGF4aXMuICovXG4gIHRyYW5zbGF0ZVRhYjogdHJpZ2dlcigndHJhbnNsYXRlVGFiJywgW1xuICAgIC8vIE5vdGU6IHRyYW5zaXRpb25zIHRvIGBub25lYCBpbnN0ZWFkIG9mIDAsIGJlY2F1c2Ugc29tZSBicm93c2VycyBtaWdodCBibHVyIHRoZSBjb250ZW50LlxuICAgIHN0YXRlKCdjZW50ZXIsIHZvaWQsIGxlZnQtb3JpZ2luLWNlbnRlciwgcmlnaHQtb3JpZ2luLWNlbnRlcicsIHN0eWxlKHt0cmFuc2Zvcm06ICdub25lJ30pKSxcblxuICAgIC8vIElmIHRoZSB0YWIgaXMgZWl0aGVyIG9uIHRoZSBsZWZ0IG9yIHJpZ2h0LCB3ZSBhZGRpdGlvbmFsbHkgYWRkIGEgYG1pbi1oZWlnaHRgIG9mIDFweFxuICAgIC8vIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGhhcyBhIGhlaWdodCBiZWZvcmUgaXRzIHN0YXRlIGNoYW5nZXMuIFRoaXMgaXNcbiAgICAvLyBuZWNlc3NhcnkgYmVjYXVzZSBDaHJvbWUgZG9lcyBzZWVtIHRvIHNraXAgdGhlIHRyYW5zaXRpb24gaW4gUlRMIG1vZGUgaWYgdGhlIGVsZW1lbnQgZG9lc1xuICAgIC8vIG5vdCBoYXZlIGEgc3RhdGljIGhlaWdodCBhbmQgaXMgbm90IHJlbmRlcmVkLiBTZWUgcmVsYXRlZCBpc3N1ZTogIzk0NjVcbiAgICBzdGF0ZSgnbGVmdCcsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLCBtaW5IZWlnaHQ6ICcxcHgnfSkpLFxuICAgIHN0YXRlKCdyaWdodCcsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsIG1pbkhlaWdodDogJzFweCd9KSksXG5cbiAgICB0cmFuc2l0aW9uKCcqID0+IGxlZnQsICogPT4gcmlnaHQsIGxlZnQgPT4gY2VudGVyLCByaWdodCA9PiBjZW50ZXInLFxuICAgICAgICBhbmltYXRlKCd7e2FuaW1hdGlvbkR1cmF0aW9ufX0gY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJykpLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gbGVmdC1vcmlnaW4tY2VudGVyJywgW1xuICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKSd9KSxcbiAgICAgIGFuaW1hdGUoJ3t7YW5pbWF0aW9uRHVyYXRpb259fSBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKVxuICAgIF0pLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gcmlnaHQtb3JpZ2luLWNlbnRlcicsIFtcbiAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKSd9KSxcbiAgICAgIGFuaW1hdGUoJ3t7YW5pbWF0aW9uRHVyYXRpb259fSBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKVxuICAgIF0pXG4gIF0pXG59O1xuIl19