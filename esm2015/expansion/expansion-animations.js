/**
 * @fileoverview added by tsickle
 * Generated from: src/material/expansion/expansion-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, animateChild, group, state, style, transition, trigger, query, } from '@angular/animations';
/**
 * Time and timing curve for expansion panel animations.
 * @type {?}
 */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM.  This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * \@docs-private
 * @type {?}
 */
export const matExpansionAnimations = {
    /**
     * Animation that rotates the indicator arrow.
     */
    indicatorRotate: trigger('indicatorRotate', [
        state('collapsed, void', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    /**
     * Animation that expands and collapses the panel header height.
     */
    expansionHeaderHeight: trigger('expansionHeight', [
        state('collapsed, void', style({
            height: '{{collapsedHeight}}',
        }), {
            params: { collapsedHeight: '48px' },
        }),
        state('expanded', style({
            height: '{{expandedHeight}}'
        }), {
            params: { expandedHeight: '64px' }
        }),
        transition('expanded <=> collapsed, void => collapsed', group([
            query('@indicatorRotate', animateChild(), { optional: true }),
            animate(EXPANSION_PANEL_ANIMATION_TIMING),
        ])),
    ]),
    /**
     * Animation that expands and collapses the panel content.
     */
    bodyExpansion: trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBQ1AsWUFBWSxFQUNaLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEVBQ1AsS0FBSyxHQUVOLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBRzdCLE1BQU0sT0FBTyxnQ0FBZ0MsR0FBRyxtQ0FBbUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCbkYsTUFBTSxPQUFPLHNCQUFzQixHQUkvQjs7OztJQUVGLGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7UUFDMUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztRQUN2RCxVQUFVLENBQUMsMkNBQTJDLEVBQ3BELE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0tBQzdDLENBQUM7Ozs7SUFHRixxQkFBcUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7UUFDaEQsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQztZQUM3QixNQUFNLEVBQUUscUJBQXFCO1NBQzlCLENBQUMsRUFBRTtZQUNGLE1BQU0sRUFBRSxFQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUM7U0FDbEMsQ0FBQztRQUNGLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxvQkFBb0I7U0FDN0IsQ0FBQyxFQUFFO1lBQ0YsTUFBTSxFQUFFLEVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBQztTQUNqQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLDJDQUEyQyxFQUFFLEtBQUssQ0FBQztZQUM1RCxLQUFLLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDM0QsT0FBTyxDQUFDLGdDQUFnQyxDQUFDO1NBQzFDLENBQUMsQ0FBQztLQUNKLENBQUM7Ozs7SUFHRixhQUFhLEVBQUUsT0FBTyxDQUFDLGVBQWUsRUFBRTtRQUN0QyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUN0RSxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDOUQsVUFBVSxDQUFDLDJDQUEyQyxFQUNwRCxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztLQUM3QyxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIGFuaW1hdGVDaGlsZCxcbiAgZ3JvdXAsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgcXVlcnksXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBUaW1lIGFuZCB0aW1pbmcgY3VydmUgZm9yIGV4cGFuc2lvbiBwYW5lbCBhbmltYXRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IEVYUEFOU0lPTl9QQU5FTF9BTklNQVRJT05fVElNSU5HID0gJzIyNW1zIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBleHBhbnNpb24gcGFuZWwuXG4gKlxuICogQSBidWcgaW4gYW5ndWxhciBhbmltYXRpb24ncyBgc3RhdGVgIHdoZW4gVmlld0NvbnRhaW5lcnMgYXJlIG1vdmVkIHVzaW5nIFZpZXdDb250YWluZXJSZWYubW92ZSgpXG4gKiBjYXVzZXMgdGhlIGFuaW1hdGlvbiBzdGF0ZSBvZiBtb3ZlZCBjb21wb25lbnRzIHRvIGJlY29tZSBgdm9pZGAgdXBvbiBleGl0LCBhbmQgbm90IHVwZGF0ZSBhZ2FpblxuICogdXBvbiByZWVudHJ5IGludG8gdGhlIERPTS4gIFRoaXMgY2FuIGxlYWQgYSB0byBzaXR1YXRpb24gZm9yIHRoZSBleHBhbnNpb24gcGFuZWwgd2hlcmUgdGhlIHN0YXRlXG4gKiBvZiB0aGUgcGFuZWwgaXMgYGV4cGFuZGVkYCBvciBgY29sbGFwc2VkYCBidXQgdGhlIGFuaW1hdGlvbiBzdGF0ZSBpcyBgdm9pZGAuXG4gKlxuICogVG8gY29ycmVjdGx5IGhhbmRsZSBhbmltYXRpbmcgdG8gdGhlIG5leHQgc3RhdGUsIHdlIGFuaW1hdGUgYmV0d2VlbiBgdm9pZGAgYW5kIGBjb2xsYXBzZWRgIHdoaWNoXG4gKiBhcmUgZGVmaW5lZCB0byBoYXZlIHRoZSBzYW1lIHN0eWxlcy4gU2luY2UgYW5ndWxhciBhbmltYXRlcyBmcm9tIHRoZSBjdXJyZW50IHN0eWxlcyB0byB0aGVcbiAqIGRlc3RpbmF0aW9uIHN0YXRlJ3Mgc3R5bGUgZGVmaW5pdGlvbiwgaW4gc2l0dWF0aW9ucyB3aGVyZSB3ZSBhcmUgbW92aW5nIGZyb20gYHZvaWRgJ3Mgc3R5bGVzIHRvXG4gKiBgY29sbGFwc2VkYCB0aGlzIGFjdHMgYSBub29wIHNpbmNlIG5vIHN0eWxlIHZhbHVlcyBjaGFuZ2UuXG4gKlxuICogSW4gdGhlIGNhc2Ugd2hlcmUgYW5ndWxhcidzIGFuaW1hdGlvbiBzdGF0ZSBpcyBvdXQgb2Ygc3luYyB3aXRoIHRoZSBleHBhbnNpb24gcGFuZWwncyBzdGF0ZSwgdGhlXG4gKiBleHBhbnNpb24gcGFuZWwgYmVpbmcgYGV4cGFuZGVkYCBhbmQgYW5ndWxhciBhbmltYXRpb25zIGJlaW5nIGB2b2lkYCwgdGhlIGFuaW1hdGlvbiBmcm9tIHRoZVxuICogYGV4cGFuZGVkYCdzIGVmZmVjdGl2ZSBzdHlsZXMgKHRob3VnaCBpbiBhIGB2b2lkYCBhbmltYXRpb24gc3RhdGUpIHRvIHRoZSBjb2xsYXBzZWQgc3RhdGUgd2lsbFxuICogb2NjdXIgYXMgZXhwZWN0ZWQuXG4gKlxuICogQW5ndWxhciBCdWc6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE4ODQ3XG4gKlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0RXhwYW5zaW9uQW5pbWF0aW9uczoge1xuICByZWFkb25seSBpbmRpY2F0b3JSb3RhdGU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgZXhwYW5zaW9uSGVhZGVySGVpZ2h0OiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGJvZHlFeHBhbnNpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCByb3RhdGVzIHRoZSBpbmRpY2F0b3IgYXJyb3cuICovXG4gIGluZGljYXRvclJvdGF0ZTogdHJpZ2dlcignaW5kaWNhdG9yUm90YXRlJywgW1xuICAgIHN0YXRlKCdjb2xsYXBzZWQsIHZvaWQnLCBzdHlsZSh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pKSxcbiAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7dHJhbnNmb3JtOiAncm90YXRlKDE4MGRlZyknfSkpLFxuICAgIHRyYW5zaXRpb24oJ2V4cGFuZGVkIDw9PiBjb2xsYXBzZWQsIHZvaWQgPT4gY29sbGFwc2VkJyxcbiAgICAgIGFuaW1hdGUoRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcpKSxcbiAgXSksXG5cbiAgLyoqIEFuaW1hdGlvbiB0aGF0IGV4cGFuZHMgYW5kIGNvbGxhcHNlcyB0aGUgcGFuZWwgaGVhZGVyIGhlaWdodC4gKi9cbiAgZXhwYW5zaW9uSGVhZGVySGVpZ2h0OiB0cmlnZ2VyKCdleHBhbnNpb25IZWlnaHQnLCBbXG4gICAgc3RhdGUoJ2NvbGxhcHNlZCwgdm9pZCcsIHN0eWxlKHtcbiAgICAgIGhlaWdodDogJ3t7Y29sbGFwc2VkSGVpZ2h0fX0nLFxuICAgIH0pLCB7XG4gICAgICBwYXJhbXM6IHtjb2xsYXBzZWRIZWlnaHQ6ICc0OHB4J30sXG4gICAgfSksXG4gICAgc3RhdGUoJ2V4cGFuZGVkJywgc3R5bGUoe1xuICAgICAgaGVpZ2h0OiAne3tleHBhbmRlZEhlaWdodH19J1xuICAgIH0pLCB7XG4gICAgICBwYXJhbXM6IHtleHBhbmRlZEhlaWdodDogJzY0cHgnfVxuICAgIH0pLFxuICAgIHRyYW5zaXRpb24oJ2V4cGFuZGVkIDw9PiBjb2xsYXBzZWQsIHZvaWQgPT4gY29sbGFwc2VkJywgZ3JvdXAoW1xuICAgICAgcXVlcnkoJ0BpbmRpY2F0b3JSb3RhdGUnLCBhbmltYXRlQ2hpbGQoKSwge29wdGlvbmFsOiB0cnVlfSksXG4gICAgICBhbmltYXRlKEVYUEFOU0lPTl9QQU5FTF9BTklNQVRJT05fVElNSU5HKSxcbiAgICBdKSksXG4gIF0pLFxuXG4gIC8qKiBBbmltYXRpb24gdGhhdCBleHBhbmRzIGFuZCBjb2xsYXBzZXMgdGhlIHBhbmVsIGNvbnRlbnQuICovXG4gIGJvZHlFeHBhbnNpb246IHRyaWdnZXIoJ2JvZHlFeHBhbnNpb24nLCBbXG4gICAgc3RhdGUoJ2NvbGxhcHNlZCwgdm9pZCcsIHN0eWxlKHtoZWlnaHQ6ICcwcHgnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7aGVpZ2h0OiAnKicsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ30pKSxcbiAgICB0cmFuc2l0aW9uKCdleHBhbmRlZCA8PT4gY29sbGFwc2VkLCB2b2lkID0+IGNvbGxhcHNlZCcsXG4gICAgICBhbmltYXRlKEVYUEFOU0lPTl9QQU5FTF9BTklNQVRJT05fVElNSU5HKSksXG4gIF0pXG59O1xuIl19