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
    ]),
    /**
     * This animation fades in the background color and text content of the
     * select's options. It is time delayed to occur 100ms after the overlay
     * panel has transformed in.
     * @deprecated Not used anymore. To be removed.
     * \@breaking-change 8.0.0
     */
    fadeInContent: trigger('fadeInContent', [
        state('showing', style({ opacity: 1 })),
        transition('void => showing', [
            style({ opacity: 0 }),
            animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
        ])
    ])
};
/**
 * @deprecated
 * \@breaking-change 8.0.0
 * \@docs-private
 * @type {?}
 */
export const transformPanel = matSelectAnimations.transformPanel;
/**
 * @deprecated
 * \@breaking-change 8.0.0
 * \@docs-private
 * @type {?}
 */
export const fadeInContent = matSelectAnimations.fadeInContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxZQUFZLEVBRVosS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sR0FDUixNQUFNLHFCQUFxQixDQUFDOzs7Ozs7Ozs7QUFTN0IsTUFBTSxPQUFPLG1CQUFtQixHQUk1Qjs7Ozs7O0lBTUYsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1FBQzlDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsRUFDN0QsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUN6QixDQUFDOzs7Ozs7Ozs7O0lBV0YsY0FBYyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUNsQixTQUFTLEVBQUUsYUFBYTtZQUN4QixRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsUUFBUSxFQUFFLG1CQUFtQjs7WUFDN0IsU0FBUyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQztZQUNWLFFBQVEsRUFBRSxtQkFBbUI7O1lBQzdCLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDcEUsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxDQUFDOzs7Ozs7OztJQVNGLGFBQWEsRUFBRSxPQUFPLENBQUMsZUFBZSxFQUFFO1FBQ3RDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDckMsVUFBVSxDQUFDLGlCQUFpQixFQUFFO1lBQzVCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUNuQixPQUFPLENBQUMsOENBQThDLENBQUM7U0FDeEQsQ0FBQztLQUNILENBQUM7Q0FDSDs7Ozs7OztBQVFELE1BQU0sT0FBTyxjQUFjLEdBQUcsbUJBQW1CLENBQUMsY0FBYzs7Ozs7OztBQU9oRSxNQUFNLE9BQU8sYUFBYSxHQUFHLG1CQUFtQixDQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgYW5pbWF0ZUNoaWxkLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG4gIHF1ZXJ5LFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgYXJlIGFsbCB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIG1hdC1zZWxlY3QgY29tcG9uZW50LCB3aXRoIGVhY2hcbiAqIGNvbnN0IGNvbnRhaW5pbmcgdGhlIG1ldGFkYXRhIGZvciBvbmUgYW5pbWF0aW9uLlxuICpcbiAqIFRoZSB2YWx1ZXMgYmVsb3cgbWF0Y2ggdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBBbmd1bGFySlMgTWF0ZXJpYWwgbWF0LXNlbGVjdCBhbmltYXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTZWxlY3RBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybVBhbmVsV3JhcDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSB0cmFuc2Zvcm1QYW5lbDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBmYWRlSW5Db250ZW50OiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKipcbiAgICogVGhpcyBhbmltYXRpb24gZW5zdXJlcyB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBhbmltYXRpb24gKHRyYW5zZm9ybVBhbmVsKSBpcyBjYWxsZWQgd2hlblxuICAgKiBjbG9zaW5nIHRoZSBzZWxlY3QuXG4gICAqIFRoaXMgaXMgbmVlZGVkIGR1ZSB0byBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMzMwMlxuICAgKi9cbiAgdHJhbnNmb3JtUGFuZWxXcmFwOiB0cmlnZ2VyKCd0cmFuc2Zvcm1QYW5lbFdyYXAnLCBbXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBxdWVyeSgnQHRyYW5zZm9ybVBhbmVsJywgW2FuaW1hdGVDaGlsZCgpXSxcbiAgICAgICAgICB7b3B0aW9uYWw6IHRydWV9KSlcbiAgXSksXG5cbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIHRyYW5zZm9ybXMgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgb24gYW5kIG9mZiB0aGUgcGFnZS5cbiAgICpcbiAgICogV2hlbiB0aGUgcGFuZWwgaXMgYXR0YWNoZWQgdG8gdGhlIERPTSwgaXQgZXhwYW5kcyBpdHMgd2lkdGggYnkgdGhlIGFtb3VudCBvZiBwYWRkaW5nLCBzY2FsZXMgaXRcbiAgICogdXAgdG8gMTAwJSBvbiB0aGUgWSBheGlzLCBmYWRlcyBpbiBpdHMgYm9yZGVyLCBhbmQgdHJhbnNsYXRlcyBzbGlnaHRseSB1cCBhbmQgdG8gdGhlXG4gICAqIHNpZGUgdG8gZW5zdXJlIHRoZSBvcHRpb24gdGV4dCBjb3JyZWN0bHkgb3ZlcmxhcHMgdGhlIHRyaWdnZXIgdGV4dC5cbiAgICpcbiAgICogV2hlbiB0aGUgcGFuZWwgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00sIGl0IHNpbXBseSBmYWRlcyBvdXQgbGluZWFybHkuXG4gICAqL1xuICB0cmFuc2Zvcm1QYW5lbDogdHJpZ2dlcigndHJhbnNmb3JtUGFuZWwnLCBbXG4gICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMC44KScsXG4gICAgICBtaW5XaWR0aDogJzEwMCUnLFxuICAgICAgb3BhY2l0eTogMFxuICAgIH0pKSxcbiAgICBzdGF0ZSgnc2hvd2luZycsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBtaW5XaWR0aDogJ2NhbGMoMTAwJSArIDMycHgpJywgLy8gMzJweCA9IDIgKiAxNnB4IHBhZGRpbmdcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlWSgxKSdcbiAgICB9KSksXG4gICAgc3RhdGUoJ3Nob3dpbmctbXVsdGlwbGUnLCBzdHlsZSh7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgbWluV2lkdGg6ICdjYWxjKDEwMCUgKyA2NHB4KScsIC8vIDY0cHggPSA0OHB4IHBhZGRpbmcgb24gdGhlIGxlZnQgKyAxNnB4IHBhZGRpbmcgb24gdGhlIHJpZ2h0XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMSknXG4gICAgfSkpLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIGFuaW1hdGUoJzEyMG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJykpLFxuICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIGFuaW1hdGUoJzEwMG1zIDI1bXMgbGluZWFyJywgc3R5bGUoe29wYWNpdHk6IDB9KSkpXG4gIF0pLFxuXG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBmYWRlcyBpbiB0aGUgYmFja2dyb3VuZCBjb2xvciBhbmQgdGV4dCBjb250ZW50IG9mIHRoZVxuICAgKiBzZWxlY3QncyBvcHRpb25zLiBJdCBpcyB0aW1lIGRlbGF5ZWQgdG8gb2NjdXIgMTAwbXMgYWZ0ZXIgdGhlIG92ZXJsYXlcbiAgICogcGFuZWwgaGFzIHRyYW5zZm9ybWVkIGluLlxuICAgKiBAZGVwcmVjYXRlZCBOb3QgdXNlZCBhbnltb3JlLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBmYWRlSW5Db250ZW50OiB0cmlnZ2VyKCdmYWRlSW5Db250ZW50JywgW1xuICAgIHN0YXRlKCdzaG93aW5nJywgc3R5bGUoe29wYWNpdHk6IDF9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBzaG93aW5nJywgW1xuICAgICAgc3R5bGUoe29wYWNpdHk6IDB9KSxcbiAgICAgIGFuaW1hdGUoJzE1MG1zIDEwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJylcbiAgICBdKVxuICBdKVxufTtcblxuXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1QYW5lbCA9IG1hdFNlbGVjdEFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWw7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IGZhZGVJbkNvbnRlbnQgPSBtYXRTZWxlY3RBbmltYXRpb25zLmZhZGVJbkNvbnRlbnQ7XG4iXX0=