/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tabs/tabs-animations.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFicy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQU03QixNQUFNLE9BQU8saUJBQWlCLEdBRTFCOzs7O0lBRUYsWUFBWSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7UUFDcEMsMEZBQTBGO1FBQzFGLEtBQUssQ0FBQyx1REFBdUQsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUUxRix1RkFBdUY7UUFDdkYscUZBQXFGO1FBQ3JGLDRGQUE0RjtRQUM1Rix5RUFBeUU7UUFDekUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDL0UsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFL0UsVUFBVSxDQUFDLHdEQUF3RCxFQUMvRCxPQUFPLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUNwRSxVQUFVLENBQUMsNEJBQTRCLEVBQUU7WUFDdkMsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFDLENBQUM7WUFDOUMsT0FBTyxDQUFDLHNEQUFzRCxDQUFDO1NBQ2hFLENBQUM7UUFDRixVQUFVLENBQUMsNkJBQTZCLEVBQUU7WUFDeEMsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLHlCQUF5QixFQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLHNEQUFzRCxDQUFDO1NBQ2hFLENBQUM7S0FDSCxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIHRhYnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRUYWJzQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2xhdGVUYWI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdHJhbnNsYXRlcyBhIHRhYiBhbG9uZyB0aGUgWCBheGlzLiAqL1xuICB0cmFuc2xhdGVUYWI6IHRyaWdnZXIoJ3RyYW5zbGF0ZVRhYicsIFtcbiAgICAvLyBOb3RlOiB0cmFuc2l0aW9ucyB0byBgbm9uZWAgaW5zdGVhZCBvZiAwLCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgbWlnaHQgYmx1ciB0aGUgY29udGVudC5cbiAgICBzdGF0ZSgnY2VudGVyLCB2b2lkLCBsZWZ0LW9yaWdpbi1jZW50ZXIsIHJpZ2h0LW9yaWdpbi1jZW50ZXInLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZSd9KSksXG5cbiAgICAvLyBJZiB0aGUgdGFiIGlzIGVpdGhlciBvbiB0aGUgbGVmdCBvciByaWdodCwgd2UgYWRkaXRpb25hbGx5IGFkZCBhIGBtaW4taGVpZ2h0YCBvZiAxcHhcbiAgICAvLyBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgZWxlbWVudCBoYXMgYSBoZWlnaHQgYmVmb3JlIGl0cyBzdGF0ZSBjaGFuZ2VzLiBUaGlzIGlzXG4gICAgLy8gbmVjZXNzYXJ5IGJlY2F1c2UgQ2hyb21lIGRvZXMgc2VlbSB0byBza2lwIHRoZSB0cmFuc2l0aW9uIGluIFJUTCBtb2RlIGlmIHRoZSBlbGVtZW50IGRvZXNcbiAgICAvLyBub3QgaGF2ZSBhIHN0YXRpYyBoZWlnaHQgYW5kIGlzIG5vdCByZW5kZXJlZC4gU2VlIHJlbGF0ZWQgaXNzdWU6ICM5NDY1XG4gICAgc3RhdGUoJ2xlZnQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJywgbWluSGVpZ2h0OiAnMXB4J30pKSxcbiAgICBzdGF0ZSgncmlnaHQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLCBtaW5IZWlnaHQ6ICcxcHgnfSkpLFxuXG4gICAgdHJhbnNpdGlvbignKiA9PiBsZWZ0LCAqID0+IHJpZ2h0LCBsZWZ0ID0+IGNlbnRlciwgcmlnaHQgPT4gY2VudGVyJyxcbiAgICAgICAgYW5pbWF0ZSgne3thbmltYXRpb25EdXJhdGlvbn19IGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IGxlZnQtb3JpZ2luLWNlbnRlcicsIFtcbiAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknfSksXG4gICAgICBhbmltYXRlKCd7e2FuaW1hdGlvbkR1cmF0aW9ufX0gY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJylcbiAgICBdKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHJpZ2h0LW9yaWdpbi1jZW50ZXInLCBbXG4gICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknfSksXG4gICAgICBhbmltYXRlKCd7e2FuaW1hdGlvbkR1cmF0aW9ufX0gY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJylcbiAgICBdKVxuICBdKVxufTtcbiJdfQ==