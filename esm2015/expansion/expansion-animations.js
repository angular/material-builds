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
import { animate, state, style, transition, trigger, } from '@angular/animations';
// Note: Keep this in sync with the Sass variable for the panel header animation.
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
     * Animation that expands and collapses the panel content.
     */
    bodyExpansion: trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBRVAsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUNSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQUk3QixNQUFNLE9BQU8sZ0NBQWdDLEdBQUcsbUNBQW1DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Qm5GLE1BQU0sT0FBTyxzQkFBc0IsR0FHL0I7Ozs7SUFFRixlQUFlLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQzFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztRQUM1RCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7UUFDdkQsVUFBVSxDQUFDLDJDQUEyQyxFQUNwRCxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztLQUM3QyxDQUFDOzs7O0lBRUYsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDdEUsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzlELFVBQVUsQ0FBQywyQ0FBMkMsRUFDcEQsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDN0MsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBUaW1lIGFuZCB0aW1pbmcgY3VydmUgZm9yIGV4cGFuc2lvbiBwYW5lbCBhbmltYXRpb25zLiAqL1xuLy8gTm90ZTogS2VlcCB0aGlzIGluIHN5bmMgd2l0aCB0aGUgU2FzcyB2YXJpYWJsZSBmb3IgdGhlIHBhbmVsIGhlYWRlciBhbmltYXRpb24uXG5leHBvcnQgY29uc3QgRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcgPSAnMjI1bXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIGV4cGFuc2lvbiBwYW5lbC5cbiAqXG4gKiBBIGJ1ZyBpbiBhbmd1bGFyIGFuaW1hdGlvbidzIGBzdGF0ZWAgd2hlbiBWaWV3Q29udGFpbmVycyBhcmUgbW92ZWQgdXNpbmcgVmlld0NvbnRhaW5lclJlZi5tb3ZlKClcbiAqIGNhdXNlcyB0aGUgYW5pbWF0aW9uIHN0YXRlIG9mIG1vdmVkIGNvbXBvbmVudHMgdG8gYmVjb21lIGB2b2lkYCB1cG9uIGV4aXQsIGFuZCBub3QgdXBkYXRlIGFnYWluXG4gKiB1cG9uIHJlZW50cnkgaW50byB0aGUgRE9NLiAgVGhpcyBjYW4gbGVhZCBhIHRvIHNpdHVhdGlvbiBmb3IgdGhlIGV4cGFuc2lvbiBwYW5lbCB3aGVyZSB0aGUgc3RhdGVcbiAqIG9mIHRoZSBwYW5lbCBpcyBgZXhwYW5kZWRgIG9yIGBjb2xsYXBzZWRgIGJ1dCB0aGUgYW5pbWF0aW9uIHN0YXRlIGlzIGB2b2lkYC5cbiAqXG4gKiBUbyBjb3JyZWN0bHkgaGFuZGxlIGFuaW1hdGluZyB0byB0aGUgbmV4dCBzdGF0ZSwgd2UgYW5pbWF0ZSBiZXR3ZWVuIGB2b2lkYCBhbmQgYGNvbGxhcHNlZGAgd2hpY2hcbiAqIGFyZSBkZWZpbmVkIHRvIGhhdmUgdGhlIHNhbWUgc3R5bGVzLiBTaW5jZSBhbmd1bGFyIGFuaW1hdGVzIGZyb20gdGhlIGN1cnJlbnQgc3R5bGVzIHRvIHRoZVxuICogZGVzdGluYXRpb24gc3RhdGUncyBzdHlsZSBkZWZpbml0aW9uLCBpbiBzaXR1YXRpb25zIHdoZXJlIHdlIGFyZSBtb3ZpbmcgZnJvbSBgdm9pZGAncyBzdHlsZXMgdG9cbiAqIGBjb2xsYXBzZWRgIHRoaXMgYWN0cyBhIG5vb3Agc2luY2Ugbm8gc3R5bGUgdmFsdWVzIGNoYW5nZS5cbiAqXG4gKiBJbiB0aGUgY2FzZSB3aGVyZSBhbmd1bGFyJ3MgYW5pbWF0aW9uIHN0YXRlIGlzIG91dCBvZiBzeW5jIHdpdGggdGhlIGV4cGFuc2lvbiBwYW5lbCdzIHN0YXRlLCB0aGVcbiAqIGV4cGFuc2lvbiBwYW5lbCBiZWluZyBgZXhwYW5kZWRgIGFuZCBhbmd1bGFyIGFuaW1hdGlvbnMgYmVpbmcgYHZvaWRgLCB0aGUgYW5pbWF0aW9uIGZyb20gdGhlXG4gKiBgZXhwYW5kZWRgJ3MgZWZmZWN0aXZlIHN0eWxlcyAodGhvdWdoIGluIGEgYHZvaWRgIGFuaW1hdGlvbiBzdGF0ZSkgdG8gdGhlIGNvbGxhcHNlZCBzdGF0ZSB3aWxsXG4gKiBvY2N1ciBhcyBleHBlY3RlZC5cbiAqXG4gKiBBbmd1bGFyIEJ1ZzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTg4NDdcbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRFeHBhbnNpb25BbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGluZGljYXRvclJvdGF0ZTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBib2R5RXhwYW5zaW9uOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgcm90YXRlcyB0aGUgaW5kaWNhdG9yIGFycm93LiAqL1xuICBpbmRpY2F0b3JSb3RhdGU6IHRyaWdnZXIoJ2luZGljYXRvclJvdGF0ZScsIFtcbiAgICBzdGF0ZSgnY29sbGFwc2VkLCB2b2lkJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSd9KSksXG4gICAgc3RhdGUoJ2V4cGFuZGVkJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSgxODBkZWcpJ30pKSxcbiAgICB0cmFuc2l0aW9uKCdleHBhbmRlZCA8PT4gY29sbGFwc2VkLCB2b2lkID0+IGNvbGxhcHNlZCcsXG4gICAgICBhbmltYXRlKEVYUEFOU0lPTl9QQU5FTF9BTklNQVRJT05fVElNSU5HKSksXG4gIF0pLFxuICAvKiogQW5pbWF0aW9uIHRoYXQgZXhwYW5kcyBhbmQgY29sbGFwc2VzIHRoZSBwYW5lbCBjb250ZW50LiAqL1xuICBib2R5RXhwYW5zaW9uOiB0cmlnZ2VyKCdib2R5RXhwYW5zaW9uJywgW1xuICAgIHN0YXRlKCdjb2xsYXBzZWQsIHZvaWQnLCBzdHlsZSh7aGVpZ2h0OiAnMHB4JywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgc3RhdGUoJ2V4cGFuZGVkJywgc3R5bGUoe2hlaWdodDogJyonLCB2aXNpYmlsaXR5OiAndmlzaWJsZSd9KSksXG4gICAgdHJhbnNpdGlvbignZXhwYW5kZWQgPD0+IGNvbGxhcHNlZCwgdm9pZCA9PiBjb2xsYXBzZWQnLFxuICAgICAgYW5pbWF0ZShFWFBBTlNJT05fUEFORUxfQU5JTUFUSU9OX1RJTUlORykpLFxuICBdKVxufTtcbiJdfQ==