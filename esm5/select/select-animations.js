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
export var matSelectAnimations = {
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
            transform: 'scaleY(1)'
        })),
        state('showing-multiple', style({
            opacity: 1,
            minWidth: 'calc(100% + 64px)',
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
     * @breaking-change 8.0.0
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
 * @breaking-change 8.0.0
 * @docs-private
 */
export var transformPanel = matSelectAnimations.transformPanel;
/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
export var fadeInContent = matSelectAnimations.fadeInContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxPQUFPLEVBQ1AsWUFBWSxFQUVaLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBQ1IsTUFBTSxxQkFBcUIsQ0FBQztBQUU3Qjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsSUFBTSxtQkFBbUIsR0FJNUI7SUFDRjs7OztPQUlHO0lBQ0gsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1FBQzlDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsRUFDN0QsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUN6QixDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQ3hDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1lBQ2xCLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7WUFDckIsT0FBTyxFQUFFLENBQUM7WUFDVixRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUM7WUFDOUIsT0FBTyxFQUFFLENBQUM7WUFDVixRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDcEUsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxDQUFDO0lBRUY7Ozs7OztPQU1HO0lBQ0gsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNyQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7WUFDNUIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQztTQUN4RCxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUM7QUFHRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLElBQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztBQUVqRTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLElBQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBhbmltYXRlQ2hpbGQsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbiAgcXVlcnksXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBhcmUgYWxsIHRoZSBhbmltYXRpb25zIGZvciB0aGUgbWF0LXNlbGVjdCBjb21wb25lbnQsIHdpdGggZWFjaFxuICogY29uc3QgY29udGFpbmluZyB0aGUgbWV0YWRhdGEgZm9yIG9uZSBhbmltYXRpb24uXG4gKlxuICogVGhlIHZhbHVlcyBiZWxvdyBtYXRjaCB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIEFuZ3VsYXJKUyBNYXRlcmlhbCBtYXQtc2VsZWN0IGFuaW1hdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdFNlbGVjdEFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgdHJhbnNmb3JtUGFuZWxXcmFwOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybVBhbmVsOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGZhZGVJbkNvbnRlbnQ6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBlbnN1cmVzIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIGFuaW1hdGlvbiAodHJhbnNmb3JtUGFuZWwpIGlzIGNhbGxlZCB3aGVuXG4gICAqIGNsb3NpbmcgdGhlIHNlbGVjdC5cbiAgICogVGhpcyBpcyBuZWVkZWQgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIzMzAyXG4gICAqL1xuICB0cmFuc2Zvcm1QYW5lbFdyYXA6IHRyaWdnZXIoJ3RyYW5zZm9ybVBhbmVsV3JhcCcsIFtcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIHF1ZXJ5KCdAdHJhbnNmb3JtUGFuZWwnLCBbYW5pbWF0ZUNoaWxkKCldLFxuICAgICAgICAgIHtvcHRpb25hbDogdHJ1ZX0pKVxuICBdKSxcblxuICAvKipcbiAgICogVGhpcyBhbmltYXRpb24gdHJhbnNmb3JtcyB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBvbiBhbmQgb2ZmIHRoZSBwYWdlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBwYW5lbCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLCBpdCBleHBhbmRzIGl0cyB3aWR0aCBieSB0aGUgYW1vdW50IG9mIHBhZGRpbmcsIHNjYWxlcyBpdFxuICAgKiB1cCB0byAxMDAlIG9uIHRoZSBZIGF4aXMsIGZhZGVzIGluIGl0cyBib3JkZXIsIGFuZCB0cmFuc2xhdGVzIHNsaWdodGx5IHVwIGFuZCB0byB0aGVcbiAgICogc2lkZSB0byBlbnN1cmUgdGhlIG9wdGlvbiB0ZXh0IGNvcnJlY3RseSBvdmVybGFwcyB0aGUgdHJpZ2dlciB0ZXh0LlxuICAgKlxuICAgKiBXaGVuIHRoZSBwYW5lbCBpcyByZW1vdmVkIGZyb20gdGhlIERPTSwgaXQgc2ltcGx5IGZhZGVzIG91dCBsaW5lYXJseS5cbiAgICovXG4gIHRyYW5zZm9ybVBhbmVsOiB0cmlnZ2VyKCd0cmFuc2Zvcm1QYW5lbCcsIFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlWSgwLjgpJyxcbiAgICAgIG1pbldpZHRoOiAnMTAwJScsXG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSkpLFxuICAgIHN0YXRlKCdzaG93aW5nJywgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIG1pbldpZHRoOiAnY2FsYygxMDAlICsgMzJweCknLCAvLyAzMnB4ID0gMiAqIDE2cHggcGFkZGluZ1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGVZKDEpJ1xuICAgIH0pKSxcbiAgICBzdGF0ZSgnc2hvd2luZy1tdWx0aXBsZScsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBtaW5XaWR0aDogJ2NhbGMoMTAwJSArIDY0cHgpJywgLy8gNjRweCA9IDQ4cHggcGFkZGluZyBvbiB0aGUgbGVmdCArIDE2cHggcGFkZGluZyBvbiB0aGUgcmlnaHRcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlWSgxKSdcbiAgICB9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgYW5pbWF0ZSgnMTIwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTAwbXMgMjVtcyBsaW5lYXInLCBzdHlsZSh7b3BhY2l0eTogMH0pKSlcbiAgXSksXG5cbiAgLyoqXG4gICAqIFRoaXMgYW5pbWF0aW9uIGZhZGVzIGluIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGFuZCB0ZXh0IGNvbnRlbnQgb2YgdGhlXG4gICAqIHNlbGVjdCdzIG9wdGlvbnMuIEl0IGlzIHRpbWUgZGVsYXllZCB0byBvY2N1ciAxMDBtcyBhZnRlciB0aGUgb3ZlcmxheVxuICAgKiBwYW5lbCBoYXMgdHJhbnNmb3JtZWQgaW4uXG4gICAqIEBkZXByZWNhdGVkIE5vdCB1c2VkIGFueW1vcmUuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGZhZGVJbkNvbnRlbnQ6IHRyaWdnZXIoJ2ZhZGVJbkNvbnRlbnQnLCBbXG4gICAgc3RhdGUoJ3Nob3dpbmcnLCBzdHlsZSh7b3BhY2l0eTogMX0pKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHNob3dpbmcnLCBbXG4gICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICAgYW5pbWF0ZSgnMTUwbXMgMTAwbXMgY3ViaWMtYmV6aWVyKDAuNTUsIDAsIDAuNTUsIDAuMiknKVxuICAgIF0pXG4gIF0pXG59O1xuXG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybVBhbmVsID0gbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbDtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZmFkZUluQ29udGVudCA9IG1hdFNlbGVjdEFuaW1hdGlvbnMuZmFkZUluQ29udGVudDtcbiJdfQ==