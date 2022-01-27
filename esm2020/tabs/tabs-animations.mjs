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
 * @docs-private
 */
export const matTabsAnimations = {
    /** Animation translates a tab along the X axis. */
    translateTab: trigger('translateTab', [
        state('center, void, left-origin-center, right-origin-center', style({
            // Transitions to `none` instead of 0, because some browsers might blur the content.
            transform: 'none',
            // Ensures that the `visibility: hidden` from below is cleared.
            visibility: '',
        })),
        // If the tab is either on the left or right, we additionally add a `min-height` of 1px
        // in order to ensure that the element has a height before its state changes. This is
        // necessary because Chrome does seem to skip the transition in RTL mode if the element does
        // not have a static height and is not rendered. See related issue: #9465
        state('left', style({
            transform: 'translate3d(-100%, 0, 0)',
            minHeight: '1px',
            // Normally this is redundant since we detach the content from the DOM, but if the user
            // opted into keeping the content in the DOM, we have to hide it so it isn't focusable.
            visibility: 'hidden',
        })),
        state('right', style({
            transform: 'translate3d(100%, 0, 0)',
            minHeight: '1px',
            visibility: 'hidden',
        })),
        transition('* => left, * => right, left => center, right => center', animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')),
        transition('void => left-origin-center', [
            style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        ]),
        transition('void => right-origin-center', [
            style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' }),
            animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        ]),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFicy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBRTFCO0lBQ0YsbURBQW1EO0lBQ25ELFlBQVksRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFO1FBQ3BDLEtBQUssQ0FDSCx1REFBdUQsRUFDdkQsS0FBSyxDQUFDO1lBQ0osb0ZBQW9GO1lBQ3BGLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLCtEQUErRDtZQUMvRCxVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FDSDtRQUVELHVGQUF1RjtRQUN2RixxRkFBcUY7UUFDckYsNEZBQTRGO1FBQzVGLHlFQUF5RTtRQUN6RSxLQUFLLENBQ0gsTUFBTSxFQUNOLEtBQUssQ0FBQztZQUNKLFNBQVMsRUFBRSwwQkFBMEI7WUFDckMsU0FBUyxFQUFFLEtBQUs7WUFFaEIsdUZBQXVGO1lBQ3ZGLHVGQUF1RjtZQUN2RixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsT0FBTyxFQUNQLEtBQUssQ0FBQztZQUNKLFNBQVMsRUFBRSx5QkFBeUI7WUFDcEMsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLFFBQVE7U0FDckIsQ0FBQyxDQUNIO1FBRUQsVUFBVSxDQUNSLHdEQUF3RCxFQUN4RCxPQUFPLENBQUMsc0RBQXNELENBQUMsQ0FDaEU7UUFDRCxVQUFVLENBQUMsNEJBQTRCLEVBQUU7WUFDdkMsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQztZQUNwRSxPQUFPLENBQUMsc0RBQXNELENBQUM7U0FDaEUsQ0FBQztRQUNGLFVBQVUsQ0FBQyw2QkFBNkIsRUFBRTtZQUN4QyxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDO1lBQ25FLE9BQU8sQ0FBQyxzREFBc0QsQ0FBQztTQUNoRSxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIHRhYnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRUYWJzQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2xhdGVUYWI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdHJhbnNsYXRlcyBhIHRhYiBhbG9uZyB0aGUgWCBheGlzLiAqL1xuICB0cmFuc2xhdGVUYWI6IHRyaWdnZXIoJ3RyYW5zbGF0ZVRhYicsIFtcbiAgICBzdGF0ZShcbiAgICAgICdjZW50ZXIsIHZvaWQsIGxlZnQtb3JpZ2luLWNlbnRlciwgcmlnaHQtb3JpZ2luLWNlbnRlcicsXG4gICAgICBzdHlsZSh7XG4gICAgICAgIC8vIFRyYW5zaXRpb25zIHRvIGBub25lYCBpbnN0ZWFkIG9mIDAsIGJlY2F1c2Ugc29tZSBicm93c2VycyBtaWdodCBibHVyIHRoZSBjb250ZW50LlxuICAgICAgICB0cmFuc2Zvcm06ICdub25lJyxcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBgdmlzaWJpbGl0eTogaGlkZGVuYCBmcm9tIGJlbG93IGlzIGNsZWFyZWQuXG4gICAgICAgIHZpc2liaWxpdHk6ICcnLFxuICAgICAgfSksXG4gICAgKSxcblxuICAgIC8vIElmIHRoZSB0YWIgaXMgZWl0aGVyIG9uIHRoZSBsZWZ0IG9yIHJpZ2h0LCB3ZSBhZGRpdGlvbmFsbHkgYWRkIGEgYG1pbi1oZWlnaHRgIG9mIDFweFxuICAgIC8vIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGhhcyBhIGhlaWdodCBiZWZvcmUgaXRzIHN0YXRlIGNoYW5nZXMuIFRoaXMgaXNcbiAgICAvLyBuZWNlc3NhcnkgYmVjYXVzZSBDaHJvbWUgZG9lcyBzZWVtIHRvIHNraXAgdGhlIHRyYW5zaXRpb24gaW4gUlRMIG1vZGUgaWYgdGhlIGVsZW1lbnQgZG9lc1xuICAgIC8vIG5vdCBoYXZlIGEgc3RhdGljIGhlaWdodCBhbmQgaXMgbm90IHJlbmRlcmVkLiBTZWUgcmVsYXRlZCBpc3N1ZTogIzk0NjVcbiAgICBzdGF0ZShcbiAgICAgICdsZWZ0JyxcbiAgICAgIHN0eWxlKHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgbWluSGVpZ2h0OiAnMXB4JyxcblxuICAgICAgICAvLyBOb3JtYWxseSB0aGlzIGlzIHJlZHVuZGFudCBzaW5jZSB3ZSBkZXRhY2ggdGhlIGNvbnRlbnQgZnJvbSB0aGUgRE9NLCBidXQgaWYgdGhlIHVzZXJcbiAgICAgICAgLy8gb3B0ZWQgaW50byBrZWVwaW5nIHRoZSBjb250ZW50IGluIHRoZSBET00sIHdlIGhhdmUgdG8gaGlkZSBpdCBzbyBpdCBpc24ndCBmb2N1c2FibGUuXG4gICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxuICAgICAgfSksXG4gICAgKSxcbiAgICBzdGF0ZShcbiAgICAgICdyaWdodCcsXG4gICAgICBzdHlsZSh7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgICAgbWluSGVpZ2h0OiAnMXB4JyxcbiAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicsXG4gICAgICB9KSxcbiAgICApLFxuXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICcqID0+IGxlZnQsICogPT4gcmlnaHQsIGxlZnQgPT4gY2VudGVyLCByaWdodCA9PiBjZW50ZXInLFxuICAgICAgYW5pbWF0ZSgne3thbmltYXRpb25EdXJhdGlvbn19IGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpLFxuICAgICksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBsZWZ0LW9yaWdpbi1jZW50ZXInLCBbXG4gICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSxcbiAgICAgIGFuaW1hdGUoJ3t7YW5pbWF0aW9uRHVyYXRpb259fSBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKSxcbiAgICBdKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHJpZ2h0LW9yaWdpbi1jZW50ZXInLCBbXG4gICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pLFxuICAgICAgYW5pbWF0ZSgne3thbmltYXRpb25EdXJhdGlvbn19IGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpLFxuICAgIF0pLFxuICBdKSxcbn07XG4iXX0=