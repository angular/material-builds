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
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material drawers.
 * \@docs-private
 * @type {?}
 */
export const matDrawerAnimations = {
    /**
     * Animation that slides a drawer in and out.
     */
    transformDrawer: trigger('transform', [
        // We remove the `transform` here completely, rather than setting it to zero, because:
        // 1. Having a transform can cause elements with ripples or an animated
        //    transform to shift around in Chrome with an RTL layout (see #10023).
        // 2. 3d transforms causes text to appear blurry on IE and Edge.
        state('open, open-instant', style({
            'transform': 'none',
            'visibility': 'visible',
        })),
        state('void', style({
            // Avoids the shadow showing up when closed in SSR.
            'box-shadow': 'none',
            'visibility': 'hidden',
        })),
        transition('void => open-instant', animate('0ms')),
        transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQU03QixNQUFNLE9BQU8sbUJBQW1CLEdBRTVCOzs7O0lBRUYsZUFBZSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDcEMsc0ZBQXNGO1FBQ3RGLHVFQUF1RTtRQUN2RSwwRUFBMEU7UUFDMUUsZ0VBQWdFO1FBQ2hFLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUM7WUFDaEMsV0FBVyxFQUFFLE1BQU07WUFDbkIsWUFBWSxFQUFFLFNBQVM7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7O1lBRWxCLFlBQVksRUFBRSxNQUFNO1lBQ3BCLFlBQVksRUFBRSxRQUFRO1NBQ3ZCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsVUFBVSxDQUFDLHFDQUFxQyxFQUM1QyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUN2RCxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIGRyYXdlcnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXREcmF3ZXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybURyYXdlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHNsaWRlcyBhIGRyYXdlciBpbiBhbmQgb3V0LiAqL1xuICB0cmFuc2Zvcm1EcmF3ZXI6IHRyaWdnZXIoJ3RyYW5zZm9ybScsIFtcbiAgICAvLyBXZSByZW1vdmUgdGhlIGB0cmFuc2Zvcm1gIGhlcmUgY29tcGxldGVseSwgcmF0aGVyIHRoYW4gc2V0dGluZyBpdCB0byB6ZXJvLCBiZWNhdXNlOlxuICAgIC8vIDEuIEhhdmluZyBhIHRyYW5zZm9ybSBjYW4gY2F1c2UgZWxlbWVudHMgd2l0aCByaXBwbGVzIG9yIGFuIGFuaW1hdGVkXG4gICAgLy8gICAgdHJhbnNmb3JtIHRvIHNoaWZ0IGFyb3VuZCBpbiBDaHJvbWUgd2l0aCBhbiBSVEwgbGF5b3V0IChzZWUgIzEwMDIzKS5cbiAgICAvLyAyLiAzZCB0cmFuc2Zvcm1zIGNhdXNlcyB0ZXh0IHRvIGFwcGVhciBibHVycnkgb24gSUUgYW5kIEVkZ2UuXG4gICAgc3RhdGUoJ29wZW4sIG9wZW4taW5zdGFudCcsIHN0eWxlKHtcbiAgICAgICd0cmFuc2Zvcm0nOiAnbm9uZScsXG4gICAgICAndmlzaWJpbGl0eSc6ICd2aXNpYmxlJyxcbiAgICB9KSksXG4gICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7XG4gICAgICAvLyBBdm9pZHMgdGhlIHNoYWRvdyBzaG93aW5nIHVwIHdoZW4gY2xvc2VkIGluIFNTUi5cbiAgICAgICdib3gtc2hhZG93JzogJ25vbmUnLFxuICAgICAgJ3Zpc2liaWxpdHknOiAnaGlkZGVuJyxcbiAgICB9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBvcGVuLWluc3RhbnQnLCBhbmltYXRlKCcwbXMnKSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA8PT4gb3Blbiwgb3Blbi1pbnN0YW50ID0+IHZvaWQnLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKScpKVxuICBdKVxufTtcbiJdfQ==