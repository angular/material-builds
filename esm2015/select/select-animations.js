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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxZQUFZLEVBRVosS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sR0FDUixNQUFNLHFCQUFxQixDQUFDOzs7Ozs7Ozs7QUFTN0IsTUFBTSxPQUFPLG1CQUFtQixHQUc1Qjs7Ozs7O0lBTUYsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1FBQzlDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsRUFDN0QsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUN6QixDQUFDOzs7Ozs7Ozs7O0lBV0YsY0FBYyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUNsQixTQUFTLEVBQUUsYUFBYTtZQUN4QixRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsUUFBUSxFQUFFLG1CQUFtQjs7WUFDN0IsU0FBUyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQztZQUNWLFFBQVEsRUFBRSxtQkFBbUI7O1lBQzdCLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDcEUsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgYW5pbWF0ZUNoaWxkLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG4gIHF1ZXJ5LFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgYXJlIGFsbCB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIG1hdC1zZWxlY3QgY29tcG9uZW50LCB3aXRoIGVhY2hcbiAqIGNvbnN0IGNvbnRhaW5pbmcgdGhlIG1ldGFkYXRhIGZvciBvbmUgYW5pbWF0aW9uLlxuICpcbiAqIFRoZSB2YWx1ZXMgYmVsb3cgbWF0Y2ggdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBBbmd1bGFySlMgTWF0ZXJpYWwgbWF0LXNlbGVjdCBhbmltYXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTZWxlY3RBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybVBhbmVsV3JhcDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSB0cmFuc2Zvcm1QYW5lbDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIGVuc3VyZXMgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgYW5pbWF0aW9uICh0cmFuc2Zvcm1QYW5lbCkgaXMgY2FsbGVkIHdoZW5cbiAgICogY2xvc2luZyB0aGUgc2VsZWN0LlxuICAgKiBUaGlzIGlzIG5lZWRlZCBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjMzMDJcbiAgICovXG4gIHRyYW5zZm9ybVBhbmVsV3JhcDogdHJpZ2dlcigndHJhbnNmb3JtUGFuZWxXcmFwJywgW1xuICAgICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgcXVlcnkoJ0B0cmFuc2Zvcm1QYW5lbCcsIFthbmltYXRlQ2hpbGQoKV0sXG4gICAgICAgICAge29wdGlvbmFsOiB0cnVlfSkpXG4gIF0pLFxuXG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiB0cmFuc2Zvcm1zIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIG9uIGFuZCBvZmYgdGhlIHBhZ2UuXG4gICAqXG4gICAqIFdoZW4gdGhlIHBhbmVsIGlzIGF0dGFjaGVkIHRvIHRoZSBET00sIGl0IGV4cGFuZHMgaXRzIHdpZHRoIGJ5IHRoZSBhbW91bnQgb2YgcGFkZGluZywgc2NhbGVzIGl0XG4gICAqIHVwIHRvIDEwMCUgb24gdGhlIFkgYXhpcywgZmFkZXMgaW4gaXRzIGJvcmRlciwgYW5kIHRyYW5zbGF0ZXMgc2xpZ2h0bHkgdXAgYW5kIHRvIHRoZVxuICAgKiBzaWRlIHRvIGVuc3VyZSB0aGUgb3B0aW9uIHRleHQgY29ycmVjdGx5IG92ZXJsYXBzIHRoZSB0cmlnZ2VyIHRleHQuXG4gICAqXG4gICAqIFdoZW4gdGhlIHBhbmVsIGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NLCBpdCBzaW1wbHkgZmFkZXMgb3V0IGxpbmVhcmx5LlxuICAgKi9cbiAgdHJhbnNmb3JtUGFuZWw6IHRyaWdnZXIoJ3RyYW5zZm9ybVBhbmVsJywgW1xuICAgIHN0YXRlKCd2b2lkJywgc3R5bGUoe1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGVZKDAuOCknLFxuICAgICAgbWluV2lkdGg6ICcxMDAlJyxcbiAgICAgIG9wYWNpdHk6IDBcbiAgICB9KSksXG4gICAgc3RhdGUoJ3Nob3dpbmcnLCBzdHlsZSh7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgbWluV2lkdGg6ICdjYWxjKDEwMCUgKyAzMnB4KScsIC8vIDMycHggPSAyICogMTZweCBwYWRkaW5nXG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMSknXG4gICAgfSkpLFxuICAgIHN0YXRlKCdzaG93aW5nLW11bHRpcGxlJywgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIG1pbldpZHRoOiAnY2FsYygxMDAlICsgNjRweCknLCAvLyA2NHB4ID0gNDhweCBwYWRkaW5nIG9uIHRoZSBsZWZ0ICsgMTZweCBwYWRkaW5nIG9uIHRoZSByaWdodFxuICAgICAgdHJhbnNmb3JtOiAnc2NhbGVZKDEpJ1xuICAgIH0pKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKCcxMjBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScpKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBhbmltYXRlKCcxMDBtcyAyNW1zIGxpbmVhcicsIHN0eWxlKHtvcGFjaXR5OiAwfSkpKVxuICBdKVxufTtcbiJdfQ==