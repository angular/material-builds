/**
 * @fileoverview added by tsickle
 * Generated from: src/material/menu/menu-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU0sRUFDSixPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLEtBQUssRUFDTCxLQUFLLEdBRU4sTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7QUFRN0IsTUFBTSxPQUFPLGlCQUFpQixHQUcxQjs7Ozs7Ozs7O0lBU0YsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDbEIsT0FBTyxFQUFFLENBQUM7WUFDVixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQztZQUNoQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUM7Z0JBQzlFLE9BQU8sRUFBRSxDQUFDO2FBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7U0FDNUUsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxDQUFDOzs7OztJQU9GLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFO1FBQ2xDLHFEQUFxRDtRQUNyRCxnREFBZ0Q7UUFDaEQsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNyQyxVQUFVLENBQUMsV0FBVyxFQUFFO1lBQ3RCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUNuQixPQUFPLENBQUMsOENBQThDLENBQUM7U0FDeEQsQ0FBQztLQUNILENBQUM7Q0FDSDs7Ozs7OztBQU9ELE1BQU0sT0FBTyxXQUFXLEdBQUcsaUJBQWlCLENBQUMsV0FBVzs7Ozs7OztBQU94RCxNQUFNLE9BQU8sYUFBYSxHQUFHLGlCQUFpQixDQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0e1xuICB0cmlnZ2VyLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIGFuaW1hdGUsXG4gIHRyYW5zaXRpb24sXG4gIHF1ZXJ5LFxuICBncm91cCxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIG1hdC1tZW51IGNvbXBvbmVudC5cbiAqIEFuaW1hdGlvbiBkdXJhdGlvbiBhbmQgdGltaW5nIHZhbHVlcyBhcmUgYmFzZWQgb246XG4gKiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvY29tcG9uZW50cy9tZW51cy5odG1sI21lbnVzLXVzYWdlXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRNZW51QW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2Zvcm1NZW51OiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGZhZGVJbkl0ZW1zOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKipcbiAgICogVGhpcyBhbmltYXRpb24gY29udHJvbHMgdGhlIG1lbnUgcGFuZWwncyBlbnRyeSBhbmQgZXhpdCBmcm9tIHRoZSBwYWdlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBtZW51IHBhbmVsIGlzIGFkZGVkIHRvIHRoZSBET00sIGl0IHNjYWxlcyBpbiBhbmQgZmFkZXMgaW4gaXRzIGJvcmRlci5cbiAgICpcbiAgICogV2hlbiB0aGUgbWVudSBwYW5lbCBpcyByZW1vdmVkIGZyb20gdGhlIERPTSwgaXQgc2ltcGx5IGZhZGVzIG91dCBhZnRlciBhIGJyaWVmXG4gICAqIGRlbGF5IHRvIGRpc3BsYXkgdGhlIHJpcHBsZS5cbiAgICovXG4gIHRyYW5zZm9ybU1lbnU6IHRyaWdnZXIoJ3RyYW5zZm9ybU1lbnUnLCBbXG4gICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7XG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC44KSdcbiAgICB9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBlbnRlcicsIGdyb3VwKFtcbiAgICAgIHF1ZXJ5KCcubWF0LW1lbnUtY29udGVudCwgLm1hdC1tZGMtbWVudS1jb250ZW50JywgYW5pbWF0ZSgnMTAwbXMgbGluZWFyJywgc3R5bGUoe1xuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KSkpLFxuICAgICAgYW5pbWF0ZSgnMTIwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknLCBzdHlsZSh7dHJhbnNmb3JtOiAnc2NhbGUoMSknfSkpLFxuICAgIF0pKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBhbmltYXRlKCcxMDBtcyAyNW1zIGxpbmVhcicsIHN0eWxlKHtvcGFjaXR5OiAwfSkpKVxuICBdKSxcblxuXG4gIC8qKlxuICAgKiBUaGlzIGFuaW1hdGlvbiBmYWRlcyBpbiB0aGUgYmFja2dyb3VuZCBjb2xvciBhbmQgY29udGVudCBvZiB0aGUgbWVudSBwYW5lbFxuICAgKiBhZnRlciBpdHMgY29udGFpbmluZyBlbGVtZW50IGlzIHNjYWxlZCBpbi5cbiAgICovXG4gIGZhZGVJbkl0ZW1zOiB0cmlnZ2VyKCdmYWRlSW5JdGVtcycsIFtcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBpcyBpbnNpZGUgdGhlIGB0cmFuc2Zvcm1NZW51YFxuICAgIC8vIG5vdy4gUmVtb3ZlIG5leHQgdGltZSB3ZSBkbyBicmVha2luZyBjaGFuZ2VzLlxuICAgIHN0YXRlKCdzaG93aW5nJywgc3R5bGUoe29wYWNpdHk6IDF9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgICAgc3R5bGUoe29wYWNpdHk6IDB9KSxcbiAgICAgIGFuaW1hdGUoJzQwMG1zIDEwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJylcbiAgICBdKVxuICBdKVxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZmFkZUluSXRlbXMgPSBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtcztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtTWVudSA9IG1hdE1lbnVBbmltYXRpb25zLnRyYW5zZm9ybU1lbnU7XG4iXX0=