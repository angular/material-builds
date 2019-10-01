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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxZQUFZLEVBQ1osS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFDUCxLQUFLLEdBRU4sTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFHN0IsTUFBTSxPQUFPLGdDQUFnQyxHQUFHLG1DQUFtQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JuRixNQUFNLE9BQU8sc0JBQXNCLEdBSS9COzs7O0lBRUYsZUFBZSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7UUFDNUQsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQywyQ0FBMkMsRUFDcEQsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDN0MsQ0FBQzs7OztJQUdGLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtRQUNoRCxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDO1lBQzdCLE1BQU0sRUFBRSxxQkFBcUI7U0FDOUIsQ0FBQyxFQUFFO1lBQ0YsTUFBTSxFQUFFLEVBQUMsZUFBZSxFQUFFLE1BQU0sRUFBQztTQUNsQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7WUFDdEIsTUFBTSxFQUFFLG9CQUFvQjtTQUM3QixDQUFDLEVBQUU7WUFDRixNQUFNLEVBQUUsRUFBQyxjQUFjLEVBQUUsTUFBTSxFQUFDO1NBQ2pDLENBQUM7UUFDRixVQUFVLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxDQUFDO1lBQzVELEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUMzRCxPQUFPLENBQUMsZ0NBQWdDLENBQUM7U0FDMUMsQ0FBQyxDQUFDO0tBQ0osQ0FBQzs7OztJQUdGLGFBQWEsRUFBRSxPQUFPLENBQUMsZUFBZSxFQUFFO1FBQ3RDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ3RFLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUM5RCxVQUFVLENBQUMsMkNBQTJDLEVBQ3BELE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0tBQzdDLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgYW5pbWF0ZUNoaWxkLFxuICBncm91cCxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBxdWVyeSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIFRpbWUgYW5kIHRpbWluZyBjdXJ2ZSBmb3IgZXhwYW5zaW9uIHBhbmVsIGFuaW1hdGlvbnMuICovXG5leHBvcnQgY29uc3QgRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcgPSAnMjI1bXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIGV4cGFuc2lvbiBwYW5lbC5cbiAqXG4gKiBBIGJ1ZyBpbiBhbmd1bGFyIGFuaW1hdGlvbidzIGBzdGF0ZWAgd2hlbiBWaWV3Q29udGFpbmVycyBhcmUgbW92ZWQgdXNpbmcgVmlld0NvbnRhaW5lclJlZi5tb3ZlKClcbiAqIGNhdXNlcyB0aGUgYW5pbWF0aW9uIHN0YXRlIG9mIG1vdmVkIGNvbXBvbmVudHMgdG8gYmVjb21lIGB2b2lkYCB1cG9uIGV4aXQsIGFuZCBub3QgdXBkYXRlIGFnYWluXG4gKiB1cG9uIHJlZW50cnkgaW50byB0aGUgRE9NLiAgVGhpcyBjYW4gbGVhZCBhIHRvIHNpdHVhdGlvbiBmb3IgdGhlIGV4cGFuc2lvbiBwYW5lbCB3aGVyZSB0aGUgc3RhdGVcbiAqIG9mIHRoZSBwYW5lbCBpcyBgZXhwYW5kZWRgIG9yIGBjb2xsYXBzZWRgIGJ1dCB0aGUgYW5pbWF0aW9uIHN0YXRlIGlzIGB2b2lkYC5cbiAqXG4gKiBUbyBjb3JyZWN0bHkgaGFuZGxlIGFuaW1hdGluZyB0byB0aGUgbmV4dCBzdGF0ZSwgd2UgYW5pbWF0ZSBiZXR3ZWVuIGB2b2lkYCBhbmQgYGNvbGxhcHNlZGAgd2hpY2hcbiAqIGFyZSBkZWZpbmVkIHRvIGhhdmUgdGhlIHNhbWUgc3R5bGVzLiBTaW5jZSBhbmd1bGFyIGFuaW1hdGVzIGZyb20gdGhlIGN1cnJlbnQgc3R5bGVzIHRvIHRoZVxuICogZGVzdGluYXRpb24gc3RhdGUncyBzdHlsZSBkZWZpbml0aW9uLCBpbiBzaXR1YXRpb25zIHdoZXJlIHdlIGFyZSBtb3ZpbmcgZnJvbSBgdm9pZGAncyBzdHlsZXMgdG9cbiAqIGBjb2xsYXBzZWRgIHRoaXMgYWN0cyBhIG5vb3Agc2luY2Ugbm8gc3R5bGUgdmFsdWVzIGNoYW5nZS5cbiAqXG4gKiBJbiB0aGUgY2FzZSB3aGVyZSBhbmd1bGFyJ3MgYW5pbWF0aW9uIHN0YXRlIGlzIG91dCBvZiBzeW5jIHdpdGggdGhlIGV4cGFuc2lvbiBwYW5lbCdzIHN0YXRlLCB0aGVcbiAqIGV4cGFuc2lvbiBwYW5lbCBiZWluZyBgZXhwYW5kZWRgIGFuZCBhbmd1bGFyIGFuaW1hdGlvbnMgYmVpbmcgYHZvaWRgLCB0aGUgYW5pbWF0aW9uIGZyb20gdGhlXG4gKiBgZXhwYW5kZWRgJ3MgZWZmZWN0aXZlIHN0eWxlcyAodGhvdWdoIGluIGEgYHZvaWRgIGFuaW1hdGlvbiBzdGF0ZSkgdG8gdGhlIGNvbGxhcHNlZCBzdGF0ZSB3aWxsXG4gKiBvY2N1ciBhcyBleHBlY3RlZC5cbiAqXG4gKiBBbmd1bGFyIEJ1ZzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTg4NDdcbiAqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRFeHBhbnNpb25BbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGluZGljYXRvclJvdGF0ZTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBleHBhbnNpb25IZWFkZXJIZWlnaHQ6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgYm9keUV4cGFuc2lvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHJvdGF0ZXMgdGhlIGluZGljYXRvciBhcnJvdy4gKi9cbiAgaW5kaWNhdG9yUm90YXRlOiB0cmlnZ2VyKCdpbmRpY2F0b3JSb3RhdGUnLCBbXG4gICAgc3RhdGUoJ2NvbGxhcHNlZCwgdm9pZCcsIHN0eWxlKHt0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSkpLFxuICAgIHN0YXRlKCdleHBhbmRlZCcsIHN0eWxlKHt0cmFuc2Zvcm06ICdyb3RhdGUoMTgwZGVnKSd9KSksXG4gICAgdHJhbnNpdGlvbignZXhwYW5kZWQgPD0+IGNvbGxhcHNlZCwgdm9pZCA9PiBjb2xsYXBzZWQnLFxuICAgICAgYW5pbWF0ZShFWFBBTlNJT05fUEFORUxfQU5JTUFUSU9OX1RJTUlORykpLFxuICBdKSxcblxuICAvKiogQW5pbWF0aW9uIHRoYXQgZXhwYW5kcyBhbmQgY29sbGFwc2VzIHRoZSBwYW5lbCBoZWFkZXIgaGVpZ2h0LiAqL1xuICBleHBhbnNpb25IZWFkZXJIZWlnaHQ6IHRyaWdnZXIoJ2V4cGFuc2lvbkhlaWdodCcsIFtcbiAgICBzdGF0ZSgnY29sbGFwc2VkLCB2b2lkJywgc3R5bGUoe1xuICAgICAgaGVpZ2h0OiAne3tjb2xsYXBzZWRIZWlnaHR9fScsXG4gICAgfSksIHtcbiAgICAgIHBhcmFtczoge2NvbGxhcHNlZEhlaWdodDogJzQ4cHgnfSxcbiAgICB9KSxcbiAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7XG4gICAgICBoZWlnaHQ6ICd7e2V4cGFuZGVkSGVpZ2h0fX0nXG4gICAgfSksIHtcbiAgICAgIHBhcmFtczoge2V4cGFuZGVkSGVpZ2h0OiAnNjRweCd9XG4gICAgfSksXG4gICAgdHJhbnNpdGlvbignZXhwYW5kZWQgPD0+IGNvbGxhcHNlZCwgdm9pZCA9PiBjb2xsYXBzZWQnLCBncm91cChbXG4gICAgICBxdWVyeSgnQGluZGljYXRvclJvdGF0ZScsIGFuaW1hdGVDaGlsZCgpLCB7b3B0aW9uYWw6IHRydWV9KSxcbiAgICAgIGFuaW1hdGUoRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcpLFxuICAgIF0pKSxcbiAgXSksXG5cbiAgLyoqIEFuaW1hdGlvbiB0aGF0IGV4cGFuZHMgYW5kIGNvbGxhcHNlcyB0aGUgcGFuZWwgY29udGVudC4gKi9cbiAgYm9keUV4cGFuc2lvbjogdHJpZ2dlcignYm9keUV4cGFuc2lvbicsIFtcbiAgICBzdGF0ZSgnY29sbGFwc2VkLCB2b2lkJywgc3R5bGUoe2hlaWdodDogJzBweCcsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIHN0YXRlKCdleHBhbmRlZCcsIHN0eWxlKHtoZWlnaHQ6ICcqJywgdmlzaWJpbGl0eTogJ3Zpc2libGUnfSkpLFxuICAgIHRyYW5zaXRpb24oJ2V4cGFuZGVkIDw9PiBjb2xsYXBzZWQsIHZvaWQgPT4gY29sbGFwc2VkJyxcbiAgICAgIGFuaW1hdGUoRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcpKSxcbiAgXSlcbn07XG4iXX0=