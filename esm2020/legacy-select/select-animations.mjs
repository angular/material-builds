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
 * @docs-private
 */
export const matSelectAnimations = {
    /**
     * This animation ensures the select's overlay panel animation (transformPanel) is called when
     * closing the select.
     * This is needed due to https://github.com/angular/angular/issues/23302
     */
    transformPanelWrap: trigger('transformPanelWrap', [
        transition('* => void', query('@transformPanel', [animateChild()], { optional: true })),
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
            opacity: 0,
        })),
        state('showing', style({
            opacity: 1,
            minWidth: 'calc(100% + 32px)',
            transform: 'scaleY(1)',
        })),
        state('showing-multiple', style({
            opacity: 1,
            minWidth: 'calc(100% + 64px)',
            transform: 'scaleY(1)',
        })),
        transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXNlbGVjdC9zZWxlY3QtYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFlBQVksRUFFWixLQUFLLEVBQ0wsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUNSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBRzVCO0lBQ0Y7Ozs7T0FJRztJQUNILGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtRQUNoRCxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUN0RixDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQ3hDLEtBQUssQ0FDSCxNQUFNLEVBQ04sS0FBSyxDQUFDO1lBQ0osU0FBUyxFQUFFLGFBQWE7WUFDeEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsU0FBUyxFQUNULEtBQUssQ0FBQztZQUNKLE9BQU8sRUFBRSxDQUFDO1lBQ1YsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsa0JBQWtCLEVBQ2xCLEtBQUssQ0FBQztZQUNKLE9BQU8sRUFBRSxDQUFDO1lBQ1YsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQ0g7UUFDRCxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3BFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0UsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgYW5pbWF0ZUNoaWxkLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG4gIHF1ZXJ5LFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgYXJlIGFsbCB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIG1hdC1zZWxlY3QgY29tcG9uZW50LCB3aXRoIGVhY2hcbiAqIGNvbnN0IGNvbnRhaW5pbmcgdGhlIG1ldGFkYXRhIGZvciBvbmUgYW5pbWF0aW9uLlxuICpcbiAqIFRoZSB2YWx1ZXMgYmVsb3cgbWF0Y2ggdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBBbmd1bGFySlMgTWF0ZXJpYWwgbWF0LXNlbGVjdCBhbmltYXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTZWxlY3RBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybVBhbmVsV3JhcDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSB0cmFuc2Zvcm1QYW5lbDogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIGVuc3VyZXMgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgYW5pbWF0aW9uICh0cmFuc2Zvcm1QYW5lbCkgaXMgY2FsbGVkIHdoZW5cbiAgICogY2xvc2luZyB0aGUgc2VsZWN0LlxuICAgKiBUaGlzIGlzIG5lZWRlZCBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjMzMDJcbiAgICovXG4gIHRyYW5zZm9ybVBhbmVsV3JhcDogdHJpZ2dlcigndHJhbnNmb3JtUGFuZWxXcmFwJywgW1xuICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIHF1ZXJ5KCdAdHJhbnNmb3JtUGFuZWwnLCBbYW5pbWF0ZUNoaWxkKCldLCB7b3B0aW9uYWw6IHRydWV9KSksXG4gIF0pLFxuXG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiB0cmFuc2Zvcm1zIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIG9uIGFuZCBvZmYgdGhlIHBhZ2UuXG4gICAqXG4gICAqIFdoZW4gdGhlIHBhbmVsIGlzIGF0dGFjaGVkIHRvIHRoZSBET00sIGl0IGV4cGFuZHMgaXRzIHdpZHRoIGJ5IHRoZSBhbW91bnQgb2YgcGFkZGluZywgc2NhbGVzIGl0XG4gICAqIHVwIHRvIDEwMCUgb24gdGhlIFkgYXhpcywgZmFkZXMgaW4gaXRzIGJvcmRlciwgYW5kIHRyYW5zbGF0ZXMgc2xpZ2h0bHkgdXAgYW5kIHRvIHRoZVxuICAgKiBzaWRlIHRvIGVuc3VyZSB0aGUgb3B0aW9uIHRleHQgY29ycmVjdGx5IG92ZXJsYXBzIHRoZSB0cmlnZ2VyIHRleHQuXG4gICAqXG4gICAqIFdoZW4gdGhlIHBhbmVsIGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NLCBpdCBzaW1wbHkgZmFkZXMgb3V0IGxpbmVhcmx5LlxuICAgKi9cbiAgdHJhbnNmb3JtUGFuZWw6IHRyaWdnZXIoJ3RyYW5zZm9ybVBhbmVsJywgW1xuICAgIHN0YXRlKFxuICAgICAgJ3ZvaWQnLFxuICAgICAgc3R5bGUoe1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMC44KScsXG4gICAgICAgIG1pbldpZHRoOiAnMTAwJScsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHN0YXRlKFxuICAgICAgJ3Nob3dpbmcnLFxuICAgICAgc3R5bGUoe1xuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBtaW5XaWR0aDogJ2NhbGMoMTAwJSArIDMycHgpJywgLy8gMzJweCA9IDIgKiAxNnB4IHBhZGRpbmdcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGVZKDEpJyxcbiAgICAgIH0pLFxuICAgICksXG4gICAgc3RhdGUoXG4gICAgICAnc2hvd2luZy1tdWx0aXBsZScsXG4gICAgICBzdHlsZSh7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIG1pbldpZHRoOiAnY2FsYygxMDAlICsgNjRweCknLCAvLyA2NHB4ID0gNDhweCBwYWRkaW5nIG9uIHRoZSBsZWZ0ICsgMTZweCBwYWRkaW5nIG9uIHRoZSByaWdodFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMSknLFxuICAgICAgfSksXG4gICAgKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKCcxMjBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScpKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBhbmltYXRlKCcxMDBtcyAyNW1zIGxpbmVhcicsIHN0eWxlKHtvcGFjaXR5OiAwfSkpKSxcbiAgXSksXG59O1xuIl19