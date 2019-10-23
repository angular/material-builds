/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, keyframes, query, animateChild, } from '@angular/animations';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';
/** @type {?} */
const SORT_ANIMATION_TRANSITION = AnimationDurations.ENTERING + ' ' +
    AnimationCurves.STANDARD_CURVE;
/**
 * Animations used by MatSort.
 * \@docs-private
 * @type {?}
 */
export const matSortAnimations = {
    /**
     * Animation that moves the sort indicator.
     */
    indicator: trigger('indicator', [
        state('active-asc, asc', style({ transform: 'translateY(0px)' })),
        // 10px is the height of the sort indicator, minus the width of the pointers
        state('active-desc, desc', style({ transform: 'translateY(10px)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that rotates the left pointer of the indicator based on the sorting direction.
     */
    leftPointer: trigger('leftPointer', [
        state('active-asc, asc', style({ transform: 'rotate(-45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that rotates the right pointer of the indicator based on the sorting direction.
     */
    rightPointer: trigger('rightPointer', [
        state('active-asc, asc', style({ transform: 'rotate(45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(-45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
     * Animation that controls the arrow opacity.
     */
    arrowOpacity: trigger('arrowOpacity', [
        state('desc-to-active, asc-to-active, active', style({ opacity: 1 })),
        state('desc-to-hint, asc-to-hint, hint', style({ opacity: .54 })),
        state('hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void', style({ opacity: 0 })),
        // Transition between all states except for immediate transitions
        transition('* => asc, * => desc, * => active, * => hint, * => void', animate('0ms')),
        transition('* <=> *', animate(SORT_ANIMATION_TRANSITION)),
    ]),
    /**
     * Animation for the translation of the arrow as a whole. States are separated into two
     * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
     * peek, and active. The other states define a specific animation (source-to-destination)
     * and are determined as a function of their prev user-perceived state and what the next state
     * should be.
     */
    arrowPosition: trigger('arrowPosition', [
        // Hidden Above => Hint Center
        transition('* => desc-to-hint, * => desc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(-25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Below
        transition('* => hint-to-desc, * => active-to-desc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(25%)' })
        ]))),
        // Hidden Below => Hint Center
        transition('* => asc-to-hint, * => asc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Above
        transition('* => hint-to-asc, * => active-to-asc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(-25%)' })
        ]))),
        state('desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active', style({ transform: 'translateY(0)' })),
        state('hint-to-desc, active-to-desc, desc', style({ transform: 'translateY(-25%)' })),
        state('hint-to-asc, active-to-asc, asc', style({ transform: 'translateY(25%)' })),
    ]),
    /**
     * Necessary trigger that calls animate on children animations.
     */
    allowChildren: trigger('allowChildren', [
        transition('* <=> *', [
            query('@*', animateChild(), { optional: true })
        ])
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NvcnQvc29ydC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEVBQ1AsU0FBUyxFQUNpQixLQUFLLEVBQUUsWUFBWSxHQUM5QyxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7TUFFckUseUJBQXlCLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxHQUFHLEdBQUc7SUFDakMsZUFBZSxDQUFDLGNBQWM7Ozs7OztBQU1oRSxNQUFNLE9BQU8saUJBQWlCLEdBTzFCOzs7O0lBRUYsU0FBUyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDOUIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxDQUFDLENBQUM7UUFDL0QsNEVBQTRFO1FBQzVFLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUM3RSxDQUFDOzs7O0lBR0YsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDbEMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7UUFDOUQsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO1FBQy9ELFVBQVUsQ0FBQyw0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SUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO1NBQzlDLENBQUM7S0FDSCxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAga2V5ZnJhbWVzLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsIHF1ZXJ5LCBhbmltYXRlQ2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtBbmltYXRpb25DdXJ2ZXMsIEFuaW1hdGlvbkR1cmF0aW9uc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbmNvbnN0IFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04gPSBBbmltYXRpb25EdXJhdGlvbnMuRU5URVJJTkcgKyAnICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuaW1hdGlvbkN1cnZlcy5TVEFOREFSRF9DVVJWRTtcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgTWF0U29ydC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdFNvcnRBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGluZGljYXRvcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBsZWZ0UG9pbnRlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSByaWdodFBvaW50ZXI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgYXJyb3dPcGFjaXR5OiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGFycm93UG9zaXRpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgYWxsb3dDaGlsZHJlbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IG1vdmVzIHRoZSBzb3J0IGluZGljYXRvci4gKi9cbiAgaW5kaWNhdG9yOiB0cmlnZ2VyKCdpbmRpY2F0b3InLCBbXG4gICAgc3RhdGUoJ2FjdGl2ZS1hc2MsIGFzYycsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDBweCknfSkpLFxuICAgIC8vIDEwcHggaXMgdGhlIGhlaWdodCBvZiB0aGUgc29ydCBpbmRpY2F0b3IsIG1pbnVzIHRoZSB3aWR0aCBvZiB0aGUgcG9pbnRlcnNcbiAgICBzdGF0ZSgnYWN0aXZlLWRlc2MsIGRlc2MnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxMHB4KSd9KSksXG4gICAgdHJhbnNpdGlvbignYWN0aXZlLWFzYyA8PT4gYWN0aXZlLWRlc2MnLCBhbmltYXRlKFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04pKVxuICBdKSxcblxuICAvKiogQW5pbWF0aW9uIHRoYXQgcm90YXRlcyB0aGUgbGVmdCBwb2ludGVyIG9mIHRoZSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIHNvcnRpbmcgZGlyZWN0aW9uLiAqL1xuICBsZWZ0UG9pbnRlcjogdHJpZ2dlcignbGVmdFBvaW50ZXInLCBbXG4gICAgc3RhdGUoJ2FjdGl2ZS1hc2MsIGFzYycsIHN0eWxlKHt0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSd9KSksXG4gICAgc3RhdGUoJ2FjdGl2ZS1kZXNjLCBkZXNjJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSg0NWRlZyknfSkpLFxuICAgIHRyYW5zaXRpb24oJ2FjdGl2ZS1hc2MgPD0+IGFjdGl2ZS1kZXNjJywgYW5pbWF0ZShTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OKSlcbiAgXSksXG5cbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHJvdGF0ZXMgdGhlIHJpZ2h0IHBvaW50ZXIgb2YgdGhlIGluZGljYXRvciBiYXNlZCBvbiB0aGUgc29ydGluZyBkaXJlY3Rpb24uICovXG4gIHJpZ2h0UG9pbnRlcjogdHJpZ2dlcigncmlnaHRQb2ludGVyJywgW1xuICAgIHN0YXRlKCdhY3RpdmUtYXNjLCBhc2MnLCBzdHlsZSh7dHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKSd9KSksXG4gICAgc3RhdGUoJ2FjdGl2ZS1kZXNjLCBkZXNjJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ30pKSxcbiAgICB0cmFuc2l0aW9uKCdhY3RpdmUtYXNjIDw9PiBhY3RpdmUtZGVzYycsIGFuaW1hdGUoU09SVF9BTklNQVRJT05fVFJBTlNJVElPTikpXG4gIF0pLFxuXG4gIC8qKiBBbmltYXRpb24gdGhhdCBjb250cm9scyB0aGUgYXJyb3cgb3BhY2l0eS4gKi9cbiAgYXJyb3dPcGFjaXR5OiB0cmlnZ2VyKCdhcnJvd09wYWNpdHknLCBbXG4gICAgc3RhdGUoJ2Rlc2MtdG8tYWN0aXZlLCBhc2MtdG8tYWN0aXZlLCBhY3RpdmUnLCBzdHlsZSh7b3BhY2l0eTogMX0pKSxcbiAgICBzdGF0ZSgnZGVzYy10by1oaW50LCBhc2MtdG8taGludCwgaGludCcsIHN0eWxlKHtvcGFjaXR5OiAuNTR9KSksXG4gICAgc3RhdGUoJ2hpbnQtdG8tZGVzYywgYWN0aXZlLXRvLWRlc2MsIGRlc2MsIGhpbnQtdG8tYXNjLCBhY3RpdmUtdG8tYXNjLCBhc2MsIHZvaWQnLFxuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMH0pKSxcbiAgICAvLyBUcmFuc2l0aW9uIGJldHdlZW4gYWxsIHN0YXRlcyBleGNlcHQgZm9yIGltbWVkaWF0ZSB0cmFuc2l0aW9uc1xuICAgIHRyYW5zaXRpb24oJyogPT4gYXNjLCAqID0+IGRlc2MsICogPT4gYWN0aXZlLCAqID0+IGhpbnQsICogPT4gdm9pZCcsIGFuaW1hdGUoJzBtcycpKSxcbiAgICB0cmFuc2l0aW9uKCcqIDw9PiAqJywgYW5pbWF0ZShTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OKSksXG4gIF0pLFxuXG4gIC8qKlxuICAgKiBBbmltYXRpb24gZm9yIHRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgYXJyb3cgYXMgYSB3aG9sZS4gU3RhdGVzIGFyZSBzZXBhcmF0ZWQgaW50byB0d29cbiAgICogZ3JvdXBzOiBvbmVzIHdpdGggYW5pbWF0aW9ucyBhbmQgb3RoZXJzIHRoYXQgYXJlIGltbWVkaWF0ZS4gSW1tZWRpYXRlIHN0YXRlcyBhcmUgYXNjLCBkZXNjLFxuICAgKiBwZWVrLCBhbmQgYWN0aXZlLiBUaGUgb3RoZXIgc3RhdGVzIGRlZmluZSBhIHNwZWNpZmljIGFuaW1hdGlvbiAoc291cmNlLXRvLWRlc3RpbmF0aW9uKVxuICAgKiBhbmQgYXJlIGRldGVybWluZWQgYXMgYSBmdW5jdGlvbiBvZiB0aGVpciBwcmV2IHVzZXItcGVyY2VpdmVkIHN0YXRlIGFuZCB3aGF0IHRoZSBuZXh0IHN0YXRlXG4gICAqIHNob3VsZCBiZS5cbiAgICovXG4gIGFycm93UG9zaXRpb246IHRyaWdnZXIoJ2Fycm93UG9zaXRpb24nLCBbXG4gICAgLy8gSGlkZGVuIEFib3ZlID0+IEhpbnQgQ2VudGVyXG4gICAgdHJhbnNpdGlvbignKiA9PiBkZXNjLXRvLWhpbnQsICogPT4gZGVzYy10by1hY3RpdmUnLFxuICAgICAgICBhbmltYXRlKFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04sIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTI1JSknfSksXG4gICAgICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSlcbiAgICAgICAgXSkpKSxcbiAgICAvLyBIaW50IENlbnRlciA9PiBIaWRkZW4gQmVsb3dcbiAgICB0cmFuc2l0aW9uKCcqID0+IGhpbnQtdG8tZGVzYywgKiA9PiBhY3RpdmUtdG8tZGVzYycsXG4gICAgICAgIGFuaW1hdGUoU09SVF9BTklNQVRJT05fVFJBTlNJVElPTiwga2V5ZnJhbWVzKFtcbiAgICAgICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSxcbiAgICAgICAgICBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgyNSUpJ30pXG4gICAgICAgIF0pKSksXG4gICAgLy8gSGlkZGVuIEJlbG93ID0+IEhpbnQgQ2VudGVyXG4gICAgdHJhbnNpdGlvbignKiA9PiBhc2MtdG8taGludCwgKiA9PiBhc2MtdG8tYWN0aXZlJyxcbiAgICAgICAgYW5pbWF0ZShTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OLCBrZXlmcmFtZXMoW1xuICAgICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDI1JSknfSksXG4gICAgICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSlcbiAgICAgICAgXSkpKSxcbiAgICAvLyBIaW50IENlbnRlciA9PiBIaWRkZW4gQWJvdmVcbiAgICB0cmFuc2l0aW9uKCcqID0+IGhpbnQtdG8tYXNjLCAqID0+IGFjdGl2ZS10by1hc2MnLFxuICAgICAgICBhbmltYXRlKFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04sIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSksXG4gICAgICAgICAgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTI1JSknfSlcbiAgICAgICAgXSkpKSxcbiAgICBzdGF0ZSgnZGVzYy10by1oaW50LCBhc2MtdG8taGludCwgaGludCwgZGVzYy10by1hY3RpdmUsIGFzYy10by1hY3RpdmUsIGFjdGl2ZScsXG4gICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pKSxcbiAgICBzdGF0ZSgnaGludC10by1kZXNjLCBhY3RpdmUtdG8tZGVzYywgZGVzYycsXG4gICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0yNSUpJ30pKSxcbiAgICBzdGF0ZSgnaGludC10by1hc2MsIGFjdGl2ZS10by1hc2MsIGFzYycsXG4gICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDI1JSknfSkpLFxuICBdKSxcblxuICAvKiogTmVjZXNzYXJ5IHRyaWdnZXIgdGhhdCBjYWxscyBhbmltYXRlIG9uIGNoaWxkcmVuIGFuaW1hdGlvbnMuICovXG4gIGFsbG93Q2hpbGRyZW46IHRyaWdnZXIoJ2FsbG93Q2hpbGRyZW4nLCBbXG4gICAgdHJhbnNpdGlvbignKiA8PT4gKicsIFtcbiAgICAgIHF1ZXJ5KCdAKicsIGFuaW1hdGVDaGlsZCgpLCB7b3B0aW9uYWw6IHRydWV9KVxuICAgIF0pXG4gIF0pLFxufTtcbiJdfQ==