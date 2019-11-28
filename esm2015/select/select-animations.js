/**
 * @fileoverview added by tsickle
 * Generated from: src/material/select/select-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, animateChild, query, state, style, transition, trigger, } from '@angular/animations';
/**
 * The following are all the animations for the mat-select component, with each
 * const containing the metadata for one animation.
 *
 * The values below match the implementation of the AngularJS Material mat-select animation.
 * \@docs-private
 * @type {?}
 */
export const matSelectAnimations = {
    /**
     * This animation ensures the select's overlay panel animation (transformPanel) is called when
     * closing the select.
     * This is needed due to https://github.com/angular/angular/issues/23302
     */
    transformPanelWrap: trigger('transformPanelWrap', [
        transition('* => void', query('@transformPanel', [animateChild()], { optional: true }))
    ]),
    /**
     * This animation transforms the select's overlay panel on and off the page.
     *
     * When the panel is attached to the DOM, it expands its width by the amount of padding, scales it
     * up to 100% on the Y axis, fades in its border, and translates slightly up and to the
     * side to ensure the option text correctly overlaps the trigger text.
     *
     * When the panel is removed from the DOM, it simply fades out linearly.
     */
    transformPanel: trigger('transformPanel', [
        state('void', style({
            transform: 'scaleY(0.8)',
            minWidth: '100%',
            opacity: 0
        })),
        state('showing', style({
            opacity: 1,
            minWidth: 'calc(100% + 32px)',
            // 32px = 2 * 16px padding
            transform: 'scaleY(1)'
        })),
        state('showing-multiple', style({
            opacity: 1,
            minWidth: 'calc(100% + 64px)',
            // 64px = 48px padding on the left + 16px padding on the right
            transform: 'scaleY(1)'
        })),
        transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 })))
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxPQUFPLEVBQ1AsWUFBWSxFQUVaLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBQ1IsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7O0FBUzdCLE1BQU0sT0FBTyxtQkFBbUIsR0FHNUI7Ozs7OztJQU1GLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtRQUM5QyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQzdELEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDekIsQ0FBQzs7Ozs7Ozs7OztJQVdGLGNBQWMsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDbEIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztZQUNyQixPQUFPLEVBQUUsQ0FBQztZQUNWLFFBQVEsRUFBRSxtQkFBbUI7O1lBQzdCLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUM7WUFDOUIsT0FBTyxFQUFFLENBQUM7WUFDVixRQUFRLEVBQUUsbUJBQW1COztZQUM3QixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3BFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0UsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIGFuaW1hdGVDaGlsZCxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBxdWVyeSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBUaGUgZm9sbG93aW5nIGFyZSBhbGwgdGhlIGFuaW1hdGlvbnMgZm9yIHRoZSBtYXQtc2VsZWN0IGNvbXBvbmVudCwgd2l0aCBlYWNoXG4gKiBjb25zdCBjb250YWluaW5nIHRoZSBtZXRhZGF0YSBmb3Igb25lIGFuaW1hdGlvbi5cbiAqXG4gKiBUaGUgdmFsdWVzIGJlbG93IG1hdGNoIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgQW5ndWxhckpTIE1hdGVyaWFsIG1hdC1zZWxlY3QgYW5pbWF0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0U2VsZWN0QW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2Zvcm1QYW5lbFdyYXA6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgdHJhbnNmb3JtUGFuZWw6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBlbnN1cmVzIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIGFuaW1hdGlvbiAodHJhbnNmb3JtUGFuZWwpIGlzIGNhbGxlZCB3aGVuXG4gICAqIGNsb3NpbmcgdGhlIHNlbGVjdC5cbiAgICogVGhpcyBpcyBuZWVkZWQgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIzMzAyXG4gICAqL1xuICB0cmFuc2Zvcm1QYW5lbFdyYXA6IHRyaWdnZXIoJ3RyYW5zZm9ybVBhbmVsV3JhcCcsIFtcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIHF1ZXJ5KCdAdHJhbnNmb3JtUGFuZWwnLCBbYW5pbWF0ZUNoaWxkKCldLFxuICAgICAgICAgIHtvcHRpb25hbDogdHJ1ZX0pKVxuICBdKSxcblxuICAvKipcbiAgICogVGhpcyBhbmltYXRpb24gdHJhbnNmb3JtcyB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBvbiBhbmQgb2ZmIHRoZSBwYWdlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBwYW5lbCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLCBpdCBleHBhbmRzIGl0cyB3aWR0aCBieSB0aGUgYW1vdW50IG9mIHBhZGRpbmcsIHNjYWxlcyBpdFxuICAgKiB1cCB0byAxMDAlIG9uIHRoZSBZIGF4aXMsIGZhZGVzIGluIGl0cyBib3JkZXIsIGFuZCB0cmFuc2xhdGVzIHNsaWdodGx5IHVwIGFuZCB0byB0aGVcbiAgICogc2lkZSB0byBlbnN1cmUgdGhlIG9wdGlvbiB0ZXh0IGNvcnJlY3RseSBvdmVybGFwcyB0aGUgdHJpZ2dlciB0ZXh0LlxuICAgKlxuICAgKiBXaGVuIHRoZSBwYW5lbCBpcyByZW1vdmVkIGZyb20gdGhlIERPTSwgaXQgc2ltcGx5IGZhZGVzIG91dCBsaW5lYXJseS5cbiAgICovXG4gIHRyYW5zZm9ybVBhbmVsOiB0cmlnZ2VyKCd0cmFuc2Zvcm1QYW5lbCcsIFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlWSgwLjgpJyxcbiAgICAgIG1pbldpZHRoOiAnMTAwJScsXG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSkpLFxuICAgIHN0YXRlKCdzaG93aW5nJywgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIG1pbldpZHRoOiAnY2FsYygxMDAlICsgMzJweCknLCAvLyAzMnB4ID0gMiAqIDE2cHggcGFkZGluZ1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGVZKDEpJ1xuICAgIH0pKSxcbiAgICBzdGF0ZSgnc2hvd2luZy1tdWx0aXBsZScsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBtaW5XaWR0aDogJ2NhbGMoMTAwJSArIDY0cHgpJywgLy8gNjRweCA9IDQ4cHggcGFkZGluZyBvbiB0aGUgbGVmdCArIDE2cHggcGFkZGluZyBvbiB0aGUgcmlnaHRcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlWSgxKSdcbiAgICB9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgYW5pbWF0ZSgnMTIwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTAwbXMgMjVtcyBsaW5lYXInLCBzdHlsZSh7b3BhY2l0eTogMH0pKSlcbiAgXSlcbn07XG4iXX0=