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
import { trigger, state, style, animate, transition, query, group, } from '@angular/animations';
/**
 * Animations used by the mat-menu component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 * \@docs-private
 * @type {?}
 */
export const matMenuAnimations = {
    /**
     * This animation controls the menu panel's entry and exit from the page.
     *
     * When the menu panel is added to the DOM, it scales in and fades in its border.
     *
     * When the menu panel is removed from the DOM, it simply fades out after a brief
     * delay to display the ripple.
     */
    transformMenu: trigger('transformMenu', [
        state('void', style({
            opacity: 0,
            transform: 'scale(0.8)'
        })),
        transition('void => enter', group([
            query('.mat-menu-content, .mat-mdc-menu-content', animate('100ms linear', style({
                opacity: 1
            }))),
            animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'scale(1)' })),
        ])),
        transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 })))
    ]),
    /**
     * This animation fades in the background color and content of the menu panel
     * after its containing element is scaled in.
     */
    fadeInItems: trigger('fadeInItems', [
        // TODO(crisbeto): this is inside the `transformMenu`
        // now. Remove next time we do breaking changes.
        state('showing', style({ opacity: 1 })),
        transition('void => *', [
            style({ opacity: 0 }),
            animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')
        ])
    ])
};
/**
 * @deprecated
 * \@breaking-change 8.0.0
 * \@docs-private
 * @type {?}
 */
export const fadeInItems = matMenuAnimations.fadeInItems;
/**
 * @deprecated
 * \@breaking-change 8.0.0
 * \@docs-private
 * @type {?}
 */
export const transformMenu = matMenuAnimations.transformMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTSxFQUNKLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsS0FBSyxFQUNMLEtBQUssR0FFTixNQUFNLHFCQUFxQixDQUFDOzs7Ozs7OztBQVE3QixNQUFNLE9BQU8saUJBQWlCLEdBRzFCOzs7Ozs7Ozs7SUFTRixhQUFhLEVBQUUsT0FBTyxDQUFDLGVBQWUsRUFBRTtRQUN0QyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDO1lBQ2hDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQztnQkFDOUUsT0FBTyxFQUFFLENBQUM7YUFDWCxDQUFDLENBQUMsQ0FBQztZQUNKLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUM1RSxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNFLENBQUM7Ozs7O0lBT0YsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDbEMscURBQXFEO1FBQ3JELGdEQUFnRDtRQUNoRCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3JDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDdEIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQztTQUN4RCxDQUFDO0tBQ0gsQ0FBQztDQUNIOzs7Ozs7O0FBT0QsTUFBTSxPQUFPLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXOzs7Ozs7O0FBT3hELE1BQU0sT0FBTyxhQUFhLEdBQUcsaUJBQWlCLENBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnR7XG4gIHRyaWdnZXIsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgYW5pbWF0ZSxcbiAgdHJhbnNpdGlvbixcbiAgcXVlcnksXG4gIGdyb3VwLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgbWF0LW1lbnUgY29tcG9uZW50LlxuICogQW5pbWF0aW9uIGR1cmF0aW9uIGFuZCB0aW1pbmcgdmFsdWVzIGFyZSBiYXNlZCBvbjpcbiAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZ3VpZGVsaW5lcy9jb21wb25lbnRzL21lbnVzLmh0bWwjbWVudXMtdXNhZ2VcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdE1lbnVBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybU1lbnU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgZmFkZUluSXRlbXM6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBjb250cm9scyB0aGUgbWVudSBwYW5lbCdzIGVudHJ5IGFuZCBleGl0IGZyb20gdGhlIHBhZ2UuXG4gICAqXG4gICAqIFdoZW4gdGhlIG1lbnUgcGFuZWwgaXMgYWRkZWQgdG8gdGhlIERPTSwgaXQgc2NhbGVzIGluIGFuZCBmYWRlcyBpbiBpdHMgYm9yZGVyLlxuICAgKlxuICAgKiBXaGVuIHRoZSBtZW51IHBhbmVsIGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NLCBpdCBzaW1wbHkgZmFkZXMgb3V0IGFmdGVyIGEgYnJpZWZcbiAgICogZGVsYXkgdG8gZGlzcGxheSB0aGUgcmlwcGxlLlxuICAgKi9cbiAgdHJhbnNmb3JtTWVudTogdHJpZ2dlcigndHJhbnNmb3JtTWVudScsIFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjgpJ1xuICAgIH0pKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IGVudGVyJywgZ3JvdXAoW1xuICAgICAgcXVlcnkoJy5tYXQtbWVudS1jb250ZW50LCAubWF0LW1kYy1tZW51LWNvbnRlbnQnLCBhbmltYXRlKCcxMDBtcyBsaW5lYXInLCBzdHlsZSh7XG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0pKSksXG4gICAgICBhbmltYXRlKCcxMjBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsIHN0eWxlKHt0cmFuc2Zvcm06ICdzY2FsZSgxKSd9KSksXG4gICAgXSkpLFxuICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIGFuaW1hdGUoJzEwMG1zIDI1bXMgbGluZWFyJywgc3R5bGUoe29wYWNpdHk6IDB9KSkpXG4gIF0pLFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIGZhZGVzIGluIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGFuZCBjb250ZW50IG9mIHRoZSBtZW51IHBhbmVsXG4gICAqIGFmdGVyIGl0cyBjb250YWluaW5nIGVsZW1lbnQgaXMgc2NhbGVkIGluLlxuICAgKi9cbiAgZmFkZUluSXRlbXM6IHRyaWdnZXIoJ2ZhZGVJbkl0ZW1zJywgW1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGlzIGluc2lkZSB0aGUgYHRyYW5zZm9ybU1lbnVgXG4gICAgLy8gbm93LiBSZW1vdmUgbmV4dCB0aW1lIHdlIGRvIGJyZWFraW5nIGNoYW5nZXMuXG4gICAgc3RhdGUoJ3Nob3dpbmcnLCBzdHlsZSh7b3BhY2l0eTogMX0pKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbXG4gICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICAgYW5pbWF0ZSgnNDAwbXMgMTAwbXMgY3ViaWMtYmV6aWVyKDAuNTUsIDAsIDAuNTUsIDAuMiknKVxuICAgIF0pXG4gIF0pXG59O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBmYWRlSW5JdGVtcyA9IG1hdE1lbnVBbmltYXRpb25zLmZhZGVJbkl0ZW1zO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1NZW51ID0gbWF0TWVudUFuaW1hdGlvbnMudHJhbnNmb3JtTWVudTtcbiJdfQ==